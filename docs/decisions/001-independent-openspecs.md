# ADR-001: OpenSpec Independiente por Proyecto

**Estado:** Aceptado

Backend y frontend tendrán `Rules.md`, `AGENTS.md`, `openspec/changes`, `openspec/specs` y `EXECUTION_PLAN.md`
independientes.

`docs/` conserva producto y reglas compartidas. Los contratos HTTP aprobados viven en `docs/api/`; el frontend depende
de esos contratos publicados, no de changes backend activos.
