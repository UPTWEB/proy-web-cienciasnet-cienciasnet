# Proposal: add-roles-permissions-account-management

**ID:** BE-004  
**Fase:** Fase 1: Identidad y estructura académica  
**Owner:** Jefferson  
**Reviewer:** André
**Dependencias:** BE-003

## Why

Delegar cuentas y roles sin entregar privilegios sensibles por accidente.

## In Scope

- CRUD y desactivación de cuentas
- roles operativos y permisos específicos
- restricciones de superadmin y gestor_usuarios

## Out of Scope

- Capacidades pertenecientes a otros changes.
- Cambiar reglas compartidas sin actualizar `docs/`.

## Impact

- Proyecto: `backend`.
- Capacidades: CRUD y desactivación de cuentas, roles operativos y permisos específicos, restricciones de superadmin y gestor_usuarios.

## API Contract

- Declaracion contractual: consultar la fila `add-roles-permissions-account-management` de [`../../API_CONTRACTS.md`](../../API_CONTRACTS.md).
- Aplicar la relacion indicada antes de implementar; si declara `Sin contrato HTTP`, no inventar endpoints.

## Source Documents

- `../../../../docs/product/roles-and-permissions.md`
- `../../../../docs/domain/identity-access.md`
- `../../../../docs/security/audit-and-operations.md`
