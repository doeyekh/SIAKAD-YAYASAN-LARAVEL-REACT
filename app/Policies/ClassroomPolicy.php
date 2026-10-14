<?php

namespace App\Policies;

use App\Models\Classroom;
use App\Models\User;
use App\Services\SchoolContext;

class ClassroomPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->canManageMasterData();
    }

    public function view(User $user, Classroom $classroom): bool
    {
        return $this->canManageMasterData() && $this->ownsRecord($classroom);
    }

    public function create(User $user): bool
    {
        return $this->canManageMasterData();
    }

    public function update(User $user, Classroom $classroom): bool
    {
        return $this->canManageMasterData() && $this->ownsRecord($classroom);
    }

    public function delete(User $user, Classroom $classroom): bool
    {
        return $this->canManageMasterData() && $this->ownsRecord($classroom);
    }

    public function restore(User $user, Classroom $classroom): bool
    {
        return $this->update($user, $classroom);
    }

    public function forceDelete(User $user, Classroom $classroom): bool
    {
        return $this->delete($user, $classroom);
    }

    protected function context(): SchoolContext
    {
        return app(SchoolContext::class);
    }

    protected function canManageMasterData(): bool
    {
        return $this->context()->hasRole(['super_admin', 'foundation_admin', 'principal', 'school_admin']);
    }

    protected function ownsRecord(Classroom $classroom): bool
    {
        $context = $this->context();

        if ($context->isFoundationLevel()) {
            return true;
        }

        $schoolId = $context->getSchoolId();

        return $schoolId !== null && (int) $classroom->school_id === (int) $schoolId;
    }
}
