# Verification: add-identity-academic-schema

## Automated and Manual Checks

- [x] migrate y rollback completos.
- [x] constraints familiares y académicos pasan.
- [x] EXPLAIN usa índices principales.

## Required Evidence

- [x] Resultados de pruebas o comandos adjuntos.
- [x] Escenarios de la delta spec demostrados.
- [x] Permisos negativos y datos sensibles revisados.
- [x] Contrato y documentos sincronizados.

## Results

- `migrate:fresh --seed`, `migrate:rollback` y `migrate --seed` pasan sobre PostgreSQL 16.
- Pest pasa 9 pruebas y 26 aserciones, incluidos correo único, vínculo familiar N:M y trazabilidad de matrícula.
- Pint pasa sobre 54 archivos.
- `EXPLAIN` usa `matriculas_seccion_id_estado_index`; se comprobaron también índices de carga académica y auditoría.
- `users` y los perfiles usan UUID; los pivotes de Spatie quedaron adaptados al identificador UUID.
- No se publican endpoints ni permisos nuevos en este change; los datos sensibles permanecen fuera de logs y seeds reales.
