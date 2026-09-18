<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {

        Schema::create('questions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('exam_id')->constrained()->cascadeOnDelete();
            $table->text('teks_soal');
            $table->json('pilihan_ganda')->nullable(); // Insight: Gunakan JSON column untuk memangkas tabel relasi opsi
            $table->string('kunci_jawaban')->nullable();
            $table->enum('tipe', ['pg', 'essay']);
            $table->integer('poin');
            $table->timestamps();
        });

        Schema::create('grades', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignId('siswa_id')->constrained('users')->cascadeOnDelete();
            $table->foreignUlid('subject_id')->constrained()->cascadeOnDelete();
            $table->decimal('nilai_tugas', 5, 2)->default(0);
            $table->decimal('nilai_ujian', 5, 2)->default(0);
            $table->decimal('nilai_akhir', 5, 2)->storedAs('nilai_tugas * 0.4 + nilai_ujian * 0.6'); // Insight: Virtual Generated Column di DB
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
        Schema::dropIfExists('questions');
    }
};
