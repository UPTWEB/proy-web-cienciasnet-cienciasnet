# Cómo Solicitar una Tarea Frontend

Toda asignación debe nombrar un change existente y sus contratos backend aceptados.

## Plantilla recomendada

```text
Implementa el change frontend <ID> `<change-name>`.

Antes de editar:
- Lee frontend/Rules.md, frontend/AGENTS.md y frontend/openspec/WORKFLOW.md.
- Lee todos los archivos de frontend/openspec/changes/<change-name>/.
- Lee sus documentos fuente y contratos backend aceptados.
- Confirma dependencias y cambia el estado del change a [~] en EXECUTION_PLAN.md.

Durante el trabajo:
- Implementa únicamente el alcance del change.
- Marca cada casilla de tasks.md solo después de implementarla y verificarla.
- Registra pruebas, E2E, accesibilidad, responsive y limitaciones en verification.md.
- Antes de implementar, confirma la fila del change en `API_CONTRACTS.md` y genera tipos/mocks desde los paquetes
  OpenAPI aprobados indicados allí.
- No cierres con mocks o contratos temporales.

Al terminar:
- Demuestra todos los escenarios de la delta spec.
- Solicita revisión; no marques [x] sin aprobación del reviewer.
- Después de aprobar: fusiona la spec en openspec/specs/, mueve el change a changes/archive/YYYY-MM-DD-<change-name>/,
  marca [x] en EXECUTION_PLAN.md y realiza un commit enfocado.
```

## Ejemplo

```text
Implementa el change frontend FE-003 `add-api-client-routing-auth` siguiendo frontend/openspec/TASK_REQUEST.md.
Usa solamente contratos backend aceptados y lleva el change hasta revisión y cierre OpenSpec.
```
