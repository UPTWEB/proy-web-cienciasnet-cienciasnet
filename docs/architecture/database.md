# Arquitectura y Optimización de Base de Datos

PostgreSQL 16 es la fuente transaccional. Las migraciones pertenecen al backend y deben planificarse en su OpenSpec.

El catálogo completo de tablas, campos, tipos, relaciones y reglas se encuentra en
[`database-schema.md`](database-schema.md). Este documento define la estrategia de implementación y optimización.

## Modelo base

- Estructura académica: periodos, grados, secciones, matrículas, cursos y cargas académicas.
- Identidad separada entre `users` y perfiles de alumno, padre, docente o administrativo.
- Asistencia separa resumen diario, movimientos y anomalías.
- Finanzas separa obligaciones/deudas de movimientos reales de pago.
- Evaluaciones referencian carga académica y notas referencian matrícula.
- Estaciones web, cámaras y activaciones técnicas son entidades separadas.
- Historiales financieros, académicos, disciplinarios y de auditoría son inmutables.

## Integridad

- UUID para tablas de dominio; `audit_logs` puede usar `BIGSERIAL`.
- Foreign keys explícitas y acciones `ON DELETE` conservadoras.
- `UNIQUE` para invariantes como matrícula, nota por evaluación y referencias de pago.
- `CHECK` para montos positivos, confianza 0..1, rangos y relaciones exclusivas.
- Estados normalizados; usar enums de aplicación o constraints según facilidad de migración.
- Timestamps con zona horaria y fechas de negocio separadas.

## Índices iniciales

- Todas las foreign keys usadas en filtros o joins.
- Índices compuestos alineados con consultas reales:
  - asistencia por persona y fecha;
  - matrícula por alumno/periodo/estado;
  - carga por sección/curso/docente/vigencia;
  - deuda por alumno/estado/vencimiento;
  - nota por evaluación/matrícula;
  - evento facial por estación/fecha/estado.
- Índices parciales para pendientes, activos y anomalías abiertas.
- Índices únicos parciales para perfiles/consentimientos activos cuando aplique.

### Consultas que deben optimizarse desde el inicio

| Flujo | Consulta dominante | Estrategia |
|---|---|---|
| Puerta | Eventos y movimientos recientes por persona/estación | Índice compuesto por IDs y fecha descendente |
| Cierre de jornada | Matrículas activas sin ingreso | Índices parciales por estado/fecha y procesamiento por lotes |
| Panel familiar | Hijos vinculados y resúmenes recientes | Índices de tabla pivote y consultas paginadas |
| Finanzas | Deudas pendientes/vencidas por alumno y concepto | Índices parciales por estado y vencimiento |
| Notas | Resultados publicados por matrícula/periodo | Índices por matrícula, evaluación y estado |
| Incidencias | Casos abiertos asignados a TOE/Psicología | Índices parciales por estado/asignación |
| Auditoría | Acciones por modelo/usuario/fecha | Índices compuestos y política de archivado |

## Rendimiento y operación

- Listados siempre paginados; evitar `SELECT *`.
- Prevenir N+1 con cargas explícitas y pruebas de consultas.
- Usar transacciones para pagos, publicación de notas, cierres y operaciones masivas.
- Jobs para reportes, correos y procesos costosos.
- Medir con `EXPLAIN ANALYZE` antes de agregar índices especulativos.
- Revisar consultas lentas, bloat, autovacuum y crecimiento de auditoría.
- Considerar partición únicamente cuando mediciones reales lo justifiquen.

## Migraciones seguras

- Cada change documenta up/down, backfill, constraints e impacto.
- Evitar bloqueos largos: crear índices concurrentemente cuando corresponda.
- Agregar columnas nullable/backfill/constraint en pasos para tablas grandes.
- Nunca reescribir pagos, notas publicadas o auditoría histórica mediante migración sin plan explícito.

## Verificación de rendimiento

Antes de aceptar un change backend que agregue listados o procesos masivos:

1. Documentar consultas principales.
2. Ejecutar con datos representativos.
3. Revisar `EXPLAIN (ANALYZE, BUFFERS)`.
4. Confirmar ausencia de N+1.
5. Verificar que índices nuevos son utilizados.
6. Medir tiempo y memoria del job/lote.
7. Registrar resultado en `verification.md` del change.
