<?php

namespace App\Policies;

use App\Models\Alumno;
use App\Models\User;

class AlumnoPolicy
{
    public function manageFamilyLinks(User $actor): bool
    {
        return $actor->hasRole('superadmin') || $actor->can('gestionar_usuarios');
    }

    public function viewLinked(User $actor, Alumno $alumno): bool
    {
        return $actor->padre?->alumnos()->whereKey($alumno->id)->exists() === true
            || $actor->alumno?->is($alumno) === true;
    }
}
