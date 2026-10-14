<?php

namespace App\Http\Controllers;

use App\Models\AcademicYear;
use App\Models\AuditLog;
use App\Models\Classroom;
use App\Models\School;
use App\Models\Student;
use App\Models\Teacher;
use App\Services\SchoolContext;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the main dashboard based on current role and school context.
     */
    public function index(Request $request): Response
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);

        $activeSchool = $context->getSchool();
        $activeRole = $context->getRole();
        $isFoundationView = $context->isFoundationLevel() && $activeSchool === null;

        $stats = [];
        $recentLogs = [];
        $schoolsSummary = [];

        if ($isFoundationView) {
            // Single query with withCount — reuse for both summary and stats
            $schoolsCollection = School::withCount(['students', 'teachers', 'classrooms'])
                ->where('is_active', true)
                ->get();

            $schoolsSummary = $schoolsCollection
                ->map(fn ($school) => [
                    'id' => $school->id,
                    'name' => $school->name,
                    'educational_level' => $school->educational_level,
                    'students_count' => $school->students_count,
                    'teachers_count' => $school->teachers_count,
                    'classrooms_count' => $school->classrooms_count,
                ]);

            // Derive stats from the already-loaded collection (zero extra queries)
            $stats = [
                'total_schools' => $schoolsCollection->count(),
                'total_students' => $schoolsCollection->sum('students_count'),
                'total_teachers' => $schoolsCollection->sum('teachers_count'),
                'total_classrooms' => $schoolsCollection->sum('classrooms_count'),
            ];
        } else {
            // School Specific View (Automatically filtered by SchoolScope)
            $stats = [
                'total_students' => Student::where('status', 'active')->count(),
                'total_teachers' => Teacher::where('is_active', true)->count(),
                'total_classrooms' => Classroom::count(),
                'active_academic_year' => AcademicYear::where('is_active', true)->first()?->name ?? '2026/2027',
            ];

            $recentLogs = AuditLog::where('school_id', $context->getSchoolId())
                ->with('user')
                ->latest('created_at')
                ->take(6)
                ->get()
                ->map(fn ($log) => [
                    'id' => $log->id,
                    'action' => $log->action,
                    'type' => class_basename($log->auditable_type),
                    'user_name' => $log->user?->name ?? 'Sistem',
                    'created_at' => $log->created_at->diffForHumans(),
                ]);
        }

        return Inertia::render('Home', [
            'stats' => $stats,
            'isFoundationView' => $isFoundationView,
            'schoolsSummary' => $schoolsSummary,
            'recentLogs' => $recentLogs,
        ]);
    }
}
