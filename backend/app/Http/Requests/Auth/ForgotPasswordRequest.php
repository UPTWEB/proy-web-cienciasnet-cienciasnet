<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class ForgotPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return ['email' => ['required', 'email:rfc', 'max:191']];
    }

    public function bodyParameters(): array
    {
        return [
            'email' => ['description' => 'Correo al que se enviarán instrucciones si existe.', 'example' => 'usuario@example.test'],
        ];
    }
}
