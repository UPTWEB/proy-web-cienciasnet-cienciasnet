<?php

namespace Database\Seeders;

use App\Models\Alumno;
use App\Models\Curso;
use App\Models\Docente;
use App\Models\Grado;
use App\Models\Matricula;
use App\Models\PeriodoAcademico;
use App\Models\Seccion;
use App\Models\User;
use Illuminate\Database\Seeder;

class IdentityAcademicSeeder extends Seeder
{
    public function run(): void
    {
        $coordinator = User::factory()->create(['email' => 'coordinacion@example.test']);
        $period = PeriodoAcademico::factory()->create(['creado_por' => $coordinator->id]);
        $grade = Grado::create([
            'periodo_academico_id' => $period->id,
            'nombre' => '3ro Secundaria',
            'nivel' => 'Secundaria',
            'orden' => 3,
            'activo' => true,
        ]);
        $section = Seccion::create([
            'grado_id' => $grade->id,
            'nombre' => 'A',
            'turno' => 'manana',
            'activo' => true,
        ]);
        $student = Alumno::factory()->create();
        Matricula::create([
            'alumno_id' => $student->id,
            'seccion_id' => $section->id,
            'codigo' => 'MAT-DEMO-001',
            'fecha' => now()->toDateString(),
            'estado' => 'activo',
            'registrado_por' => $coordinator->id,
        ]);
        Curso::factory()->create(['codigo' => 'MAT-001', 'nombre' => 'Matemática']);
        Docente::factory()->create();
    }
}
