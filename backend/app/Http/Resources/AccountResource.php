<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'active' => $this->activo,
            'roles' => $this->roles->pluck('name')->values(),
            'last_login_at' => $this->ultimo_login?->toISOString(),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
