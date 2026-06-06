# Specs Frontend Aceptadas

Aquí viven únicamente capacidades frontend implementadas, verificadas y aceptadas. Cada spec archivada debe describir
rutas, permisos visuales, estados, integración API, responsive y accesibilidad relevantes.

## Aceptación y fusión

- Si la capability no existe, copiar su delta spec aceptada a `<capability>/spec.md`.
- Si ya existe, fusionar requisitos ADDED/MODIFIED/REMOVED sin borrar comportamiento aceptado no relacionado.
- La spec aceptada describe el comportamiento vigente completo y usa contratos backend publicados.
- Solo el reviewer aprueba la fusión y el cierre del change.
- Después de fusionar, mover el paquete completo del change a `../changes/archive/YYYY-MM-DD-<change-name>/`.
