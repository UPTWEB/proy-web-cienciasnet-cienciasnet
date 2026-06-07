# Flujo de Trabajo API-First

CienciasNET adopta API-First Design para permitir que frontend y backend trabajen en paralelo sobre un contrato HTTP
aprobado. Este flujo reduce bloqueos, pero no reemplaza la revisión, integración ni pruebas reales.

## Fuente de verdad

- Los contratos HTTP autoritativos viven en `docs/api/` y utilizan OpenAPI 3.x.
- El contrato se divide progresivamente en un archivo raíz y documentos reutilizables de paths, schemas, responses y
  parameters.
- OpenSpec organiza alcance y ejecución; no sustituye el contrato HTTP.
- Scribe genera documentación navegable desde la implementación backend y sirve como apoyo para detectar diferencias;
  no reemplaza ni sobrescribe el contrato aprobado.

## Gobierno del contrato

Durante la primera etapa, Jefferson diseña y aprueba directamente los contratos para evitar demoras. Más adelante, los
owners backend podrán proponerlos, pero Jefferson deberá aprobarlos antes de iniciar el desarrollo paralelo.

Un contrato aprobado:

- Habilita el inicio de los changes frontend y backend relacionados.
- No puede cambiarse silenciosamente.
- Debe describir éxito, autenticación, permisos, validaciones y conflictos de negocio aplicables.
- Debe mantenerse compatible durante la versión vigente o modificarse mediante una decisión explícita.

## Desarrollo paralelo

### Frontend

- Depende del contrato aprobado, no de un change backend activo.
- Construye tipos, API client y mocks alineados con OpenAPI.
- Los mocks deben cubrir éxito, datos vacíos, latencia, error inesperado, `401`, `403`, `404`, `409` y `422` cuando
  correspondan.
- Los mocks son una herramienta de desarrollo y prueba; deben retirarse o desactivarse en la integración y release.

### Backend

- Implementa rutas, validaciones, autorización, respuestas y errores conforme al contrato aprobado.
- Agrega pruebas positivas y negativas que demuestren el comportamiento acordado.
- Genera documentación Scribe para revisar la implementación y detectar diferencias respecto de OpenAPI.

## Integración y cierre

Antes de cerrar los changes relacionados:

1. Frontend se prueba contra el backend real sin mocks activos.
2. Backend, tipos frontend y escenarios simulados se comparan con el contrato aprobado.
3. Se ejecutan pruebas de éxito, validación, autenticación, autorización y conflictos aplicables.
4. Las diferencias se corrigen en la implementación o se aprueban formalmente como cambio de contrato.
5. La evidencia se registra en los `verification.md` correspondientes.

La validación automática del contrato se incorporará progresivamente. Hasta entonces, estas comprobaciones son
responsabilidad explícita de owners y reviewers.

## Vertical slicing

El `EXECUTION_PLAN.md` asigna un owner por change para implementar y verificar una capacidad completa. El contrato
aprobado es una dependencia previa compartida; no autoriza cerrar un change con pruebas pendientes o integración basada
únicamente en mocks.
