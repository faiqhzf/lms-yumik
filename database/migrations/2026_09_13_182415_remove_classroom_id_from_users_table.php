<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Jika sebelumnya classroom_id diatur sebagai foreign key, 
            // hapus foreign key-nya terlebih dahulu (hapus tanda // di bawah jika error)
            // $table->dropForeign(['classroom_id']); 

            $table->dropColumn('classroom_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignUlid('classroom_id')->nullable()->constrained('classrooms')->cascadeOnDelete();
        });
    }
};
