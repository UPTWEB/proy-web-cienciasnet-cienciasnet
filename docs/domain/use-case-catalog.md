# Módulos del Sistema — CienciasNET (Colegio Ciencias)

> **Catálogo detallado vigente de reglas y casos de uso.** Los documentos individuales de `docs/domain/` facilitan la
> lectura por dominio; este catálogo conserva el detalle funcional completo.

Detalle funcional de cada módulo con sus casos de uso y reglas de negocio.

---

## Gestión de Usuarios y Roles

**Responsables:** Superadmin (Promotor) y cuenta delegada con rol `gestor_usuarios`

### Reglas de Negocio

- El Promotor conserva el rol `superadmin`, pero puede delegar la operación diaria de cuentas a una persona de confianza
  mediante el rol independiente `gestor_usuarios`.
- El permiso no se entrega a todos los usuarios `administrativo`; Yanina no gestiona cuentas por ser administrativo.
- Solo `superadmin` puede asignar o retirar el rol `gestor_usuarios` y crear otro `superadmin`.
- `gestor_usuarios` puede crear, actualizar, activar/desactivar cuentas y restablecer contraseñas.
- `gestor_usuarios` puede asignar los roles operativos `toe`, `psicologia`, `auxiliar`, `coordinador_academico`,
  `administrativo`, `docente`, `padre` y `alumno`.
- `gestor_usuarios` no puede asignar `superadmin`, modificar sus propios roles ni otorgarse permisos adicionales.
- La vinculación entre padres/apoderados y alumnos no admite autorregistro y la realiza `gestor_usuarios` o `superadmin`.
- Cada padre registrado debe tener un correo único. Un mismo padre puede vincularse con varios alumnos y cada alumno con
  varios padres o apoderados.
- Un alumno puede existir sin cuenta de portal. Si necesita acceso, se crea su cuenta con correo único.
- Una persona que también sea trabajador usa una sola cuenta con varios roles; después de iniciar sesión elige el
  contexto de trabajo o familia. Las rutas y permisos de cada contexto permanecen separados.
- La recuperación de contraseña se realiza exclusivamente mediante el correo verificado.
- Los permisos sensibles `gestionar_finanzas`, `gestionar_planilla`, `cerrar_liquidacion` y
  `gestionar_dispositivos` se asignan a cuentas específicas, no automáticamente a todo el rol `administrativo`.
- Las cámaras, celulares, tablets y servicios usan cuentas técnicas administrables, sin correo falso ni contraseña de
  usuario. Se vinculan a un dispositivo, no acceden al panel y se desactivan o rotan sin eliminar su auditoría.
- Los cambios de rol, activaciones, desactivaciones y vinculaciones quedan registrados en auditoría.

### Casos de Uso

- `CrearCuenta` — Crear cuenta y perfil para trabajador, docente, padre o alumno
- `ActualizarCuenta` — Actualizar datos permitidos del usuario
- `ActivarDesactivarCuenta` — Controlar acceso sin eliminar el historial
- `RestablecerContrasena` — Emitir recuperación o contraseña temporal
- `AsignarRolOperativo` — Asignar o retirar un rol permitido
- `VincularPadreAlumno` — Registrar relación padre, madre o apoderado con un alumno
- `ConsultarPanelFamiliar` — Padre consulta por cada hijo vinculado notas, horarios, comunicados, estado de cuenta e
  historial de ingresos/salidas

---

## Módulo 1 — Control de Asistencia y Alertas (Alumnos)

**Responsable principal:** Auxiliar de Educación

### Reglas de Negocio

- **Punto de control:** La asistencia se registra en las entradas/salidas autorizadas del colegio, no en cada salón.
- **Múltiples dispositivos:** Se pueden registrar varias cámaras, celulares o tablets autorizadas. Cada dispositivo
  indica su ubicación y modo (`entrada`, `salida` o `bidireccional`).
- **Estaciones web:** El responsable activa cada PC, celular o tablet desde una PC segura mediante QR/código temporal.
  Nunca inicia sesión con su cuenta personal en las estaciones. Una PC puede operar una o varias cámaras; celulares y
  tablets normalmente usan una cámara a la vez.
- **Sesión limitada:** Aunque alguien retroceda o cambie la URL en una estación, no puede acceder a otros módulos porque
  el navegador solo posee una sesión técnica con permiso para captura facial.
