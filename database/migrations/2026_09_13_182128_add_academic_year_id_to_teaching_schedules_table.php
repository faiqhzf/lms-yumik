<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('teaching_schedules', function (Blueprint $table) {
            $table->foreignUuid('academic_year_id')->after('id')->nullable()->constrained('academic_years')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('teaching_schedules', function (Blueprint $table) {
            $table->dropForeign(['academic_year_id']);
            $table->dropColumn('academic_year_id');
        });
    }
};
