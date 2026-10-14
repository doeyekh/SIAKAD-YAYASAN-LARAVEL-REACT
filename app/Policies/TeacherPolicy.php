<?php

namespace App\Policies;

use App\Models\Teacher;
use App\Models\User;

class TeacherPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Teacher $teacher): bool
    {
        return $this->canManageMasterData($user) && $this->ownsRecord($user, $teacher);
    }

    public function create(User $user): bool
    {
        return $this->canManageMasterData($user);
    }

    public function update(User $user, Teacher $teacher): bool
    {
        return $this->canManageMasterData($user) && $this->ownsRecord($user, $teacher);
    }

    public function delete(User $user, Teacher $teacher): bool
    {
        return $this->canManageMasterData($user) && $this->ownsRecord($user, $teacher);
    }

    public function restore(User $user, Teacher $teacher): bool
    {
        return $this->update($user, $teacher);
    }

    public function forceDelete(User $user, Teacher $teacher): bool
    {
        return $this->delete($user, $teacher);
    }

    protected function canManageMasterData(User $user): bool
    {
        return $user->schoolUsers()
            ->where('is_active', true)
            ->whereIn('role', ['super_admin', 'foundation_admin'])
            ->exists();
    }

    protected function ownsRecord(User $user, Teacher $teacher): bool
    {
        return true;
    }
}
