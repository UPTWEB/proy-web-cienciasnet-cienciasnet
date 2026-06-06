# Arquitectura General

CienciasNET es un monorepo con proyectos independientes coordinados por documentación compartida y contratos aceptados.

```text
React/Vite SPA ── HTTPS ──► Laravel API ──► PostgreSQL
      │                         │
      │                         ├──► Colas / correo
      │                         ├──► Archivos privados
      │                         ├──► Cloudflare R2 privado
      │                         └──► Servicio facial Python privado
      │
Estaciones web de asistencia
```

## Límites

- Laravel es la autoridad de reglas de negocio, permisos, auditoría y persistencia.
- React presenta información y valida experiencia de usuario, pero no decide reglas críticas.
- PostgreSQL conserva datos transaccionales e históricos.
- Python identifica rostros y devuelve confianza/prueba de vida; no registra asistencia ni accede a PostgreSQL.
- R2 conserva fotos de enrolamiento y evidencia excepcional, nunca video continuo.

## Proyectos independientes

- `backend/` tendrá su propio OpenSpec, reglas, specs y plan.
- `frontend/` tendrá su propio OpenSpec, reglas, specs y plan.
- Los contratos estables se publican desde specs backend aceptadas.
- Cambios cross-project declaran dependencias explícitas.

## Estructura objetivo del repositorio

```text
ciencias-net/
├── docs/
│   ├── product/
│   ├── domain/
│   ├── architecture/
│   ├── security/
│   ├── decisions/
│   └── legacy/
├── backend/
│   ├── app/Modules/
│   ├── database/migrations/
│   ├── routes/
│   ├── tests/
│   ├── openspec/
│   │   ├── EXECUTION_PLAN.md
│   │   ├── WORKFLOW.md
│   │   ├── NEW_FEATURE_FLOW.md
│   │   ├── changes/
│   │   └── specs/
│   ├── .codex/skills/
│   ├── Rules.md
│   └── AGENTS.md
├── frontend/
│   ├── src/
│   ├── tests/
│   ├── openspec/
│   │   ├── EXECUTION_PLAN.md
│   │   ├── WORKFLOW.md
│   │   ├── NEW_FEATURE_FLOW.md
│   │   ├── changes/
│   │   └── specs/
│   ├── .codex/skills/
│   ├── Rules.md
│   └── AGENTS.md
├── facial-service/
└── docker-compose.yml
```

## Orden de precedencia documental

Cuando exista diferencia:

1. ADR aceptado más reciente.
2. Regla específica del dominio.
3. Arquitectura o seguridad especializada.
4. Referencia detallada nueva.
5. Spec aceptada del proyecto para comportamiento ya implementado.
6. `docs/legacy/` solo como contexto histórico.

La spec aceptada debe reflejar las reglas compartidas; si no coincide, se abre un change para corregir documentación o
implementación, no se ignora la contradicción.

## Referencia detallada

Diagramas completos, contratos de ejemplo, matriz de roles, estructura modular y comunicación CORS/API están en
[`detailed-system-design.md`](detailed-system-design.md).
