<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('alumno_padre', function (Blueprint $table): void {
            $table->uuid('id')->nullable();
            $table->unique('id');
        });

        DB::table('alumno_padre')->whereNull('id')->get()->each(
            fn (object $link) => DB::table('alumno_padre')
                ->where('alumno_id', $link->alumno_id)
                ->where('padre_id', $link->padre_id)
                ->update(['id' => (string) Str::uuid()])
        );

        Schema::table('secciones', function (Blueprint $table): void {
            $table->unsignedSmallInteger('capacidad')->default(30);
        });

        Schema::table('cursos', function (Blueprint $table): void {
            $table->text('descripcion')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('cursos', fn (Blueprint $table) => $table->dropColumn('descripcion'));
        Schema::table('secciones', fn (Blueprint $table) => $table->dropColumn('capacidad'));
        Schema::table('alumno_padre', function (Blueprint $table): void {
            $table->dropUnique(['id']);
            $table->dropColumn('id');
        });
    }
};
