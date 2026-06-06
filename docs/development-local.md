# Desarrollo Local Reproducible

Docker Compose es el entorno oficial de desarrollo y evita depender de versiones particulares instaladas en cada PC.

## Requisitos

- Git.
- Docker Desktop reciente con Docker Compose v2.
- Al menos 8 GB de RAM disponibles para Docker.
- Puertos locales `5173` y `8000` libres.

PHP, Composer, PostgreSQL, Python y Node.js no son obligatorios en el host. Se ejecutan dentro de contenedores.

## Primer arranque

```bash
git clone <repositorio>
cd ciencias-net
docker compose up -d --build
docker compose ps
```

| Servicio | Uso | Acceso host |
|---|---|---|
| `frontend` | SPA React/Vite | `http://localhost:5173` |
| `backend` | Laravel API | `http://localhost:8000` |
| `queue` | Worker Laravel | No expuesto |
| `db` | PostgreSQL 16 | No expuesto |
| `facial-api` | FastAPI facial privado | No expuesto |

Los valores predeterminados de Compose son exclusivos para desarrollo local. Para personalizarlos:

```bash
cp .env.docker.example .env
```

## Comandos diarios

```bash
docker compose up -d
docker compose ps
docker compose logs -f backend frontend
docker compose exec backend php artisan test
docker compose exec frontend npm run test
docker compose down
```

`docker compose down` conserva PostgreSQL. `docker compose down -v` elimina volúmenes y borra la base local.

## Verificación completa

```bash
docker compose config --quiet
docker compose exec backend php vendor/bin/pint --test
docker compose exec backend php artisan test
docker compose exec backend php artisan scribe:generate
docker compose exec frontend npm run lint
docker compose exec frontend npm run test
docker compose exec frontend npm run build
```

Comprobar además que `/health`, `/api/v1/health` y `http://localhost:5173` respondan, y que `docker compose ps` muestre
todos los healthchecks saludables.

## Diagnóstico

```bash
docker compose logs --tail=100 backend
docker compose logs --tail=100 frontend
docker compose logs --tail=100 facial-api
docker compose exec db pg_isready -U cienciasnet -d cienciasnet
docker compose build --no-cache <servicio>
```

No instalar paquetes manualmente dentro de un contenedor en ejecución como solución permanente; actualizar el manifiesto
y lockfile correspondiente.
