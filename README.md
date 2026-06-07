# CienciasNET

> Desarrollo local reproducible: [`docs/development-local.md`](docs/development-local.md)

Sistema web académico y administrativo para el Colegio Ciencias. Centraliza estructura académica, asistencia facial,
planilla docente, finanzas, evaluaciones, incidencias, Psicología, materiales, horarios y comunicaciones.

## Estado actual

El repositorio se encuentra en fase de definición y scaffolding. La documentación compartida nueva es autoritativa; los
documentos anteriores se conservan en `docs/legacy/` únicamente como referencia histórica.

Backend y frontend son proyectos independientes dentro del monorepo y ya cuentan con OpenSpec, reglas y planes de
ejecución separados. La Fase 0 de ambos planes prepara bases clonables antes de repartir features funcionales.

## Acceso Local de Prueba

Al ejecutar en entorno local, ten en cuenta las siguientes reglas y credenciales:

- **Dominio estricto (CORS):** Debes acceder al frontend **únicamente** a través de `http://localhost:5173`. Si usas `127.0.0.1`, el inicio de sesión fallará por políticas de seguridad.
- **Usuarios de prueba:** Si la base de datos se pobló correctamente usando los seeders (`php artisan migrate:fresh --seed`), puedes probar el sistema con contraseña `password` en estas cuentas:
  - `superadmin@example.test`
  - `gestor@example.test`
  - `coordinacion@example.test`
  - `docente@example.test`
  - `padre@example.test`
  - `alumno@example.test`
  - `toe@example.test`
  - `psicologia@example.test`
  - `auxiliar@example.test`
  - `administrativo@example.test`

## Arquitectura prevista

```text
React + TypeScript + Vite
        │ HTTPS / Sanctum SPA
        ▼
Laravel 13 API ──► PostgreSQL 16
        │
        ├──► Colas y correo
        ├──► Archivos privados / Cloudflare R2
        └──► Servicio facial Python privado
```

- Laravel es la autoridad de reglas, permisos, auditoría y persistencia.
- React ofrece portales responsive y estaciones web de asistencia.
- Python únicamente identifica rostros y devuelve confianza/prueba de vida.
- PostgreSQL conserva datos transaccionales e históricos.

## Estructura

```text
ciencias-net/
├── docs/                         # Fuente compartida y estable
│   ├── README.md                 # Navegación y reglas documentales
│   ├── product/                  # Visión, módulos, actores y permisos
│   ├── domain/                   # Reglas de negocio y casos de uso
│   ├── architecture/             # Backend, frontend, DB, facial y despliegue
│   ├── security/                 # Auth, privacidad, auditoría y operación
│   ├── decisions/                # ADRs aceptados
│   └── legacy/                   # Documentos históricos no autoritativos
├── backend/                      # Proyecto backend independiente
├── frontend/                     # Proyecto frontend independiente
├── facial-service/               # Servicio biométrico independiente (Python/FastAPI)
├── docker-compose.yml
└── README.md
```

## Documentación

Comenzar en [`docs/README.md`](docs/README.md).

Documentos principales:

- [Visión del producto](docs/product/overview.md)
- [Roles y permisos](docs/product/roles-and-permissions.md)
- [Reglas y casos de uso por dominio](docs/domain/)
- [Arquitectura general](docs/architecture/system.md)
- [Flujo API-First](docs/architecture/api-first-workflow.md)
- [Contratos API](docs/api/)
- [Diseño técnico detallado](docs/architecture/detailed-system-design.md)
- [Arquitectura frontend](docs/architecture/frontend.md)
- [Arquitectura y optimización PostgreSQL](docs/architecture/database.md)
- [Esquema completo de base de datos](docs/architecture/database-schema.md)
- [Seguridad compartida](docs/security/overview.md)
- [Controles de seguridad detallados](docs/security/security-controls.md)
- [Catálogo completo de casos de uso](docs/domain/use-case-catalog.md)
- [Decisiones aceptadas](docs/decisions/README.md)

## Frontend previsto

- React + TypeScript + Vite.
- React Router con layouts y rutas protegidas.
- Tailwind CSS y shadcn/ui.
- Phosphor Icons para React como librería de iconos.
- TanStack Query, Axios, React Hook Form y Zod.
- GSAP para animaciones complejas justificadas; CSS para transiciones comunes.
- Vitest, Testing Library y Playwright.

Las rutas protegidas mejoran la experiencia, pero el backend siempre vuelve a validar permisos y acceso al recurso.

## Backend previsto

- Laravel 13 API y PHP 8.3+.
- PostgreSQL 16 y migraciones Laravel.
- Sanctum: sesión/cookie para personas y credenciales técnicas para integraciones.
- Spatie Laravel Permission y Policies.
- Pest, colas Laravel y contrato API versionado.

## OpenSpec por proyecto

Cada proyecto administra su propio flujo:

```text
backend/
├── Rules.md
├── AGENTS.md
└── openspec/

frontend/
├── Rules.md
├── AGENTS.md
└── openspec/
```

Cada proyecto planificará y archivará sus propias capacidades. El frontend dependerá de documentación compartida,
contratos API aprobados y publicados, nunca de changes backend activos.

- [Plan backend](backend/openspec/EXECUTION_PLAN.md)
- [Plan frontend](frontend/openspec/EXECUTION_PLAN.md)

### Inicio recomendado

1. Ejecutar en paralelo `BE-001`, `OPS-001` y `FE-001`.
2. Continuar con convenciones API, sistema visual y calidad de ambos proyectos.
3. Verificar que un clon limpio pueda levantar, probar y compilar toda la base.
4. Recién entonces asignar e iniciar features funcionales de la Fase 1.

## Decisiones clave

- El Promotor conserva `superadmin` con acceso completo.
- Permisos financieros, planilla y estaciones se asignan a cuentas específicas.
- Padres y alumnos tienen acceso de consulta limitado a recursos vinculados.
- La asistencia utiliza estaciones web activadas sin compartir sesiones personales.
- Una PC puede operar varias cámaras.
- No existen pagos parciales en V1.
- Deudas pagadas y movimientos históricos son inmutables.
- Archivos y biometría permanecen privados.
