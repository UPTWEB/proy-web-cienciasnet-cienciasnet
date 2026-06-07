<?php

namespace App\Http\Requests\Academic;

use App\Models\PeriodoAcademico;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AcademicEntityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage', PeriodoAcademico::class) === true;
    }

    public function rules(): array
    {
        return match ((string) $this->route()->getName()) {
            'api.v1.academic-periods.store' => [
                'name' => ['required', 'string', 'max:100'],
                'start_date' => ['required', 'date'],
                'end_date' => ['required', 'date', 'after_or_equal:start_date'],
                'status' => ['sometimes', Rule::in(['draft', 'active', 'closed'])],
            ],
            'api.v1.academic-periods.update' => [
                'name' => ['sometimes', 'string', 'max:100'],
                'start_date' => ['sometimes', 'date'],
                'end_date' => ['sometimes', 'date', 'after_or_equal:start_date'],
                'status' => ['sometimes', Rule::in(['draft', 'active', 'closed'])],
            ],
            'api.v1.grades.store' => [
                'name' => ['required', 'string', 'max:100'],
                'level' => ['required', Rule::in(['inicial', 'primaria', 'secundaria'])],
                'order' => ['sometimes', 'integer', 'min:1'],
                'academic_period_id' => ['required', 'uuid', 'exists:periodos_academicos,id'],
            ],
            'api.v1.sections.store' => [
                'grade_id' => ['required', 'uuid', 'exists:grados,id'],
                'name' => ['required', 'string', 'max:50'],
                'capacity' => ['required', 'integer', 'min:1'],
            ],
            'api.v1.courses.store' => [
                'code' => ['required', 'string', 'max:30', 'unique:cursos,codigo'],
                'name' => ['required', 'string', 'max:150'],
                'description' => ['sometimes', 'string', 'max:1000'],
            ],
            'api.v1.enrollments.store' => [
                'student_id' => ['required', 'uuid', 'exists:alumnos,id'],
                'section_id' => ['required', 'uuid', 'exists:secciones,id'],
                'academic_period_id' => ['required', 'uuid', 'exists:periodos_academicos,id'],
                'enrolled_at' => ['sometimes', 'date'],
            ],
            'api.v1.teaching-assignments.store' => [
                'teacher_id' => ['required', 'uuid', 'exists:docentes,id'],
                'course_id' => ['required', 'uuid', 'exists:cursos,id'],
                'section_id' => ['required', 'uuid', 'exists:secciones,id'],
                'academic_period_id' => ['required', 'uuid', 'exists:periodos_academicos,id'],
            ],
            default => [],
        };
    }
}