- **Reconocimiento facial:** Los dispositivos envían capturas puntuales al servicio facial Python desplegado en el VPS.
  No se transmite video continuo.
- **Separación de responsabilidades:** El servicio facial únicamente identifica a la persona y reporta su nivel de
  confianza. Laravel determina ingreso/salida, estado, duplicados, notificaciones y auditoría.
- **Consentimiento:** Se registra y valida durante el enrolamiento. Después, únicamente los perfiles biométricos activos
  se sincronizan con el servicio facial; no se consulta nuevamente el consentimiento en cada pase.
- **Supervisión:** Los reconocimientos dudosos o no reconocidos quedan pendientes para revisión del Auxiliar.
- **Horario límite de entrada:** 7:45 AM. Después de esa hora se registra como tardanza.
- **Movimientos múltiples:** Un alumno puede registrar varios ingresos y salidas en el día. Esto permite salidas
  temporales, emergencias y posteriores reingresos sin perder el historial.
- **Alternancia bidireccional:** En un dispositivo bidireccional, el primer pase confirmado del día es ingreso, el
  siguiente es salida y luego alternan reingreso/salida. Los dispositivos con modo fijo fuerzan entrada o salida.
- **Ingreso sin salida:** Al cierre, toda presencia abierta genera una anomalía en el panel del Auxiliar. El Auxiliar
  investiga y registra una salida manual estimada o deja constancia de que la hora real es desconocida.
- **Salida sin registro:** El sistema no puede detectar por sí mismo que alguien cruzó sin escanearse; por ello nunca
  inventa una hora de salida y mantiene la anomalía hasta su resolución.
- **Duplicados entre dispositivos:** Solo se descartan repeticiones del mismo movimiento dentro de una ventana corta
  configurable. Una salida o reingreso posterior legítimo nunca se descarta por existir otro movimiento ese día.
- **Salida de emergencia:** Si el alumno no puede pasar por reconocimiento facial, el Auxiliar registra manualmente la
  salida, motivo y observación. El sistema envía una notificación especial al padre.
- **Notificaciones (Correo):** El sistema envía correo al padre por cada ingreso, salida y salida de emergencia
  confirmados. Todos los asuntos llevan el prefijo `[CienciasNET]`.
- **Cierre de jornada:** La hora de cierre se configura por jornada/calendario. Al finalizar la jornada completa, el
  sistema marca falta injustificada únicamente a alumnos sin ningún ingreso confirmado.
- **Configuración de jornada:** El Coordinador Académico o Superadmin configura la hora límite de puntualidad y la hora
  de cierre por grado/día.
- **Llegada tardía:** Cualquier ingreso confirmado antes del cierre de jornada evita la falta y queda como tardanza si
  ocurrió después de las 7:45 AM.
- **Sincronización tardía:** Si un dispositivo estuvo sin Internet y posteriormente envía un ingreso capturado antes del
  cierre, Laravel reemplaza la falta generada por tardanza/presente y conserva la corrección en auditoría.
- **Regla de Faltas:** Solo las faltas injustificadas cuentan para el umbral de 3 faltas que genera alerta en TOE y
  Auxiliar para citar al padre.
- **Justificaciones:** Solo TOE o Auxiliar pueden cambiar el estado de "Falta Injustificada" a "Falta Justificada".

### Casos de Uso

