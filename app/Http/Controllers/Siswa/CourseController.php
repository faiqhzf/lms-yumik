<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\TeachingSchedule;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function show(string $id)
    {
        $schedule = TeachingSchedule::with([
            'subject',
            'user',
            'meetings.materials',
            'meetings.assignments' => function ($q) {
                $q->with(['submissions' => function ($sq) {
                    $sq->where('user_id', Auth::id());
                }]);
            }
        ])
            ->where('id', $id)
            ->where('classroom_id', Auth::user()->classroom_id)
            ->firstOrFail();

        return Inertia::render('Siswa/Courses/Show', [
            'schedule' => $schedule
        ]);
    }
}
