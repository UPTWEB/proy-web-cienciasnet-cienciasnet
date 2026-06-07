# OpenSpec Frontend

Organiza pantallas, navegación, componentes, integración API, accesibilidad y pruebas frontend.

Para asignar trabajo, usar la plantilla de [`TASK_REQUEST.md`](TASK_REQUEST.md).

## Flujo

1. Elegir el siguiente change desbloqueado de `EXECUTION_PLAN.md`.
2. Completar propuesta, diseño, delta spec, tareas y verificación.
3. Confirmar que los contratos OpenAPI requeridos estén aprobados y publicados en `../../docs/api/`.
4. Implementar estados completos: carga, vacío, error, éxito y sin permiso.
5. Verificar responsive, accesibilidad, pruebas y E2E antes de archivar.

La Fase 0 entrega una base clonable y consistente. Kiara y Vincenzo pueden apoyar cualquier feature; el reviewer válido
para cada change futuro es el indicado en `EXECUTION_PLAN.md`.

## Fuentes

- `../../docs/`: reglas compartidas y decisiones autoritativas.
- `COVERAGE.md`: trazabilidad entre experiencias documentadas y changes frontend.
- `API_CONTRACTS.md`: relación exacta entre cada change activo y los paquetes OpenAPI que consume o verifica.
- `../../docs/api/`: contratos HTTP estables y autoritativos.
- `../../backend/openspec/specs/`: comportamiento backend aceptado relacionado.
- `specs/`: capacidades frontend aceptadas.
- `changes/`: trabajo propuesto o activo.

Cada change activo contiene `proposal.md`, `design.md`, `tasks.md`, `verification.md` y al menos una delta spec en
`specs/<capability>/spec.md`.

La declaración `API Contract` de cada propuesta debe coincidir con `API_CONTRACTS.md`. Los mocks, tipos y clientes se
construyen desde esos paquetes aprobados, nunca desde supuestos de pantalla ni desde changes backend activos.
