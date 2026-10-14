<?php

namespace App\Http\Controllers\Foundation;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\Foundation;
use App\Models\School;
use App\Models\SchoolUser;
use App\Models\User;
use App\Services\SchoolContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RoleManagementController extends Controller
{
    protected array $roles = [
        'super_admin' => 'Super Admin',
        'foundation_admin' => 'Admin Yayasan',
        'principal' => 'Kepala Sekolah',
        'school_admin' => 'Admin Sekolah / TU',
        'teacher' => 'Guru',
        'homeroom_teacher' => 'Wali Kelas',
        'treasurer' => 'Bendahara',
        'student' => 'Siswa',
        'guardian' => 'Orang Tua / Wali',
    ];

    public function index(Request $request): Response
    {
        $context = app(SchoolContext::class);
        if (! $context->hasRole(['super_admin', 'foundation_admin'])) {
            abort(403);
        }

        $foundationId = $this->foundationIdForCurrentUser();

        $assignments = SchoolUser::with(['user', 'school', 'foundation', 'academicYear'])
            ->when($foundationId, fn ($q, $foundationId) => $q->where('foundation_id', $foundationId))
            ->latest('id')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Foundation/RoleAssignments/Index', [
            'assignments' => $assignments,
            'filters' => ['search' => $request->input('search')],
        ]);
    }

    public function create(): Response
    {
        $context = app(SchoolContext::class);
        if (! $context->hasRole(['super_admin', 'foundation_admin'])) {
            abort(403);
        }

        $foundationId = $this->foundationIdForCurrentUser();

        return Inertia::render('Foundation/RoleAssignments/Form', [
            'assignment' => null,
            'users' => User::orderBy('name')->get(['id', 'name', 'email']),
            'schools' => School::when($foundationId, fn ($q, $foundationId) => $q->where('foundation_id', $foundationId))
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'foundation_id', 'educational_level']),
            'foundations' => $context->hasRole('super_admin')
                ? Foundation::orderBy('name')->get(['id', 'name'])
                : [],
            'roles' => $this->roles,
            'academicYears' => AcademicYear::when($foundationId, fn ($q, $foundationId) => $q->whereIn('school_id', School::where('foundation_id', $foundationId)->pluck('id')))
                ->with('school')
                ->orderBy('start_date', 'desc')
                ->get(['id', 'name', 'school_id', 'is_active']),
            'isSuperAdmin' => $context->hasRole('super_admin'),
            'foundationId' => $foundationId,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $context = app(SchoolContext::class);
        if (! $context->hasRole(['super_admin', 'foundation_admin'])) {
            abort(403);
        }

        $foundationId = $this->foundationIdForCurrentUser();

        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'school_id' => ['nullable', 'integer', 'exists:schools,id'],
            'foundation_id' => ['nullable', 'integer', 'exists:foundations,id'],
            'role' => ['required', 'string', 'in:' . implode(',', array_keys($this->roles))],
            'academic_year_id' => ['nullable', 'integer', 'exists:academic_years,id'],
            'is_active' => ['boolean'],
        ]);

        if ($foundationId) {
            $validated['foundation_id'] = $foundationId;
        }

        SchoolUser::create([
            'user_id' => $validated['user_id'],
            'school_id' => $validated['school_id'] ?? null,
            'foundation_id' => $validated['foundation_id'] ?? null,
            'role' => $validated['role'],
            'academic_year_id' => $validated['academic_year_id'] ?? null,
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ]);

        return redirect()->route('foundation.role-assignments.index')->with('success', 'Penugasan role berhasil ditambahkan.');
    }

    public function edit(SchoolUser $assignment): RedirectResponse|Response
    {
        $context = app(SchoolContext::class);
        if (! $context->hasRole(['super_admin', 'foundation_admin'])) {
            abort(403);
        }

        $foundationId = $this->foundationIdForCurrentUser();
        if ($foundationId && (int) $assignment->foundation_id !== (int) $foundationId) {
            abort(403);
        }

        $academicYears = $assignment->school_id
            ? AcademicYear::where('school_id', $assignment->school_id)->orderBy('start_date', 'desc')->get(['id', 'name', 'is_active'])
            : collect();

        return Inertia::render('Foundation/RoleAssignments/Form', [
            'assignment' => [
                'id' => $assignment->id,
                'user_id' => $assignment->user_id,
                'school_id' => $assignment->school_id,
                'foundation_id' => $assignment->foundation_id,
                'role' => $assignment->role,
                'academic_year_id' => $assignment->academic_year_id,
                'is_active' => $assignment->is_active,
            ],
            'users' => User::orderBy('name')->get(['id', 'name', 'email']),
            'schools' => School::when($foundationId, fn ($q, $foundationId) => $q->where('foundation_id', $foundationId))
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'foundation_id', 'educational_level']),
            'foundations' => $context->hasRole('super_admin')
                ? Foundation::orderBy('name')->get(['id', 'name'])
                : [],
            'roles' => $this->roles,
            'academicYears' => $academicYears,
            'isSuperAdmin' => $context->hasRole('super_admin'),
            'foundationId' => $foundationId,
        ]);
    }

    public function update(SchoolUser $assignment, Request $request): RedirectResponse
    {
        $context = app(SchoolContext::class);
        if (! $context->hasRole(['super_admin', 'foundation_admin'])) {
            abort(403);
        }

        $foundationId = $this->foundationIdForCurrentUser();
        if ($foundationId && (int) $assignment->foundation_id !== (int) $foundationId) {
            abort(403);
        }

        $validated = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'school_id' => ['nullable', 'integer', 'exists:schools,id'],
            'foundation_id' => ['nullable', 'integer', 'exists:foundations,id'],
            'role' => ['required', 'string', 'in:' . implode(',', array_keys($this->roles))],
            'academic_year_id' => ['nullable', 'integer', 'exists:academic_years,id'],
            'is_active' => ['boolean'],
        ]);

        if ($foundationId) {
            $validated['foundation_id'] = $foundationId;
        }

        $assignment->update([
            'user_id' => $validated['user_id'],
            'school_id' => $validated['school_id'] ?? null,
            'foundation_id' => $validated['foundation_id'] ?? null,
            'role' => $validated['role'],
            'academic_year_id' => $validated['academic_year_id'] ?? null,
            'is_active' => (bool) ($validated['is_active'] ?? true),
        ]);

        return redirect()->route('foundation.role-assignments.index')->with('success', 'Penugasan role berhasil diperbarui.');
    }

    public function destroy(SchoolUser $assignment): RedirectResponse
    {
        $context = app(SchoolContext::class);
        if (! $context->hasRole(['super_admin', 'foundation_admin'])) {
            abort(403);
        }

        $foundationId = $this->foundationIdForCurrentUser();
        if ($foundationId && (int) $assignment->foundation_id !== (int) $foundationId) {
            abort(403);
        }

        $assignment->delete();

        return redirect()->route('foundation.role-assignments.index')->with('success', 'Penugasan role berhasil dihapus.');
    }

    protected function foundationIdForCurrentUser(): ?int
    {
        $user = Auth::user();
        if (! $user) {
            return null;
        }

        $assignment = SchoolUser::where('user_id', $user->id)
            ->where('role', 'foundation_admin')
            ->where('is_active', true)
            ->first();

        return $assignment?->foundation_id;
    }
}
