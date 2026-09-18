<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Subject;
use App\Models\Classroom;
use App\Models\TeachingSchedule;

class DummyKbmSeeder extends Seeder
{
    public function run(): void
    {
        $guru = User::where('email', 'guru@yumik.sch.id')->first();

        // Buat 2 Kelas
        $kelas1 = Classroom::firstOrCreate(['nama_kelas' => 'XII Pemrograman'], ['wali_kelas_id' => $guru->id]);
        $kelas2 = Classroom::firstOrCreate(['nama_kelas' => 'XI RPL 1'], ['wali_kelas_id' => $guru->id]);

        // Buat 2 Mata Pelajaran
        $mapel1 = Subject::firstOrCreate(['name' => 'Pemrograman Java Lanjut'], ['tingkat' => '12']);
        $mapel2 = Subject::firstOrCreate(['name' => 'Basis Data'], ['tingkat' => '11']);

        // Jadwal 1: Kelas XII
        TeachingSchedule::firstOrCreate([
            'user_id' => $guru->id,
            'subject_id' => $mapel1->id,
            'classroom_id' => $kelas1->id,
        ]);

        // Jadwal 2: Kelas XI
        TeachingSchedule::firstOrCreate([
            'user_id' => $guru->id,
            'subject_id' => $mapel2->id,
            'classroom_id' => $kelas2->id,
        ]);
    }
}
