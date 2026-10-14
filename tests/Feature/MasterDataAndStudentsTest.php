<?php

namespace Tests\Feature;

use App\Models\Classroom;
use App\Models\School;
use App\Models\Teacher;
use App\Models\User;
use App\Services\SchoolContext;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MasterDataAndStudentsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();

        $sma = School::where('slug', 'sma-plus-al-hikmah-1')->first();
        if ($sma) {
            app(SchoolContext::class)->setSchool($sma);
            app(SchoolContext::class)->setRole('school_admin');
        }
    }

    public function test_admin_can_view_students_list(): void
    {
        $adminSma = User::where('email', 'admin.sma@alhikmah.sch.id')->firstOrFail();
        $sma = School::where('slug', 'sma-plus-al-hikmah-1')->firstOrFail();

        $response = $this->actingAs($adminSma)->get('/students');
        $response->assertStatus(200);
    }

    public function test_admin_can_create_student_with_guardian_and_enrollment(): void
    {
        $adminSma = User::where('email', 'admin.sma@alhikmah.sch.id')->firstOrFail();
        $sma = School::where('slug', 'sma-plus-al-hikmah-1')->firstOrFail();
        $classroom = Classroom::where('school_id', $sma->id)->firstOrFail();

        $response = $this->actingAs($adminSma)->post('/students', [
            'nisn' => '0098765432',
            'nis' => '262710099',
            'full_name' => 'Muhammad Zidan',
            'gender' => 'L',
            'status' => 'active',
            'classroom_id' => $classroom->id,
            'guardian_name' => 'H. Zarkasih',
            'guardian_relationship' => 'ayah',
            'guardian_phone' => '081299887766',
        ]);

        $response->assertRedirect('/students');
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('students', [
            'school_id' => $sma->id,
            'nisn' => '0098765432',
            'full_name' => 'Muhammad Zidan',
        ]);

        $this->assertDatabaseHas('guardians', [
            'school_id' => $sma->id,
            'name' => 'H. Zarkasih',
        ]);
    }

    public function test_admin_can_create_and_update_teacher(): void
    {
        $adminYayasan = User::where('email', 'admin.yayasan@alhikmah.sch.id')->firstOrFail();
        $sma = School::where('slug', 'sma-plus-al-hikmah-1')->firstOrFail();

        $response = $this->actingAs($adminYayasan)->post('/teachers', [
            'school_id' => $sma->id,
            'nip' => '198701012015011002',
            'nuptk' => '1234567890123456',
            'full_name' => 'Hendro Prabowo',
            'gender' => 'L',
            'title_suffix' => 'M.Kom',
            'email' => 'hendro@alhikmah.sch.id',
            'is_active' => true,
        ]);

        $response->assertRedirect('/teachers');
        $this->assertDatabaseHas('teachers', [
            'school_id' => $sma->id,
            'full_name' => 'Hendro Prabowo',
        ]);
    }

    public function test_admin_can_assign_homeroom_teacher_to_classroom(): void
    {
        $adminSma = User::where('email', 'admin.sma@alhikmah.sch.id')->firstOrFail();
        $sma = School::where('slug', 'sma-plus-al-hikmah-1')->firstOrFail();
        $classroom = Classroom::where('school_id', $sma->id)->whereNull('homeroom_teacher_id')->firstOrFail();
        $teacher = Teacher::where('school_id', $sma->id)->firstOrFail();

        $response = $this->actingAs($adminSma)->put("/classrooms/{$classroom->id}", [
            'name' => $classroom->name,
            'grade_level' => $classroom->grade_level,
            'homeroom_teacher_id' => $teacher->id,
        ]);

        $response->assertRedirect('/classrooms');
        $this->assertDatabaseHas('classrooms', [
            'id' => $classroom->id,
            'homeroom_teacher_id' => $teacher->id,
        ]);
    }

    public function test_admin_can_manage_subject_and_kkm(): void
    {
        $adminSma = User::where('email', 'admin.sma@alhikmah.sch.id')->firstOrFail();
        $sma = School::where('slug', 'sma-plus-al-hikmah-1')->firstOrFail();

        $response = $this->actingAs($adminSma)->post('/subjects', [
            'code' => 'FIS-10',
            'name' => 'Fisika Dasar',
            'grade_level' => '10',
            'kkm' => 78.5,
        ]);

        $response->assertRedirect('/subjects');
        $this->assertDatabaseHas('subjects', [
            'school_id' => $sma->id,
            'code' => 'FIS-10',
            'kkm' => 78.5,
        ]);
    }
}
