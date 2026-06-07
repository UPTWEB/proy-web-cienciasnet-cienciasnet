# Frontend OpenSpec Workflow

## Flujo

1. Confirmar que el change está desbloqueado y los contratos OpenAPI necesarios están aprobados.
2. Leer `Rules.md`, `AGENTS.md`, este workflow, todos los artefactos del change y documentos fuente.
3. Cambiar el estado del change de `[ ]` a `[~]` en `EXECUTION_PLAN.md` al iniciar implementación.
4. Confirmar requisitos SHALL y escenarios de `specs/<capability>/spec.md`.
5. Definir o corregir pantallas, rutas, permisos, estados, mocks y responsive en `design.md`.
6. Implementar tareas pequeñas y marcar cada `[x]` solamente tras comprobarla.
7. Verificar componentes, mocks de éxito/error/permisos/vacíos/latencia, accesibilidad, responsive, rutas y E2E;
   registrar resultados reales en `verification.md`.
8. Solicitar revisión y corregir hallazgos.
9. Fusionar las delta specs aceptadas en `openspec/specs/<capability>/spec.md`.
10. Mover el change a `openspec/changes/archive/YYYY-MM-DD-<change-name>/`.
11. Cambiar el plan a `[x]` y crear un commit enfocado.

## Sincronización de estados

| Momento | `EXECUTION_PLAN.md` | `tasks.md` | `verification.md` |
|---|---|---|---|
| Antes de iniciar | `[ ]` | Casillas pendientes | Resultados pendientes |
| Trabajo activo | `[~]` | Marcar solo tareas demostradas | Registrar evidencia progresivamente |
| Bloqueado | `[-]` | Conservar estado real | Explicar bloqueo y siguiente condición |
| Revisado y archivado | `[x]` | Todas las casillas completas | Todas las verificaciones y resultado final |

## Cierre obligatorio

No cerrar un change con estados loading/error/vacío/sin permiso faltantes, errores de consola, accesibilidad pendiente,
contratos simulados, pruebas E2E críticas sin ejecutar, aprobación pendiente, spec sin aceptar o change sin archivar.
