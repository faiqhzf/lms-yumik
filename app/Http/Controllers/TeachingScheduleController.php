<?php

namespace App\Http\Controllers;

use App\Models\TeachingSchedule;
use App\Models\User;
use App\Models\Subject;
use App\Models\Classroom;
use App\Models\AcademicYear; // Import model AcademicYear
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class TeachingScheduleController extends Controller
{
    public function indexAdmin()
    {
        $activeAcademic = AcademicYear::where('is_active', true)->first();

        $schedules = TeachingSchedule::with([
            'user:id,name',
            'subject:id,name,tingkat',
            'classroom:id,nama_kelas'
        ])
            ->when($activeAcademic, function ($query) use ($activeAcademic) {
                $query->where('academic_year_id', $activeAcademic->id);
            })
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/TeachingSchedules/Index', [
            'teaching_schedules' => $schedules,
            'teachers' => User::where('role', 'guru')->select(['id', 'name'])->get(),
            'subjects' => Subject::select(['id', 'name', 'tingkat'])->get(),
            'classrooms' => Classroom::select(['id', 'nama_kelas'])->get(),
            'activeAcademic' => $activeAcademic,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'subject_id' => 'required|exists:subjects,id',
            'classroom_id' => 'required|array',
            'classroom_id.*' => 'exists:classrooms,id',
        ]);

        $activeAcademic = AcademicYear::where('is_active', true)->first();

        if (!$activeAcademic) {
            return back()->withErrors(['error' => 'Harap aktifkan Tahun Ajaran terlebih dahulu sebelum membuat jadwal.']);
        }

        foreach ($validated['classroom_id'] as $classId) {
            TeachingSchedule::firstOrCreate([
                'user_id' => $validated['user_id'],
                'subject_id' => $validated['subject_id'],
                'classroom_id' => $classId,
                'academic_year_id' => $activeAcademic->id,
            ]);
        }

        return back();
    }

    public function update(Request $request, TeachingSchedule $teaching_schedule)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'subject_id' => 'required|exists:subjects,id',
            'classroom_id' => 'required|exists:classrooms,id',
        ]);

        $exists = TeachingSchedule::where('user_id', $validated['user_id'])
            ->where('subject_id', $validated['subject_id'])
            ->where('classroom_id', $validated['classroom_id'])
            ->where('academic_year_id', $teaching_schedule->academic_year_id)
            ->where('id', '!=', $teaching_schedule->id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['classroom_id' => 'Penugasan ini sudah ada di sistem pada semester yang sama.']);
        }

        $teaching_schedule->update($validated);
        return back();
    }

    public function destroy(TeachingSchedule $teachingSchedule)
    {
        $teachingSchedule->delete();
        return redirect()->back();
    }
}
