<?php

namespace App\Http\Middleware;

use App\Models\School;
use App\Services\SchoolContext;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SetSchoolContext
{
    /**
     * Handle an incoming request.
     *
     * Fetches all active SchoolUser assignments in a single query
     * to avoid N+1 on every request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);

        $user = Auth::user();

        if (! $user) {
            $context->setSchool(null);
            $context->setRole(null);

            return $next($request);
        }

        // Single query: fetch ALL active assignments for this user
        $user->loadMissing('schoolUsers');
        $activeAssignments = $user->schoolUsers->where('is_active', true);

        $sessionSchoolId = session('active_school_id');
        $sessionRole = session('active_role');

        // Normalize stale session values so invalid roles fall back to safe defaults.
        if (! in_array($sessionRole, ['super_admin', 'foundation_admin', 'principal', 'school_admin', 'teacher', 'homeroom_teacher', 'treasurer', 'student', 'guardian'], true)) {
            $sessionRole = null;
        }

        // Check if user has global super admin role
        $superAdminAssignment = $activeAssignments->firstWhere('role', 'super_admin');

        if ($superAdminAssignment) {
            $activeRole = 'super_admin';
            $activeSchool = $sessionSchoolId ? School::find($sessionSchoolId) : null;

            $context->setRole($activeRole);
            $context->setSchool($activeSchool);

            return $next($request);
        }

        // Check if user has foundation admin role
        $foundationAdminAssignment = $activeAssignments->firstWhere('role', 'foundation_admin');

        if ($foundationAdminAssignment) {
            $activeRole = 'foundation_admin';
            $activeSchool = null;

            if ($sessionSchoolId) {
                $activeSchool = School::where('id', $sessionSchoolId)
                    ->where('foundation_id', $foundationAdminAssignment->foundation_id)
                    ->first();
            }

            $context->setRole($activeRole);
            $context->setSchool($activeSchool);

            return $next($request);
        }

        // Regular school roles: verify user belongs to requested school with requested role
        $validAssignment = null;
        if ($sessionSchoolId && $sessionRole) {
            $validAssignment = $activeAssignments
                ->where('school_id', $sessionSchoolId)
                ->where('role', $sessionRole)
                ->first();
        }

        if (! $validAssignment) {
            $validAssignment = $activeAssignments->first();
        }

        if ($validAssignment) {
            session([
                'active_school_id' => $validAssignment->school_id,
                'active_role' => $validAssignment->role,
            ]);

            // Eager load school to avoid lazy loading
            $validAssignment->loadMissing('school');

            $context->setRole($validAssignment->role);
            $context->setSchool($validAssignment->school);
        } else {
            $context->setRole(null);
            $context->setSchool(null);
        }

        return $next($request);
    }
}
