<?php

namespace App\Policies;

use App\Models\User;

class PeriodoAcademicoPolicy
{
    public function viewAny(User $actor): bool
    {
        return $actor->roles()->exists();
    }

    public function manage(User $actor): bool
    {
        return $actor->hasAnyRole(['superadmin', 'coordinador_academico']);
    }
}
