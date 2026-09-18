<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Cache;

class AcademicYear extends Model
{
    use HasUuids;

    protected $fillable = [
        'tahun_ajaran',
        'semester',
        'tanggal_mulai',
        'tanggal_selesai',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
    ];

    public function scopeActive(Builder $query)
    {
        return $query->where('is_active', true);
    }

    public function setActive(AcademicYear $academicYear)
    {
        // Nonaktifkan semua yang lain
        AcademicYear::where('id', '!=', $academicYear->id)->update(['is_active' => false]);

        // Aktifkan yang dipilih
        $academicYear->update(['is_active' => true]);

        // HAPUS CACHE LAMA AGAR GLOBAL SCOPE MEMBACA ID TERBARU
        Cache::forget('active_academic_year_id');

        return redirect()->back()->with('success', 'Tahun Ajaran Aktif berhasil diubah.');
    }
}
