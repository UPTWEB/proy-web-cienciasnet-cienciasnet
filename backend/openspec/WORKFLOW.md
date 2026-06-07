# Backend OpenSpec Workflow

## Estados

- `[ ]` pendiente
- `[~]` en progreso
- `[-]` bloqueado
- `[x]` terminado, verificado, archivado y committeado

## Flujo

1. Confirmar que el change está desbloqueado, sus dependencias están aceptadas y el contrato OpenAPI aplicable está
   aprobado.
2. Leer `Rules.md`, `AGENTS.md`, este workflow, todos los artefactos del change, documentos fuente, contrato OpenAPI y
   specs relacionadas.
3. Cambiar el estado del change de `[ ]` a `[~]` en `EXECUTION_PLAN.md` al iniciar implementación.
4. Confirmar que `specs/<capability>/spec.md` contiene requisitos SHALL y escenarios GIVEN/WHEN/THEN.
5. Actualizar `proposal.md` y `design.md` si cambia el alcance antes de continuar.
6. Ejecutar tareas pequeñas en orden y marcar cada `[x]` solamente tras comprobarla.
7. Ejecutar migraciones, pruebas, autorización y rendimiento aplicables; comparar Scribe con el contrato OpenAPI.
8. Marcar las verificaciones cumplidas y registrar resultados reales en `verification.md`.
9. Solicitar revisión. El reviewer confirma tareas, escenarios, contrato y evidencia.
10. Fusionar las delta specs aceptadas en `openspec/specs/<capability>/spec.md`.
11. Mover el change a `openspec/changes/archive/YYYY-MM-DD-<change-name>/`.
12. Cambiar el plan a `[x]` y crear un commit enfocado.

## Sincronización de estados

| Momento | `EXECUTION_PLAN.md` | `tasks.md` | `verification.md` |
|---|---|---|---|
| Antes de iniciar | `[ ]` | Casillas pendientes | Resultados pendientes |
| Trabajo activo | `[~]` | Marcar solo tareas demostradas | Registrar evidencia progresivamente |
| Bloqueado | `[-]` | Conservar estado real | Explicar bloqueo y siguiente condición |
| Revisado y archivado | `[x]` | Todas las casillas completas | Todas las verificaciones y resultado final |

## Cierre obligatorio

Un change backend no se marca `[x]` si falta contrato API, pruebas negativas de permisos, rollback de migración,
verificación de consultas, documentación requerida, aprobación del reviewer, spec aceptada o archivado del change.
