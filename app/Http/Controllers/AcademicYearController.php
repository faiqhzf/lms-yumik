<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;

class AcademicYearController extends Controller
{
    public function index()
    {
        $academicYears = AcademicYear::orderBy('tanggal_mulai', 'desc')->get();

        return Inertia::render('Admin/Academics/Index', [
            'academicYears' => $academicYears
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tahun_ajaran' => 'required|string',
            'semester' => 'required|in:Ganjil,Genap',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
        ]);

        $isFirst = AcademicYear::count() === 0;
        $validated['is_active'] = $isFirst;

        AcademicYear::create($validated);

        if ($isFirst) {
            Cache::forget('active_academic_year_id');
        }

        return redirect()->back()->with('success', 'Tahun Ajaran berhasil ditambahkan.');
    }

    public function setActive(AcademicYear $academicYear)
    {
        AcademicYear::where('id', '!=', $academicYear->id)->update(['is_active' => false]);

        $academicYear->update(['is_active' => true]);

        Cache::forget('active_academic_year_id');

        return redirect()->back()->with('success', 'Tahun Ajaran aktif berhasil diubah. Seluruh data KBM kini difokuskan ke periode ini.');
    }

    public function destroy(AcademicYear $academicYear)
    {
        if ($academicYear->is_active) {
            return redirect()->back()->withErrors(['error' => 'Tidak dapat menghapus Tahun Ajaran yang sedang aktif. Silakan aktifkan periode lain terlebih dahulu.']);
        }

        $academicYear->delete();

        return redirect()->back()->with('success', 'Tahun Ajaran berhasil dihapus.');
    }
}
