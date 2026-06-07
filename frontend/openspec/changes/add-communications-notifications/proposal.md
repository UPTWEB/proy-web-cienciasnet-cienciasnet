# Proposal: add-communications-notifications

**ID:** FE-019  
**Fase:** Fase 4: Evaluación y contenido  
**Owner:** Kiara  
**Reviewer:** Jefferson
**Dependencias:** FE-002, Backend BE-023

## Why

Publicar, leer y archivar comunicaciones segmentadas.

## In Scope

- editor y segmentación
- bandeja/notificaciones
- lectura y archivo

## Out of Scope

- Capacidades pertenecientes a otros changes.
- Cambiar reglas compartidas sin actualizar `docs/`.

## Impact

- Proyecto: `frontend`.
- Capacidades: editor y segmentación, bandeja/notificaciones, lectura y archivo.

## API Contract

- Declaracion contractual: consultar la fila `add-communications-notifications` de [`../../API_CONTRACTS.md`](../../API_CONTRACTS.md).
- Aplicar la relacion indicada antes de implementar; si declara `Sin contrato HTTP`, no inventar endpoints.

## Source Documents

- `../../../../docs/domain/incidents-communications.md`
- `../../../../docs/product/roles-and-permissions.md`
