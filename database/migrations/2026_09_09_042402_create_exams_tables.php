<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('teaching_schedule_id')->constrained('teaching_schedules')->cascadeOnDelete();
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->integer('durasi_menit');
            $table->dateTime('waktu_buka');
            $table->dateTime('waktu_tutup');
            $table->boolean('izinkan_upload')->default(false);
            $table->timestamps();
        });

        Schema::create('exam_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->cascadeOnDelete();
            $table->text('pertanyaan');
            $table->string('opsi_a');
            $table->string('opsi_b');
            $table->string('opsi_c');
            $table->string('opsi_d');
            $table->string('opsi_e')->nullable();
            $table->enum('jawaban_benar', ['A', 'B', 'C', 'D', 'E']);
            $table->integer('bobot_nilai')->default(1);
            $table->timestamps();
        });

        Schema::create('exam_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->dateTime('waktu_mulai');
            $table->dateTime('waktu_selesai')->nullable();
            $table->enum('status', ['berjalan', 'selesai'])->default('berjalan');
            $table->decimal('nilai_pg', 5, 2)->nullable();
            $table->decimal('nilai_essay', 5, 2)->nullable();
            $table->string('file_upload')->nullable();
            $table->timestamps();
        });

        Schema::create('exam_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_session_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exam_question_id')->constrained()->cascadeOnDelete();
            $table->enum('jawaban_siswa', ['A', 'B', 'C', 'D', 'E'])->nullable();
            $table->boolean('is_correct')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('exam_answers');
        Schema::dropIfExists('exam_sessions');
        Schema::dropIfExists('exam_questions');
        Schema::dropIfExists('exams');
    }
};