- `RegistrarIngreso` — Auxiliar registra ingreso del alumno (hora y estado: presente/tardanza)
- `RegistrarSalida` — Auxiliar registra salida del alumno
- `RegistrarSalidaEmergencia` — Auxiliar registra salida manual con motivo y observación
- `RegistrarReingreso` — Registra el retorno después de una salida temporal
- `CerrarJornadaAsistencia` — Genera faltas para alumnos sin ingresos al finalizar la jornada configurable
- `ConfigurarJornadaAsistencia` — Coordinador Académico/Superadmin define puntualidad y cierre
- `ObtenerAsistenciaAlumno` — Historial de asistencia por alumno con filtros (mes, grado)
- `ObtenerAsistenciaGrado` — Lista de asistencia del día por grado y sección
- `JustificarFalta` — TOE o Auxiliar cambia estado a falta justificada
- `VerificarUmbralFaltas` — Detecta alumnos con 3+ faltas y genera alerta
- `ObtenerAlertasFaltas` — Panel de TOE/Auxiliar muestra alumnos con umbral superado
- `EnviarNotificacionIngreso` — Correo automático al padre al registrar ingreso
- `EnviarNotificacionSalida` — Correo automático al padre al registrar salida
- `GenerarReporteAsistencia` — Reporte mensual por alumno/grado
- `ProcesarEventoFacial` — Procesa una identificación facial; Laravel resuelve ingreso, salida o reingreso
- `RevisarEventoFacial` — Auxiliar confirma, rechaza o corrige un reconocimiento dudoso
- `ResolverAnomaliaAsistencia` — Auxiliar documenta una presencia sin salida o secuencia inválida
- `EnrolarPerfilFacial` — Registra el consentimiento y genera el perfil biométrico del alumno
- `GestionarEstacionBiometrica` — Cuenta autorizada registra, configura o revoca estaciones web
- `GestionarCamarasEstacion` — Configura una o varias cámaras, ubicación y modo por estación
- `GenerarActivacionEstacion` — Cuenta autorizada genera un código/QR temporal de un solo uso
- `ActivarEstacionWeb` — Navegador intercambia el código por una sesión técnica limitada
- `RevocarEstacionComprometida` — Desactiva la sesión técnica y envía sus eventos recientes a revisión

---

## Módulo 2 — Control de Asistencia y Planilla (Docentes)

**Responsable exclusivo:** Yanina (Administrativo)

### Reglas de Negocio

- Los dispositivos autorizados registran automáticamente los eventos faciales de docentes.
- Yanina supervisa, corrige excepciones y gestiona faltas, descuentos y sustituciones; el docente no edita su propia
  asistencia.
- **Tardanzas (Acumulativas):** Los minutos de tardanza de los docentes se acumulan mensualmente. El sistema suma todos
  los minutos de retraso en el mes para facilitar el descuento salarial.
- **Inicio de tardanza:** La tardanza se calcula contra la primera clase programada del docente en ese día, incluso
  cuando tenga una sola clase.
- **Tarifa vigente:** Yanina registra la tarifa por hora y su periodo de vigencia para cada docente.
- **Cambios futuros:** Una tarifa nueva solo afecta clases y liquidaciones futuras; nunca recalcula periodos anteriores.
- **Tardanza:** `minutos_tardanza / 60 × tarifa_hora`.
- **Falta Justificada:** `horas_no_laboradas × tarifa_hora`.
- **Falta Injustificada:** `horas_no_laboradas × tarifa_hora × 2`.
- **Trazabilidad:** El reporte mensual guarda horas, tarifa usada y monto calculado. Yanina puede registrar un ajuste
  justificado sin modificar el historial original.
- **Horas no laboradas:** Se calculan usando el horario asignado al docente. Registrar un sustituto documenta quién
  cubrió la clase, pero no elimina automáticamente el descuento del docente ausente.
- **Ejemplo:** Con tarifa de S/ 20 por hora, 30 minutos de tardanza descuentan S/ 10; una falta justificada de 3 horas
  descuenta S/ 60; una falta injustificada de 3 horas descuenta S/ 120.
- **Sustitución:** El sistema permite registrar si las horas fueron cubiertas por un docente sustituto.
- **Clase cancelada:** El Coordinador Académico marca la cancelación y su motivo. Yanina la revisa para planilla; una
  clase cancelada no genera falta ni descuento.
- **Falta por clase:** Si la clase continúa programada y no existe ingreso del docente al terminar su hora de fin, el
  sistema genera una falta pendiente de revisión.
- **Cuenta autorizada:** Solo la cuenta específica de Yanina puede gestionar reglas y ajustes de planilla.
- **Cierre mensual:** Yanina cierra la liquidación mensual. Después queda inmutable y cualquier corrección usa un ajuste
  compensatorio auditado.

### Casos de Uso

- `RegistrarAsistenciaDocente` — Laravel registra desde un evento facial validado o Yanina registra/corrige una excepción
- `ObtenerAsistenciaDocente` — Historial de asistencia por docente
- `CalcularMinutosTardanzaMes` — Suma de minutos de tardanza en el mes
- `CalcularHorasDescuento` — Cálculo automático de horas a descontar según reglas
- `ConfigurarTarifaDocente` — Yanina registra tarifa por hora y vigencia
- `CalcularMontoDescuentoDocente` — Convierte tardanzas y faltas a monto monetario
- `RegistrarAjustePlanillaDocente` — Registra corrección justificada sin borrar el cálculo original
- `RegistrarDocenteSustituto` — Asignar docente que cubrió las horas
- `CancelarSesionClase` — Coordinador Académico registra una cancelación académica justificada
- `DetectarFaltaDocente` — Genera falta al finalizar una clase programada sin asistencia
- `CerrarLiquidacionMensual` — Yanina congela la liquidación revisada
- `GenerarReportePlanilla` — Reporte mensual para cálculo de descuentos
- `RevisarEventoFacialDocente` — Yanina confirma, rechaza o corrige un reconocimiento dudoso

