<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('school_users', function (Blueprint $table) {
            $table->string('role_type', 50)->default('school')->after('role');
            $table->index('role_type');
        });

        // Backfill the new type column for existing assignments.
        foreach ([
            'super_admin' => 'system',
            'foundation_admin' => 'foundation',
            'student' => 'student',
            'guardian' => 'guardian',
        ] as $role => $type) {
            DB::table('school_users')->where('role', $role)->update(['role_type' => $type]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('school_users', function (Blueprint $table) {
            $table->dropIndex(['role_type']);
            $table->dropColumn('role_type');
        });
    }
};
