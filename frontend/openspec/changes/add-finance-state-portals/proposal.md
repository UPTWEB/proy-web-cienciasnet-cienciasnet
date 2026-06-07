# Proposal: add-finance-state-portals

**ID:** FE-014  
**Fase:** Fase 3: Finanzas  
**Owner:** Vincenzo  
**Reviewer:** Jefferson
**Dependencias:** FE-008, Backend BE-017

## Why

Mostrar estado de cuenta comprensible a familias y reportes a Yanina.

## In Scope

- estado por alumno/hijo
- pronto pago y vencimiento
- morosos, caja y recordatorios

## Out of Scope

- Capacidades pertenecientes a otros changes.
- Cambiar reglas compartidas sin actualizar `docs/`.

## Impact

- Proyecto: `frontend`.
- Capacidades: estado por alumno/hijo, pronto pago y vencimiento, morosos, caja y recordatorios.

## API Contract

- Declaracion contractual: consultar la fila `add-finance-state-portals` de [`../../API_CONTRACTS.md`](../../API_CONTRACTS.md).
- Aplicar la relacion indicada antes de implementar; si declara `Sin contrato HTTP`, no inventar endpoints.

## Source Documents

- `../../../../docs/domain/finance.md`
- `../../../../docs/product/roles-and-permissions.md`
