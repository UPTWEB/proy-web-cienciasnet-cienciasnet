# Proposal: add-private-files-service

**ID:** BE-026  
**Fase:** Fase 6: Operación y release  
**Owner:** André  
**Reviewer:** Jefferson
**Dependencias:** BE-001

## Why

Centralizar archivos privados y evitar storage público accidental.

## In Scope

- uploads privados y descargas autorizadas
- URLs firmadas cortas para R2
- validación, retención y eliminación

## Out of Scope

- Capacidades pertenecientes a otros changes.
- Cambiar reglas compartidas sin actualizar `docs/`.

## Impact

- Proyecto: `backend`.
- Capacidades: uploads privados y descargas autorizadas, URLs firmadas cortas para R2, validación, retención y eliminación.

## API Contract

- Declaracion contractual: consultar la fila `add-private-files-service` de [`../../API_CONTRACTS.md`](../../API_CONTRACTS.md).
- Aplicar la relacion indicada antes de implementar; si declara `Sin contrato HTTP`, no inventar endpoints.

## Source Documents

- `../../../../docs/security/data-and-files.md`
- `../../../../docs/architecture/deployment.md`
