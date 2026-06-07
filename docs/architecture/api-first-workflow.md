# Flujo API-First de CienciasNET

CienciasNET utiliza API-First Design para definir antes de implementar cómo se comunican frontend, backend e
integraciones. El objetivo es permitir desarrollo paralelo con una fuente de verdad compartida, sin convertir el
contrato en documentación desconectada de las reglas de negocio.

Este documento gobierna toda la aplicación. Los contratos concretos vivirán en `docs/api/` y los changes de OpenSpec
deberán enlazar únicamente los contratos que implementan o consumen.

## 1. Fuentes de verdad

Cada nivel responde una pregunta diferente:

| Fuente | Define |
|---|---|
| `docs/product/` | Alcance, módulos, actores y permisos generales |
| `docs/domain/` | Reglas de negocio y casos de uso compartidos |
| `docs/security/` | Autenticación, autorización, privacidad, auditoría y operación |
| `docs/architecture/` | Límites técnicos y decisiones de integración |
| `docs/api/` | Contratos HTTP OpenAPI aprobados |
| `backend/openspec/` | Cómo backend implementará y verificará una capacidad |
| `frontend/openspec/` | Cómo frontend consumirá el contrato y entregará la experiencia |

Si existe una contradicción, primero se corrige la fuente superior correspondiente. Un contrato OpenAPI no puede
debilitar una regla de dominio, permiso o control de seguridad.

## 2. Alcance contractual

Se definen contratos explícitos para:

- **SPA React ↔ Laravel:** API HTTP pública bajo `/api/v1`.
- **Estación web ↔ Laravel:** API HTTP con sesión técnica limitada, separada del portal humano.
- **Laravel ↔ servicio facial Python:** API HTTP interna, autenticada y no accesible desde el navegador.
- **Laravel ↔ archivos privados:** respuestas de descarga o URLs firmadas siempre autorizadas por Laravel.

No se definen como contratos HTTP:

- Tablas, migraciones, índices o modelos internos.
- Jobs, eventos internos o colas que no crucen un límite de sistema.
- Detalles visuales, rutas React o estructura interna de componentes.
- Operación Docker, backups y despliegue, salvo sus health checks observables.

Un change exclusivamente de base de datos u operación puede declarar **“sin contrato HTTP”**, justificándolo en su
`design.md`. Si modifica comportamiento visible o una integración, sí requiere contrato.

## 3. Gobierno inicial

Durante la primera etapa:

1. Jefferson diseña y aprueba directamente los contratos.
2. Cada contrato parte de reglas existentes en `docs/`, no del código o pantalla deseada.
3. Después de aprobarse, habilita el trabajo paralelo frontend/backend relacionado.
4. Un contrato aprobado no cambia silenciosamente.

Más adelante, los owners backend podrán proponer contratos. Jefferson conservará la aprobación antes de desbloquear
implementación o consumo frontend.

## 4. Catálogo contractual de la aplicación

Cada paquete tendrá un identificador estable. Un paquete puede contener varios archivos OpenAPI, pero representa un
límite funcional coherente.

