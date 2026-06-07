# Proposal: add-result-publication-reports-portals

**ID:** FE-016  
**Fase:** Fase 4: Evaluación y contenido  
**Owner:** Vincenzo  
**Reviewer:** Jefferson
**Dependencias:** FE-008, Backend BE-020

## Why

Publicar, corregir y consultar resultados/rankings protegidos.

## In Scope

- revisión/publicación/cierre coordinación
- corrección publicada auditada
- notas, ranking y reportes familia/alumno

## Out of Scope

- Capacidades pertenecientes a otros changes.
- Cambiar reglas compartidas sin actualizar `docs/`.

## Impact

- Proyecto: `frontend`.
- Capacidades: revisión/publicación/cierre coordinación, corrección publicada auditada, notas, ranking y reportes familia/alumno.

## API Contract

- Declaracion contractual: consultar la fila `add-result-publication-reports-portals` de [`../../API_CONTRACTS.md`](../../API_CONTRACTS.md).
- Aplicar la relacion indicada antes de implementar; si declara `Sin contrato HTTP`, no inventar endpoints.

## Source Documents

- `../../../../docs/domain/academic.md`
- `../../../../docs/product/roles-and-permissions.md`
