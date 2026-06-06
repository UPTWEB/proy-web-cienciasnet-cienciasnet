<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'email:rfc', 'max:191'],
            'password' => ['required', 'string'],
            'remember' => ['sometimes', 'boolean'],
        ];
    }

    public function bodyParameters(): array
    {
        return [
            'email' => ['description' => 'Correo único de la cuenta humana.', 'example' => 'usuario@example.test'],
            'password' => ['description' => 'Contraseña de la cuenta.', 'example' => 'correct-password'],
            'remember' => ['description' => 'Mantener la sesión al cerrar el navegador.', 'example' => false],
        ];
    }
}
