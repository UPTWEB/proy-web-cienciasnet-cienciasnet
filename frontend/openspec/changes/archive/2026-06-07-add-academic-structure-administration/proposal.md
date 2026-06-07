# Proposal: add-academic-structure-administration

**ID:** FE-007  
**Fase:** Fase 1: Identidad y academia  
**Owner:** Kiara  
**Reviewer:** Jefferson
**Dependencias:** FE-002, FE-003, Backend BE-006

## Why

Administrar periodos, grados, secciones, matrículas, cursos y cargas.

## In Scope

- navegación académica
- CRUD y asignaciones
- vigencias e historial de carga

## Out of Scope

- Capacidades pertenecientes a otros changes.
- Cambiar reglas compartidas sin actualizar `docs/`.

## Impact

- Proyecto: `frontend`.
- Capacidades: navegación académica, CRUD y asignaciones, vigencias e historial de carga.

## API Contract

- Declaracion contractual: consultar la fila `add-academic-structure-administration` de [`../../API_CONTRACTS.md`](../../API_CONTRACTS.md).
- Aplicar la relacion indicada antes de implementar; si declara `Sin contrato HTTP`, no inventar endpoints.

## Source Documents

- `../../../../docs/domain/academic.md`
- `../../../../docs/product/roles-and-permissions.md`
