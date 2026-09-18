<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExamAnswer extends Model
{
    protected $fillable = ['exam_session_id', 'exam_question_id', 'jawaban_siswa', 'is_correct'];
    protected $casts = ['is_correct' => 'boolean'];
}
