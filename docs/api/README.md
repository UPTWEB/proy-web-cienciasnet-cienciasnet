# Contratos API

Esta carpeta contiene los contratos HTTP autoritativos de CienciasNET en formato OpenAPI 3.x. Un contrato aprobado aquí
es la fuente de verdad compartida entre frontend y backend.

## Gobierno inicial

- Durante la primera etapa, Jefferson diseña y aprueba directamente los contratos para evitar demoras de coordinación.
- Más adelante, los owners backend podrán proponer contratos, pero Jefferson deberá aprobarlos antes de iniciar el
  desarrollo paralelo.
- Un contrato no aprobado se considera propuesta y no habilita la implementación frontend o backend.
- Un contrato aprobado no se modifica silenciosamente. Todo cambio debe revisarse y comunicarse a ambos proyectos.

## Estructura prevista

```text
docs/api/
├── openapi.yaml
├── paths/
├── schemas/
├── responses/
└── parameters/
```

La estructura se creará progresivamente al definir los primeros contratos. No deben agregarse endpoints o esquemas
hipotéticos solo para completar carpetas.

## Contenido mínimo

Cada operación debe describir, cuando aplique:

- Ruta, método, autenticación y permisos.
- Parámetros, request body y respuestas exitosas.
- Errores esperados `401`, `403`, `404`, `409` y `422`.
- Formato de errores, paginación, estados vacíos e idempotencia.

## Relación con las herramientas

- OpenSpec organiza alcance, requisitos, tareas y verificación de cada change.
- OpenAPI en `docs/api/` define el contrato HTTP aprobado.
- Scribe genera documentación navegable desde la implementación backend y ayuda a detectar diferencias.
- Los tipos, mocks y pruebas frontend deben alinearse con el contrato aprobado.

La validación automática de OpenAPI, tipos, mocks e implementación se incorporará progresivamente. Mientras no esté
automatizada, owner y reviewer deben registrar la comprobación manual en `verification.md`.
