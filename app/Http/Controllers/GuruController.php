<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\TeachingSchedule;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class GuruController extends Controller
{
    public function index()
    {
        $guruId = Auth::id();

        $stats = [
            'total_kelas' => TeachingSchedule::where('user_id', $guruId)->count(),
            'total_tugas' => Assignment::where('guru_id', $guruId)->count(),
        ];



        $jadwal = TeachingSchedule::with(['subject:id,name', 'classroom:id,nama_kelas'])
            ->where('user_id', $guruId)
            ->get();

        $tugasTerbaru = Assignment::with(['classroom:id,nama_kelas', 'subject:id,name'])
            ->where('guru_id', $guruId)
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Guru/Dashboard', [
            'stats' => $stats,
            'jadwal' => $jadwal,
            'tugas_terbaru' => $tugasTerbaru,
        ]);
    }
}
