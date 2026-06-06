# Cómo Solicitar una Tarea Backend

Toda asignación debe nombrar un change existente. No pedir solamente “implementa autenticación” o “haz pagos”.

## Plantilla recomendada

```text
Implementa el change backend <ID> `<change-name>`.

Antes de editar:
- Lee backend/Rules.md, backend/AGENTS.md y backend/openspec/WORKFLOW.md.
- Lee todos los archivos de backend/openspec/changes/<change-name>/.
- Lee sus documentos fuente y specs aceptadas relacionadas.
- Confirma dependencias y cambia el estado del change a [~] en EXECUTION_PLAN.md.

Durante el trabajo:
- Implementa únicamente el alcance del change.
- Marca cada casilla de tasks.md solo después de implementarla y verificarla.
- Registra comandos, pruebas, resultados y limitaciones en verification.md.
- Mantén OpenAPI y documentación sincronizados.

Al terminar:
- Ejecuta todas las verificaciones y demuestra los escenarios de la delta spec.
- Solicita revisión; no marques [x] sin aprobación del reviewer.
- Después de aprobar: fusiona la spec en openspec/specs/, mueve el change a changes/archive/YYYY-MM-DD-<change-name>/,
  marca [x] en EXECUTION_PLAN.md y realiza un commit enfocado.
```

## Ejemplo

```text
Implementa el change backend BE-003 `add-human-authentication` siguiendo backend/openspec/TASK_REQUEST.md.
Lleva el change hasta revisión y cierre OpenSpec; no implementes BE-004.
```
