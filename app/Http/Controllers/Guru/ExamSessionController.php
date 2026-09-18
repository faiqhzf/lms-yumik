<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamSession;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExamSessionController extends Controller
{
    public function index(Exam $exam)
    {
        // Validasi kepemilikan
        if ($exam->teachingSchedule->user_id !== Auth::id()) abort(403);

        $exam->load('teachingSchedule.subject', 'teachingSchedule.classroom');
        $classroomId = $exam->teachingSchedule->classroom_id;

        // Ambil semua siswa di kelas tersebut
        $students = User::where('role', 'siswa')
            ->where('classroom_id', $classroomId)
            ->select('id', 'name', 'email')
            ->orderBy('name', 'asc')
            ->get();

        // Ambil sesi ujian yang sudah ada
        $sessions = ExamSession::where('exam_id', $exam->id)->get()->keyBy('user_id');

        // Mapping status pengerjaan secara manual di backend
        $monitoringData = $students->map(function ($student) use ($sessions) {
            $session = $sessions->get($student->id);
            return [
                'user_id' => $student->id,
                'name' => $student->name,
                'session_id' => $session ? $session->id : null,
                'status' => $session ? $session->status : 'belum_mulai',
                'waktu_mulai' => $session ? $session->waktu_mulai : null,
                'waktu_selesai' => $session ? $session->waktu_selesai : null,
                'nilai_pg' => $session ? $session->nilai_pg : null,
                'nilai_essay' => $session ? $session->nilai_essay : null,
                'file_upload' => $session ? $session->file_upload : null,
                'total_nilai' => $session ? (($session->nilai_pg ?? 0) + ($session->nilai_essay ?? 0)) : 0,
            ];
        });

        return Inertia::render('Guru/Exams/Monitoring', [
            'exam' => $exam,
            'monitoringData' => $monitoringData
        ]);
    }

    public function updateNilaiEssay(Request $request, ExamSession $session)
    {
        if ($session->exam->teachingSchedule->user_id !== Auth::id()) abort(403);

        $validated = $request->validate([
            'nilai_essay' => 'required|numeric|min:0|max:100'
        ]);

        $session->update(['nilai_essay' => $validated['nilai_essay']]);

        return back();
    }
}
