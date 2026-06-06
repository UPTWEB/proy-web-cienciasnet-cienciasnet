# Verification: add-human-authentication

## Automated and Manual Checks

- [x] login/logout/419 probados.
- [x] recuperación no filtra existencia.
- [x] cuenta desactivada rechazada.

## Required Evidence

- [x] Resultados de pruebas o comandos adjuntos.
- [x] Escenarios de la delta spec demostrados.
- [x] Permisos negativos y datos sensibles revisados.
- [x] Contrato y documentos sincronizados.

## Results

- `composer quality` pasa Pint, 16 pruebas y 55 aserciones, y regenera OpenAPI.
- Se probaron login por cookie, consulta de sesión, logout e invalidación.
- Una mutación stateful sin token CSRF responde 419 y `/sanctum/csrf-cookie` publica la cookie esperada.
- Recuperación responde el mismo mensaje para correos existentes e inexistentes.
- Cuentas desactivadas reciben rechazo genérico tanto al iniciar como al reutilizar una sesión.
- Login y recuperación tienen rate limiting; intentos, recuperaciones y logout quedan auditados sin guardar contraseñas.
