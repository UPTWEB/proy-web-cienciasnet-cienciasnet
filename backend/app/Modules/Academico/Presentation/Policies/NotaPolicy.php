<?php

namespace App\Modules\Academico\Presentation\Policies;

use App\Modules\Usuarios\Infrastructure\Models\User;
use App\Modules\Academico\Infrastructure\Models\Examen;
use App\Modules\Academico\Infrastructure\Models\Nota;

class NotaPolicy
{
    public function register(User $user, Examen $examen): bool
    {
        // Coordinador Académico puede
        if ($user->hasRole('coordinador_academico')) {
            return true;
        }

        // Si es docente, debe ser el asignado a la carga académica
        if ($user->hasRole('docente')) {
            $docente = \Illuminate\Support\Facades\DB::table('docentes')->where('user_id', $user->id)->first();
            \Illuminate\Support\Facades\Log::info('POLICY DEBUG', [
                'user_id' => $user->id,
                'docente_id_found' => $docente ? $docente->id : null,
                'examen_carga_docente_id' => $examen->cargaAcademica->docente_id,
                'match' => $docente && $examen->cargaAcademica->docente_id === $docente->id
            ]);
            return $docente && $examen->cargaAcademica->docente_id === $docente->id;
        }

        return false;
    }

    public function update(User $user, Nota $nota): bool
    {
        return $this->register($user, $nota->examen);
    }
}
