# Arquitectura Frontend

## Plataforma prevista

Si no existe una restricción técnica posterior, el frontend será una SPA con:

| Área | Elección |
|---|---|
| Base | React + TypeScript + Vite |
| Rutas | React Router con layouts y rutas protegidas |
| Estilos | Tailwind CSS |
| Componentes | shadcn/ui como base editable y accesible |
| Iconos | Phosphor Icons |
| Datos remotos | TanStack Query |
| Cliente HTTP | Axios con `withCredentials` |
| Formularios | React Hook Form + Zod |
| Estado local/global | Estado local primero; Zustand solo para estado transversal necesario |
| Gráficas | Recharts |
| Animaciones | CSS/transiciones primero; GSAP para secuencias complejas justificadas |
| Pruebas | Vitest, Testing Library y Playwright |

## Organización

```text
src/
├── app/             # Providers, router, layouts y configuración
├── components/ui/   # Componentes shadcn adaptados
├── components/shared/
├── features/        # Módulos por dominio
├── lib/             # API client y utilidades
├── hooks/
└── types/
```

### Estructura frontend esperada

```text
frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── providers/
│   │   │   ├── AuthProvider.tsx
│   │   │   └── QueryProvider.tsx
│   │   ├── layouts/
│   │   │   ├── PublicLayout.tsx
│   │   │   ├── PortalLayout.tsx
│   │   │   └── StationLayout.tsx
│   │   └── router/
│   │       ├── index.tsx
│   │       ├── ProtectedRoute.tsx
│   │       └── PermissionRoute.tsx
│   ├── components/
│   │   ├── ui/                  # shadcn/ui adaptado
│   │   └── shared/
│   │       ├── AppSidebar.tsx
│   │       ├── DataTable.tsx
│   │       ├── EmptyState.tsx
│   │       └── PermissionDenied.tsx
│   ├── features/
│   │   ├── auth/
│   │   ├── usuarios/
│   │   ├── academico/
│   │   ├── asistencia/
│   │   ├── estaciones/
│   │   ├── finanzas/
│   │   ├── incidencias/
│   │   ├── psicologia/
│   │   ├── materiales/
│   │   ├── horarios/
│   │   └── comunicados/
│   ├── hooks/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── queryClient.ts
│   │   └── permissions.ts
│   ├── styles/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   └── e2e/
├── openspec/
│   ├── EXECUTION_PLAN.md
│   ├── WORKFLOW.md
│   ├── NEW_FEATURE_FLOW.md
│   ├── changes/
│   └── specs/
├── Rules.md
├── AGENTS.md
├── package.json
└── vite.config.ts
```

Cada feature puede contener:

```text
features/finanzas/
├── api/
├── components/
├── hooks/
├── pages/
├── schemas/
├── types/
└── tests/
```

## Navegación y autorización

- Las rutas protegidas verifican sesión y permisos para mejorar UX.
- El backend siempre vuelve a autorizar; ocultar una ruta no es seguridad.
- Cada contexto de rol tiene layout y navegación permitida.
- Una cuenta con varios roles selecciona contexto sin crear otra sesión.
- Las estaciones web de asistencia usan rutas y sesiones técnicas separadas del portal humano.

### Familias de rutas

```text
/login                         # Público
/recuperar-contrasena          # Público
/portal/*                      # Cuenta humana autenticada
/portal/familia/*              # Contexto padre
/portal/alumno/*               # Contexto alumno
/portal/docente/*              # Contexto docente
/admin/*                       # Personal con permisos operativos
/estacion/activar              # Activación mediante código/QR
/estacion/captura              # Sesión técnica limitada
```

Una ruta protegida valida sesión, contexto y permiso antes de renderizar. Una respuesta backend `401` redirige a login;
`403` muestra estado sin permiso; `404` no debe revelar recursos ajenos.

## Sistema visual

- shadcn/ui aporta componentes consistentes, pero se adaptan a la identidad del colegio.
- Lucide es la librería única de iconos para evitar mezclas visuales.
- Todas las pantallas incluyen estados loading, vacío, error, éxito y sin permiso.
- Diseño responsive desde móvil hasta escritorio.
- Accesibilidad mínima WCAG AA: teclado, foco visible, contraste, labels y reducción de movimiento.
- GSAP solo se usa para animaciones que aporten comprensión; debe respetar `prefers-reduced-motion` y no bloquear la UI.

### Componentes base esperados

- Formularios, diálogos, selectores, calendarios, tablas, badges, tabs y tooltips desde shadcn/ui.
- `DataTable` compartida con paginación servidor, filtros, orden y estados.
- Confirmaciones explícitas para cierres, publicación, anulaciones y cambios masivos.
- Toasts para resultados breves; errores importantes permanecen visibles en pantalla.
- Skeletons para cargas iniciales y spinners solo para acciones puntuales.
- Animaciones GSAP limitadas a onboarding, transiciones complejas o visualización; no animar tablas extensas.

## Rendimiento

- División de código por ruta/feature.
- Lazy loading de módulos pesados.
- Caché e invalidación explícita con TanStack Query.
- Tablas paginadas y virtualizadas cuando el volumen lo requiera.
- Imágenes optimizadas y carga diferida.
- Evitar almacenar datos sensibles o tokens en `localStorage`.

## Pruebas frontend

- Vitest para utilidades, schemas y hooks.
- Testing Library para componentes y permisos visuales.
- Playwright para login, selección de contexto, rutas protegidas y flujos críticos.
- Pruebas responsive para móvil, tablet y escritorio.
- Auditoría básica de accesibilidad y `prefers-reduced-motion`.
