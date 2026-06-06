# Dominio: Asistencia

## Reglas de alumnos

- La asistencia se registra en entradas y salidas autorizadas, no por salón.
- El primer evento bidireccional del día es ingreso; los siguientes alternan salida y reingreso.
- Una cámara con modo fijo siempre registra entrada o salida según configuración.
- Después de la hora puntual, un ingreso es tardanza.
- La falta se genera al terminar la jornada completa y solo si no hubo ingreso.
- Solo faltas injustificadas cuentan para la alerta por acumulación.
- Un ingreso sin salida crea una anomalía para el Auxiliar.
- Si alguien sale sin registrarse, el sistema no inventa hora; el Auxiliar documenta la corrección.
- Una salida de emergencia puede registrarse manualmente y notifica al padre.

## Reglas de docentes y planilla

- La tardanza se calcula contra la primera clase programada del día, incluso si es la única.
- Una clase programada sin asistencia genera falta al terminar su hora.
- El Coordinador Académico registra clases canceladas; una clase cancelada no genera descuento.
- Cambiar tarifa solo afecta periodos futuros.
- Falta justificada: horas no trabajadas por tarifa.
- Falta injustificada: horas no trabajadas por tarifa multiplicadas por dos.
- Yanina revisa excepciones y cierra la liquidación mensual.

## Casos de uso compartidos

- Registrar ingreso, salida, reingreso y salida de emergencia.
- Procesar evento facial y revisar reconocimiento dudoso.
- Resolver anomalía de asistencia.
- Cerrar jornada, generar faltas y justificar falta.
- Detectar umbral de faltas y notificar.
- Detectar falta docente, registrar sustituto y ajustar planilla.
- Cerrar liquidación mensual.

