# Arquitectura Backend

## Plataforma prevista

- PHP 8.2+ y Laravel 11 API.
- PostgreSQL 16 mediante Eloquent y Query Builder.
- Laravel Sanctum para sesión SPA y credenciales técnicas.
- Spatie Laravel Permission para roles y permisos.
- Colas Laravel para correos, notificaciones y tareas diferidas.
- Pest para pruebas y Scribe/OpenAPI para contrato HTTP.

## Organización

El backend se organiza por módulos de dominio. Cada módulo contiene casos de uso, modelos, Policies, validación,
persistencia y presentación HTTP relacionados. Las abstracciones compartidas deben ser pequeñas y justificadas.

### Estructura esperada por módulo

```text
backend/app/Modules/Academico/
├── Application/
│   ├── UseCases/
│   │   ├── CrearExamen.php
│   │   ├── RegistrarNota.php
│   │   ├── PublicarNotas.php
│   │   └── ObtenerRanking.php
│   └── DTOs/
│       └── NotaDTO.php
├── Domain/
│   ├── Entities/
│   │   └── Examen.php
│   ├── ValueObjects/
│   │   └── CanalExamen.php
│   └── Repositories/
│       └── ExamenRepositoryInterface.php
├── Infrastructure/
│   ├── Models/
│   │   ├── ExamenModel.php
│   │   └── NotaModel.php
│   └── Repositories/
│       └── EloquentExamenRepository.php
└── Presentation/
    ├── Controllers/
    │   └── ExamenController.php
    ├── Requests/
    │   └── RegistrarNotaRequest.php
    ├── Resources/
    │   └── ExamenResource.php
    └── Policies/
        └── ExamenPolicy.php
```

### Regla de dependencias

```text
Presentation ──► Application ──► Domain
Infrastructure ────────────────► Domain
```

- `Domain` no depende de Laravel, Eloquent, HTTP ni infraestructura.
- `Application` conoce contratos y entidades del dominio.
- `Infrastructure` implementa persistencia e integraciones.
- `Presentation` valida HTTP, autoriza y llama casos de uso.
- Un controlador no contiene reglas de negocio ni consultas complejas.

### Módulos esperados

```text
backend/app/Modules/
├── Auth/
├── Usuarios/
├── Academico/
├── Asistencia/
├── Finanzas/
├── Incidencias/
├── Psicologia/
├── Materiales/
├── Horarios/
├── Comunicados/
├── Notificaciones/
└── Shared/
```

## Responsabilidades

- Implementar invariantes descritas en `docs/domain/`.
- Aplicar autorización por permiso y Policy de recurso.
- Publicar contratos API versionados.
- Ejecutar migraciones y mantener integridad/índices.
- Auditar operaciones críticas.
- Orquestar servicio facial, R2, correo y archivos privados.

## Contratos

- API bajo `/api/v1`.
- Errores con formato consistente y códigos estables.
- UUID para recursos de dominio.
- Paginación obligatoria en listados.
- Operaciones sensibles e integraciones usan idempotencia.
- El backend OpenSpec define endpoints concretos antes de que frontend dependa de ellos.

## Estructura backend esperada

```text
backend/
├── app/Modules/
├── bootstrap/
├── config/
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
├── tests/
│   ├── Feature/
│   ├── Integration/
│   └── Unit/
├── openspec/
│   ├── EXECUTION_PLAN.md
│   ├── WORKFLOW.md
│   ├── NEW_FEATURE_FLOW.md
│   ├── changes/
│   └── specs/
├── Rules.md
├── AGENTS.md
├── composer.json
└── .env.example
```

Las migraciones viven exclusivamente en `backend/database/migrations/`. El orden completo de tablas y campos está en
[`database-schema.md`](database-schema.md).

## Pruebas backend

- Unitarias para reglas y Value Objects.
- Integración para repositorios, constraints y transacciones.
- Feature para endpoints, validación, autenticación y Policies.
- Pruebas de autorización negativas para todos los recursos sensibles.
- Verificación de migraciones y rollback en cambios de esquema.
