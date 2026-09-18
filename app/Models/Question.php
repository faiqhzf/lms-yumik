<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class Question extends Model
{
    use HasUlids;

    protected $guarded = ['id'];
    
    protected function casts(): array
    {
        return [
            'pilihan_ganda' => 'array',
        ];
    }
}