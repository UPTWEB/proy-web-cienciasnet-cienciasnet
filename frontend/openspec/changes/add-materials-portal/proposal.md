# Proposal: add-materials-portal

**ID:** FE-017  
**Fase:** Fase 4: Evaluación y contenido  
**Owner:** Kiara  
**Reviewer:** Jefferson
**Dependencias:** FE-002, Backend BE-021

## Why

Publicar y consultar materiales según carga/matrícula.

## In Scope

- gestión docente/coordinación
- lista por alumno y semana
- upload, enlace y descarga privada

## Out of Scope

- Capacidades pertenecientes a otros changes.
- Cambiar reglas compartidas sin actualizar `docs/`.

## Impact

- Proyecto: `frontend`.
- Capacidades: gestión docente/coordinación, lista por alumno y semana, upload, enlace y descarga privada.

## API Contract

- Declaracion contractual: consultar la fila `add-materials-portal` de [`../../API_CONTRACTS.md`](../../API_CONTRACTS.md).
- Aplicar la relacion indicada antes de implementar; si declara `Sin contrato HTTP`, no inventar endpoints.

## Source Documents

- `../../../../docs/domain/use-case-catalog.md`
- `../../../../docs/security/data-and-files.md`
