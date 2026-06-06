# Integración Facial y Estaciones Web

## Flujo web

1. Desde una PC segura, una cuenta con `gestionar_dispositivos` crea una estación.
2. Laravel genera un QR/código aleatorio de un solo uso, válido máximo 10 minutos.
3. En una PC, celular o tablet se abre la ruta web de activación.
4. El navegador recibe una sesión técnica limitada, nunca la sesión personal del responsable.
5. Se seleccionan y autorizan cámaras disponibles.
6. La estación envía capturas puntuales a Laravel.
7. Laravel llama al servicio Python privado y decide el movimiento de asistencia.

Una estación puede ser un celular/tablet con una cámara o una PC con varias cámaras. Cada cámara define ubicación y modo:
entrada, salida o bidireccional.

## Seguridad y comportamiento

- Conocer la URL no permite registrar eventos sin sesión técnica activa.
- Retroceder o cambiar URL no concede acceso al portal humano.
- La sesión puede revocarse individualmente.
- No se transmite video continuo ni se conserva una cola biométrica offline.
- Capturas rutinarias se procesan en memoria.
- Evidencia excepcional tiene retención limitada y acceso auditado.
- Prueba de vida es obligatoria para aceptación automática.
- Umbrales iniciales: aceptar `>= 0.85`, revisar `0.65..0.8499`, rechazar `< 0.65`.
- Objetivo normal de respuesta: 2 segundos; timeout: 5 segundos; siempre existe alternativa manual.

