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
        Schema::create('school_users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('school_id')->nullable()->constrained('schools')->cascadeOnDelete();
            $table->foreignId('foundation_id')->nullable()->constrained('foundations')->cascadeOnDelete();
            $table->string('role'); // super_admin, foundation_admin, principal, school_admin, teacher, homeroom_teacher, treasurer, student, guardian
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['user_id', 'school_id', 'role']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('school_users');
    }
};
