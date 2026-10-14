<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClassroomRequest;
use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\Teacher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClassroomController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Classroom::class, 'classroom');
    }

    /**
     * Display a listing of classrooms.
     */
    public function index(Request $request): Response
    {
        $classrooms = Classroom::with(['homeroomTeacher', 'academicYear'])
            ->withCount('enrollments')
            ->orderBy('grade_level')
            ->orderBy('name')
            ->get()
            ->map(fn ($classroom) => [
                'id' => $classroom->id,
                'name' => $classroom->name,
                'grade_level' => $classroom->grade_level,
                'academic_year' => $classroom->academicYear?->name ?? '-',
                'homeroom_teacher_id' => $classroom->homeroom_teacher_id,
                'homeroom_teacher_name' => $classroom->homeroomTeacher?->full_name ?? 'Belum Ditentukan',
                'students_count' => $classroom->enrollments_count,
            ]);

        $teachers = Teacher::where('is_active', true)->select('id', 'full_name')->get();
        $academicYears = AcademicYear::where('is_active', true)->select('id', 'name')->get();

        return Inertia::render('Classrooms/Index', [
            'classrooms' => $classrooms,
            'teachers' => $teachers,
            'academicYears' => $academicYears,
        ]);
    }

    /**
     * Store a newly created classroom.
     */
    public function store(StoreClassroomRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        if (empty($validated['academic_year_id'])) {
            $activeAy = AcademicYear::where('is_active', true)->first();
            $validated['academic_year_id'] = $activeAy?->id;
        }

        Classroom::create($validated);

        return redirect()->route('classrooms.index')->with('success', 'Rombongan belajar berhasil ditambahkan.');
    }

    /**
     * Update the specified classroom.
     */
    public function update(StoreClassroomRequest $request, Classroom $classroom): RedirectResponse
    {
        $classroom->update($request->validated());

        return redirect()->route('classrooms.index')->with('success', 'Rombongan belajar berhasil diperbarui.');
    }

    /**
     * Remove the specified classroom.
     */
    public function destroy(Classroom $classroom): RedirectResponse
    {
        $classroom->delete();

        return redirect()->route('classrooms.index')->with('success', 'Rombongan belajar berhasil dihapus.');
    }
}
