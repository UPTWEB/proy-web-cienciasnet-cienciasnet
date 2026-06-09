# Proposal: add-obligations-payments-administration

**ID:** FE-013  
**Fase:** Fase 3: Finanzas  
**Owner:** Kiara  
**Reviewer:** Jefferson
**Dependencias:** FE-003, Backend BE-015/BE-016

## Why

Gestionar obligaciones, ajustes y pagos manuales sin alterar históricos.

## In Scope

- generar/ajustar pendientes
- registrar pago completo y comprobante
- anular/devolver y generar recibo

## Out of Scope

- Capacidades pertenecientes a otros changes.
- Cambiar reglas compartidas sin actualizar `docs/`.

## Impact

- Proyecto: `frontend`.
- Capacidades: generar/ajustar pendientes, registrar pago completo y comprobante, anular/devolver y generar recibo.

## API Contract

- Declaracion contractual: consultar la fila `add-obligations-payments-administration` de [`../../API_CONTRACTS.md`](../../API_CONTRACTS.md).
- Aplicar la relacion indicada antes de implementar; si declara `Sin contrato HTTP`, no inventar endpoints.

## Source Documents

- `../../../../docs/domain/finance.md`
- `../../../../docs/domain/use-case-catalog.md`
