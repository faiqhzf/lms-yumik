<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\User;
use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassroomMemberController extends Controller
{
    /**
     * Menampilkan daftar anggota kelas pada tahun ajaran aktif.
     */
    public function show(Classroom $classroom)
    {
        $activeAcademic = AcademicYear::where('is_active', true)->first();

        if (!$activeAcademic) {
            return redirect()->route('admin.classrooms.index')
                ->withErrors(['error' => 'Harap aktifkan Tahun Ajaran terlebih dahulu.']);
        }

        // 1. Ambil data siswa yang berada di kelas ini KHUSUS pada semester aktif
        $studentsInClass = $classroom->students()
            ->wherePivot('academic_year_id', $activeAcademic->id)
            ->orderBy('name', 'asc')
            ->get();

        // 2. Cari ID siswa yang sudah terdaftar di kelas MANA PUN pada semester aktif
        $enrolledStudentIds = User::whereHas('classrooms', function ($query) use ($activeAcademic) {
            $query->where('academic_year_id', $activeAcademic->id);
        })->pluck('id');

        // 3. Ambil sisa siswa yang masih "menganggur" (belum punya kelas) di semester ini
        $availableStudents = User::where('role', 'siswa')
            ->whereNotIn('id', $enrolledStudentIds)
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Admin/Classrooms/Members', [
            'classroom' => $classroom,
            'studentsInClass' => $studentsInClass,
            'availableStudents' => $availableStudents,
            'activeAcademic' => $activeAcademic,
        ]);
    }

    /**
     * Memasukkan siswa ke dalam kelas (Rombel).
     */
    public function store(Request $request, Classroom $classroom)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $activeAcademic = AcademicYear::where('is_active', true)->firstOrFail();

        // Proteksi ganda: Pastikan siswa belum dimasukkan ke kelas ini di tahun yang sama
        $isAlreadyInClass = $classroom->students()
            ->wherePivot('academic_year_id', $activeAcademic->id)
            ->wherePivot('user_id', $validated['user_id'])
            ->exists();

        if ($isAlreadyInClass) {
            return redirect()->back()->withErrors(['user_id' => 'Siswa sudah berada di dalam kelas ini.']);
        }

        // Simpan ke tabel pivot beserta ID wadah tahun ajarannya
        $classroom->students()->attach($validated['user_id'], [
            'academic_year_id' => $activeAcademic->id
        ]);

        return redirect()->back()->with('success', 'Siswa berhasil ditambahkan ke kelas.');
    }

    /**
     * Mengeluarkan siswa dari kelas (hanya di tahun ajaran aktif).
     */
    public function destroy(Classroom $classroom, User $student)
    {
        $activeAcademic = AcademicYear::where('is_active', true)->firstOrFail();


        $classroom->students()
            ->wherePivot('academic_year_id', $activeAcademic->id)
            ->detach($student->id);

        return redirect()->back()->with('success', 'Siswa berhasil dikeluarkan dari kelas.');
    }
}
