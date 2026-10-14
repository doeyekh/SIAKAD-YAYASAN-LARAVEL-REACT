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
        Schema::table('teachers', function (Blueprint $table) {
            // Add new profile columns without changing tenant scoping
            $table->string('nik')->nullable()->after('title_suffix');
            $table->enum('jenis_guru', ['tetap', 'honorer', 'pns'])->nullable()->after('nik');
            $table->string('npwp')->nullable()->after('jenis_guru');
            $table->string('foto')->nullable()->after('npwp');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teachers', function (Blueprint $table) {
            // Drop added profile columns only
            $table->dropColumn(['nik', 'jenis_guru', 'npwp', 'foto']);
        });
    }
};
