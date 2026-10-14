<?php

namespace App\Policies;

use App\Models\School;
use App\Models\User;
use App\Services\SchoolContext;

class SchoolPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->canManageSchools();
    }

    public function view(User $user, School $school): bool
    {
        return $this->canManageSchools();
    }

    public function create(User $user): bool
    {
        return $this->canManageSchools();
    }

    public function update(User $user, School $school): bool
    {
        return $this->canManageSchools();
    }

    public function delete(User $user, School $school): bool
    {
        return $this->canManageSchools();
    }

    public function restore(User $user, School $school): bool
    {
        return $this->update($user, $school);
    }

    public function forceDelete(User $user, School $school): bool
    {
        return $this->delete($user, $school);
    }

    protected function context(): SchoolContext
    {
        return app(SchoolContext::class);
    }

    protected function canManageSchools(): bool
    {
        return $this->context()->hasRole(['super_admin', 'foundation_admin']);
    }
}
