<?php

namespace App\Http\Requests;

use App\Services\SchoolContext;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreStudentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);

        return $context->hasRole(['super_admin', 'foundation_admin', 'principal', 'school_admin']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $schoolId = app(SchoolContext::class)->getSchoolId();

        return [
            'nisn' => [
                'required',
                'string',
                'max:20',
                Rule::unique('students', 'nisn')->where(fn ($query) => $query->where('school_id', $schoolId)),
            ],
            'nis' => ['nullable', 'string', 'max:20'],
            'full_name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'in:L,P'],
            'birth_place' => ['nullable', 'string', 'max:100'],
            'birth_date' => ['nullable', 'date'],
            'religion' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string'],
            'status' => ['required', 'in:active,transferred_in,transferred_out,graduated'],
            'classroom_id' => ['nullable', 'exists:classrooms,id'],
            'guardian_name' => ['nullable', 'string', 'max:255'],
            'guardian_relationship' => ['nullable', 'in:ayah,ibu,wali'],
            'guardian_phone' => ['nullable', 'string', 'max:25'],
            'guardian_occupation' => ['nullable', 'string', 'max:100'],
        ];
    }
}
