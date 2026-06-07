# add-human-authentication Specification

## Purpose

Permitir acceso humano seguro a la SPA mediante sesiones protegidas, sin autorregistro ni exposición de tokens.

## Requirements

### Requirement: Autenticación humana mediante sesión

El sistema SHALL autenticar la SPA mediante cookie y CSRF.

#### Scenario: recibe sesión sin token en localStorage

- GIVEN una cuenta activa usa credenciales válidas
- WHEN inicia sesión
- THEN recibe sesión sin token en localStorage

### Requirement: Bloqueo de cuentas desactivadas

Una cuenta desactivada SHALL perder acceso.

#### Scenario: recibe rechazo genérico

- GIVEN una cuenta fue desactivada
- WHEN intenta usar la API
- THEN recibe rechazo genérico
