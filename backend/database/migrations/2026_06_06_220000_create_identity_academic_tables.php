<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('alumnos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->nullable()->unique()->constrained()->nullOnDelete();
            $table->string('dni', 8)->unique();
            $table->string('nombres', 150);
            $table->string('apellidos', 150);
            $table->timestampsTz();
            $table->index(['apellidos', 'nombres']);
        });

        Schema::create('padres', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained()->restrictOnDelete();
            $table->string('dni', 8)->unique();
            $table->string('nombres', 150);
            $table->string('apellidos', 150);
            $table->string('celular', 15);
            $table->string('correo_notificaciones', 191);
            $table->timestampsTz();
            $table->index(['apellidos', 'nombres']);
        });

        Schema::create('docentes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained()->restrictOnDelete();
            $table->string('dni', 8)->unique();
            $table->string('nombres', 150);
            $table->string('apellidos', 150);
            $table->string('telefono', 15)->nullable();
            $table->timestampsTz();
            $table->index(['apellidos', 'nombres']);
        });

        Schema::create('administrativos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->unique()->constrained()->restrictOnDelete();
            $table->string('nombres', 150);
            $table->string('cargo', 30);
            $table->timestampsTz();
            $table->index('cargo');
        });

        Schema::create('alumno_padre', function (Blueprint $table) {
            $table->foreignUuid('alumno_id')->constrained('alumnos')->cascadeOnDelete();
            $table->foreignUuid('padre_id')->constrained('padres')->cascadeOnDelete();
            $table->string('relacion', 20);
            $table->boolean('es_contacto_principal')->default(false);
            $table->boolean('recibe_notificaciones')->default(true);
            $table->primary(['alumno_id', 'padre_id']);
            $table->index('padre_id');
        });

        Schema::create('periodos_academicos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nombre', 100);
            $table->string('tipo', 20);
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->string('estado', 20)->default('borrador');
            $table->foreignUuid('creado_por')->constrained('users')->restrictOnDelete();
            $table->timestampsTz();
            $table->index(['tipo', 'estado']);
        });

        Schema::create('grados', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('periodo_academico_id')->constrained('periodos_academicos')->cascadeOnDelete();
            $table->string('nombre', 100);
            $table->string('nivel', 50);
            $table->smallInteger('orden');
            $table->boolean('activo')->default(true);
            $table->timestampsTz();
            $table->unique(['periodo_academico_id', 'nombre']);
            $table->index(['periodo_academico_id', 'activo']);
        });

        Schema::create('secciones', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('grado_id')->constrained('grados')->cascadeOnDelete();
            $table->string('nombre', 30);
            $table->string('turno', 20);
            $table->string('aula', 50)->nullable();
            $table->boolean('activo')->default(true);
            $table->timestampsTz();
            $table->unique(['grado_id', 'nombre']);
            $table->index(['grado_id', 'activo']);
        });

        Schema::create('matriculas', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('alumno_id')->constrained('alumnos')->restrictOnDelete();
            $table->foreignUuid('seccion_id')->constrained('secciones')->restrictOnDelete();
            $table->string('codigo', 50)->unique();
            $table->date('fecha');
            $table->string('estado', 20)->default('preinscrito');
            $table->foreignUuid('registrado_por')->constrained('users')->restrictOnDelete();
            $table->timestampsTz();
            $table->unique(['alumno_id', 'seccion_id']);
            $table->index(['seccion_id', 'estado']);
        });

        Schema::create('cursos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('codigo', 50)->unique();
            $table->string('nombre', 150);
            $table->string('area', 100)->nullable();
            $table->boolean('activo')->default(true);
            $table->timestampsTz();
            $table->index(['activo', 'nombre']);
        });

        Schema::create('carga_academica', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('seccion_id')->constrained('secciones')->restrictOnDelete();
            $table->foreignUuid('curso_id')->constrained('cursos')->restrictOnDelete();
            $table->foreignUuid('docente_id')->constrained('docentes')->restrictOnDelete();
            $table->date('vigente_desde');
            $table->date('vigente_hasta')->nullable();
            $table->boolean('activo')->default(true);
            $table->foreignUuid('asignado_por')->constrained('users')->restrictOnDelete();
            $table->timestampsTz();
            $table->index(['seccion_id', 'curso_id', 'activo']);
            $table->index(['docente_id', 'activo']);
        });

        Schema::create('audit_logs', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->foreignUuid('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action', 100);
            $table->string('model', 100);
            $table->string('model_id', 36);
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip', 45)->nullable();
            $table->timestampTz('created_at')->useCurrent();
            $table->index(['model', 'model_id']);
            $table->index(['user_id', 'created_at']);
            $table->index(['action', 'created_at']);
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE periodos_academicos ADD CONSTRAINT periodos_fechas_validas CHECK (fecha_fin >= fecha_inicio)');
            DB::statement('ALTER TABLE carga_academica ADD CONSTRAINT carga_vigencia_valida CHECK (vigente_hasta IS NULL OR vigente_hasta >= vigente_desde)');
            DB::statement("CREATE UNIQUE INDEX periodos_un_activo_por_tipo ON periodos_academicos (tipo) WHERE estado = 'activo'");
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('carga_academica');
        Schema::dropIfExists('cursos');
        Schema::dropIfExists('matriculas');
        Schema::dropIfExists('secciones');
        Schema::dropIfExists('grados');
        Schema::dropIfExists('periodos_academicos');
        Schema::dropIfExists('alumno_padre');
        Schema::dropIfExists('administrativos');
        Schema::dropIfExists('docentes');
        Schema::dropIfExists('padres');
        Schema::dropIfExists('alumnos');
    }
};
