<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Models\AcademicYear;
use App\Models\Classroom;
use App\Models\Guardian;
use App\Models\Student;
use App\Models\StudentEnrollment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Student::class, 'student');
    }

    /**
     * Display a listing of students with search and filter.
     */
    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status');
        $classroomId = $request->input('classroom_id');

        $query = Student::with(['classrooms', 'guardians'])
            ->when($search, function ($q, $search): void {
                $q->where(function ($sub): void {
                    $sub->where('full_name', 'like', "%{$search}%")
                        ->orWhere('nisn', 'like', "%{$search}%")
                        ->orWhere('nis', 'like', "%{$search}%");
                });
            })
            ->when($status, function ($q, $status): void {
                $q->where('status', $status);
            })
            ->when($classroomId, function ($q, $classroomId): void {
                $q->whereHas('enrollments', function ($sub) use ($classroomId): void {
                    $sub->where('classroom_id', $classroomId);
                });
            })
            ->latest('id');

        $students = $query->paginate(15)->withQueryString()->through(fn ($student) => [
            'id' => $student->id,
            'nisn' => $student->nisn,
            'nis' => $student->nis,
            'full_name' => $student->full_name,
            'gender' => $student->gender,
            'status' => $student->status,
            'current_class' => $student->classrooms->first()?->name ?? '-',
            'guardian_name' => $student->guardians->first()?->name ?? '-',
            'phone' => $student->guardians->first()?->phone ?? '-',
        ]);

        $classrooms = Classroom::select('id', 'name', 'grade_level')->get();

        return Inertia::render('Students/Index', [
            'students' => $students,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'classroom_id' => $classroomId,
            ],
            'classrooms' => $classrooms,
        ]);
    }

    /**
     * Show the form for creating a new student.
     */
    public function create(): Response
    {
        $classrooms = Classroom::select('id', 'name', 'grade_level')->get();

        return Inertia::render('Students/Form', [
            'student' => null,
            'classrooms' => $classrooms,
        ]);
    }

    /**
     * Store a newly created student.
     */
    public function store(StoreStudentRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $student = Student::create([
            'nisn' => $validated['nisn'],
            'nis' => $validated['nis'] ?? null,
            'full_name' => $validated['full_name'],
            'gender' => $validated['gender'],
            'birth_place' => $validated['birth_place'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
            'religion' => $validated['religion'] ?? null,
            'address' => $validated['address'] ?? null,
            'status' => $validated['status'],
        ]);

        if (! empty($validated['guardian_name'])) {
            Guardian::create([
                'student_id' => $student->id,
                'name' => $validated['guardian_name'],
                'relationship' => $validated['guardian_relationship'] ?? 'ayah',
                'phone' => $validated['guardian_phone'] ?? null,
                'occupation' => $validated['guardian_occupation'] ?? null,
                'address' => $validated['address'] ?? null,
            ]);
        }

        if (! empty($validated['classroom_id'])) {
            $activeAy = AcademicYear::where('is_active', true)->first();
            if ($activeAy) {
                StudentEnrollment::create([
                    'student_id' => $student->id,
                    'classroom_id' => $validated['classroom_id'],
                    'academic_year_id' => $activeAy->id,
                    'status' => 'enrolled',
                ]);
            }
        }

        return redirect()->route('students.index')->with('success', 'Data siswa berhasil ditambahkan.');
    }

    /**
     * Show the form for editing the specified student.
     */
    public function edit(Student $student): Response
    {
        $student->load(['guardians', 'enrollments']);
        $classrooms = Classroom::select('id', 'name', 'grade_level')->get();

        $guardian = $student->guardians->first();
        $currentEnrollment = $student->enrollments()->latest('id')->first();

        return Inertia::render('Students/Form', [
            'student' => [
                'id' => $student->id,
                'nisn' => $student->nisn,
                'nis' => $student->nis,
                'full_name' => $student->full_name,
                'gender' => $student->gender,
                'birth_place' => $student->birth_place,
                'birth_date' => $student->birth_date?->format('Y-m-d'),
                'religion' => $student->religion,
                'address' => $student->address,
                'status' => $student->status,
                'classroom_id' => $currentEnrollment?->classroom_id,
                'guardian_name' => $guardian?->name,
                'guardian_relationship' => $guardian?->relationship,
                'guardian_phone' => $guardian?->phone,
                'guardian_occupation' => $guardian?->occupation,
            ],
            'classrooms' => $classrooms,
        ]);
    }

    /**
     * Update the specified student.
     */
    public function update(UpdateStudentRequest $request, Student $student): RedirectResponse
    {
        $validated = $request->validated();

        $student->update([
            'nisn' => $validated['nisn'],
            'nis' => $validated['nis'] ?? null,
            'full_name' => $validated['full_name'],
            'gender' => $validated['gender'],
            'birth_place' => $validated['birth_place'] ?? null,
            'birth_date' => $validated['birth_date'] ?? null,
            'religion' => $validated['religion'] ?? null,
            'address' => $validated['address'] ?? null,
            'status' => $validated['status'],
        ]);

        if (! empty($validated['guardian_name'])) {
            $guardian = $student->guardians()->first();
            if ($guardian) {
                $guardian->update([
                    'name' => $validated['guardian_name'],
                    'relationship' => $validated['guardian_relationship'] ?? 'ayah',
                    'phone' => $validated['guardian_phone'] ?? null,
                    'occupation' => $validated['guardian_occupation'] ?? null,
                    'address' => $validated['address'] ?? null,
                ]);
            } else {
                Guardian::create([
                    'student_id' => $student->id,
                    'name' => $validated['guardian_name'],
                    'relationship' => $validated['guardian_relationship'] ?? 'ayah',
                    'phone' => $validated['guardian_phone'] ?? null,
                    'occupation' => $validated['guardian_occupation'] ?? null,
                    'address' => $validated['address'] ?? null,
                ]);
            }
        }

        if (! empty($validated['classroom_id'])) {
            $activeAy = AcademicYear::where('is_active', true)->first();
            if ($activeAy) {
                $enrollment = StudentEnrollment::where('student_id', $student->id)
                    ->where('academic_year_id', $activeAy->id)
                    ->first();

                if ($enrollment) {
                    $enrollment->update(['classroom_id' => $validated['classroom_id']]);
                } else {
                    StudentEnrollment::create([
                        'student_id' => $student->id,
                        'classroom_id' => $validated['classroom_id'],
                        'academic_year_id' => $activeAy->id,
                        'status' => 'enrolled',
                    ]);
                }
            }
        }

        return redirect()->route('students.index')->with('success', 'Data siswa berhasil diperbarui.');
    }

    /**
     * Remove the specified student.
     */
    public function destroy(Student $student): RedirectResponse
    {
        $student->delete();

        return redirect()->route('students.index')->with('success', 'Data siswa berhasil dihapus.');
    }
}
