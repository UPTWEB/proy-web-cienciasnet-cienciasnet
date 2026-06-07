# Proposal: add-student-attendance-events

**ID:** BE-010  
**Fase:** Fase 2: Facial y asistencia  
**Owner:** Jefferson  
**Reviewer:** Jefferson
**Dependencias:** BE-008, BE-009

## Why

Convertir capturas válidas en entradas, salidas y reingresos de alumnos.

## In Scope

- idempotencia y modo de cámara
- alternancia bidireccional
- tardanza, salidas de emergencia y notificaciones

## Out of Scope

- Capacidades pertenecientes a otros changes.
- Cambiar reglas compartidas sin actualizar `docs/`.

## Impact

- Proyecto: `backend`.
- Capacidades: idempotencia y modo de cámara, alternancia bidireccional, tardanza, salidas de emergencia y notificaciones.

## API Contract

- Declaracion contractual: consultar la fila `add-student-attendance-events` de [`../../API_CONTRACTS.md`](../../API_CONTRACTS.md).
- Aplicar la relacion indicada antes de implementar; si declara `Sin contrato HTTP`, no inventar endpoints.

## Source Documents

- `../../../../docs/domain/attendance.md`
- `../../../../docs/domain/use-case-catalog.md`
- `../../../../docs/architecture/facial-integration.md`
