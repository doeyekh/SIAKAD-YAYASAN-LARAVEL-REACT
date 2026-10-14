<?php

namespace Tests\Feature;

use App\Models\AuditLog;
use App\Models\School;
use App\Models\Student;
use App\Models\User;
use App\Services\SchoolContext;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuditLogTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_student_mutations_create_audit_logs(): void
    {
        $sma = School::where('slug', 'sma-plus-al-hikmah-1')->firstOrFail();
        $user = User::where('email', 'admin.sma@alhikmah.sch.id')->firstOrFail();

        $this->actingAs($user);

        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);
        $context->setSchool($sma);
        $context->setRole('school_admin');

        // Create student
        $student = Student::create([
            'school_id' => $sma->id,
            'nisn' => '0099112233',
            'full_name' => 'Siswa Audit Test',
            'gender' => 'L',
            'status' => 'active',
        ]);

        $createdLog = AuditLog::where('auditable_type', Student::class)
            ->where('auditable_id', $student->id)
            ->where('action', 'created')
            ->first();

        $this->assertNotNull($createdLog);
        $this->assertEquals($sma->id, $createdLog->school_id);
        $this->assertEquals($user->id, $createdLog->user_id);

        // Update student
        $student->update([
            'full_name' => 'Siswa Audit Test Diubah',
            'status' => 'transferred_out',
        ]);

        $updatedLog = AuditLog::where('auditable_type', Student::class)
            ->where('auditable_id', $student->id)
            ->where('action', 'updated')
            ->latest('id')
            ->first();

        $this->assertNotNull($updatedLog);
        $this->assertEquals('Siswa Audit Test', $updatedLog->old_values['full_name']);
        $this->assertEquals('Siswa Audit Test Diubah', $updatedLog->new_values['full_name']);
        $this->assertEquals('transferred_out', $updatedLog->new_values['status']);
    }
}
