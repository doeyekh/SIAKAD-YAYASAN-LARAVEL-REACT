<?php

namespace App\Imports;

use App\Models\AcademicYear;
use App\Models\School;
use App\Models\SchoolUser;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class TeachersImport implements ToModel, WithHeadingRow
{
    public function __construct(private ?int $schoolId = null) {}

    public function model(array $row): ?Teacher
    {
        $fullName = trim((string) ($row['full_name'] ?? $row['nama_lengkap'] ?? ''));

        if ($fullName === '') {
            return null;
        }

        $school = $this->schoolId ? School::find($this->schoolId) : null;
        $activeAcademicYear = $school
            ? AcademicYear::where('school_id', $school->id)->where('is_active', true)->first()
            : null;

        $loginEmail = trim((string) ($row['email'] ?? ''));

        if ($loginEmail === '') {
            $loginEmail = $this->generateEmail($school, $fullName, $row['nip'] ?? null);
        }

        $user = User::firstOrCreate(
            ['email' => $loginEmail],
            [
                'name' => $fullName,
                'password' => Hash::make('password'),
                'is_active' => (bool) ($row['is_active'] ?? $row['aktif'] ?? true),
            ]
        );

        if ($school) {
            $schoolUser = SchoolUser::firstOrNew(
                [
                    'user_id' => $user->id,
                    'school_id' => $school->id,
                    'role' => 'teacher',
                ]
            );
            $schoolUser->foundation_id = $school->foundation_id;
            $schoolUser->academic_year_id = $activeAcademicYear?->id;
            $schoolUser->is_active = true;
            $schoolUser->save();
        }

        return new Teacher([
            'school_id' => $this->schoolId,
            'user_id' => $user->id,
            'nip' => $row['nip'] ?? null,
            'nuptk' => $row['nuptk'] ?? null,
            'nik' => $row['nik'] ?? null,
            'full_name' => $fullName,
            'gender' => strtoupper((string) ($row['gender'] ?? $row['jenis_kelamin'] ?? 'L')),
            'title_prefix' => $row['title_prefix'] ?? $row['gelar_depan'] ?? null,
            'title_suffix' => $row['title_suffix'] ?? $row['gelar_belakang'] ?? null,
            'jenis_guru' => $row['jenis_guru'] ?? null,
            'npwp' => $row['npwp'] ?? null,
            'phone' => $row['phone'] ?? $row['telepon'] ?? null,
            'email' => $loginEmail,
            'is_active' => (bool) ($row['is_active'] ?? $row['aktif'] ?? true),
        ]);
    }

    private function generateEmail(?School $school, string $fullName, ?string $nip): string
    {
        $slug = Str::slug($fullName, '.');
        if ($slug === '') {
            $slug = 'guru';
        }

        $suffix = $nip ? preg_replace('/\D/', '', (string) $nip) : Str::lower(Str::random(4));
        if ($suffix === '') {
            $suffix = Str::lower(Str::random(4));
        }

        $domain = $school && $school->slug ? $school->slug.'.sch.id' : 'siakad.local';
        $email = "{$slug}.{$suffix}@{$domain}";

        $counter = 1;
        while (User::where('email', $email)->exists()) {
            $email = "{$slug}.{$suffix}.{$counter}@{$domain}";
            $counter++;
        }

        return $email;
    }
}
