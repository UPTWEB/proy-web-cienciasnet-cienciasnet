# Proposal: add-production-deployment-backups

**ID:** OPS-003  
**Fase:** Fase 6: Operación y release  
**Owner:** André  
**Reviewer:** Jefferson  
**Dependencias:** OPS-002, BE-008

## Why

Desplegar y recuperar el sistema completo de forma documentada.

## In Scope

- Nginx, Laravel, worker, scheduler, PostgreSQL, frontend y Python
- backups cifrados fuera del VPS
- restauración RPO 24h/RTO 4h

## Out of Scope

- Capacidades pertenecientes a otros changes.
- Cambiar reglas compartidas sin actualizar `docs/`.

## Impact

- Proyecto: `backend`.
- Capacidades: Nginx, Laravel, worker, scheduler, PostgreSQL, frontend y Python, backups cifrados fuera del VPS, restauración RPO 24h/RTO 4h.

## API Contract

- Declaracion contractual: consultar la fila `add-production-deployment-backups` de [`../../API_CONTRACTS.md`](../../API_CONTRACTS.md).
- Aplicar la relacion indicada antes de implementar; si declara `Sin contrato HTTP`, no inventar endpoints.

## Source Documents

- `../../../../docs/architecture/deployment.md`
- `../../../../docs/architecture/deployment-runbook.md`
