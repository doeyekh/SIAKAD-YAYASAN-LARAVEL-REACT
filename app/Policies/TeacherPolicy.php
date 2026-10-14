<?php

namespace App\Policies;

use App\Models\Teacher;
use App\Models\User;
use App\Services\SchoolContext;

class TeacherPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->canManageMasterData();
    }

    public function view(User $user, Teacher $teacher): bool
    {
        return $this->canManageMasterData() && $this->ownsRecord($teacher);
    }

    public function create(User $user): bool
    {
        return $this->canManageMasterData();
    }

    public function update(User $user, Teacher $teacher): bool
    {
        return $this->canManageMasterData() && $this->ownsRecord($teacher);
    }

    public function delete(User $user, Teacher $teacher): bool
    {
        return $this->canManageMasterData() && $this->ownsRecord($teacher);
    }

    public function restore(User $user, Teacher $teacher): bool
    {
        return $this->update($user, $teacher);
    }

    public function forceDelete(User $user, Teacher $teacher): bool
    {
        return $this->delete($user, $teacher);
    }

    protected function context(): SchoolContext
    {
        return app(SchoolContext::class);
    }

    protected function canManageMasterData(): bool
    {
        return $this->context()->hasRole(['super_admin', 'foundation_admin', 'principal', 'school_admin']);
    }

    protected function ownsRecord(Teacher $teacher): bool
    {
        $context = $this->context();

        if ($context->isFoundationLevel()) {
            return true;
        }

        $schoolId = $context->getSchoolId();

        return $schoolId !== null && (int) $teacher->school_id === (int) $schoolId;
    }
}
