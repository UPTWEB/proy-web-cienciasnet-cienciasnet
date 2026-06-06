# Dominio: Académico

## Modelo conceptual

`periodo académico → grado → sección → matrícula`

`sección + curso + docente → carga académica → horario/evaluación/material`

## Reglas de negocio

- La matrícula determina la sección activa de un alumno durante un periodo.
- La carga académica determina qué docente puede registrar notas y materiales.
- Cambiar docente conserva la vigencia e historial de cargas anteriores.
- El sistema no administra ni corrige exámenes; almacena resultados ya procesados de pruebas físicas.
- Docentes solo registran notas de cargas activas asignadas.
- Alumnos ven resultados propios y padres los de hijos vinculados.
- Las notas solo son visibles cuando la evaluación está publicada o cerrada.
- Ausentes, exonerados y pendientes no participan en ranking.
- Empates comparten posición dentro del examen, sección y canal.
- Corregir una nota publicada exige auditoría, recalcula ranking y vuelve a notificar.

## Casos de uso compartidos

- Gestionar periodo, grado, sección, matrícula, curso y carga académica.
- Crear horario y registrar/cancelar sesión de clase.
- Crear evaluación y cargar resultados individual o masivamente.
- Revisar, publicar, corregir, cerrar o reabrir evaluación.
- Generar ranking, libreta escolar o reporte de academia.
- Publicar materiales y calendario.

