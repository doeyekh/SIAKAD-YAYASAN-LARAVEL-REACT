<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\School;
use App\Models\SchoolUser;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class RoleManagementSeeder extends Seeder
{
    public function run(): void
    {
        $sma = School::where('slug', 'sma-plus-al-hikmah-1')->first();
        $smp = School::where('slug', 'smp-al-hikmah')->first();

        $schools = collect([$sma, $smp])->filter();

        foreach ($schools as $school) {
            $academicYearId = AcademicYear::where('school_id', $school->id)
                ->where('is_active', true)
                ->value('id');

            $user = User::firstOrCreate(
                ['email' => 'bendahara.' . $school->slug . '@alhikmah.sch.id'],
                [
                    'name' => 'Bendahara ' . $school->name,
                    'password' => Hash::make('password'),
                    'is_active' => true,
                ]
            );

            SchoolUser::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'school_id' => $school->id,
                    'role' => 'treasurer',
                ],
                [
                    'foundation_id' => $school->foundation_id,
                    'academic_year_id' => $academicYearId,
                    'is_active' => true,
                ]
            );

            SchoolUser::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'school_id' => $school->id,
                    'role' => 'school_admin',
                ],
                [
                    'foundation_id' => $school->foundation_id,
                    'academic_year_id' => $academicYearId,
                    'is_active' => true,
                ]
            );
        }
    }
}
