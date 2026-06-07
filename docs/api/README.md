# Contratos API

Esta carpeta contiene los contratos HTTP autoritativos de CienciasNET en formato OpenAPI 3.x. Un contrato aprobado aquí
es la fuente de verdad compartida entre frontend y backend.

El gobierno, catálogo contractual y flujo completo de diseño están definidos en
[`../architecture/api-first-workflow.md`](../architecture/api-first-workflow.md).

## Estado actual

`openapi.yaml` y `internal/facial-openapi.yaml` contienen el catálogo contractual inicial de toda la aplicación. Fijan
operaciones, actores, permisos, cuerpos de solicitud tipados, respuestas, errores y límites de integración.

Todos los comandos de escritura del catálogo público tienen un schema de solicitud específico y cerrado. Los envelopes
comunes `ResourceResponse`, `CollectionResponse` y `PaginatedResponse` fijan la forma transversal de las respuestas,
pero sus representaciones `data` deben especializarse por paquete antes de aprobar su implementación.

Un paquete solo se considera aprobado cuando sus solicitudes y representaciones de respuesta son específicas, sus
escenarios de error están revisados y Jefferson confirma su diseño.

## Gobierno inicial

- Durante la primera etapa, Jefferson diseña y aprueba directamente los contratos para evitar demoras de coordinación.
- Más adelante, los owners backend podrán proponer contratos, pero Jefferson deberá aprobarlos antes de iniciar el
  desarrollo paralelo.
- Un contrato no aprobado se considera propuesta y no habilita la implementación frontend o backend.
- Un contrato aprobado no se modifica silenciosamente. Todo cambio debe revisarse y comunicarse a ambos proyectos.

## Estructura modular

```text
docs/api/
├── openapi.yaml
├── internal/
│   └── facial-openapi.yaml
├── paths/
│   └── <paquete>.yaml
├── request-bodies/
│   └── <paquete>.yaml
├── schemas/
│   ├── common.yaml
│   └── <paquete>.yaml
├── responses/
│   └── common.yaml
├── parameters/
│   └── common.yaml
└── security-schemes/
    └── common.yaml
```

`openapi.yaml` es un índice liviano y el único punto de entrada público. Cada paquete contractual posee sus paths,
request bodies y schemas. Los componentes transversales permanecen en archivos `common.yaml`.

La revisión de cobertura funcional está registrada en [`coverage.md`](coverage.md).

## Contenido mínimo

Cada operación debe describir, cuando aplique:

- Ruta, método, autenticación y permisos.
- Parámetros, request body y respuestas exitosas.
- Errores esperados `401`, `403`, `404`, `409` y `422`.
- Formato de errores, paginación, estados vacíos e idempotencia.

## Relación con las herramientas

- OpenSpec organiza alcance, requisitos, tareas y verificación de cada change.
- OpenAPI en `docs/api/` define el contrato HTTP aprobado.
- Scribe genera `backend/public/docs/openapi.yaml` y documentación navegable desde la implementación backend. Ese
  archivo es un artefacto generado para detectar diferencias y no sustituye ni sobrescribe el contrato de `docs/api/`.
- Los tipos, mocks y pruebas frontend deben alinearse con el contrato aprobado.

La validación automática de OpenAPI, tipos, mocks e implementación se incorporará progresivamente. Mientras no esté
automatizada, owner y reviewer deben registrar la comprobación manual en `verification.md`.

Validación estructural actual:

```bash
npx --yes @redocly/cli lint docs/api/openapi.yaml docs/api/internal/facial-openapi.yaml --config docs/api/redocly.yaml
```

Bundle autocontenido para herramientas que no resuelven referencias externas:

```bash
npx --yes @redocly/cli bundle docs/api/openapi.yaml --output docs/api/dist/openapi.yaml --config docs/api/redocly.yaml
```

`docs/api/dist/` es generado y no se edita manualmente.
