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
        Schema::table('students', function (Blueprint $table): void {
            $table->index(['school_id', 'status']);
        });

        Schema::table('teachers', function (Blueprint $table): void {
            $table->index(['school_id', 'is_active']);
        });

        Schema::table('classrooms', function (Blueprint $table): void {
            $table->index(['school_id', 'academic_year_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table): void {
            $table->dropIndex(['school_id', 'status']);
        });

        Schema::table('teachers', function (Blueprint $table): void {
            $table->dropIndex(['school_id', 'is_active']);
        });

        Schema::table('classrooms', function (Blueprint $table): void {
            $table->dropIndex(['school_id', 'academic_year_id']);
        });
    }
};
