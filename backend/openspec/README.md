# OpenSpec Backend

Organiza migraciones, casos de uso, APIs, seguridad, integraciones e infraestructura backend.

Para asignar trabajo, usar la plantilla de [`TASK_REQUEST.md`](TASK_REQUEST.md).

## Flujo

1. Elegir el siguiente change desbloqueado de `EXECUTION_PLAN.md`.
2. Completar su propuesta, diseño, delta spec, tareas y criterios de verificación.
3. Implementar únicamente el alcance aprobado.
4. Verificar pruebas, migraciones, seguridad e implementación contra el contrato OpenAPI aprobado.
5. Archivar la capacidad aceptada en `specs/` y cerrar el plan.

La Fase 0 debe terminar antes de repartir features funcionales. Los owners son líderes iniciales; Jefferson, Fátima y
André pueden apoyar cualquier change backend. El reviewer válido es el indicado en `EXECUTION_PLAN.md`.

## Fuentes

- `../../docs/`: reglas compartidas y decisiones autoritativas.
- `COVERAGE.md`: trazabilidad entre dominios documentados y changes backend.
- `specs/`: capacidades backend aceptadas y estables.
- `changes/`: trabajo propuesto o activo; no es contrato estable para frontend.
- `../../docs/api/`: contrato HTTP aprobado y autoritativo para integración.
- Scribe: documentación generada desde la implementación para detectar diferencias.

Cada change activo contiene `proposal.md`, `design.md`, `tasks.md`, `verification.md` y al menos una delta spec en
`specs/<capability>/spec.md`.
