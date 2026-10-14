<?php

namespace App\Policies;

use App\Models\Student;
use App\Models\User;
use App\Services\SchoolContext;

class StudentPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $this->canManageMasterData();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Student $student): bool
    {
        return $this->canManageMasterData() && $this->ownsRecord($student);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $this->canManageMasterData();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Student $student): bool
    {
        return $this->canManageMasterData() && $this->ownsRecord($student);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Student $student): bool
    {
        return $this->canManageMasterData() && $this->ownsRecord($student);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Student $student): bool
    {
        return $this->update($user, $student);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Student $student): bool
    {
        return $this->delete($user, $student);
    }

    /**
     * Get the current tenant context.
     */
    protected function context(): SchoolContext
    {
        return app(SchoolContext::class);
    }

    /**
     * Determine whether the current role may manage master data.
     */
    protected function canManageMasterData(): bool
    {
        return $this->context()->hasRole(['super_admin', 'foundation_admin', 'principal', 'school_admin']);
    }

    /**
     * Determine whether the record belongs to the active school context.
     */
    protected function ownsRecord(Student $student): bool
    {
        $context = $this->context();

        if ($context->isFoundationLevel()) {
            return true;
        }

        $schoolId = $context->getSchoolId();

        return $schoolId !== null && (int) $student->school_id === (int) $schoolId;
    }
}
