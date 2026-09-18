<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class Attendance extends Model
{
    use HasUlids;

    protected $guarded = ['id'];

    public function meeting()
    {
        return $this->belongsTo(Meeting::class);
    }

    public function siswa()
    {
        return $this->belongsTo(User::class, 'siswa_id');
    }
}
