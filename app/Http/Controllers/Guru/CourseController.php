<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\TeachingSchedule;
use App\Models\Meeting;
use App\Models\Material;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    public function show(string $id)
    {
        $schedule = TeachingSchedule::with(['subject', 'classroom'])
            ->where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        if ($schedule->meetings()->count() === 0) {
            $meetings = [];
            for ($i = 1; $i <= 16; $i++) {
                $meetings[] = [
                    'id' => (string) Str::ulid(),
                    'teaching_schedule_id' => $schedule->id,
                    'pertemuan_ke' => $i,
                    'metode' => 'offline',
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            Meeting::insert($meetings);
        }

        $schedule->load(['meetings.materials', 'meetings.assignments', 'meetings.attendances']);

        $bankMateri = Material::where('user_id', Auth::id())
            ->select('id', 'judul')
            ->latest()
            ->get();

        $students = User::where('role', 'siswa')
            ->where('classroom_id', $schedule->classroom_id)
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Guru/Courses/Show', [
            'schedule' => $schedule,
            'bankMateri' => $bankMateri,
            'students' => $students,
        ]);
    }
}
