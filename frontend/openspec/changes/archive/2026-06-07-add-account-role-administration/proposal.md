# Proposal: add-account-role-administration

**ID:** FE-005  
**Fase:** Fase 1: Identidad y academia  
**Owner:** Kiara  
**Reviewer:** Jefferson
**Dependencias:** FE-002, FE-003, Backend BE-004

## Why

Permitir administrar cuentas y roles respetando restricciones.

## In Scope

- listado y formulario de cuentas
- activar/desactivar y asignar roles operativos
- estados sin permiso y confirmaciones

## Out of Scope

- Capacidades pertenecientes a otros changes.
- Cambiar reglas compartidas sin actualizar `docs/`.

## Impact

- Proyecto: `frontend`.
- Capacidades: listado y formulario de cuentas, activar/desactivar y asignar roles operativos, estados sin permiso y confirmaciones.

## API Contract

- Declaracion contractual: consultar la fila `add-account-role-administration` de [`../../API_CONTRACTS.md`](../../API_CONTRACTS.md).
- Aplicar la relacion indicada antes de implementar; si declara `Sin contrato HTTP`, no inventar endpoints.

## Source Documents

- `../../../../docs/domain/identity-access.md`
- `../../../../docs/product/roles-and-permissions.md`
