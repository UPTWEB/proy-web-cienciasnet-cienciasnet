# Roles y Permisos

Los roles expresan responsabilidades generales. Los permisos sensibles se asignan a cuentas específicas y no se entregan
automáticamente a todas las personas de un rol.

| Rol | Responsabilidad |
|---|---|
| `superadmin` | Promotor con acceso completo, incluida Psicología |
| `gestor_usuarios` | Gestión delegada de cuentas y roles operativos |
| `toe` | Gestión y seguimiento de incidencias, derivaciones y comunicación |
| `psicologia` | Atenciones y notas psicológicas confidenciales |
| `auxiliar` | Supervisión de asistencia de alumnos y registro inicial de incidencias |
| `coordinador_academico` | Periodos, grados, secciones, cursos, cargas, horarios y evaluaciones |
| `administrativo` | Rol administrativo general; no concede permisos sensibles por sí solo |
| `docente` | Horario, materiales y notas de cargas académicas asignadas |
| `padre` | Consulta de información de hijos vinculados |
| `alumno` | Consulta de información propia |

## Permisos específicos

- `gestionar_finanzas`: cuenta administrativa específica, actualmente Yanina.
- `gestionar_planilla` y `cerrar_liquidacion`: cuenta específica de Yanina.
- `gestionar_dispositivos`: superadmin o cuenta específicamente delegada.
- `gestionar_usuarios`: representado por el rol delegado `gestor_usuarios`.

## Reglas

- Solo `superadmin` asigna otro `superadmin` o `gestor_usuarios`.
- `gestor_usuarios` no modifica sus propios roles ni concede permisos adicionales.
- Padres y alumnos tienen acceso de solo lectura sobre recursos vinculados.
- Un padre puede estar vinculado a varios alumnos y un alumno a varios padres.
- Cada cuenta humana usa un correo único. Una persona con varios roles conserva una sola cuenta y selecciona contexto.
- No existe autorregistro. Desactivar una cuenta conserva el historial.
- Las estaciones web usan sesiones técnicas y nunca reciben la sesión personal de un trabajador.

