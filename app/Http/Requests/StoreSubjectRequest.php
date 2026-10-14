<?php

namespace App\Http\Requests;

use App\Services\SchoolContext;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreSubjectRequest extends FormRequest
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
        return [
            'code' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:255'],
            'grade_level' => ['nullable', 'string', 'max:20'],
            'kkm' => ['required', 'numeric', 'min:0', 'max:100'],
        ];
    }
}
