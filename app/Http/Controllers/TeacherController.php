<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTeacherRequest;
use App\Http\Requests\UpdateTeacherRequest;
use App\Imports\TeachersImport;
use App\Models\AcademicYear;
use App\Models\School;
use App\Models\SchoolUser;
use App\Models\Teacher;
use App\Models\User;
use App\Services\SchoolContext;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class TeacherController extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Teacher::class, 'teacher');
    }

    /**
     * Display a listing of teachers.
     */
    public function index(Request $request): Response
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);
        $search = $request->input('search');

        $teachers = Teacher::with(['homeroomClassrooms', 'subjectAssignments.subject'])
            ->when($search, function ($q, $search): void {
                $q->where(function ($sub) use ($search): void {
                    $sub->where('full_name', 'like', "%{$search}%")
                        ->orWhere('nip', 'like', "%{$search}%")
                        ->orWhere('nuptk', 'like', "%{$search}%");
                });
            })
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn ($teacher) => [
                'id' => $teacher->id,
                'school_id' => $teacher->school_id,
                'nip' => $teacher->nip ?? '-',
                'nuptk' => $teacher->nuptk ?? '-',
                'full_name' => $teacher->full_name,
                'gender' => $teacher->gender,
                'phone' => $teacher->phone ?? '-',
                'email' => $teacher->email ?? '-',
                'is_active' => $teacher->is_active,
                'homeroom_class' => $teacher->homeroomClassrooms->first()?->name ?? null,
                'subjects_count' => $teacher->subjectAssignments->count(),
            ]);

        $schools = [];
        if ($context->hasRole(['super_admin', 'foundation_admin'])) {
            $schools = School::where('is_active', true)->orderBy('name')->get(['id', 'name', 'educational_level']);
        }

        return Inertia::render('Teachers/Index', [
            'teachers' => $teachers,
            'filters' => [
                'search' => $search,
            ],
            'schools' => $schools,
            'activeSchoolId' => $context->getSchoolId(),
            'isFoundation' => $context->hasRole(['super_admin', 'foundation_admin']),
        ]);
    }

    /**
     * Show the form for creating a new teacher.
     */
    public function create(): Response
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);

        $schools = [];
        if ($context->hasRole(['super_admin', 'foundation_admin'])) {
            $schools = School::where('is_active', true)->orderBy('name')->get(['id', 'name', 'educational_level']);
        }

        return Inertia::render('Teachers/Form', [
            'teacher' => null,
            'schools' => $schools,
            'activeSchoolId' => $context->getSchoolId(),
            'isFoundation' => $context->hasRole(['super_admin', 'foundation_admin']),
        ]);
    }

    /**
     * Store a newly created teacher.
     */
    public function store(StoreTeacherRequest $request): RedirectResponse
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);
        $validated = $request->validated();

        $schoolId = $context->hasRole(['super_admin', 'foundation_admin'])
            ? ($validated['school_id'] ?? $request->integer('school_id'))
            : $context->getSchoolId();

        if (empty($schoolId)) {
            return back()->withErrors(['school_id' => 'Sekolah wajib dipilih.'])->withInput();
        }

        $validated['school_id'] = (int) $schoolId;

        $school = School::findOrFail((int) $schoolId);
        $activeAcademicYear = AcademicYear::where('school_id', $school->id)->where('is_active', true)->first();
        $loginEmail = ! empty($validated['email']) ? (string) $validated['email'] : $this->generateTeacherEmail($school, (string) $validated['full_name'], $validated['nip'] ?? null);

        $user = User::firstOrCreate(
            ['email' => $loginEmail],
            [
                'name' => $validated['full_name'],
                'password' => Hash::make('password'),
                'is_active' => (bool) ($validated['is_active'] ?? true),
            ]
        );

        SchoolUser::firstOrCreate(
            [
                'user_id' => $user->id,
                'school_id' => $school->id,
                'role' => 'teacher',
            ],
            [
                'foundation_id' => $school->foundation_id,
                'academic_year_id' => $activeAcademicYear?->id,
                'is_active' => true,
            ]
        );

        $validated['user_id'] = $user->id;
        $validated['email'] = $loginEmail;

        $teacher = Teacher::create($validated);
        $user->update(['teacher_id' => $teacher->id]);

        return redirect()->route('teachers.index')->with('success', "Data guru berhasil ditambahkan. Akun login: {$loginEmail} (password default: password)");
    }

    /**
     * Show the form for editing the specified teacher.
     */
    public function edit(Teacher $teacher): Response
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);

        $schools = [];
        if ($context->hasRole(['super_admin', 'foundation_admin'])) {
            $schools = School::where('is_active', true)->orderBy('name')->get(['id', 'name', 'educational_level']);
        }

        return Inertia::render('Teachers/Form', [
            'teacher' => [
                'id' => $teacher->id,
                'school_id' => $teacher->school_id,
                'nip' => $teacher->nip,
                'nuptk' => $teacher->nuptk,
                'full_name' => $teacher->full_name,
                'gender' => $teacher->gender,
                'title_prefix' => $teacher->title_prefix,
                'title_suffix' => $teacher->title_suffix,
                'nik' => $teacher->nik,
                'jenis_guru' => $teacher->jenis_guru,
                'npwp' => $teacher->npwp,
                'foto' => $teacher->foto,
                'phone' => $teacher->phone,
                'email' => $teacher->email,
                'is_active' => $teacher->is_active,
            ],
            'schools' => $schools,
            'activeSchoolId' => $context->getSchoolId(),
            'isFoundation' => $context->hasRole(['super_admin', 'foundation_admin']),
        ]);
    }

    /**
     * Update the specified teacher.
     */
    public function update(UpdateTeacherRequest $request, Teacher $teacher): RedirectResponse
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);
        $validated = $request->validated();

        if ($context->hasRole(['super_admin', 'foundation_admin']) && ! empty($validated['school_id'])) {
            // Yayasan may reassign the teacher to another school.
        } else {
            unset($validated['school_id']);
        }

        $teacher->update($validated);

        return redirect()->route('teachers.index')->with('success', 'Data guru berhasil diperbarui.');
    }

    /**
     * Remove the specified teacher.
     */
    public function destroy(Teacher $teacher): RedirectResponse
    {
        $teacher->delete();

        return redirect()->route('teachers.index')->with('success', 'Data guru berhasil dihapus.');
    }

    /**
     * Import teachers from an Excel file.
     */
    public function import(Request $request): RedirectResponse
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);

        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,csv', 'max:10240'],
            'school_id' => ['nullable', 'integer', 'exists:schools,id'],
        ]);

        $schoolId = $context->hasRole(['super_admin', 'foundation_admin'])
            ? ($validated['school_id'] ?? $context->getSchoolId())
            : $context->getSchoolId();

        if (empty($schoolId)) {
            return back()->withErrors(['school_id' => 'Sekolah wajib dipilih untuk import.'])->withInput();
        }

        Excel::import(new TeachersImport((int) $schoolId), $request->file('file'));

        Teacher::whereNotNull('user_id')->each(function (Teacher $teacher): void {
            if ($teacher->user !== null && $teacher->user->teacher_id !== $teacher->id) {
                $teacher->user->update(['teacher_id' => $teacher->id]);
            }
        });

        return redirect()->route('teachers.index')->with('success', 'Import data guru selesai. Akun login default menggunakan password: password');
    }

    /**
     * Generate a unique login email when the teacher form does not provide one.
     */
    private function generateTeacherEmail(School $school, string $fullName, ?string $nip): string
    {
        $slug = Str::slug($fullName, '.');
        if ($slug === '') {
            $slug = 'guru';
        }

        $suffix = $nip ? preg_replace('/\D/', '', $nip) : Str::lower(Str::random(4));
        if ($suffix === '') {
            $suffix = Str::lower(Str::random(4));
        }

        $domain = $school->slug ? $school->slug.'.sch.id' : 'siakad.local';
        $email = "{$slug}.{$suffix}@{$domain}";

        $counter = 1;
        while (User::where('email', $email)->exists()) {
            $email = "{$slug}.{$suffix}.{$counter}@{$domain}";
            $counter++;
        }

        return $email;
    }
}
