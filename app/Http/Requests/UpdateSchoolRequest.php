<?php

namespace App\Http\Requests;

use App\Services\SchoolContext;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSchoolRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        /** @var SchoolContext $context */
        $context = app(SchoolContext::class);

        return $context->hasRole(['super_admin', 'foundation_admin']);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $schoolId = $this->route('school')?->id ?? $this->input('id');

        return [
            'name' => ['required', 'string', 'max:255'],
            'npsn' => ['required', 'string', 'max:20', Rule::unique('schools', 'npsn')->ignore($schoolId)],
            'educational_level' => ['required', 'in:TK,SD,SMP,SMA,SMK'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:25'],
            'address' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ];
    }
}
