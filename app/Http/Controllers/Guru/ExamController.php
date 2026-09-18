<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\TeachingSchedule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ExamController extends Controller
{
    public function index()
    {
        $schedules = TeachingSchedule::where('user_id', Auth::id())->pluck('id');
        $exams = Exam::with(['teachingSchedule.subject', 'teachingSchedule.classroom'])
            ->whereIn('teaching_schedule_id', $schedules)
            ->withCount('questions', 'sessions')
            ->latest()
            ->get();

        return Inertia::render('Guru/Exams/Index', ['exams' => $exams]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'teaching_schedule_id' => 'required|exists:teaching_schedules,id',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'durasi_menit' => 'required|integer|min:1',
            'waktu_buka' => 'required|date',
            'waktu_tutup' => 'required|date|after:waktu_buka',
            'izinkan_upload' => 'boolean',
        ]);

        Exam::create($validated);
        return back();
    }
}
