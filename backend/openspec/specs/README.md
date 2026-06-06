# Specs Backend Aceptadas

Aquí viven únicamente capacidades backend implementadas, verificadas y aceptadas. Cada spec archivada debe describir
comportamiento observable, permisos, contrato, errores y restricciones relevantes.

Los changes activos permanecen en `../changes/` y no desbloquean frontend hasta publicar el contrato correspondiente.

## Aceptación y fusión

- Si la capability no existe, copiar su delta spec aceptada a `<capability>/spec.md`.
- Si ya existe, fusionar requisitos ADDED/MODIFIED/REMOVED sin borrar comportamiento aceptado no relacionado.
- La spec aceptada describe el comportamiento vigente completo, no conserva lenguaje de propuesta o tareas pendientes.
- Solo el reviewer aprueba la fusión y el cierre del change.
- Después de fusionar, mover el paquete completo del change a `../changes/archive/YYYY-MM-DD-<change-name>/`.
