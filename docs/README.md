# Documentación Compartida de CienciasNET

Guía de entorno reproducible: [`development-local.md`](development-local.md).

Esta carpeta es la fuente estable y compartida del producto. Explica **qué debe hacer CienciasNET** y las decisiones que
frontend y backend deben respetar.

## Orden de lectura

1. [`product/overview.md`](product/overview.md)
2. [`product/roles-and-permissions.md`](product/roles-and-permissions.md)
3. Documento del dominio relacionado en [`domain/`](domain/)
4. Documento técnico relacionado en [`architecture/`](architecture/)
5. Controles aplicables en [`security/`](security/)
6. Decisiones aceptadas en [`decisions/`](decisions/)

## Organización

| Carpeta | Contenido |
|---|---|
| `product/` | Objetivos, alcance, módulos, actores y permisos |
| `domain/` | Reglas de negocio y casos de uso compartidos |
| `architecture/` | Límites técnicos, contratos y decisiones de plataforma |
| `security/` | Autenticación, autorización, privacidad, biometría y operación |
| `decisions/` | ADRs que explican decisiones relevantes |
| `legacy/` | Documentos históricos; no son fuente autoritativa |

## Niveles de detalle

- Los documentos cortos funcionan como mapas de lectura y reglas principales.
- Las referencias detalladas conservan tablas, campos, estructuras, comandos, matrices y catálogos completos.

Referencias detalladas:

- [`architecture/detailed-system-design.md`](architecture/detailed-system-design.md)
- [`architecture/database-schema.md`](architecture/database-schema.md)
- [`architecture/deployment-runbook.md`](architecture/deployment-runbook.md)
- [`security/security-controls.md`](security/security-controls.md)
- [`domain/use-case-catalog.md`](domain/use-case-catalog.md)
- [`product/approved-requirements.md`](product/approved-requirements.md)
- [`product/business-model.md`](product/business-model.md)

## Cobertura del legacy

Todo el contenido previo fue trasladado también a documentos detallados dentro de la estructura autoritativa:

| Documento anterior | Destino nuevo detallado |
|---|---|
| `legacy/architecture.md` | `architecture/detailed-system-design.md` |
| `legacy/database.md` | `architecture/database-schema.md` |
| `legacy/deployment.md` | `architecture/deployment-runbook.md` |
| `legacy/security.md` | `security/security-controls.md` |
| `legacy/modules.md` | `domain/use-case-catalog.md` |
| `legacy/reunion-funcionalidades.md` | `product/approved-requirements.md` |
| `legacy/business-model.md` | `product/business-model.md` |

Los archivos de `legacy/` permanecen únicamente para comprobar procedencia. El desarrollo debe leer los destinos nuevos.

## Relación con OpenSpec

- `docs/` define reglas compartidas e independientes de implementación.
- `backend/openspec/` planificará migraciones, API, casos de uso e integraciones backend.
- `frontend/openspec/` planificará pantallas, navegación, API client y pruebas frontend.
- El frontend depende de specs backend aceptadas y contratos API publicados, nunca de changes backend activos.

Los casos de uso compartidos viven en `docs/domain/`. Los detalles de cómo implementarlos viven en el OpenSpec del
proyecto correspondiente.