| ID | Paquete contractual | Alcance principal | Changes backend relacionados | Changes frontend relacionados |
|---|---|---|---|---|
| `API-CORE` | Convenciones transversales | Health, errores, paginación, filtros, idempotencia y seguridad común | `BE-002`, `BE-027`, `BE-028` | `FE-003`, `FE-022`, `FE-023` |
| `API-AUTH` | Sesión humana | Login, sesión, logout y recuperación de contraseña | `BE-003` | `FE-003` |
| `API-IAM` | Cuentas, roles y permisos | Administración de cuentas, activación y roles operativos | `BE-004` | `FE-005` |
| `API-FAMILY` | Vínculos y portal familiar | Vínculos padre-alumno, selector de hijo y resumen permitido | `BE-005` | `FE-006`, `FE-008` |
| `API-ACADEMIC` | Estructura académica | Periodos, grados, secciones, matrículas, cursos y cargas | `BE-006` | `FE-007`, `FE-008` |
| `API-BIOMETRICS` | Consentimiento y enrolamiento | Estado biométrico, consentimiento, enrolamiento y revocación | `BE-007` | `FE-009A` |
| `API-FACIAL-INTERNAL` | Integración facial privada | Calidad, prueba de vida, identificación y confianza | `BE-008` | Sin consumidor frontend |
| `API-STATIONS` | Estaciones biométricas | Administración, activación, sesión técnica, cámaras y captura | `BE-009` | `FE-009`, `FE-009A` |
| `API-STUDENT-ATTENDANCE` | Asistencia de alumnos | Eventos, historial, cierre, faltas, alertas y anomalías | `BE-010`, `BE-011` | `FE-010`, `FE-008` |
| `API-TEACHER-ATTENDANCE` | Asistencia docente y planilla | Sesiones, excepciones, tarifas, ajustes y liquidaciones | `BE-012`, `BE-013` | `FE-011` |
| `API-FINANCE-CONFIG` | Configuración financiera | Conceptos, montos, vencimientos y beneficios | `BE-014` | `FE-012` |
| `API-FINANCE-OPERATIONS` | Obligaciones y pagos | Generación, ajustes, pagos, anulaciones, devoluciones y recibos | `BE-015`, `BE-016` | `FE-013` |
| `API-FINANCE-QUERIES` | Consultas financieras | Estado de cuenta, morosos, caja y recordatorios | `BE-017` | `FE-014`, `FE-008` |
| `API-ASSESSMENTS` | Evaluaciones y resultados | Evaluaciones, carga individual/masiva y validación previa | `BE-018`, `BE-019` | `FE-015` |
| `API-ACADEMIC-REPORTS` | Publicación y reportes | Publicación, corrección, ranking, notas y reportes | `BE-020` | `FE-016`, `FE-008` |
| `API-MATERIALS` | Materiales privados | Publicación, consulta, descarga y administración | `BE-021`, `BE-026` | `FE-017`, `FE-008` |
| `API-SCHEDULES` | Horarios y calendario | Horarios, sesiones, eventos y días no laborables | `BE-022` | `FE-018`, `FE-008` |
| `API-COMMUNICATIONS` | Comunicados y notificaciones | Publicación, segmentación, lectura y notificaciones | `BE-023` | `FE-019`, `FE-008` |
| `API-INCIDENTS` | Incidencias y seguimiento | Registro, derivación, seguimiento, archivos y resolución | `BE-024` | `FE-020` |
| `API-PSYCHOLOGY` | Psicología confidencial | Derivaciones y atenciones privadas | `BE-025` | `FE-021` |
| `API-FILES` | Archivos privados compartidos | Subida, descarga autorizada, metadatos y expiración | `BE-026` | Consumido por features aplicables |

Los changes `DB-*` preparan persistencia y normalmente declaran “sin contrato HTTP”. Los changes `OPS-*` solo requieren
contrato cuando exponen health checks o comportamiento observable nuevo.

## 5. Organización de `docs/api/`

La estructura crecerá por paquetes contractuales, reutilizando componentes comunes:

```text
docs/api/
├── README.md
├── openapi.yaml                    # SPA/estaciones ↔ Laravel
├── internal/
│   └── facial-openapi.yaml         # Laravel ↔ servicio facial
├── paths/
│   ├── auth.yaml
│   ├── identity-access.yaml
│   ├── academic.yaml
│   └── ...
├── request-bodies/
│   ├── common.yaml
│   ├── academic.yaml
│   └── ...
├── schemas/
│   ├── common.yaml
│   ├── identity-access.yaml
│   ├── academic.yaml
│   └── ...
├── responses/
│   └── common.yaml
├── parameters/
│   └── common.yaml
└── security-schemes/
    └── common.yaml
```

Reglas:

- `openapi.yaml` es el punto de entrada aprobado para consumidores React y estaciones web.
- `openapi.yaml` funciona como índice de `$ref`; los contratos se editan en el archivo del paquete propietario.
- Se mantiene un archivo por paquete en `paths/`, `request-bodies/` y `schemas/` para reducir conflictos entre ramas.
- Un bundle autocontenido puede generarse en `docs/api/dist/`, pero nunca se edita ni reemplaza la fuente modular.
- `internal/facial-openapi.yaml` define únicamente la integración privada Laravel ↔ servicio facial.
- Se usará inicialmente OpenAPI `3.0.3`, compatible con la configuración actual de Scribe.
- Los nombres técnicos del contrato estarán en inglés consistente; descripciones y mensajes pueden estar en español.
- Cada operación tendrá `operationId` único y estable.
- Se reutilizarán schemas y respuestas comunes mediante `$ref`.
- Los envelopes comunes pueden reutilizarse, pero el schema contenido en `data` debe ser específico del paquete antes
  de aprobar su implementación.
- Los cuerpos de solicitud deben ser cerrados con `additionalProperties: false`, salvo una excepción documentada y
  aprobada.
- No se crearán endpoints o schemas hipotéticos para completar carpetas.

