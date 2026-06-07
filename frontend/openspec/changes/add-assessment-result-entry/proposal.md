# Proposal: add-assessment-result-entry

**ID:** FE-015  
**Fase:** Fase 4: Evaluación y contenido  
**Owner:** Vincenzo  
**Reviewer:** Jefferson
**Dependencias:** FE-003, Backend BE-018/BE-019

## Why

Permitir configurar evaluaciones y cargar resultados procesados.

## In Scope

- evaluaciones para coordinación
- registro individual docente
- preview e importación masiva

## Out of Scope

- Capacidades pertenecientes a otros changes.
- Cambiar reglas compartidas sin actualizar `docs/`.

## Impact

- Proyecto: `frontend`.
- Capacidades: evaluaciones para coordinación, registro individual docente, preview e importación masiva.

## API Contract

- Declaracion contractual: consultar la fila `add-assessment-result-entry` de [`../../API_CONTRACTS.md`](../../API_CONTRACTS.md).
- Aplicar la relacion indicada antes de implementar; si declara `Sin contrato HTTP`, no inventar endpoints.

## Source Documents

- `../../../../docs/domain/academic.md`
- `../../../../docs/domain/use-case-catalog.md`
