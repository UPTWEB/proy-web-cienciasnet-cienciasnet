# Proposal: add-finance-configuration-benefits

**ID:** FE-012  
**Fase:** Fase 3: Finanzas  
**Owner:** Kiara  
**Reviewer:** Jefferson
**Dependencias:** FE-003, Backend BE-014

## Why

Dar a Yanina control de configuración y beneficios futuros.

## In Scope

- conceptos, montos y fechas
- becas/descuentos/exoneraciones
- alcance, vigencia y acumulación

## Out of Scope

- Capacidades pertenecientes a otros changes.
- Cambiar reglas compartidas sin actualizar `docs/`.

## Impact

- Proyecto: `frontend`.
- Capacidades: conceptos, montos y fechas, becas/descuentos/exoneraciones, alcance, vigencia y acumulación.

## API Contract

- Declaracion contractual: consultar la fila `add-finance-configuration-benefits` de [`../../API_CONTRACTS.md`](../../API_CONTRACTS.md).
- Aplicar la relacion indicada antes de implementar; si declara `Sin contrato HTTP`, no inventar endpoints.

## Source Documents

- `../../../../docs/domain/finance.md`
- `../../../../docs/product/roles-and-permissions.md`
