<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {

        Schema::create('meetings', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('teaching_schedule_id')->constrained('teaching_schedules')->cascadeOnDelete();
            $table->tinyInteger('pertemuan_ke');
            $table->date('tanggal')->nullable();
            $table->text('rencana_materi')->nullable();
            $table->enum('metode', ['online', 'offline'])->default('offline');
            $table->string('link_vicon')->nullable();
            $table->timestamps();
        });



        Schema::create('materials', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('judul');
            $table->string('file_url')->nullable();
            $table->timestamps();
        });


        Schema::create('material_meeting', function (Blueprint $table) {
            $table->foreignUlid('material_id')->constrained('materials')->cascadeOnDelete();
            $table->foreignUlid('meeting_id')->constrained('meetings')->cascadeOnDelete();
            $table->primary(['material_id', 'meeting_id']);
        });


        Schema::create('assignments', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('meeting_id')->constrained('meetings')->cascadeOnDelete();
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->dateTime('deadline');
            $table->unsignedTinyInteger('max_score')->default(100);
            $table->timestamps();
        });


        Schema::create('submissions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('assignment_id')->constrained('assignments')->cascadeOnDelete();
            $table->foreignId('siswa_id')->constrained('users')->cascadeOnDelete();
            $table->string('file_url')->nullable();
            $table->decimal('nilai', 5, 2)->nullable();
            $table->enum('status', ['submitted', 'graded', 'late'])->default('submitted');
            $table->timestamps();
        });


        Schema::create('attendances', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignUlid('meeting_id')->constrained('meetings')->cascadeOnDelete();
            $table->foreignId('siswa_id')->constrained('users')->cascadeOnDelete();
            $table->enum('status', ['hadir', 'izin', 'sakit', 'alfa'])->default('alfa');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
        Schema::dropIfExists('submissions');
        Schema::dropIfExists('assignments');
        Schema::dropIfExists('material_meeting');
        Schema::dropIfExists('materials');
        Schema::dropIfExists('meetings');
    }
};
