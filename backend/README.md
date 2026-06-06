# CienciasNET Backend

API Laravel 13 de CienciasNET. Las reglas de desarrollo viven en `Rules.md`; la planificación y los cambios aceptados
viven en `openspec/`.

## Requisitos

- PHP 8.3 o superior.
- Composer 2.
- PostgreSQL 16.
- Node.js solo para compilar los recursos incluidos por Laravel.

El host actual puede ejecutar Composer y las pruebas mediante Docker cuando no tenga PHP 8.3:

```bash
docker run --rm -v "$PWD:/app" -w /app composer:2 composer install
docker run --rm -v "$PWD:/app" -w /app composer:2 php artisan test
```

## Primer arranque

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan test
php artisan serve
```

Configurar previamente las credenciales PostgreSQL en `.env`. El archivo `.env` nunca se versiona.

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
