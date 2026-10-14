<?php

namespace App\Imports;

use App\Models\Teacher;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class TeachersImport implements ToModel, WithHeadingRow, WithValidation
{
    public function __construct(private ?int $schoolId = null) {}

    public function model(array $row): ?Teacher
    {
        $fullName = trim((string) ($row['full_name'] ?? $row['nama_lengkap'] ?? ''));

        if ($fullName === '') {
            return null;
        }

        return new Teacher([
            'school_id' => $this->schoolId,
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
            'email' => $row['email'] ?? null,
            'is_active' => (bool) ($row['is_active'] ?? $row['aktif'] ?? true),
        ]);
    }

    /**
     * @return array<string, string>
     */
    public function rules(): array
    {
        return [
            'full_name' => ['nullable', 'string', 'max:255'],
            '*.full_name' => ['nullable', 'string', 'max:255'],
        ];
    }
}
