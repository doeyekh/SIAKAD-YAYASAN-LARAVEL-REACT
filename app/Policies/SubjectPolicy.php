<?php

namespace App\Policies;

use App\Models\Subject;
use App\Models\User;
use App\Services\SchoolContext;

class SubjectPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->canManageMasterData();
    }

    public function view(User $user, Subject $subject): bool
    {
        return $this->canManageMasterData() && $this->ownsRecord($subject);
    }

    public function create(User $user): bool
    {
        return $this->canManageMasterData();
    }

    public function update(User $user, Subject $subject): bool
    {
        return $this->canManageMasterData() && $this->ownsRecord($subject);
    }

    public function delete(User $user, Subject $subject): bool
    {
        return $this->canManageMasterData() && $this->ownsRecord($subject);
    }

    public function restore(User $user, Subject $subject): bool
    {
        return $this->update($user, $subject);
    }

    public function forceDelete(User $user, Subject $subject): bool
    {
        return $this->delete($user, $subject);
    }

    protected function context(): SchoolContext
    {
        return app(SchoolContext::class);
    }

    protected function canManageMasterData(): bool
    {
        return $this->context()->hasRole(['super_admin', 'foundation_admin', 'principal', 'school_admin']);
    }

    protected function ownsRecord(Subject $subject): bool
    {
        $context = $this->context();

        if ($context->isFoundationLevel()) {
            return true;
        }

        $schoolId = $context->getSchoolId();

        return $schoolId !== null && (int) $subject->school_id === (int) $schoolId;
    }
}
