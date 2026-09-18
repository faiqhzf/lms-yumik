<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExamController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $exams = Exam::whereHas('teachingSchedule', function ($query) use ($user) {
            $query->where('classroom_id', $user->classroom_id);
        })
            ->with([
                'teachingSchedule.subject:id,name',
                'sessions' => function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                }
            ])
            ->latest()
            ->get();

        return Inertia::render('Siswa/Exams/Index', [
            'exams' => $exams,
            'now' => now()->toIso8601String()
        ]);
    }
}
