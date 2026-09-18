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
    Schema::create('subjects', function (Blueprint $table) {
        $table->ulid('id')->primary(); // Menggunakan ULID
        $table->string('name');
        $table->string('tingkat', 10);
        $table->timestamps();
    });

    Schema::create('classrooms', function (Blueprint $table) {
        $table->ulid('id')->primary();
        $table->string('nama_kelas');
        $table->foreignId('wali_kelas_id')->nullable()->constrained('users')->nullOnDelete();
        $table->timestamps();
    });


    Schema::create('classroom_user', function (Blueprint $table) {
        $table->foreignUlid('classroom_id')->constrained()->cascadeOnDelete();
        $table->foreignId('user_id')->constrained()->cascadeOnDelete();
        $table->primary(['classroom_id', 'user_id']);
    });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_tables');
    }
};
