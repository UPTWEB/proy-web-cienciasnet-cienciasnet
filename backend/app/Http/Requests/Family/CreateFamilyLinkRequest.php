<?php

namespace App\Http\Requests\Family;

use App\Models\Alumno;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateFamilyLinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manageFamilyLinks', Alumno::class) === true;
    }

    public function rules(): array
    {
        return [
            'parent_account_id' => ['required', 'uuid', 'exists:users,id'],
            'student_id' => ['required', 'uuid', 'exists:alumnos,id'],
            'relationship' => ['required', Rule::in(['padre', 'madre', 'apoderado'])],
        ];
    }
}
