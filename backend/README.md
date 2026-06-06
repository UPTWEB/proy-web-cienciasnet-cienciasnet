# CienciasNET Backend

API Laravel 13 de CienciasNET. Las reglas de desarrollo viven en `Rules.md`; la planificación y los cambios aceptados
viven en `openspec/`.

## Requisitos

- PHP 8.3 o superior.
- Composer 2.
- PostgreSQL 16.
- Docker Desktop con Docker Compose es el flujo recomendado del equipo.

El host actual puede ejecutar Composer y las pruebas mediante Docker cuando no tenga PHP 8.3:

```bash
docker run --rm -v "$PWD:/app" -w /app composer:2 composer install
docker run --rm -v "$PWD:/app" -w /app composer:2 php artisan test
```

## Primer arranque recomendado

Desde la raíz del repositorio:

```bash
docker compose up -d --build
docker compose exec backend php artisan test
```

La guía completa está en [`../docs/development-local.md`](../docs/development-local.md).

## Verificación rápida

- `GET /health` responde únicamente `{"status":"ok"}`.
- `php artisan test` ejecuta la suite.
- `php artisan migrate:fresh` aplica las migraciones base.
- `php artisan migrate:rollback` revierte el último lote.

## Dependencias base

- Laravel Sanctum para autenticación SPA y credenciales técnicas.
- Spatie Laravel Permission para roles y permisos.
- Scribe para publicar el contrato HTTP.
- Pest para pruebas.

Las capacidades funcionales se implementan únicamente desde el siguiente change desbloqueado de
`openspec/EXECUTION_PLAN.md`.