---

## Módulo 3 — Gestión Financiera y Pagos

**Responsable exclusivo:** Yanina (Administrativo)
**Visualización:** Padres (solo estado de cuenta de sus hijos)

### Estructura de Costos Base

| Concepto         | Monto     |
|------------------|-----------|
| Cuota de Ingreso | S/ 200.00 |
| Matrícula        | S/ 480.00 |
| Mensualidad Base | S/ 480.00 |

### Reglas de Negocio

- **Pronto Pago:** Si el padre cancela la mensualidad hasta el último día del mes (30 o 31), el sistema aplica
  automáticamente un descuento de S/ 30.00, dejando la deuda en S/ 450.00.
- **Responsabilidad:** Yanina registra directamente conceptos, becas y descuentos según las indicaciones recibidas fuera
  del sistema. No existe un flujo de aprobación de Dirección dentro de la aplicación.
- **Cuenta autorizada:** El permiso `gestionar_finanzas` se asigna específicamente a Yanina; no lo reciben todos los
  usuarios con rol `administrativo`.
- **Generación configurable:** Yanina configura por periodo los montos, fechas de generación, vencimientos y alcance de
  conceptos. Las configuraciones históricas quedan versionadas.
- **Cuenta financiera privilegiada:** Una sola cuenta administrativa, actualmente Yanina, recibe
  `gestionar_finanzas`. Puede cambiar configuración general y ajustar deudas todavía pendientes; otros administrativos
  no pueden hacerlo.
- **Montos configurables:** Cuota de ingreso, matrícula y mensualidad son montos base configurables por periodo; no son
  valores fijos permanentes.
- **Ajustes de deudas pendientes:** Yanina puede modificar monto ordinario, pronto pago, fecha límite, vencimiento o
  beneficio de deudas aún pendientes, individualmente o por grupo. Debe indicar motivo; el sistema audita y notifica.
- **Protección histórica:** Los pagos realizados y las deudas pagadas/anuladas son inmutables. Los cambios generales
  afectan nuevas deudas salvo que Yanina seleccione expresamente deudas pendientes para actualizarlas.
- **Beneficios:** Una beca o descuento define modalidad (`porcentaje`, `monto_fijo` o `exoneracion`), valor, conceptos a
  los que aplica y periodo de vigencia.
- **Aplicación por defecto:** Becas y descuentos aplican solo a mensualidades, salvo que Yanina marque explícitamente
  matrícula o cuota de ingreso.
- **Acumulación:** El pronto pago no se combina con otra beca o descuento, salvo que Yanina habilite expresamente la
  acumulación en el beneficio.
- **Un beneficio por deuda:** Cada deuda aplica como máximo una beca o descuento. Si existen beneficios coincidentes,
  Yanina selecciona cuál corresponde antes de generarla.
- **Sin pagos parciales:** Cada deuda se paga en una sola operación por el monto exacto aplicable.
- **Pronto pago efectivo:** Si el pago completo se registra hasta la fecha límite, corresponde S/ 450.00. Después de la
  fecha límite corresponde el monto ordinario de S/ 480.00.
- **Cambios futuros:** Crear, modificar o desactivar un beneficio afecta únicamente deudas futuras.
- **Correcciones:** Los pagos históricos no se eliminan ni se sobrescriben; cualquier corrección se registra como ajuste
  auditado.
- **Registro manual:** No existe pasarela de pagos en la versión actual. Yanina verifica el pago fuera del sistema y lo
  registra indicando medio: `efectivo`, `transferencia`, `yape`, `plin` u `otro`.
- **Evidencia:** Para medios distintos de efectivo se registra referencia de operación y puede adjuntarse comprobante.
- **Pronto pago congelado:** Cada deuda guarda el monto ordinario, monto de pronto pago y fecha límite aplicables al
  momento de su emisión.
