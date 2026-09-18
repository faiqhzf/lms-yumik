<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;


class Meeting extends Model
{
    use HasUlids;
    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
        ];
    }

    public function teachingSchedule(): BelongsTo
    {
        return $this->belongsTo(TeachingSchedule::class);
    }

    public function materials(): BelongsToMany
    {
        return $this->belongsToMany(Material::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(Assignment::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    protected static function booted(): void
    {
        static::addGlobalScope('active_academic_year', function (Builder $builder) {
            $activeYearId = Cache::rememberForever('active_academic_year_id', function () {
                return AcademicYear::where('is_active', true)->value('id');
            });

            if ($activeYearId) {
                $builder->whereHas('teachingSchedule', function ($query) use ($activeYearId) {
                    $query->where('academic_year_id', $activeYearId);
                });
            }
        });
    }
}
