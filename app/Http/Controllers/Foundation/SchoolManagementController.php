<?php

namespace App\Http\Controllers\Foundation;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSchoolRequest;
use App\Http\Requests\UpdateSchoolRequest;
use App\Models\Foundation;
use App\Models\School;
use App\Models\SchoolUser;
use App\Models\User;
use App\Services\SchoolContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SchoolManagementController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(School::class, 'school');
    }

    /**
     * Display a listing of schools in the foundation.
     */
    public function index(Request $request): Response
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);

        if (! $context->hasRole(['super_admin', 'foundation_admin'])) {
            abort(403, 'Akses khusus Administrator Yayasan.');
        }

        $search = $request->input('search');

        $user = Auth::user();
        $foundationAdmin = SchoolUser::where('user_id', $user->id)
            ->where('role', 'foundation_admin')
            ->first();

        $foundationId = $foundationAdmin?->foundation_id;

        $schools = School::with(['foundation'])
            ->withCount(['students', 'teachers', 'classrooms'])
            ->when($foundationId, function ($q, $foundationId): void {
                $q->where('foundation_id', $foundationId);
            })
            ->when($search, function ($q, $search): void {
                $q->where(function ($sub) use ($search): void {
                    $sub->where('name', 'like', "%{$search}%")
                        ->orWhere('npsn', 'like', "%{$search}%")
                        ->orWhere('educational_level', 'like', "%{$search}%");
                });
            })
            ->latest('id')
            ->get()
            ->map(fn ($school) => [
                'id' => $school->id,
                'name' => $school->name,
                'npsn' => $school->npsn,
                'slug' => $school->slug,
                'educational_level' => $school->educational_level,
                'email' => $school->email ?? '-',
                'phone' => $school->phone ?? '-',
                'address' => $school->address ?? '-',
                'is_active' => $school->is_active,
                'students_count' => $school->students_count,
                'teachers_count' => $school->teachers_count,
                'classrooms_count' => $school->classrooms_count,
            ]);

        return Inertia::render('Foundation/Schools/Index', [
            'schools' => $schools,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    /**
     * Show the form for creating a new school.
     */
    public function create(): Response
    {
        return Inertia::render('Foundation/Schools/Form', [
            'school' => null,
        ]);
    }

    /**
     * Store a newly created school and optional initial school admin.
     */
    public function store(StoreSchoolRequest $request): RedirectResponse
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);
        if (! $context->hasRole(['super_admin', 'foundation_admin', 'principal', 'school_admin'])) {
            abort(403);
        }

        $validated = $request->validated();

        $user = Auth::user();
        $foundationAdmin = SchoolUser::where('user_id', $user->id)
            ->where('role', 'foundation_admin')
            ->first();

        $foundationId = $foundationAdmin?->foundation_id ?? Foundation::first()?->id;

        $slug = Str::slug($validated['name']);
        if (School::where('slug', $slug)->exists()) {
            $slug .= '-'.Str::lower(Str::random(4));
        }

        $school = School::create([
            'foundation_id' => $foundationId,
            'npsn' => $validated['npsn'],
            'name' => $validated['name'],
            'slug' => $slug,
            'educational_level' => $validated['educational_level'],
            'email' => $validated['email'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Create initial school admin if specified (PRD MVP Acceptance Criteria 1)
        if (! empty($validated['admin_name']) && ! empty($validated['admin_email'])) {
            $password = ! empty($validated['admin_password']) ? $validated['admin_password'] : 'password';

            $adminUser = User::create([
                'name' => $validated['admin_name'],
                'email' => $validated['admin_email'],
                'password' => Hash::make($password),
                'is_active' => true,
            ]);

            SchoolUser::create([
                'user_id' => $adminUser->id,
                'school_id' => $school->id,
                'foundation_id' => $foundationId,
                'role' => 'school_admin',
                'is_active' => true,
            ]);
        }

        return redirect()->route('foundation.schools.index')->with('success', 'Satuan sekolah baru berhasil didaftarkan.');
    }

    /**
     * Show the form for editing the specified school.
     */
    public function edit(School $school): Response
    {
        return Inertia::render('Foundation/Schools/Form', [
            'school' => [
                'id' => $school->id,
                'name' => $school->name,
                'npsn' => $school->npsn,
                'educational_level' => $school->educational_level,
                'email' => $school->email,
                'phone' => $school->phone,
                'address' => $school->address,
                'is_active' => $school->is_active,
            ],
        ]);
    }

    /**
     * Update the specified school.
     */
    public function update(UpdateSchoolRequest $request, School $school): RedirectResponse
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);
        if (! $context->hasRole(['super_admin', 'foundation_admin', 'principal', 'school_admin'])) {
            abort(403);
        }

        $school->update($request->validated());

        return redirect()->route('foundation.schools.index')->with('success', 'Informasi satuan sekolah berhasil diperbarui.');
    }

    /**
     * Remove the specified school.
     */
    public function destroy(School $school): RedirectResponse
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);
        if (! $context->hasRole(['super_admin', 'foundation_admin'])) {
            abort(403);
        }

        $school->delete();

        return redirect()->route('foundation.schools.index')->with('success', 'Satuan sekolah berhasil dihapus.');
    }
}
