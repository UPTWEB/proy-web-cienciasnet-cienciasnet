<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $manageUsers = Permission::findOrCreate('gestionar_usuarios', 'web');
        foreach (['gestionar_finanzas', 'gestionar_planilla', 'cerrar_liquidacion', 'gestionar_dispositivos'] as $name) {
            Permission::findOrCreate($name, 'web');
        }

        foreach (['superadmin', 'gestor_usuarios', 'toe', 'psicologia', 'auxiliar', 'coordinador_academico', 'administrativo', 'docente', 'padre', 'alumno'] as $name) {
            Role::findOrCreate($name, 'web');
        }

        Role::findByName('superadmin', 'web')->givePermissionTo(Permission::all());
        Role::findByName('gestor_usuarios', 'web')->givePermissionTo($manageUsers);
    }
}
