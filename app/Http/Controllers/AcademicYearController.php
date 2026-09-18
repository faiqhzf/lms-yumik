<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AcademicYearController extends Controller
{
    public function index()
    {
        $academics = AcademicYear::orderBy('tanggal_mulai', 'desc')->paginate(10);

        return Inertia::render('Admin/Academics/Index', [
            'academics' => $academics
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tahun_ajaran' => 'required|string|max:10',
            'semester' => 'required|in:Ganjil,Genap',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
        ]);

        AcademicYear::create($validated);

        return redirect()->back()->with('success', 'Tahun akademik berhasil ditambahkan.');
    }

    public function update(Request $request, AcademicYear $academic)
    {
        $validated = $request->validate([
            'tahun_ajaran' => 'required|string|max:10',
            'semester' => 'required|in:Ganjil,Genap',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
        ]);

        $academic->update($validated);

        return redirect()->back()->with('success', 'Data akademik berhasil diperbarui.');
    }

    public function destroy(AcademicYear $academic)
    {
        $academic->delete();
        return redirect()->back();
    }

    public function toggleActive(AcademicYear $academic)
    {
        DB::transaction(function () use ($academic) {
            // Nonaktifkan semua periode akademik
            AcademicYear::query()->update(['is_active' => false]);

            // Aktifkan periode yang dipilih
            $academic->update(['is_active' => true]);
        });

        return redirect()->back()->with('success', 'Periode akademik diaktifkan.');
    }
}
