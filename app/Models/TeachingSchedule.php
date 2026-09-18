<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;

class TeachingSchedule extends Model
{
    use HasUlids;
    protected $guarded = ['id'];

    // --- GLOBAL SCOPE TAHUN AJARAN ---
    protected static function booted(): void
    {
        static::addGlobalScope('active_academic_year', function (Builder $builder) {
            $activeYearId = Cache::rememberForever('active_academic_year_id', function () {
                return AcademicYear::where('is_active', true)->value('id');
            });

            if ($activeYearId) {
                $builder->where('teaching_schedules.academic_year_id', $activeYearId);
            }
        });
    }
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function classroom(): BelongsTo
    {
        return $this->belongsTo(Classroom::class, 'classroom_id');
    }

    public function meetings(): HasMany
    {
        return $this->hasMany(Meeting::class)->orderBy('pertemuan_ke', 'asc');
    }

    public function academicYear(): BelongsTo
    {
        return $this->belongsTo(AcademicYear::class);
    }
}