- **Visualización:** Antes de la fecha límite, el estado de cuenta muestra ambos valores: “Paga S/ 450.00 hasta
  `<fecha>`; después S/ 480.00”. Al vencer el plazo, muestra S/ 480.00 como monto exigible.
- **Correcciones y devoluciones:** Se registran como movimientos compensatorios inmutables. Un pago aplicado a una deuda
  equivocada se anula y vuelve a registrar.
- **Referencias y recibos:** Las referencias no se repiten por medio/proveedor y cada recibo tiene numeración secuencial
  inmutable.

### Casos de Uso

- `CrearConceptoPago` — Registrar concepto (Matrícula, Mensualidad, Cuota de Ingreso)
- `ActualizarConceptoPago` — Modificar un concepto únicamente antes de generar deudas
- `AjustarDeudaPendiente` — Modificar montos, fechas o beneficio de una deuda pendiente con motivo y auditoría
- `AjustarDeudasPendientesMasivo` — Aplicar un cambio controlado a pendientes de un concepto, grado o sección
- `GenerarDeudas` — Crear obligaciones congelando monto base y beneficios aplicados
- `ConfigurarBeneficioAlumno` — Registrar beca o descuento con alcance, valor y vigencia
- `DesactivarBeneficioAlumno` — Impedir su aplicación a deudas futuras
- `RegistrarPago` — Registrar el pago completo de una deuda por el monto aplicable según la fecha
- `RegistrarAjustePago` — Corregir un movimiento sin alterar o eliminar el historial
- `AplicarDescuentoProntoPago` — Aplica S/ 30 de descuento si paga hasta fin de mes
- `ObtenerEstadoCuenta` — Total requerido, monto pagado, saldo pendiente por alumno
- `ObtenerEstadoCuentaPadre` — Padre ve pagos de sus hijos vinculados
- `ListarMorosos` — Alumnos con pagos vencidos
- `EnviarRecordatorioPago` — Correo automático al padre con deuda pendiente (asunto:
  `[CienciasNET] Recordatorio de pago`)
- `GenerarReciboPDF` — Exportar recibo de pago en PDF
- `GenerarReporteCaja` — Ingresos del día/mes para Yanina y superadmin

---

## Módulo 4 — Evaluación y Academia

**Responsable principal:** Coordinador Académico

### Reglas de Negocio

- **Ciclo Semanal:** Exámenes se rinden los viernes y se publican el martes siguiente.
- **Alcance:** El sistema no toma exámenes ni corrige respuestas. Almacena resultados de pruebas físicas ya corregidas
  manualmente por la institución.
- **Estructura académica:** Periodos, grados, secciones, matrículas, cursos y carga académica determinan qué alumnos
  pertenecen a cada curso y qué docente puede registrar sus notas.
- **Estructura de Exámenes:**
    - 1° a 4° de Secundaria: Examen general de 40 preguntas.
    - 5° de Secundaria: Examen tipo admisión de 60 preguntas, dividido por canales (`ciencias` / `letras`).
- **Publicación:** Las notas solo son visibles para alumnos y padres cuando la evaluación está en estado `publicado` o
  `cerrado`.
- **Registro docente:** Cada docente solo puede cargar o corregir notas de sus cargas académicas activas. El Coordinador
  Académico puede revisar todas y publicarlas.
- **Privacidad:** Cada alumno ve únicamente sus notas; cada padre ve únicamente las de sus hijos vinculados.
- **Ranking:** Al publicar, el sistema calcula el puesto por examen, sección y canal. Los empates comparten posición.
- **Validación:** Cada evaluación define puntaje máximo. Solo se admiten valores entre cero y ese máximo; ausente,
  exonerado y pendiente se registran como estados separados y no participan en ranking.
- **Carga masiva:** Antes de guardar, el sistema muestra errores y previsualización; la importación se confirma en una
  sola transacción para evitar cargas parciales.
- **Corrección publicada:** Toda corrección posterior conserva auditoría, recalcula ranking y vuelve a notificar.
- **Cierre:** Una evaluación cerrada no cambia salvo reapertura auditada por Coordinador Académico o superadmin.
- **Reportes:** El sistema genera libretas para colegio o reportes para academia, según el periodo académico.
- **Notificaciones:** Al publicar resultados se crea notificación en el panel responsive y se envía correo. La V1 no
  incluye push nativo, SMS ni WhatsApp.

### Casos de Uso

