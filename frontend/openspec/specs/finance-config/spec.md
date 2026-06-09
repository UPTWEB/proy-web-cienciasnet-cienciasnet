# Finance Config Spec

## Capability: Configuración de Conceptos de Pago

### Requirement: Crear Concepto de Pago
GIVEN que el usuario tiene el permiso `gestionar_finanzas`
WHEN ingresa al formulario de nuevo concepto de pago
AND proporciona un código único, nombre, monto y fecha de vencimiento
THEN el sistema debe guardar el concepto y asignarle un ID.

### Requirement: Historial de Conceptos de Pago
GIVEN que el usuario tiene el permiso `gestionar_finanzas`
WHEN visualiza la tabla de conceptos de pago
THEN el sistema muestra un historial diferenciable entre conceptos activos y pasados, marcando visualmente aquellos cuyo monto sea inactivo/0 o estén obsoletos.

## Capability: Beneficios Estudiantiles

### Requirement: Asignar Beneficio a Estudiante
GIVEN que el usuario tiene el permiso `gestionar_finanzas`
WHEN ingresa al formulario de nuevo beneficio
AND provee un ID de estudiante, tipo de beneficio (porcentaje/fijo/exoneración) y fechas
THEN el sistema guarda el beneficio activamente.

### Requirement: Desactivar Beneficio
GIVEN que el usuario tiene el permiso `gestionar_finanzas`
WHEN selecciona un beneficio activo en la tabla
AND confirma la desactivación proveyendo un motivo
THEN el estado del beneficio pasa a "Inactivo" inmediatamente.
