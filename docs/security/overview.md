# Seguridad Compartida

CienciasNET procesa datos de menores, biometría, finanzas y registros psicológicos. La seguridad se aplica por capas y
con mínimo privilegio.

Los ejemplos de Policies, variables, auditoría y checklist completo están en
[`security-controls.md`](security-controls.md).

## Controles obligatorios

- HTTPS obligatorio y secretos fuera del repositorio.
- Autenticación separada para personas y estaciones/servicios.
- Autorización backend mediante permisos y Policies de recurso.
- Padres/alumnos limitados a recursos propios o vinculados.
- Archivos y R2 privados.
- Auditoría para cambios sensibles y accesos excepcionales.
- Rate limiting, validación estricta e idempotencia.
- Backups cifrados y restauraciones probadas.
- Datos sensibles excluidos de logs.

## Datos especialmente protegidos

- Embeddings y fotos biométricas.
- Notas privadas de Psicología.
- Comprobantes y movimientos financieros.
- Datos personales de menores y vínculos familiares.
- Tokens, cookies técnicas y claves de cifrado.
