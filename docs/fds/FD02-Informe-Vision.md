<center>

![Logo UPT](./media/logo-upt.png)

**UNIVERSIDAD PRIVADA DE TACNA**

**FACULTAD DE INGENIERÍA**

**Escuela Profesional de Ingeniería de Sistemas**

**Informe de Visión de Producto**

**Sistema Web Académico y Administrativo CienciasNET**

Curso: *Programación Web 1*

Docente: *Mtro. Tito Fernando Ale Nieto*

Integrantes:

***Zapana Murillo, Kiara Holly (2023077087)***

***Vargas Espinoza, Jefferson Alfonso (2023076820)***

***Yupa Gomez, Fatima Sofia (2023076618)***

***Carbajal Vargas, Andre Alejandro (2023077287)***

***LLanos Niño, Vincenzo Rafael (202307679)***

**Tacna - Perú**

***2026***

</center>

<div style="page-break-after: always; visibility: hidden">\pagebreak</div>

Sistema *Web Académico y Administrativo CienciasNET*

Informe de Visión de Producto

Versión *1.0*

| CONTROL DE VERSIONES |                     |              |                    |            |                  |
|:--------------------:|:--------------------|:-------------|:-------------------|:-----------|:-----------------|
|       Versión        | Hecha por           | Revisada por | Aprobada por       | Fecha      | Motivo           |
|         1.0          | KZM, JVE, FYG, ACV, VLN | KZM, JVE, FYG, ACV, VLN | T. Ale Nieto | 2026-07-07 | Primera versión del documento |

<div style="page-break-after: always; visibility: hidden">\pagebreak</div>

**ÍNDICE GENERAL**