## 6. Convenciones HTTP globales

### Rutas y recursos

- La API pública se versiona bajo `/api/v1`.
- `/sanctum/csrf-cookie` es la excepción de infraestructura necesaria para iniciar sesiones Sanctum stateful.
- Las rutas usan sustantivos plurales en `kebab-case`.
- Los recursos de dominio exponen UUID, nunca IDs secuenciales.
- Los recursos vinculados se autorizan por Policy; conocer un UUID no concede acceso.
- Las acciones de dominio que no encajan como CRUD usan subrecursos o acciones explícitas, por ejemplo
  `/assessments/{assessment}/publication` o `/payment-obligations/{obligation}/adjustments`.
- Las eliminaciones físicas no se ofrecen para historial auditable; se usan desactivación, archivo, revocación o
  movimientos compensatorios.

### Respuestas

Recurso o resultado único:

```json
{
  "data": {}
}
```

Colección paginada:

```json
{
  "data": [],
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 1,
    "per_page": 20,
    "to": 1,
    "total": 1
  },
  "links": {
    "first": "string",
    "last": "string",
    "prev": null,
    "next": null
  }
}
```

- Los listados son paginados desde servidor.
- Filtros, búsqueda, orden y límites permitidos deben declararse explícitamente.
- Fechas usan `YYYY-MM-DD`; timestamps usan ISO 8601 con zona horaria.
- Montos monetarios se representan como strings decimales y nunca como `float`.
- Estados y tipos finitos se documentan como enums.
- Cada operación declara su código de éxito: `200` consulta/acción, `201` creación, `202` proceso aceptado o `204`
  acción exitosa sin cuerpo.

### Errores

Todos los errores API usan:

```json
{
  "error": {
    "code": "stable_machine_code",
    "message": "Mensaje seguro para la persona usuaria.",
    "fields": {}
  }
}
```

| HTTP | Uso esperado |
|---|---|
| `400` | Solicitud mal formada que no corresponde a validación de campos |
| `401` | Sesión ausente, expirada o revocada |
| `403` | Actor autenticado sin permiso |
| `404` | Recurso inexistente o no visible para el actor |
| `409` | Conflicto de estado o regla de negocio |
| `419` | CSRF expirado en sesión stateful |
| `422` | Validación de campos |
| `429` | Rate limit |
| `500` | Error inesperado sin detalles sensibles |

Cada operación debe declarar solo los errores aplicables y códigos de máquina específicos para conflictos relevantes.

### Autenticación y actores

- El portal humano utiliza Sanctum SPA stateful y CSRF.
- La estación web utiliza una sesión técnica separada y limitada.
- El servicio facial utiliza credencial interna propia.
- Los contratos declaran el esquema de seguridad y permisos requeridos.
- El frontend puede ocultar acciones por UX, pero el backend siempre autoriza nuevamente.
- Un `404` puede utilizarse para no revelar la existencia de recursos ajenos.

### Idempotencia, concurrencia y auditoría

- Capturas, pagos, generación masiva, importaciones y otras operaciones reintentables declaran `Idempotency-Key`.
- Los contratos deben indicar si repetir una solicitud devuelve el resultado original.
- Las acciones sensibles o irreversibles deben declarar conflictos `409` por estado inválido.
- Cuando exista riesgo de edición concurrente, el contrato deberá definir una estrategia explícita antes de implementar.
- El contrato identifica operaciones auditables, pero nunca expone contenido privado o secretos en auditoría.
- Las respuestas deben propagar un identificador de correlación cuando se incorpore el control de observabilidad.

### Archivos, reportes y procesos pesados

- Subidas declaran MIME, tamaño máximo y propósito permitido.
- Descargas privadas pasan por autorización Laravel o URL firmada de corta duración.
- Embeddings, secretos y notas psicológicas privadas nunca aparecen en contratos destinados a actores no autorizados.
- PDF, exportaciones e importaciones deben declarar su content type y errores.
- Si una operación supera tiempos HTTP razonables, el contrato definirá job, estado consultable y resultado; no se
  asumirá procesamiento síncrono indefinido.

## 7. Escenarios obligatorios por operación

Antes de aprobar una operación se evalúa esta matriz:

