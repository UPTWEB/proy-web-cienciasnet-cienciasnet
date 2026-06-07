# Frontend Agents

## Equipo

| Persona | Responsabilidad principal | Puede apoyar |
|---|---|---|
| Kiara | Sistema visual, shadcn/ui, layouts, responsive, accesibilidad y UX | Features, pruebas visuales |
| Vincenzo | Vite, rutas, API client, estado remoto, integración y E2E | Componentes, rendimiento |

Kiara y Vincenzo implementan y verifican los changes asignados. Jefferson es el reviewer de los changes frontend
futuros según `openspec/EXECUTION_PLAN.md`; los artefactos archivados conservan sus reviewers históricos.

## Lectura obligatoria

1. `Rules.md`
2. `AGENTS.md`
3. `openspec/EXECUTION_PLAN.md`
4. `../docs/` relacionados
5. Contratos OpenAPI aprobados relevantes en `../docs/api/`
6. Specs/changes frontend y código relacionado

## Coordinación

- Al recibir una tarea, confirmar el ID/change y seguir `openspec/TASK_REQUEST.md`.
- Mantener sincronizados `EXECUTION_PLAN.md`, `tasks.md` y `verification.md` mientras se trabaja.
- Kiara verifica consistencia visual, responsive y accesibilidad en sus changes.
- Vincenzo verifica rutas, API client, caché, manejo de sesión y E2E en sus changes.
- Jefferson revisa el cierre y archivado de los changes frontend futuros.
- No simular como definitivo un contrato OpenAPI no aprobado.
- Los mocks temporales deben marcarse y retirarse antes de cerrar el change.
