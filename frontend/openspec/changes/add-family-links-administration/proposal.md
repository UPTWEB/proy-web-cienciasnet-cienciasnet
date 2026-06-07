# Proposal: add-family-links-administration

**ID:** FE-006  
**Fase:** Fase 1: Identidad y academia  
**Owner:** Kiara  
**Reviewer:** Jefferson
**Dependencias:** FE-003, Backend BE-005

## Why

Gestionar perfiles y vínculos familiares sin autorregistro.

## In Scope

- crear padre/alumno
- vincular/desvincular N:M
- mostrar hijos/padres relacionados

## Out of Scope

- Capacidades pertenecientes a otros changes.
- Cambiar reglas compartidas sin actualizar `docs/`.

## Impact

- Proyecto: `frontend`.
- Capacidades: crear padre/alumno, vincular/desvincular N:M, mostrar hijos/padres relacionados.

## API Contract

- Declaracion contractual: consultar la fila `add-family-links-administration` de [`../../API_CONTRACTS.md`](../../API_CONTRACTS.md).
- Aplicar la relacion indicada antes de implementar; si declara `Sin contrato HTTP`, no inventar endpoints.

## Source Documents

- `../../../../docs/domain/identity-access.md`
- `../../../../docs/product/roles-and-permissions.md`
