<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\ExamQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExamQuestionController extends Controller
{
    public function index(Exam $exam)
    {
        // Pastikan guru hanya bisa mengelola ujian dari jadwal miliknya
        if ($exam->teachingSchedule->user_id !== Auth::id()) abort(403);

        $questions = $exam->questions()->latest()->get();

        return Inertia::render('Guru/Exams/Questions', [
            'exam' => $exam,
            'questions' => $questions
        ]);
    }

    public function store(Request $request, Exam $exam)
    {
        if ($exam->teachingSchedule->user_id !== Auth::id()) abort(403);

        $validated = $request->validate([
            'pertanyaan' => 'required|string',
            'opsi_a' => 'required|string',
            'opsi_b' => 'required|string',
            'opsi_c' => 'required|string',
            'opsi_d' => 'required|string',
            'opsi_e' => 'nullable|string',
            'jawaban_benar' => 'required|in:A,B,C,D,E',
            'bobot_nilai' => 'required|integer|min:1',
        ]);

        $exam->questions()->create($validated);
        return back();
    }

    public function update(Request $request, ExamQuestion $question)
    {
        if ($question->exam->teachingSchedule->user_id !== Auth::id()) abort(403);

        $validated = $request->validate([
            'pertanyaan' => 'required|string',
            'opsi_a' => 'required|string',
            'opsi_b' => 'required|string',
            'opsi_c' => 'required|string',
            'opsi_d' => 'required|string',
            'opsi_e' => 'nullable|string',
            'jawaban_benar' => 'required|in:A,B,C,D,E',
            'bobot_nilai' => 'required|integer|min:1',
        ]);

        $question->update($validated);
        return back();
    }

    public function destroy(ExamQuestion $question)
    {
        if ($question->exam->teachingSchedule->user_id !== Auth::id()) abort(403);
        $question->delete();
        return back();
    }

    public function downloadTemplate()
    {
        $headers = [
            "Content-type"        => "text/csv",
            "Content-Disposition" => "attachment; filename=template_soal_ujian.csv",
            "Pragma"              => "no-cache",
            "Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
            "Expires"             => "0"
        ];

        $columns = ['pertanyaan', 'opsi_a', 'opsi_b', 'opsi_c', 'opsi_d', 'opsi_e', 'jawaban_benar', 'bobot_nilai'];

        $callback = function () use ($columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns);
            fputcsv($file, ['Apa ibukota Indonesia?', 'Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Semarang', 'A', '1']);
            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    public function import(Request $request, Exam $exam)
    {
        if ($exam->teachingSchedule->user_id !== Auth::id()) abort(403);

        $request->validate(['file' => 'required|mimes:csv,txt|max:2048']);

        $file = $request->file('file');
        $fileHandle = fopen($file->getRealPath(), 'r');
        fgetcsv($fileHandle); // Lewati header

        $questions = [];
        while (($row = fgetcsv($fileHandle)) !== false) {
            if (count($row) < 8 || empty($row[0]) || empty($row[1]) || empty($row[2]) || empty($row[3]) || empty($row[4]) || empty($row[6]) || empty($row[7])) {
                continue;
            }

            $questions[] = [
                'exam_id' => $exam->id,
                'pertanyaan' => trim($row[0]),
                'opsi_a' => trim($row[1]),
                'opsi_b' => trim($row[2]),
                'opsi_c' => trim($row[3]),
                'opsi_d' => trim($row[4]),
                'opsi_e' => trim($row[5]) !== '' ? trim($row[5]) : null,
                'jawaban_benar' => strtoupper(trim($row[6])),
                'bobot_nilai' => (int) trim($row[7]),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        fclose($fileHandle);

        if (!empty($questions)) {
            ExamQuestion::insert($questions);
        }

        return back();
    }
}