- `CrearExamen` — Coordinador crea examen (título, fecha, grado, canal, total preguntas)
- `RegistrarNotas` — Docente registra puntajes únicamente para su carga académica
- `RegistrarNotasMasivo` — Carga masiva de notas para todo el grado/sección
- `ActualizarNota` — Corrección de nota con registro en audit_logs
- `PublicarExamen` — Cambia el estado a `publicado` el martes y calcula rankings.
- `ObtenerNotasAlumno` — Notas por alumno con filtros (bimestre, examen)
- `ObtenerRanking` — Ranking de alumnos por examen o acumulado
- `ObtenerNotasPadre` — Padre ve notas de sus hijos (solo exámenes publicados)
- `GenerarBoletaPDF` — Exportar boleta de notas
- `GenerarReporteAcademico` — Generar libreta escolar o reporte de academia
- `NotificarResultadosPublicados` — Avisar por panel y correo a alumnos y padres vinculados

---

## Módulo 5 — Cuaderno de Incidencias y Psicología

**Responsables:** Auxiliar (registro inicial) → TOE (derivación) → Psicología (atención confidencial)

### Reglas de Negocio

- **Registro Actitudinal:** El Auxiliar registra incidencias conductuales en el Cuaderno de Incidencias virtual y las
  deriva a TOE. TOE también puede registrar directamente una incidencia.
- **Derivación:** Casos graves pasan a TOE. TOE puede derivar a Psicología.
- **Notificar a padres:** TOE notifica a los padres sobre faltas graves por correo (asunto:
  `[CienciasNET] Incidencia conductual — <nombre alumno>`).
- **Confidencialidad:** El módulo de Psicología (`atenciones_psicologia`) es privado. Sus reportes detallados (
  `notas_privadas`) no son visibles para docentes ni auxiliares. Solo Psicología y `superadmin` (Promotor).
- **Seguimiento:** TOE registra comentarios, archivos, notificaciones, derivaciones y resolución.

### Casos de Uso

- `RegistrarIncidencia` — Auxiliar registra incidencia (tipo, descripción, alumno)
- `ObtenerIncidenciasAlumno` — Historial de incidencias de un alumno
- `DerivarATOE` — Auxiliar deriva caso grave a TOE
- `DerivarAPsicologia` — TOE deriva caso a Psicología
- `NotificarPadreIncidencia` — TOE envía correo al padre sobre falta grave
- `RegistrarAtencionPsicologia` — Psicóloga registra atención y notas privadas
- `ObtenerAtencionesAlumno` — Psicología y superadmin ven historial confidencial
- `RegistrarSeguimientoIncidencia` — TOE documenta acciones, archivos y resolución
- `GenerarReporteIncidencias` — Reporte semanal para TOE/Auxiliar

---

## Módulo 6 — Materiales de Estudio

### Casos de Uso

- `SubirMaterial` — Coordinador/Docente sube PDF, imagen o recurso (grado y sección destino)
- `RegistrarEnlaceExterno` — Registrar URL de YouTube u otro recurso
- `ListarMaterialPorGrado` — Alumnos ven recursos de su grado/sección por semana
- `DescargarMaterial` — Acceso con validación de matrícula activa
- `ActualizarMaterial` — Editar título, semana o reemplazar archivo
- `EliminarMaterial` — Coordinador elimina recurso

---

## Módulo 7 — Horarios y Calendario

### Casos de Uso

- `CrearHorario` — Registrar horario semanal (grado, sección, día, hora, docente, aula)
- `ObtenerHorarioGrado` — Horario semanal por grado y sección
- `ObtenerHorarioDocente` — Clases asignadas al docente
- `ObtenerHorarioPadre` — Padre ve horario del grado de su hijo
- `CrearEventoCalendario` — Examen, simulacro, evento especial
- `ObtenerCalendarioMes` — Vista mensual de eventos
- `RegistrarDiaNoLaboral` — Feriado o día sin clases

---

## Módulo 8 — Comunicados

### Casos de Uso

- `PublicarComunicado` — Superadmin/TOE/Coordinador Académico publica aviso
- `SegmentarDestinatarios` — Por rol (padre, docente), por grado, o general
- `NotificarPorCorreo` — Email automático al publicar aviso importante
- `ListarComunicados` — Ver activos según el rol/grado del usuario
- `MarcarLeido` — Registro de lectura por usuario
- `ArchivarComunicado` — Ocultar comunicado antiguo sin eliminar
