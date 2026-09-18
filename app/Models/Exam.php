<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exam extends Model
{
    protected $fillable = ['teaching_schedule_id', 'judul', 'deskripsi', 'durasi_menit', 'waktu_buka', 'waktu_tutup', 'izinkan_upload'];

    protected function casts(): array
    {
        return [
            'waktu_buka' => 'datetime',
            'waktu_tutup' => 'datetime',
            'izinkan_upload' => 'boolean'
        ];
    }

    public function teachingSchedule(): BelongsTo
    {
        return $this->belongsTo(TeachingSchedule::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(ExamQuestion::class);
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(ExamSession::class);
    }
}
