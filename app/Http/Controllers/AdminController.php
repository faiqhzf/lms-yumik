<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Subject;
use App\Models\Classroom;
use App\Models\TeachingSchedule;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        // 1. Mengambil total data untuk kartu statistik
        // Pastikan nama key (seperti 'totalGuru') persis dengan yang dipanggil di Dashboard.tsx
        $stats = [
            'totalGuru' => User::where('role', 'guru')->count(),
            'totalSiswa' => User::where('role', 'siswa')->count(),
            'totalKelas' => Classroom::count(),
            'totalMapel' => Subject::count(),
            'totalJadwal' => TeachingSchedule::count(), // Tetap dipertahankan untuk kebutuhan mendatang
        ];

        // 2. Mengambil 3 siswa terbaru beserta data relasi kelasnya
        $recentStudents = User::where('role', 'siswa')
            ->with('classrooms') // Ubah dari 'classroom' menjadi 'classrooms'
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => (string) $user->id,
                    'nis' => '100' . $user->id,
                    'name' => $user->name,
                    // Ambil kelas pertama dari relasi pivot (kelas saat ini)
                    'classroom' => $user->classrooms->first() ? $user->classrooms->first()->nama_kelas : 'Belum diatur'
                ];
            });

        // 3. Melempar data ke komponen React
        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentStudents' => $recentStudents
        ]);
    }
}
