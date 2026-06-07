<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FamilyLinkResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student_id' => $this->alumno_id,
            'parent_id' => $this->padre_id,
            'parent_account_id' => $this->parent_account_id,
            'student_name' => trim($this->student_name),
            'parent_name' => trim($this->parent_name),
            'relationship' => $this->relacion,
        ];
    }
}
