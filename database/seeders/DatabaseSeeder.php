<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Classroom;
use App\Models\Subject;
use App\Models\TeachingSchedule;
use App\Models\Exam;
use App\Models\ExamQuestion;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $password = Hash::make('password123');

        // 1. Buat Tahun Ajaran Aktif (Tambahan Baru)
        $tahunAjaran = \App\Models\AcademicYear::create([
            'tahun_ajaran' => '2026/2027',
            'semester' => 'Ganjil',
            'tanggal_mulai' => Carbon::now()->startOfYear(),
            'tanggal_selesai' => Carbon::now()->endOfYear(),
            'is_active' => true,
        ]);

        // 2. Buat Kelas
        $kelas10A = Classroom::create(['nama_kelas' => '10-A']);
        $kelas10B = Classroom::create(['nama_kelas' => '10-B']);

        // 3. Buat Pengguna
        User::create(['name' => 'Super Admin', 'email' => 'admin@lms.com', 'password' => $password, 'role' => 'admin_master']);
        $guru1 = User::create(['name' => 'Budi Santoso, S.Pd', 'email' => 'guru@lms.com', 'password' => $password, 'role' => 'guru']);

        // Hapus classroom_id dari sini
        $siswa1 = User::create(['name' => 'Siswa Pertama', 'email' => 'siswa@lms.com', 'password' => $password, 'role' => 'siswa']);
        $siswa2 = User::create(['name' => 'Siswa Kedua', 'email' => 'siswa2@lms.com', 'password' => $password, 'role' => 'siswa']);

        // 4. Masukkan siswa ke kelas melalui Pivot Table
        $siswa1->classrooms()->attach($kelas10A->id, ['academic_year_id' => $tahunAjaran->id]);
        $siswa2->classrooms()->attach($kelas10A->id, ['academic_year_id' => $tahunAjaran->id]);

        // 5. Buat Mata Pelajaran
        $matematika = Subject::create(['name' => 'Matematika Dasar', 'tingkat' => '10']);

        // 6. Buat Jadwal Mengajar (Tambahkan academic_year_id)
        $jadwal1 = TeachingSchedule::create([
            'user_id' => $guru1->id,
            'subject_id' => $matematika->id,
            'classroom_id' => $kelas10A->id,
            'academic_year_id' => $tahunAjaran->id, // Ikatan ke wadah semester
        ]);

        // 5. Buat Skenario Ujian Aktif
        $exam = Exam::create([
            'teaching_schedule_id' => $jadwal1->id,
            'judul' => 'Ujian Tengah Semester (CBT & Essay)',
            'deskripsi' => 'Kerjakan pilihan ganda di sistem dan unggah foto kertas untuk essay.',
            'durasi_menit' => 90,
            'waktu_buka' => Carbon::now()->subMinutes(10), // Sudah buka 10 menit lalu
            'waktu_tutup' => Carbon::now()->addDays(1), // Tutup besok
            'izinkan_upload' => true,
        ]);

        // 6. Bank Soal Ujian
        ExamQuestion::insert([
            [
                'exam_id' => $exam->id,
                'pertanyaan' => 'Berapakah hasil dari 5 x 5?',
                'opsi_a' => '10',
                'opsi_b' => '15',
                'opsi_c' => '20',
                'opsi_d' => '25',
                'opsi_e' => '30',
                'jawaban_benar' => 'D',
                'bobot_nilai' => 50,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'exam_id' => $exam->id,
                'pertanyaan' => 'Rumus luas segitiga adalah...',
                'opsi_a' => 'p x l',
                'opsi_b' => '1/2 x a x t',
                'opsi_c' => 's x s',
                'opsi_d' => 'a x t',
                'opsi_e' => 'pi x r x r',
                'jawaban_benar' => 'B',
                'bobot_nilai' => 50,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
