# Base de datos backend

Las migraciones se ejecutan en orden y deben poder revertirse completas antes de aceptar un change.

```bash
docker compose exec backend php artisan migrate:fresh --seed
docker compose exec backend php artisan migrate:rollback --force
docker compose exec backend php artisan migrate --force
```

`migrate:rollback` revierte el último lote. En desarrollo, `migrate:fresh` elimina todo el esquema y no debe utilizarse
contra datos reales. Los cambios históricos se corrigen con una migración nueva; no se editan migraciones ya desplegadas
en producción.
