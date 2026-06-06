<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ResetPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'token' => ['required', 'string'],
            'email' => ['required', 'email:rfc', 'max:191'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ];
    }

    public function bodyParameters(): array
    {
        return [
            'token' => ['description' => 'Token recibido por correo.', 'example' => 'reset-token'],
            'email' => ['description' => 'Correo asociado al token.', 'example' => 'usuario@example.test'],
            'password' => ['description' => 'Nueva contraseña.', 'example' => 'new-secure-password'],
            'password_confirmation' => ['description' => 'Confirmación de la nueva contraseña.', 'example' => 'new-secure-password'],
        ];
    }
}
