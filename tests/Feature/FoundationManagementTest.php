<?php

namespace Tests\Feature;

use App\Models\AcademicYear;
use App\Models\School;
use App\Models\Semester;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FoundationManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_foundation_admin_can_access_school_management(): void
    {
        $foundationAdmin = User::where('email', 'admin.yayasan@alhikmah.sch.id')->firstOrFail();

        $response = $this->actingAs($foundationAdmin)->get('/foundation/schools');
        $response->assertStatus(200);
    }

    public function test_foundation_admin_can_create_new_school_and_its_initial_admin(): void
    {
        $foundationAdmin = User::where('email', 'admin.yayasan@alhikmah.sch.id')->firstOrFail();

        $response = $this->actingAs($foundationAdmin)->post('/foundation/schools', [
            'name' => 'SMK Al-Hikmah Informatika',
            'npsn' => '20104599',
            'educational_level' => 'SMK',
            'email' => 'smk@alhikmah.sch.id',
            'phone' => '022-7231499',
            'address' => 'Jl. Rancabolang No. 47, Bandung',
            'is_active' => true,
            'admin_name' => 'Rian Hidayat, S.Kom',
            'admin_email' => 'admin.smk@alhikmah.sch.id',
            'admin_password' => 'password123',
        ]);

        $response->assertRedirect('/foundation/schools');
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('schools', [
            'name' => 'SMK Al-Hikmah Informatika',
            'npsn' => '20104599',
            'educational_level' => 'SMK',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'admin.smk@alhikmah.sch.id',
            'name' => 'Rian Hidayat, S.Kom',
        ]);

        $school = School::where('npsn', '20104599')->firstOrFail();
        $adminUser = User::where('email', 'admin.smk@alhikmah.sch.id')->firstOrFail();

        $this->assertDatabaseHas('school_users', [
            'user_id' => $adminUser->id,
            'school_id' => $school->id,
            'role' => 'school_admin',
        ]);
    }

    public function test_foundation_admin_can_create_and_activate_academic_year(): void
    {
        $foundationAdmin = User::where('email', 'admin.yayasan@alhikmah.sch.id')->firstOrFail();
        $sma = School::where('slug', 'sma-plus-al-hikmah-1')->firstOrFail();

        $response = $this->actingAs($foundationAdmin)->post('/foundation/academic-years', [
            'school_id' => $sma->id,
            'name' => '2027/2028',
            'start_date' => '2027-07-15',
            'end_date' => '2028-06-25',
            'is_active' => true,
            'active_semester' => 'ganjil',
        ]);

        $response->assertSessionHas('success');

        $newAy = AcademicYear::withoutGlobalScopes()
            ->where('school_id', $sma->id)
            ->where('name', '2027/2028')
            ->firstOrFail();

        $this->assertTrue($newAy->is_active);

        // Previous academic year should be deactivated
        $oldAy = AcademicYear::withoutGlobalScopes()
            ->where('school_id', $sma->id)
            ->where('name', '2026/2027')
            ->firstOrFail();

        $this->assertFalse($oldAy->is_active);

        // Semesters created
        $this->assertEquals(2, Semester::withoutGlobalScopes()->where('academic_year_id', $newAy->id)->count());
    }

    public function test_unauthorized_school_staff_cannot_access_foundation_management(): void
    {
        $guru = User::where('email', 'guru.sma@alhikmah.sch.id')->firstOrFail();

        $response = $this->actingAs($guru)->get('/foundation/schools');
        $response->assertStatus(403);
    }
}
