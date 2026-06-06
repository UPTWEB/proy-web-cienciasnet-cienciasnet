# Verification: initialize-docker-development

## Automated and Manual Checks

- [x] docker compose config válido.
- [x] todos los healthchecks pasan.
- [x] reinicio conserva PostgreSQL.

## Required Evidence

- [x] Resultados de pruebas o comandos adjuntos.
- [x] Escenarios de la delta spec demostrados.
- [x] Permisos negativos y datos sensibles revisados.
- [x] Contrato y documentos sincronizados.

## Results

- `docker compose config --quiet` pasó.
- Backend, frontend, PostgreSQL y facial-api alcanzaron estado healthy; queue quedó ejecutándose.
- PostgreSQL y facial-api no publican puertos al host.
- La sonda `ops_persistence_probe=survives` permaneció después de reiniciar PostgreSQL.
- Se documentó primer arranque, verificación y diagnóstico en `docs/development-local.md`.
