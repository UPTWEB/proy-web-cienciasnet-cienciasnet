# Protección de Datos y Archivos

## Archivos

- Archivos del VPS viven en almacenamiento privado y se sirven mediante endpoints autorizados.
- No se utiliza `storage:link` en producción.
- R2 permanece privado y sin dominio público.
- URLs firmadas tienen duración corta y cada acceso sensible se audita.
- MIME, tamaño e integridad se validan antes de guardar.

## Biometría

- El enrolamiento requiere consentimiento registrado.
- Revocar consentimiento desactiva el perfil y programa eliminación.
- Embeddings se cifran con clave independiente de `APP_KEY`.
- Capturas rutinarias no se conservan.
- Evidencia excepcional tiene expiración obligatoria.
- Nunca se expone embedding al navegador, padres o estaciones.

## Privacidad

- Recopilar solo datos necesarios para una finalidad documentada.
- No incluir notas privadas, secretos o datos biométricos en logs/auditoría.
- Padres consultan estado biométrico, nunca los datos biométricos.
- Toda exportación y reporte debe aplicar el mismo alcance de permisos.

