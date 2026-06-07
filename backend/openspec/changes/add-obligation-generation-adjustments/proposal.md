# Proposal: add-obligation-generation-adjustments

**ID:** BE-015  
**Fase:** Fase 3: Finanzas  
**Owner:** Jefferson  
**Reviewer:** Jefferson
**Dependencias:** BE-014

## Why

Generar y ajustar deudas pendientes conservando el historial.

## In Scope

- generación individual/masiva
- selección de beneficio y pronto pago
- ajuste pendiente con motivo y notificación

## Out of Scope

- Capacidades pertenecientes a otros changes.
- Cambiar reglas compartidas sin actualizar `docs/`.

## Impact

- Proyecto: `backend`.
- Capacidades: generación individual/masiva, selección de beneficio y pronto pago, ajuste pendiente con motivo y notificación.

## API Contract

- Declaracion contractual: consultar la fila `add-obligation-generation-adjustments` de [`../../API_CONTRACTS.md`](../../API_CONTRACTS.md).
- Aplicar la relacion indicada antes de implementar; si declara `Sin contrato HTTP`, no inventar endpoints.

## Source Documents

- `../../../../docs/domain/finance.md`
- `../../../../docs/domain/use-case-catalog.md`
- `../../../../docs/security/audit-and-operations.md`
