# Proposal: add-family-links-management

**ID:** BE-005  
**Fase:** Fase 1: Identidad y estructura académica  
**Owner:** Fátima  
**Reviewer:** André
**Dependencias:** BE-004

## Why

Gestionar relaciones N:M entre padres y alumnos con alcance seguro.

## In Scope

- crear perfiles padre/alumno
- vincular y desvincular familiares
- consultar hijos vinculados y contextos

## Out of Scope

- Capacidades pertenecientes a otros changes.
- Cambiar reglas compartidas sin actualizar `docs/`.

## Impact

- Proyecto: `backend`.
- Capacidades: crear perfiles padre/alumno, vincular y desvincular familiares, consultar hijos vinculados y contextos.

## API Contract

- Declaracion contractual: consultar la fila `add-family-links-management` de [`../../API_CONTRACTS.md`](../../API_CONTRACTS.md).
- Aplicar la relacion indicada antes de implementar; si declara `Sin contrato HTTP`, no inventar endpoints.

## Source Documents

- `../../../../docs/domain/identity-access.md`
- `../../../../docs/product/roles-and-permissions.md`
- `../../../../docs/architecture/database-schema.md`
