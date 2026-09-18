<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class SubmissionController extends Controller
{
    public function indexGuru(Assignment $assignment)
    {
        $isOwner = $assignment->meeting->teachingSchedule->user_id === Auth::id();
        if (!$isOwner) {
            abort(403, 'Unauthorized action.');
        }

        $assignment->load([
            'meeting.teachingSchedule.classroom',
            'meeting.teachingSchedule.subject'
        ]);

        $submissions = $assignment->submissions()->with('user:id,name')->latest()->get();

        return Inertia::render('Guru/Assignments/Submissions', [
            'assignment' => $assignment,
            'submissions' => $submissions
        ]);
    }

    public function grade(Request $request, Submission $submission)
    {
        $request->validate([
            'nilai' => 'required|integer|min:0|max:100',
            'komentar_guru' => 'nullable|string',
        ]);

        $submission->update([
            'nilai' => $request->nilai,
            'komentar_guru' => $request->komentar_guru,
        ]);

        return back();
    }
    public function store(Request $request, Assignment $assignment)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // Maksimal 10MB
            'catatan_siswa' => 'nullable|string',
        ]);

        $path = $request->file('file')->store('submissions', 'public');

        Submission::updateOrCreate(
            [
                'assignment_id' => $assignment->id,
                'user_id' => Auth::id(),
            ],
            [
                'file_url' => '/storage/' . $path,
                'catatan_siswa' => $request->catatan_siswa,
            ]
        );

        return back();
    }
}
