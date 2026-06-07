# Arquitectura Backend

## Plataforma prevista

- PHP 8.3+ y Laravel 13 API.
- PostgreSQL 16 mediante Eloquent y Query Builder.
- Laravel Sanctum para sesión SPA y credenciales técnicas.
- Spatie Laravel Permission para roles y permisos.
- Colas Laravel para correos, notificaciones y tareas diferidas.
- Pest para pruebas, OpenAPI Design-First para contrato HTTP y Scribe para documentación de la implementación.

Laravel ya proporciona rutas API, controladores, Form Requests, API Resources, paginación, manejo de excepciones,
Sanctum, middleware y Policies. Se utilizarán estas capacidades antes de crear abstracciones propias. El contrato
OpenAPI aprobado en `docs/api/` es autoritativo. Scribe genera documentación navegable desde endpoints implementados y
ayuda a detectar diferencias; OpenSpec planifica el change, pero ninguno reemplaza el contrato aprobado.

## Organización

El backend se organiza por módulos de dominio con arquitectura modular pragmática. Los módulos complejos pueden separar
Application, Domain, Infrastructure y Presentation; los CRUD simples no deben crear capas vacías. Cada abstracción debe
eliminar complejidad real o proteger una regla/integración.

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
- Los endpoints concretos se aprueban primero en `docs/api/`.
- El backend OpenSpec planifica cómo implementar y verificar el contrato aprobado.

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
