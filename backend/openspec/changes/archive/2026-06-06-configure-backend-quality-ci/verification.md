# Verification: configure-backend-quality-ci

## Automated and Manual Checks

- [x] pipeline pasa desde clon.
- [x] fallo intencional bloquea.
- [x] no aparecen secretos.

## Required Evidence

- [x] Resultados de pruebas o comandos adjuntos.
- [x] Escenarios de la delta spec demostrados.
- [x] Permisos negativos y datos sensibles revisados.
- [x] Contrato y documentos sincronizados.

## Results

- `docker compose config --quiet`: correcto.
- `docker compose exec -T backend composer quality`: correcto; Pint, 6 pruebas y 21 aserciones pasan.
- Migraciones PostgreSQL ejecutadas, revertidas y aplicadas nuevamente sin error.
- Scribe genera `public/docs/openapi.yaml` de forma determinista y CI verifica diferencias.
- Composer audit y el escaneo de secretos no detectan dependencias vulnerables ni secretos reales.
- El workflow usa pasos secuenciales: cualquier comando con salida distinta de cero bloquea el job.
