<?php

namespace Tests\Feature;

use App\Models\Classroom;
use App\Models\School;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CrossTenantAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_school_a_cannot_open_school_b_master_data_edit_pages(): void
    {
        $smaUser = User::where('email', 'admin.sma@alhikmah.sch.id')->firstOrFail();
        $smp = School::where('slug', 'smp-al-hikmah')->firstOrFail();

        $student = Student::withoutGlobalScopes()->where('school_id', $smp->id)->firstOrFail();
        $teacher = Teacher::withoutGlobalScopes()->where('school_id', $smp->id)->firstOrFail();
        $classroom = Classroom::withoutGlobalScopes()->where('school_id', $smp->id)->firstOrFail();

        $this->actingAs($smaUser);

        foreach ([
            "/students/{$student->id}/edit",
            "/teachers/{$teacher->id}/edit",
            "/classrooms/{$classroom->id}/edit",
        ] as $uri) {
            $response = $this->get($uri);
            $this->assertTrue(
                in_array($response->getStatusCode(), [403, 404], true),
                "Expected 403/404 for {$uri}, got {$response->getStatusCode()}."
            );
        }
    }

    public function test_school_admin_cannot_delete_another_school(): void
    {
        $smaUser = User::where('email', 'admin.sma@alhikmah.sch.id')->firstOrFail();
        $smp = School::where('slug', 'smp-al-hikmah')->firstOrFail();

        $response = $this->actingAs($smaUser)->delete("/foundation/schools/{$smp->id}");

        $this->assertTrue(in_array($response->getStatusCode(), [403, 404], true));
    }
}
