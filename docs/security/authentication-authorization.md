# Autenticación y Autorización

## Usuarios humanos

- React usa Sanctum SPA stateful con cookie `httpOnly`, `Secure` y `SameSite`.
- React solicita CSRF y usa `withCredentials`.
- Tokens y contraseñas nunca se almacenan en `localStorage`.
- Sesiones expiran por inactividad y logout invalida servidor.
- Recuperación de contraseña mediante correo verificado.

## Estaciones web y servicios

- Una estación se activa mediante QR/código de un solo uso y corta duración.
- La activación crea una sesión técnica independiente en cookie `httpOnly`.
- La estación solo puede enviar capturas y consultar su estado mínimo.
- El servicio facial usa credencial propia en red privada.
- Sesiones/credenciales son rotables y revocables individualmente.

## Autorización

- El frontend protege rutas para UX; el backend siempre vuelve a autorizar.
- Middleware valida permiso general y Policy valida recurso específico.
- Permisos sensibles se asignan a cuentas concretas.
- `superadmin` tiene acceso completo; cada uso sensible queda auditado.
- Las notas privadas de Psicología solo son visibles para Psicología y superadmin.

## Protección operativa

- Rate limiting en login, activación, captura y operaciones sensibles.
- Mensajes de autenticación genéricos.
- Registro de intentos y revocaciones.
- Reautenticación para cambios críticos cuando se implemente.

