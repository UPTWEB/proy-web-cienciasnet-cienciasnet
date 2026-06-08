<?php

namespace App\Modules\Asistencia\Presentation\Requests\TeacherAttendance;

use Illuminate\Foundation\Http\FormRequest;

class CancelClassSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['superadmin', 'coordinador_academico']) === true;
    }

    public function rules(): array
    {
        return ['reason' => ['required', 'string', 'max:1000']];
    }
}
