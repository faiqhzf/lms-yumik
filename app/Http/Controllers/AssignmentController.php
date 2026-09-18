<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\TeachingSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AssignmentController extends Controller
{
    // ==========================================
    // AKSES GURU (Manajemen Tugas KBM)
    // ==========================================

    public function index()
    {
        $assignments = Assignment::with([
            'meeting.teachingSchedule.subject',
            'meeting.teachingSchedule.classroom'
        ])
            ->whereHas('meeting.teachingSchedule', function ($query) {
                $query->where('user_id', Auth::id());
            })
            ->latest()
            ->paginate(10);

        $schedules = TeachingSchedule::with(['subject', 'classroom'])
            ->where('user_id', Auth::id())
            ->get();

        return Inertia::render('Guru/Assignments/Index', [
            'assignments' => $assignments,
            'schedules' => $schedules
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'meeting_id' => 'required|exists:meetings,id',
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'deadline' => 'required|date',
            'max_score' => 'nullable|integer|min:1|max:100',
        ]);

        $validated['max_score'] = $validated['max_score'] ?? 100;

        Assignment::create($validated);
        return redirect()->back();
    }

    public function update(Request $request, Assignment $assignment)
    {
        $isOwner = $assignment->meeting->teachingSchedule->user_id === Auth::id();
        if (!$isOwner) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'deadline' => 'required|date',
            'max_score' => 'nullable|integer|min:1|max:100',
        ]);

        $validated['max_score'] = $validated['max_score'] ?? 100;

        $assignment->update($validated);
        return redirect()->back();
    }

    public function destroy(Assignment $assignment)
    {
        $isOwner = $assignment->meeting->teachingSchedule->user_id === Auth::id();
        if (!$isOwner) {
            abort(403, 'Unauthorized action.');
        }

        $assignment->delete();
        return redirect()->back();
    }

    // ==========================================
    // AKSES SISWA (Melihat Daftar Tugas)
    // ==========================================

    public function indexSiswa()
    {
        $assignments = Assignment::with([
            'meeting.teachingSchedule.subject',
            'meeting.teachingSchedule.classroom',
            'meeting.teachingSchedule.user',
            'submissions' => function ($query) {
                $query->where('user_id', Auth::id());
            }
        ])
            ->latest()
            ->paginate(10);

        return Inertia::render('Siswa/Assignments/Index', [
            'assignments' => $assignments
        ]);
    }
}
