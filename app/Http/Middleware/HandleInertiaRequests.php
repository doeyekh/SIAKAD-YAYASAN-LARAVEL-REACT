<?php

namespace App\Http\Middleware;

use App\Models\School;
use App\Services\SchoolContext;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * Reuses the user's pre-loaded schoolUsers from SetSchoolContext
     * middleware to avoid redundant queries on every request.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);

        $availableAssignments = [];

        if ($user) {
            $availableAssignments = $this->buildAvailableAssignments($user);
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'avatar' => $user->avatar,
                ] : null,
                'active_school' => $context->getSchool() ? [
                    'id' => $context->getSchool()->id,
                    'name' => $context->getSchool()->name,
                    'npsn' => $context->getSchool()->npsn,
                    'educational_level' => $context->getSchool()->educational_level,
                    'slug' => $context->getSchool()->slug,
                ] : null,
                'active_role' => $context->getRole(),
                'is_foundation_level' => $user ? ($user->isSuperAdmin() || $user->isFoundationAdmin()) : false,
                'available_assignments' => $availableAssignments,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }

    /**
     * Build available assignments list from pre-loaded schoolUsers.
     *
     * Uses the already-loaded schoolUsers relation (from SetSchoolContext
     * middleware) instead of making additional queries per role check.
     *
     * @return array<int, array{school_id: ?int, school_name: string, educational_level: ?string, role: string, role_label: string}>
     */
    private function buildAvailableAssignments(mixed $user): array
    {
        $user->loadMissing('schoolUsers.school');
        $activeAssignments = $user->schoolUsers->where('is_active', true);

        $superAdmin = $activeAssignments->firstWhere('role', 'super_admin');

        if ($superAdmin) {
            return $this->buildSuperAdminAssignments();
        }

        $foundationAdmin = $activeAssignments->firstWhere('role', 'foundation_admin');

        if ($foundationAdmin) {
            return $this->buildFoundationAdminAssignments($foundationAdmin);
        }

        return $this->buildRegularAssignments($activeAssignments);
    }

    /**
     * Build assignments list for super admin.
     *
     * @return array<int, array{school_id: ?int, school_name: string, educational_level: ?string, role: string, role_label: string}>
     */
    private function buildSuperAdminAssignments(): array
    {
        $assignments = [
            [
                'school_id' => null,
                'school_name' => 'Konsol Global (Super Admin)',
                'educational_level' => null,
                'role' => 'super_admin',
                'role_label' => 'Super Admin',
            ],
        ];

        // Single query for all active schools
        foreach (School::where('is_active', true)->get(['id', 'name', 'educational_level']) as $school) {
            $assignments[] = [
                'school_id' => $school->id,
                'school_name' => $school->name,
                'educational_level' => $school->educational_level,
                'role' => 'super_admin',
                'role_label' => 'Super Admin',
            ];
        }

        return $assignments;
    }

    /**
     * Build assignments list for foundation admin.
     *
     * @return array<int, array{school_id: ?int, school_name: string, educational_level: ?string, role: string, role_label: string}>
     */
    private function buildFoundationAdminAssignments(mixed $foundationAdmin): array
    {
        $assignments = [
            [
                'school_id' => null,
                'school_name' => 'Konsol Yayasan',
                'educational_level' => null,
                'role' => 'foundation_admin',
                'role_label' => 'Admin Yayasan',
            ],
        ];

        // Single query scoped by foundation
        $schools = School::where('foundation_id', $foundationAdmin->foundation_id)
            ->where('is_active', true)
            ->get(['id', 'name', 'educational_level']);

        foreach ($schools as $school) {
            $assignments[] = [
                'school_id' => $school->id,
                'school_name' => $school->name,
                'educational_level' => $school->educational_level,
                'role' => 'foundation_admin',
                'role_label' => 'Admin Yayasan',
            ];
        }

        return $assignments;
    }

    /**
     * Build assignments list for regular school roles.
     *
     * Uses already-eager-loaded school relationship to avoid lazy loading.
     *
     * @return array<int, array{school_id: ?int, school_name: string, educational_level: ?string, role: string, role_label: string}>
     */
    private function buildRegularAssignments(mixed $activeAssignments): array
    {
        $roleLabels = [
            'principal' => 'Kepala Sekolah',
            'school_admin' => 'Admin Sekolah / TU',
            'teacher' => 'Guru Pengampu',
            'homeroom_teacher' => 'Wali Kelas',
            'treasurer' => 'Bendahara',
            'student' => 'Siswa',
            'guardian' => 'Orang Tua / Wali',
        ];

        $assignments = [];

        foreach ($activeAssignments as $assignment) {
            $assignments[] = [
                'school_id' => $assignment->school_id,
                'school_name' => $assignment->school?->name ?? 'Sekolah',
                'educational_level' => $assignment->school?->educational_level,
                'role' => $assignment->role,
                'role_label' => $roleLabels[$assignment->role] ?? ucfirst($assignment->role),
            ];
        }

        return $assignments;
    }
}
