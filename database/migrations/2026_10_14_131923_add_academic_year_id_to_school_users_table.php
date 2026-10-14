<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('school_users', function (Blueprint $table): void {
            $table->foreignId('academic_year_id')->nullable()->after('school_id')->constrained('academic_years')->nullOnDelete();
            $table->index(['user_id', 'school_id', 'academic_year_id']);
        });
    }

    public function down(): void
    {
        Schema::table('school_users', function (Blueprint $table): void {
            $table->dropIndex(['user_id', 'school_id', 'academic_year_id']);
            $table->dropForeign(['academic_year_id']);
            $table->dropColumn('academic_year_id');
        });
    }
};
