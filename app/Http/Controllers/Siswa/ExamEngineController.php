<?php

namespace App\Http\Controllers\Siswa;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamSession;
use App\Models\ExamAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class ExamEngineController extends Controller
{
    public function start(Exam $exam)
    {
        $now = now();

        // Validasi waktu akses
        if ($now->lt($exam->waktu_buka) || $now->gt($exam->waktu_tutup)) {
            abort(403, 'Ujian tidak dapat diakses saat ini.');
        }

        // Cek atau buat sesi baru (hanya 1 sesi per siswa)
        $session = ExamSession::firstOrCreate(
            ['exam_id' => $exam->id, 'user_id' => Auth::id()],
            ['waktu_mulai' => $now, 'status' => 'berjalan']
        );

        // Server-Side Timer Validation
        $endTime = $session->waktu_mulai->copy()->addMinutes($exam->durasi_menit);

        if ($now->gt($endTime)) {
            $this->autoGrade($session);
            return redirect()->route('siswa.dashboard')->with('message', 'Waktu ujian telah habis.');
        }

        $exam->load('questions');

        return Inertia::render('Siswa/Exams/Take', [
            'exam' => $exam,
            'session' => $session,
            'endTime' => $endTime->toIso8601String()
        ]);
    }

    public function saveAnswer(Request $request, ExamSession $session)
    {
        // Validasi manipulasi API: 
        if ($session->user_id !== Auth::id()) abort(403);

        $exam = $session->exam;
        $endTime = $session->waktu_mulai->copy()->addMinutes($exam->durasi_menit);

        // Validasi waktu server: 
        if (now()->gt($endTime) || $session->status === 'selesai') {
            return response()->json(['error' => 'Waktu habis'], 403);
        }

        $question = $exam->questions()->find($request->question_id);

        ExamAnswer::updateOrCreate(
            ['exam_session_id' => $session->id, 'exam_question_id' => $question->id],
            [
                'jawaban_siswa' => $request->jawaban,
                'is_correct' => $request->jawaban === $question->jawaban_benar
            ]
        );

        return response()->json(['success' => true]);
    }

    public function finish(Request $request, ExamSession $session)
    {
        if ($session->user_id !== Auth::id()) abort(403);

        if ($request->hasFile('file') && $session->exam->izinkan_upload) {
            $path = $request->file('file')->store('exams', 'public');
            $session->file_upload = '/storage/' . $path;
        }

        $this->autoGrade($session);
        return redirect()->route('siswa.dashboard');
    }

    private function autoGrade(ExamSession $session)
    {
        if ($session->status === 'selesai') return;

        $answers = $session->answers()->with('examQuestion')->get();
        $totalBobot = $session->exam->questions()->sum('bobot_nilai');

        $skorDiperoleh = 0;
        foreach ($answers as $ans) {
            if ($ans->is_correct) {
                $skorDiperoleh += $ans->examQuestion->bobot_nilai;
            }
        }

        $nilaiAkhir = $totalBobot > 0 ? ($skorDiperoleh / $totalBobot) * 100 : 0;

        $session->update([
            'status' => 'selesai',
            'waktu_selesai' => now(),
            'nilai_pg' => $nilaiAkhir
        ]);
    }
}