[1. Introduccion](#_Toc52661346)

1.1 Proposito  
1.2 Alcance  
1.3 Definiciones, Siglas y Abreviaturas  
1.4 Referencias  
1.5 Vision General

[2. Posicionamiento](#_Toc52661347)

2.1 Oportunidad de negocio  
2.2 Definicion del problema

[3. Descripcion de los interesados y usuarios](#_Toc52661348)

3.1 Resumen de los interesados  
3.2 Resumen de los usuarios  
3.3 Entorno de usuario  
3.4 Perfiles de los interesados  
3.5 Perfiles de los usuarios  
3.6 Necesidades de los interesados y usuarios

[4. Vista General del Producto](#_Toc52661349)

4.1 Perspectiva del producto  
4.2 Resumen de capacidades  
4.3 Suposiciones y dependencias  
4.4 Costos y precios  
4.5 Licenciamiento e instalacion

[5. Caracteristicas del producto](#_Toc52661350)

[6. Restricciones](#_Toc52661351)

[7. Rangos de calidad](#_Toc52661352)

[8. Precedencia y Prioridad](#_Toc52661353)

[9. Otros requerimientos del producto](#_Toc52661354)

9.1 Estandares legales  
9.2 Estandares de comunicacion  
9.3 Estandares de cumplimiento de la plataforma  
9.4 Estandares de calidad y seguridad

[CONCLUSIONES](#_Toc52661355)

[RECOMENDACIONES](#_Toc52661356)

[BIBLIOGRAFIA](#_Toc52661357)

[WEBGRAFIA](#_Toc52661358)

<div style="page-break-after: always; visibility: hidden">\pagebreak</div>

**<u>Informe de Vision</u>**

1. <span id="_Toc52661346" class="anchor"></span>**Introduccion**

   **1.1 Proposito**

   El presente informe define la vision funcional y academica del sistema *Web Academico y Administrativo CienciasNET*.
   Su proposito es establecer una referencia comun para estudiantes, docente evaluador, cliente (Colegio Ciencias) y
   futuros mantenedores del proyecto, describiendo con claridad:

    - El problema real que se busca resolver.
    - El alcance de la solucion en su version actual (V1).
    - Las capacidades esperadas y sus limites.
    - Los criterios de calidad y prioridad para su evolucion.

   Este documento tambien cumple una funcion de trazabilidad, porque conecta el objetivo del proyecto con artefactos
   tecnicos verificables (modulos backend, componentes frontend, servicio facial, contratos API y pruebas).

   **1.2 Alcance**

   **Alcance funcional (incluido en V1):**

    - Gestion de usuarios con 10 roles diferenciados y permisos granulares.
    - Estructura academica: periodos, grados, secciones, matriculas, cursos y cargas docentes.
    - Control de asistencia de alumnos mediante reconocimiento facial con estaciones web.
    - Control de asistencia y planilla docente con calculo automatico de tardanzas y descuentos.
    - Gestion financiera: conceptos de cobro, becas, descuentos, generacion de deudas y registro de pagos.
    - Evaluaciones: registro de notas por docente, rankings automaticos y libretas.
    - Cuaderno de incidencias con flujo Auxiliar → TOE → Psicologia.
    - Materiales de estudio, horarios, calendario y comunicados segmentados.
    - Servicio facial Python independiente con prueba de vida y metodo manual alternativo.
    - Portales diferenciados para cada rol (responsive).

   **Alcance no funcional (incluido):**

    - Aplicacion web responsive accesible desde PC, tablet y celular.
    - HTTPS obligatorio y seguridad de datos de menores.
    - Despliegue en VPS Hetzner con Docker Compose.
    - Backups cifrados diarios con retencion de 30 dias.

   **Fuera de alcance (version actual V1):**

    - Aplicacion movil nativa.
    - Pasarela de pagos electronica.
    - Examenes en linea (el sistema almacena resultados, no toma examenes).
    - Integracion con WhatsApp o SMS.
    - Multi-tenancy para multiples colegios.

   **1.3 Definiciones, Siglas y Abreviaturas**

    - **SPA (Single Page Application):** aplicacion web que carga una sola pagina y actualiza contenido dinamicamente.
    - **API (Application Programming Interface):** interfaz para comunicacion entre frontend y backend.
    - **CRUD:** operaciones basicas de Crear, Leer, Actualizar y Eliminar.
    - **VPS (Virtual Private Server):** servidor virtual privado para alojar la aplicacion.
    - **R2:** servicio de almacenamiento de objetos de Cloudflare.
    - **TOE:** Tutoria y Orientacion Educativa, departamento disciplinario del colegio.
    - **Embedding facial:** representacion numerica de un rostro utilizada para comparacion biometrica.
    - **Sanctum:** paquete de Laravel para autenticacion de SPA mediante sesion/cookie.
    - **UUID:** identificador unico universal utilizado como clave primaria de recursos de dominio.

   **1.4 Referencias**

    - Documento de factibilidad (`docs/fds/FD01-Informe-Factibilidad.md`).
    - Vision del producto (`docs/product/overview.md`).
    - Requerimientos aprobados (`docs/product/approved-requirements.md`).
    - Modelo de negocio (`docs/product/business-model.md`).
    - Arquitectura general (`docs/architecture/system.md`).
    - Arquitectura backend (`docs/architecture/backend.md`).
    - Arquitectura frontend (`docs/architecture/frontend.md`).
    - Esquema de base de datos (`docs/architecture/database-schema.md`).
    - Seguridad (`docs/security/overview.md`).
    - Roles y permisos (`docs/product/roles-and-permissions.md`).

   **1.5 Vision General**

   CienciasNET se visiona como una intranet web integral que transforma la operacion del Colegio Ciencias, migrando
   procesos manuales dispersos a una plataforma digital centralizada. La propuesta de valor central es ofrecer a toda
   la comunidad educativa (directivos, administrativos, docentes, padres y alumnos) acceso oportuno y seguro a la
   informacion que necesitan, desde cualquier dispositivo, reduciendo errores, mejorando la trazabilidad y elevando
   la calidad del servicio educativo.

   Desde la perspectiva tecnica, el sistema aporta una arquitectura moderna API-First que separa responsabilidades
   entre backend y frontend, facilita la evolucion independiente de modulos y protege datos sensibles con multiples
   capas de seguridad.

<div style="page-break-after: always; visibility: hidden">\pagebreak</div>

2. <span id="_Toc52661347" class="anchor"></span>**Posicionamiento**

   **2.1 Oportunidad de negocio**

   Los colegios privados del Peru operan frecuentemente con herramientas genericas (hojas de calculo, cuadernos
   fisicos, grupos de WhatsApp) que no cubren las necesidades especificas de gestion academica, administrativa y
   disciplinaria. Las soluciones comerciales existentes suelen ser costosas, rigidas o no adaptadas al contexto local.

   La oportunidad del proyecto se ubica en proveer una solucion personalizada, moderna y asequible para el Colegio
   Ciencias, con potencial de replicacion para otros colegios del Peru:

    - Modelo de negocio sostenible: pago unico + mantenimiento mensual.
    - Sistema adaptado a las reglas de negocio especificas del cliente.
    - Diferenciador tecnologico: reconocimiento facial para control de acceso.
    - Portales personalizados por rol con informacion en tiempo real.

   **Propuesta de valor resumida:**

    - Centralizacion de toda la operacion escolar en una sola plataforma.
    - Seguridad biometrica en control de acceso.
    - Transparencia financiera y academica para padres.
    - Reduccion de carga administrativa.

   **2.2 Definicion del problema**

   El problema principal es la dispersion y falta de digitalizacion de los procesos operativos del Colegio Ciencias,
   lo que genera multiples consecuencias:

    1. **Ineficiencia operativa:** procesos manuales que consumen horas diarias del personal.
    2. **Falta de trazabilidad:** informacion perdida, inconsistente o inaccesible.
    3. **Riesgos de seguridad:** control de acceso fisico sin registro confiable.
    4. **Opacidad para padres:** informacion financiera y academica no disponible en tiempo real.
    5. **Vulnerabilidad disciplinaria:** incidencias sin seguimiento formal y atenciones psicologicas sin proteccion.

   **Causas identificadas:**

    - Ausencia de un sistema integrado adaptado a las necesidades del colegio.
    - Costos percibidos como elevados para soluciones comerciales genericas.
    - Resistencia al cambio en procesos establecidos.

   **Efecto esperado con CienciasNET:**

    - Eliminar procesos manuales criticos.
    - Proveer informacion confiable y en tiempo real a todos los actores.
    - Mejorar la seguridad del entorno escolar.
    - Facilitar la toma de decisiones directivas con datos consolidados.

<div style="page-break-after: always; visibility: hidden">\pagebreak</div>

3. <span id="_Toc52661348" class="anchor"></span>**Descripcion de los interesados y usuarios**

   **3.1 Resumen de los interesados**

   | Interesado | Rol principal | Interes | Criterio de exito |
          |---|---|---|---|
   | Promotor del Colegio | Cliente y superadmin | Centralizar operacion y controlar todas las areas | Sistema funcional, seguro y adoptado por el personal |
   | Yanina (Contabilidad) | Administradora financiera | Gestionar pagos, planilla y reportes | Calculo automatico correcto y auditoria completa |
   | Coordinador Academico | Responsable academico | Gestionar estructura y evaluaciones | Periodos, notas y rankings sin errores |
   | Equipo de desarrollo | Desarrolladores | Completar proyecto academico con calidad | Entrega funcional y documentada |
   | Universidad Privada de Tacna | Institucion formadora | Promover proyectos aplicados con impacto real | Producto utilizado en contexto real |

   **3.2 Resumen de los usuarios**

   El sistema tiene 10 roles de usuario definidos con perfiles y necesidades diferenciadas:

    - **Superadmin (Promotor):** acceso total, supervision general.
    - **Gestor de usuarios:** creacion y gestion de cuentas y vinculos.
    - **Coordinador academico:** estructura academica, evaluaciones y horarios.
    - **Administrativo (Yanina):** finanzas, pagos y planilla docente.
    - **Docente:** notas de sus cursos, horarios y materiales.
    - **Auxiliar:** supervision de asistencia, excepciones e incidencias.
    - **TOE:** seguimiento disciplinario y derivaciones.
    - **Psicologia:** atencion confidencial de casos derivados.
    - **Padre/Apoderado:** consulta de informacion de hijos vinculados.
    - **Alumno:** consulta de informacion propia.

   **3.3 Entorno de usuario**

    - Dispositivos: PC, laptop, tablet o celular con navegador web moderno.
    - Conexion: internet (red del colegio o conexion personal).
    - Estaciones de asistencia: PC, celular o tablet con camara activada como estacion web.
    - Formato de interaccion: aplicacion web responsive con portales por rol.

   **Escenarios representativos de uso:**

    - **Escenario A (asistencia):** alumno se presenta ante la camara, el sistema lo identifica y registra su ingreso.
    - **Escenario B (finanzas):** Yanina genera deudas del mes y registra pagos recibidos.
    - **Escenario C (padre):** padre consulta notas y estado de cuenta desde su celular.
    - **Escenario D (incidencia):** Auxiliar registra incidencia y TOE la recibe para seguimiento.

   **3.4 Perfiles de los interesados**

    - **Promotor:** enfoque en control total, visibilidad y seguridad de la informacion.
    - **Administradora financiera:** enfoque en exactitud de calculos, auditoria y eficiencia.
    - **Equipo desarrollador:** enfoque en arquitectura limpia, pruebas y cumplimiento de requerimientos.
    - **Institucion academica:** enfoque en impacto formativo y aplicacion practica.

   **3.5 Perfiles de los usuarios**

    - **Usuario administrativo:** requiere interfaces eficientes para gestion masiva de datos.
    - **Usuario docente:** requiere formularios simples para registro de notas y consulta de horarios.
    - **Usuario padre/alumno:** requiere portal de consulta claro, rapido y accesible desde movil.
    - **Auxiliar/TOE:** requiere flujos de trabajo guiados para excepciones e incidencias.

   **3.6 Necesidades de los interesados y usuarios**

   | Necesidad | Tipo | Respuesta del sistema |
          |---|---|---|
   | Controlar acceso de alumnos y docentes con evidencia | Funcional | Reconocimiento facial con registro automatico |
   | Gestionar pagos, becas y descuentos sin errores | Funcional | Modulo financiero con auditoria e inmutabilidad |
   | Consultar notas y asistencia de hijos | Usabilidad | Portal padre responsive con datos en tiempo real |
   | Proteger datos de menores y atencion psicologica | Seguridad | HTTPS, Policies, R2 privado, auditoria |
   | Registrar y dar seguimiento a incidencias | Funcional | Flujo Auxiliar → TOE → Psicologia con historial |
   | Facilitar la adopcion por personal no tecnico | Operativa | Interfaz intuitiva, capacitacion y soporte |

<div style="page-break-after: always; visibility: hidden">\pagebreak</div>

4. <span id="_Toc52661349" class="anchor"></span>**Vista General del Producto**

   **4.1 Perspectiva del producto**

   CienciasNET es un sistema web integral que reemplaza y centraliza los procesos manuales del Colegio Ciencias. Su
   rol es ser la plataforma unica para toda la operacion academica, administrativa, financiera y disciplinaria.

   **Flujo funcional general:**

    1. Autenticacion y seleccion de portal segun rol.
    2. Gestion de estructura academica y matriculas.
    3. Registro de asistencia mediante reconocimiento facial.
    4. Gestion financiera y generacion de reportes.
    5. Registro de notas, evaluaciones y publicacion de resultados.
    6. Seguimiento de incidencias y atenciones psicologicas.
    7. Comunicados segmentados y notificaciones.

   **4.2 Resumen de capacidades**

   | ID | Capacidad | Estado | Modulo responsable |
          |---|---|---|---|
   | CAP-01 | Autenticacion con roles y permisos granulares | En desarrollo | Auth / Usuarios |
   | CAP-02 | Estructura academica (periodos, grados, secciones, cursos) | En desarrollo | Academico |
   | CAP-03 | Asistencia facial de alumnos con estaciones web | En desarrollo | Asistencia |
   | CAP-04 | Asistencia y planilla docente con calculo de descuentos | En desarrollo | Asistencia |
   | CAP-05 | Gestion financiera (deudas, pagos, becas, descuentos) | En desarrollo | Finanzas |
   | CAP-06 | Evaluaciones, notas, rankings y libretas | En desarrollo | Academico |
   | CAP-07 | Cuaderno de incidencias y atencion psicologica | En desarrollo | Incidencias / Psicologia |
   | CAP-08 | Materiales de estudio y horarios | En desarrollo | Materiales / Horarios |
   | CAP-09 | Comunicados segmentados con confirmacion de lectura | En desarrollo | Comunicados |
   | CAP-10 | Portal de consulta para padres y alumnos | En desarrollo | Frontend |

   **4.3 Suposiciones y dependencias**

   **Suposiciones de operacion:**

    - El Colegio Ciencias cuenta con conexion a internet estable.
    - Las estaciones de asistencia disponen de camaras web funcionales.
    - El personal recibira capacitacion antes del go-live.
    - Los padres cuentan con correo electronico para recibir notificaciones.

   **Dependencias tecnicas principales:**

    - Laravel 13 y PHP 8.3+ para el backend API.
    - React 19+, TypeScript y Vite para el frontend SPA.
    - PostgreSQL 16 para persistencia.
    - Python, FastAPI y face_recognition para servicio facial.
    - Nginx como reverse proxy y servidor de archivos estaticos.
    - Docker Compose para entorno reproducible.

   **Dependencias externas:**

    - Hetzner Cloud para VPS de produccion.
    - Cloudflare R2 para almacenamiento biometrico.
    - Servicio de correo para notificaciones.

   **4.4 Costos y precios**

   El proyecto tiene un modelo de negocio comercial definido:

    - **Pago unico por desarrollo:** S/. 5,000 – S/. 8,000 (incluye capacitacion y migracion de datos).
    - **Mantenimiento mensual:** S/. 300 – S/. 450/mes (incluye hosting, dominio, SSL, backups, soporte y bugs).

   Segun FD01, el costo directo de desarrollo es S/. 6,175.00 y el ingreso esperado del cliente cubre la inversion.

   **4.5 Licenciamiento e instalacion**

   La instalacion se basa en Docker Compose para entorno reproducible:

    - Clonar repositorio y configurar variables de entorno.
    - Ejecutar `docker-compose up -d` para levantar todos los servicios.
    - Ejecutar migraciones y seeders para la base de datos.
    - Acceder al frontend via `http://localhost:5173` en desarrollo.

   **Comandos de referencia (desarrollo local):**

```bash
docker-compose up -d
docker-compose exec backend php artisan migrate:fresh --seed
# Acceder a http://localhost:5173 con credenciales de prueba
```

   En produccion, el acceso es mediante dominio con HTTPS configurado en Nginx.

<div style="page-break-after: always; visibility: hidden">\pagebreak</div>

5. <span id="_Toc52661350" class="anchor"></span>**Caracteristicas del producto**

**5.1 Requisitos funcionales principales**

| ID    | Requisito funcional                                  | Descripcion resumida                                                                         |
|-------|------------------------------------------------------|----------------------------------------------------------------------------------------------|
| RF-01 | Autenticacion y gestion de sesiones                  | Login con Sanctum, sesion SPA por cookie, sesion tecnica para estaciones                     |
| RF-02 | Gestion de usuarios y roles                          | CRUD de cuentas, asignacion de roles, vinculacion padre-alumno                               |
| RF-03 | Estructura academica                                 | Periodos, grados, secciones, cursos, matriculas y cargas docentes                            |
| RF-04 | Asistencia facial de alumnos                         | Reconocimiento facial en estaciones, registro de ingresos/salidas, notificacion a padres     |
| RF-05 | Asistencia y planilla docente                        | Registro facial, calculo de tardanzas y faltas, liquidacion mensual                          |
| RF-06 | Gestion financiera                                   | Conceptos, becas, descuentos, generacion de deudas, registro de pagos, estado de cuenta      |
| RF-07 | Evaluaciones y notas                                 | Registro de notas por docente, rankings automaticos, libretas y publicacion                   |
| RF-08 | Cuaderno de incidencias                              | Registro por Auxiliar, derivacion a TOE, escalamiento a Psicologia                           |
| RF-09 | Materiales y horarios                                | Subida de archivos por docentes, consulta por alumnos, gestion de horarios                   |
| RF-10 | Comunicados                                          | Creacion segmentada, notificacion por panel y correo, confirmacion de lectura                |
| RF-11 | Portal padre                                         | Consulta de notas, asistencia, estado de cuenta e incidencias de hijos vinculados            |
| RF-12 | Portal alumno                                        | Consulta de notas, asistencia, horarios, materiales y comunicados propios                    |

**5.2 Requisitos no funcionales asociados**

- **RNF-01 (Seguridad):** HTTPS obligatorio, datos de menores protegidos, biometria en R2 privado.
- **RNF-02 (Usabilidad):** interfaz responsive adaptada a PC, tablet y celular.
- **RNF-03 (Rendimiento):** reconocimiento facial en menos de 5 segundos por captura.
- **RNF-04 (Disponibilidad):** VPS con health checks y alertas, RPO 24h y RTO 4h.
- **RNF-05 (Mantenibilidad):** arquitectura modular por dominio, contratos API versionados.
- **RNF-06 (Auditabilidad):** registro de operaciones sensibles y accesos excepcionales.

**5.3 Escenarios de uso prioritarios**

1. **Control de ingreso matutino:** alumnos pasan por estaciones faciales y el sistema notifica a padres.
2. **Cierre de planilla mensual:** Yanina revisa asistencia docente y cierra liquidacion.
3. **Consulta de notas por padres:** padre accede al portal y revisa notas publicadas de su hijo.
4. **Registro de incidencia:** Auxiliar documenta incidencia y TOE da seguimiento.

<div style="page-break-after: always; visibility: hidden">\pagebreak</div>

6. <span id="_Toc52661351" class="anchor"></span>**Restricciones**

**6.1 Restricciones tecnicas**

- Requiere servidor con PHP 8.3+, PostgreSQL 16 y Python 3.11+.
- Requiere conexion a internet para operacion completa.
- Las estaciones de asistencia requieren camaras funcionales y navegador web moderno.
- El reconocimiento facial depende de condiciones minimas de iluminacion.

**6.2 Restricciones funcionales**

- No incluye pasarela de pagos: todos los pagos se verifican externamente y se registran manualmente.
- No toma ni corrige examenes: almacena resultados de pruebas fisicas procesadas externamente.
- No existe autorregistro: todas las cuentas son creadas por superadmin o gestor de usuarios.
- No existe pago parcial: cada deuda se paga en una sola operacion.

**6.3 Restricciones de proyecto academico**

- Alcance acotado al periodo del curso.
- Priorizacion de modulos core sobre funcionalidades accesorias.
- Evolucion sujeta a disponibilidad del equipo y validacion docente.

<div style="page-break-after: always; visibility: hidden">\pagebreak</div>

7. <span id="_Toc52661352" class="anchor"></span>**Rangos de Calidad**

| Atributo              | Indicador                                            | Meta objetivo                              | Metodo de verificacion               |
|-----------------------|------------------------------------------------------|--------------------------------------------|--------------------------------------|
| Correctitud funcional | CRUD y flujos principales operan correctamente       | >= 90% de casos de prueba exitosos         | Pruebas Feature con Pest             |
| Confiabilidad         | Sistema responde sin errores criticos en uso normal  | >= 95% de uptime en produccion             | Monitoreo y health checks            |
| Rendimiento           | Reconocimiento facial y carga de paginas             | <= 5s facial, <= 2s paginas                | Medicion en entorno de referencia    |
| Usabilidad            | Adopcion por personal no tecnico                     | >= 80% del personal operando sin asistencia| Evaluacion post-capacitacion         |
| Seguridad             | Proteccion de datos sensibles                        | Cero filtraciones de datos biometricos     | Auditoria y pruebas de acceso        |
| Mantenibilidad        | Modulos independientes y documentados                | Cada modulo con pruebas y contrato API     | Revision de cobertura y documentacion|

**Criterios de aceptacion global:**

- El sistema se considera aceptable si cumple al menos los umbrales de correctitud, confiabilidad y seguridad.
- Rendimiento y usabilidad se consideran metas de mejora continua durante el mantenimiento.

<div style="page-break-after: always; visibility: hidden">\pagebreak</div>

8. <span id="_Toc52661353" class="anchor"></span>**Precedencia y Prioridad**

| Nivel | Elemento                                              | Tipo             | Justificacion                                                   |
|-------|-------------------------------------------------------|------------------|-----------------------------------------------------------------|
| Alta  | Autenticacion, roles y permisos                       | Nucleo           | Sin auth no existe acceso controlado al sistema                 |
| Alta  | Asistencia facial de alumnos                          | Diferenciador    | Principal valor agregado y requerimiento del cliente            |
| Alta  | Gestion financiera y pagos                            | Core negocio     | Impacto directo en la operacion economica del colegio           |
| Alta  | Estructura academica y evaluaciones                   | Core academico   | Base para notas, rankings y libretas                            |
| Media | Asistencia y planilla docente                         | Operativo        | Calculo de descuentos y liquidacion mensual                     |
| Media | Incidencias y psicologia                              | Disciplinario    | Seguimiento de casos y proteccion de confidencialidad           |
| Media | Portal padre y alumno                                 | Consulta         | Transparencia y comunicacion familia-colegio                    |
| Baja  | Materiales, horarios y comunicados                    | Complementario   | Funcionalidades de apoyo que mejoran la experiencia             |

**Criterio de precedencia aplicado:**

Se priorizan funcionalidades que habilitan la operacion minima viable del colegio (autenticacion, asistencia, finanzas
y academia). Los modulos complementarios se incorporan de forma incremental.

<div style="page-break-after: always; visibility: hidden">\pagebreak</div>

9. <span id="_Toc52661354" class="anchor"></span>**Otros requerimientos del producto**

**9.1 Estandares legales**

- Proteger datos personales de menores de edad con controles tecnicos estrictos.
- Obtener consentimiento registrado de padres para enrolamiento biometrico.
- Mantener metodo manual alternativo para quienes no consientan reconocimiento facial.
- Excluir datos sensibles (embeddings, notas psicologicas, tokens) de logs.

**9.2 Estandares de comunicacion**

- Notificar a padres por correo automatico ante ingresos, salidas y salidas de emergencia.
- Publicar resultados academicos mediante notificacion en panel y correo.
- Comunicados con confirmacion de lectura por destinatario.

**9.3 Estandares de cumplimiento de la plataforma**

- Arquitectura API-First con contratos OpenAPI aprobados.
- Backend modular con Laravel y modulos por dominio.
- Frontend SPA con React, TypeScript y Vite.
- Base de datos PostgreSQL con UUID para dominio y BIGSERIAL para auditoria.
- Despliegue con Docker Compose reproducible.

**9.4 Estandares de calidad y seguridad**

- HTTPS obligatorio en produccion.
- Autenticacion Sanctum SPA para personas y credenciales tecnicas para estaciones.
- Policies de recurso en backend para todo dato sensible.
- Rate limiting en endpoints criticos.
- Backups cifrados diarios con retencion de 30 dias.
- Auditoria de operaciones financieras, cambios de permisos y accesos excepcionales.

<div style="page-break-after: always; visibility: hidden">\pagebreak</div>

<span id="_Toc52661355" class="anchor"></span>**CONCLUSIONES**

1. La vision del proyecto queda definida con precision, delimitando claramente el alcance de V1 y los limites del
   sistema.
2. CienciasNET responde a una necesidad concreta del Colegio Ciencias: centralizar operaciones dispersas en una
   plataforma web segura y accesible.
3. Los 10 roles diferenciados y los 8 modulos aprobados cubren toda la operacion academica, administrativa y
   disciplinaria del colegio.
4. El reconocimiento facial como diferenciador tecnologico aporta valor real en seguridad escolar.
5. El modelo de negocio (pago unico + mantenimiento) garantiza sostenibilidad del proyecto.

<div style="page-break-after: always; visibility: hidden">\pagebreak</div>

<span id="_Toc52661356" class="anchor"></span>**RECOMENDACIONES**

1. Mantener sincronizados los documentos FD01-FD05 con la documentacion de producto en `docs/`.
2. Realizar pruebas de usuario con personal del colegio antes del go-live para validar usabilidad.
3. Implementar metricas de adopcion (uso por rol, frecuencia de consulta de padres) para evaluar impacto.
4. Planificar sesiones de capacitacion diferenciadas por rol (administrativos, docentes, padres).
5. Evaluar en V2 la incorporacion de aplicacion movil nativa y pasarela de pagos.

<div style="page-break-after: always; visibility: hidden">\pagebreak</div>

<span id="_Toc52661357" class="anchor"></span>**BIBLIOGRAFIA**

1. Pressman, R. S., & Maxim, B. R. (2020). *Software Engineering: A Practitioner's Approach*.
2. Sommerville, I. (2016). *Software Engineering*.
3. ISO/IEC 25010:2011. *Systems and software quality models*.
4. Laravel LLC. (2026). *Laravel Documentation*.
5. Meta Platforms. (2026). *React Documentation*.
6. The PostgreSQL Global Development Group. (2026). *PostgreSQL Documentation*.
7. Tiangolo, S. (2026). *FastAPI Documentation*.

<div style="page-break-after: always; visibility: hidden">\pagebreak</div>

<span id="_Toc52661358" class="anchor"></span>**WEBGRAFIA**

- Repositorio del proyecto: `README.md`.
- Vision del producto: `docs/product/overview.md`.
- Requerimientos aprobados: `docs/product/approved-requirements.md`.
- Modelo de negocio: `docs/product/business-model.md`.
- Arquitectura general: `docs/architecture/system.md`.
- https://laravel.com/docs
- https://react.dev/
- https://www.postgresql.org/docs/
- https://fastapi.tiangolo.com/
- https://vitejs.dev/
- https://docs.docker.com/
