# Verification: add-roles-permissions-account-management

## Automated and Manual Checks

- [x] matriz positiva y negativa pasa.
- [x] cambios propios bloqueados.
- [x] desactivaciÃ³n conserva historial.

## Required Evidence

- [x] Resultados de pruebas o comandos adjuntos.
- [x] Escenarios de la delta spec demostrados.
- [x] Permisos negativos y datos sensibles revisados.
- [x] Fila contractual de `../../API_CONTRACTS.md` validada contra OpenAPI y documentos fuente.

## Results

- `docker compose exec -T backend php artisan test`: 22 pruebas, 83 aserciones, todas aprobadas.
- `php vendor/bin/pint --test`: aprobado.
- Comparación Scribe/OpenAPI de Fase 1: 26 operaciones de diseño, 26 implementadas, 0 faltantes y 0 extras.
- `openspec validate --strict --all`: 36 elementos backend aprobados.
- Redocly con `docs/api/redocly.yaml`: contratos público e interno válidos.
- PostgreSQL confirmó 19 índices sobre periodos, grados, secciones, matrículas, cursos y carga académica.
- Revisión pendiente únicamente de aprobación y archivado por el reviewer.
