<?php

namespace App\Http\Requests\IdentityAccess;

use Illuminate\Foundation\Http\FormRequest;

class ActivationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'active' => ['required', 'boolean'],
            'reason' => ['sometimes', 'string', 'max:500'],
        ];
    }
}
