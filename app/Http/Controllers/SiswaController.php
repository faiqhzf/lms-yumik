<?php

namespace App\Http\Controllers;

use App\Models\TeachingSchedule;
use App\Models\Assignment;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SiswaController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $jadwal = TeachingSchedule::with(['subject:id,name', 'user:id,name'])
            ->where('classroom_id', $user->classroom_id)
            ->get();

        // Ambil tugas yang belum dikerjakan oleh siswa ini
        $tugas_pending = Assignment::with(['meeting.teachingSchedule.subject'])
            ->whereHas('meeting.teachingSchedule', function ($q) use ($user) {
                $q->where('classroom_id', $user->classroom_id);
            })
            ->whereDoesntHave('submissions', function ($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Siswa/Dashboard', [
            'jadwal' => $jadwal,
            'tugas_pending' => $tugas_pending
        ]);
    }
}