| Escenario | Aplicación |
|---|---|
| Éxito principal | Siempre |
| Datos vacíos | Listados, paneles y reportes |
| `401` | Operaciones autenticadas |
| `403` | Operaciones con roles o permisos |
| `404` | Recursos por UUID o recursos vinculados |
| `409` | Cambios de estado, duplicados y reglas de negocio |
| `422` | Entrada, filtros, archivos o formularios |
| `429` | Login, activación, captura y operaciones sensibles |
| Reintento/idempotencia | Capturas, pagos, importaciones y procesos masivos |
| Latencia/error inesperado | Todos los consumidores frontend |
| Privacidad/autorización negativa | Familia, finanzas, biometría, incidencias y Psicología |

Los mocks frontend deben representar los escenarios aplicables. Las pruebas backend deben demostrar el contrato y sus
límites de autorización.

## 8. Diseño y aprobación de un paquete

Para cada paquete del catálogo:

1. Releer documentos de producto, dominio, arquitectura, seguridad y esquema relacionados.
2. Identificar actores, permisos, recursos, estados, invariantes y casos de uso.
3. Diseñar operaciones y schemas mínimos sin copiar directamente tablas de base de datos.
4. Documentar respuestas y escenarios obligatorios.
5. Revisar privacidad, autorización, auditoría, idempotencia y compatibilidad.
6. Aprobar el paquete e incorporarlo a `docs/api/openapi.yaml`.
7. Enlazar el ID contractual y archivos concretos desde los changes backend/frontend relacionados.

Un paquete se considera aprobado cuando Jefferson confirma que:

- Cubre los casos de uso requeridos sin exponer datos innecesarios.
- Respeta roles, permisos y recursos vinculados.
- Sus schemas, errores y estados son suficientes para backend, frontend y pruebas.
- No contradice otros paquetes ni reglas compartidas.
- No depende de `MutationPayload`, `ReasonedMutationPayload` ni `MultipartMutationPayload` genéricos.
- No depende de una representación `Resource` genérica para los datos que consumirá frontend.

## 9. Uso desde OpenSpec

Cada change activo deberá declarar en `proposal.md` o `design.md`:

```text
Contratos API:
- API-IAM
- docs/api/paths/identity-access.yaml
- docs/api/schemas/identity/account.yaml
```

También debe indicar una de estas relaciones:

- **Implementa:** backend entrega operaciones del contrato.
- **Consume:** frontend usa operaciones, tipos y mocks del contrato.
- **Modifica:** propone un cambio contractual que requiere aprobación.
- **Sin contrato HTTP:** change interno con justificación.

Las tareas y `verification.md` deberán comprobar únicamente el subconjunto contractual relacionado. No se cerrará un
change con contrato pendiente, mocks definitivos, diferencias conocidas o pruebas de autorización faltantes.

## 10. Desarrollo paralelo

### Frontend

- Comienza después de aprobarse el contrato requerido.
- Construye tipos, cliente y mocks desde OpenAPI.
- Implementa éxito, carga, vacío, permisos, validación, conflictos, latencia y error inesperado.
- En integración y release prueba contra backend real sin mocks activos.

### Backend

- Implementa rutas, validaciones, Policies, Resources y errores conforme al contrato.
- Agrega pruebas positivas, negativas, de permisos e idempotencia aplicables.
- Genera Scribe en `backend/public/docs/` como documentación navegable de la implementación.
- Compara Scribe y comportamiento real contra OpenAPI; Scribe no sobrescribe el contrato aprobado.

## 11. Cambios y compatibilidad

- Un cambio antes de aprobación puede editarse libremente.
- Un cambio aprobado debe identificar consumidores afectados.
- Agregar campos opcionales o nuevas operaciones suele ser compatible.
- Eliminar campos, cambiar tipos, hacer obligatorio un campo opcional o alterar semántica es incompatible.
- Los cambios incompatibles requieren decisión explícita de versión o migración coordinada.
- Las diferencias encontradas en integración se corrigen en implementación o se aprueban como cambio contractual; nunca
  se aceptan silenciosamente.

## 12. Integración y cierre

Antes de cerrar changes que implementan o consumen un contrato:

1. El contrato aprobado valida estructuralmente y resuelve todos sus `$ref`.
2. Backend demuestra respuestas, errores, permisos e idempotencia aplicables.
3. Frontend demuestra tipos, mocks y estados completos.
4. Frontend se prueba contra backend real sin mocks activos.
5. Scribe y comportamiento real se comparan con OpenAPI.
6. Las diferencias se corrigen o aprueban formalmente.
7. La evidencia se registra en los `verification.md` relacionados.

La automatización de lint, validación, generación de tipos, mocks y pruebas contractuales se incorporará
progresivamente. Hasta entonces, estas comprobaciones son responsabilidad explícita de owners y reviewers.
