<?php

namespace Tests\Feature;

use App\Models\Classroom;
use App\Models\School;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use App\Services\SchoolContext;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MultiTenancyIsolationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_school_a_cannot_see_school_b_students(): void
    {
        $sma = School::where('slug', 'sma-plus-al-hikmah-1')->firstOrFail();
        $smp = School::where('slug', 'smp-al-hikmah')->firstOrFail();

        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);

        // Set context to School A (SMA)
        $context->setSchool($sma);
        $context->setRole('principal');

        $smaStudents = Student::all();
        $this->assertNotEmpty($smaStudents);
        foreach ($smaStudents as $student) {
            $this->assertEquals($sma->id, $student->school_id);
            $this->assertNotEquals($smp->id, $student->school_id);
        }

        // Set context to School B (SMP)
        $context->setSchool($smp);
        $context->setRole('principal');

        $smpStudents = Student::all();
        $this->assertNotEmpty($smpStudents);
        foreach ($smpStudents as $student) {
            $this->assertEquals($smp->id, $student->school_id);
            $this->assertNotEquals($sma->id, $student->school_id);
        }
    }

    public function test_school_a_cannot_see_school_b_classrooms_and_teachers(): void
    {
        $sma = School::where('slug', 'sma-plus-al-hikmah-1')->firstOrFail();
        $smp = School::where('slug', 'smp-al-hikmah')->firstOrFail();

        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);
        $context->setSchool($sma);
        $context->setRole('school_admin');

        $classrooms = Classroom::all();
        $this->assertNotEmpty($classrooms);
        foreach ($classrooms as $classroom) {
            $this->assertEquals($sma->id, $classroom->school_id);
        }

        $teachers = Teacher::all();
        $this->assertNotEmpty($teachers);
        foreach ($teachers as $teacher) {
            $this->assertEquals($sma->id, $teacher->school_id);
        }
    }

    public function test_new_records_automatically_get_active_school_id(): void
    {
        $sma = School::where('slug', 'sma-plus-al-hikmah-1')->firstOrFail();

        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);
        $context->setSchool($sma);
        $context->setRole('school_admin');

        $student = Student::create([
            'nisn' => '0099887766',
            'full_name' => 'Siswa Baru SMA',
            'gender' => 'L',
            'status' => 'active',
        ]);

        $this->assertEquals($sma->id, $student->school_id);
    }

    public function test_unauthorized_user_cannot_switch_to_another_school(): void
    {
        $smaUser = User::where('email', 'admin.sma@alhikmah.sch.id')->firstOrFail();
        $smp = School::where('slug', 'smp-al-hikmah')->firstOrFail();

        $response = $this->actingAs($smaUser)->post('/switch-context', [
            'school_id' => $smp->id,
            'role' => 'school_admin',
        ]);

        $response->assertSessionHas('error');
    }
}
