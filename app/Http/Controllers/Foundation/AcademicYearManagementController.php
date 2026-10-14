<?php

namespace App\Http\Controllers\Foundation;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAcademicYearRequest;
use App\Models\AcademicYear;
use App\Models\School;
use App\Models\Semester;
use App\Services\SchoolContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AcademicYearManagementController extends Controller
{
    /**
     * Display a listing of academic years.
     */
    public function index(Request $request): Response
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);

        if (! $context->hasRole(['super_admin', 'foundation_admin', 'principal', 'school_admin'])) {
            abort(403);
        }

        $selectedSchoolId = $request->input('school_id') ?? $context->getSchoolId();

        $schools = School::where('is_active', true)->select('id', 'name', 'educational_level')->get();

        if (! $selectedSchoolId && $schools->isNotEmpty()) {
            $selectedSchoolId = $schools->first()->id;
        }

        $academicYears = AcademicYear::withoutGlobalScopes()
            ->with(['semesters', 'school'])
            ->when($selectedSchoolId, function ($q, $selectedSchoolId): void {
                $q->where('school_id', $selectedSchoolId);
            })
            ->latest('start_date')
            ->get()
            ->map(fn ($ay) => [
                'id' => $ay->id,
                'name' => $ay->name,
                'school_id' => $ay->school_id,
                'school_name' => $ay->school?->name ?? 'Semua',
                'start_date' => $ay->start_date->format('Y-m-d'),
                'end_date' => $ay->end_date->format('Y-m-d'),
                'is_active' => $ay->is_active,
                'semesters' => $ay->semesters->map(fn ($s) => [
                    'id' => $s->id,
                    'semester' => $s->semester,
                    'is_active' => $s->is_active,
                ]),
            ]);

        return Inertia::render('Foundation/AcademicYears/Index', [
            'academicYears' => $academicYears,
            'schools' => $schools,
            'selectedSchoolId' => (int) $selectedSchoolId,
        ]);
    }

    /**
     * Store a newly created academic year.
     */
    public function store(StoreAcademicYearRequest $request): RedirectResponse
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);
        if (! $context->hasRole(['super_admin', 'foundation_admin', 'principal', 'school_admin'])) {
            abort(403);
        }

        $validated = $request->validated();

        $schoolId = $validated['school_id'] ?? app(SchoolContext::class)->getSchoolId();
        if (! $schoolId) {
            $schoolId = School::first()?->id;
        }

        if (! empty($validated['is_active'])) {
            AcademicYear::withoutGlobalScopes()
                ->where('school_id', $schoolId)
                ->update(['is_active' => false]);
        }

        $academicYear = AcademicYear::withoutGlobalScopes()->create([
            'school_id' => $schoolId,
            'name' => $validated['name'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'is_active' => $validated['is_active'] ?? false,
        ]);

        $activeSemester = $validated['active_semester'] ?? 'ganjil';

        Semester::withoutGlobalScopes()->create([
            'school_id' => $schoolId,
            'academic_year_id' => $academicYear->id,
            'semester' => 'ganjil',
            'is_active' => ($activeSemester === 'ganjil'),
        ]);

        Semester::withoutGlobalScopes()->create([
            'school_id' => $schoolId,
            'academic_year_id' => $academicYear->id,
            'semester' => 'genap',
            'is_active' => ($activeSemester === 'genap'),
        ]);

        return back()->with('success', 'Tahun ajaran & semester berhasil dibuat.');
    }

    /**
     * Activate the specified academic year.
     */
    public function activate(AcademicYear $academicYear): RedirectResponse
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);
        if (! $context->hasRole(['super_admin', 'foundation_admin', 'principal', 'school_admin'])) {
            abort(403);
        }

        AcademicYear::withoutGlobalScopes()
            ->where('school_id', $academicYear->school_id)
            ->update(['is_active' => false]);

        $academicYear->update(['is_active' => true]);

        return back()->with('success', "Tahun ajaran {$academicYear->name} diaktifkan.");
    }

    /**
     * Toggle the active semester for an academic year.
     */
    public function toggleSemester(AcademicYear $academicYear, string $semester): RedirectResponse
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);
        if (! $context->hasRole(['super_admin', 'foundation_admin', 'principal', 'school_admin'])) {
            abort(403);
        }

        Semester::withoutGlobalScopes()
            ->where('academic_year_id', $academicYear->id)
            ->update(['is_active' => false]);

        Semester::withoutGlobalScopes()
            ->where('academic_year_id', $academicYear->id)
            ->where('semester', $semester)
            ->update(['is_active' => true]);

        return back()->with('success', "Semester {$semester} diaktifkan.");
    }
}
