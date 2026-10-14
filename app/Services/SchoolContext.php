<?php

namespace App\Services;

use App\Models\School;

class SchoolContext
{
    protected ?School $school = null;

    protected ?string $role = null;

    protected bool $scopeDisabled = false;

    /**
     * Set the current active school.
     */
    public function setSchool(?School $school): void
    {
        $this->school = $school;
    }

    /**
     * Get the current active school.
     */
    public function getSchool(): ?School
    {
        return $this->school;
    }

    /**
     * Get the ID of the current active school.
     */
    public function getSchoolId(): ?int
    {
        return $this->school?->id;
    }

    /**
     * Set the current active role.
     */
    public function setRole(?string $role): void
    {
        $this->role = $role;
    }

    /**
     * Get the current active role.
     */
    public function getRole(): ?string
    {
        return $this->role;
    }

    /**
     * Check if current role matches any of the given roles.
     *
     * @param  string|array<int, string>  $roles
     */
    public function hasRole(string|array $roles): bool
    {
        if (is_string($roles)) {
            $roles = [$roles];
        }

        return in_array($this->role, $roles, true);
    }

    /**
     * Determine if current role is system/foundation level.
     */
    public function isFoundationLevel(): bool
    {
        return in_array($this->role, ['super_admin', 'foundation_admin'], true);
    }

    /**
     * Execute a callback without the tenant school scope.
     */
    public function withoutScope(callable $callback): mixed
    {
        $previous = $this->scopeDisabled;
        $this->scopeDisabled = true;

        try {
            return $callback();
        } finally {
            $this->scopeDisabled = $previous;
        }
    }

    /**
     * Check if the tenant scope is currently disabled.
     */
    public function isScopeDisabled(): bool
    {
        return $this->scopeDisabled;
    }
}
