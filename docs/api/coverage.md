# Cobertura contractual de CienciasNET

Esta matriz registra la revisión del contrato frente a `docs/product/`, `docs/domain/`, `docs/security/` y
`docs/architecture/`. No sustituye los schemas ni los escenarios detallados de OpenAPI.

| Área documentada | Paquete propietario | Cobertura HTTP principal |
|---|---|---|
| Sesión, recuperación y cuenta autenticada | `API-AUTH` | `paths/auth.yaml` |
| Cuentas, roles, activación y vínculos familiares | `API-IAM`, `API-FAMILY` | `paths/identity-access.yaml`, `paths/family.yaml` |
| Periodos, grados, secciones, matrículas, cursos y cargas | `API-ACADEMIC` | `paths/academic.yaml` |
| Consentimiento, enrolamiento y servicio facial | `API-BIOMETRICS`, `API-FACIAL-INTERNAL` | `paths/biometrics.yaml`, `internal/facial-openapi.yaml` |
| Estaciones, cámaras, activación y captura | `API-STATIONS` | `paths/stations.yaml` |
| Asistencia de alumnos, jornada, alertas, anomalías y reportes | `API-STUDENT-ATTENDANCE` | `paths/student-attendance.yaml` |
| Asistencia docente, sustituciones, planilla y reportes | `API-TEACHER-ATTENDANCE` | `paths/teacher-attendance.yaml` |
| Conceptos, beneficios, obligaciones, pagos y consultas | `API-FINANCE-*` | `paths/finance-*.yaml` |
| Evaluaciones, resultados, publicación, ranking y reportes | `API-ASSESSMENTS`, `API-ACADEMIC-REPORTS` | `paths/assessments.yaml`, `paths/academic-reports.yaml` |
| Archivos, enlaces y materiales privados | `API-MATERIALS`, `API-FILES` | `paths/materials.yaml`, `paths/files.yaml` |
| Horarios, calendario y días no laborables | `API-SCHEDULES` | `paths/schedules.yaml` |
| Comunicados, segmentación, lectura y notificaciones | `API-COMMUNICATIONS` | `paths/communications.yaml` |
| Incidencias, seguimiento, derivación y Psicología | `API-INCIDENTS`, `API-PSYCHOLOGY` | `paths/incidents.yaml`, `paths/psychology.yaml` |

## Procesos internos deliberados

Los siguientes casos de uso no necesitan un endpoint independiente porque son reglas o efectos de una operación:

- Alternar ingreso, salida y reingreso al procesar una captura.
- Detectar duplicados, umbrales de faltas y faltas docentes.
- Calcular tardanzas, descuentos, pronto pago y rankings.
- Generar notificaciones y correos al registrar eventos, publicar resultados o comunicados.
- Aplicar autorización, auditoría, retención y almacenamiento privado.
- Seleccionar contexto de portal usando los roles de la sesión autenticada.

Si un proceso interno necesita posteriormente ejecución manual, consulta de estado o reintento explícito, deberá
proponerse como cambio contractual antes de implementarlo.

## Resultado de la revisión

El punto de entrada público cubre todos los módulos funcionales aprobados para V1 y la integración facial tiene contrato
interno separado. La aprobación para implementación sigue siendo por paquete: cada uno debe especializar sus respuestas,
errores de negocio, filtros y ejemplos antes de desbloquear sus changes relacionados.
