<center>

![Logo UPT](./media/logo-upt.png)

**UNIVERSIDAD PRIVADA DE TACNA**

**FACULTAD DE INGENIERÍA**

**Escuela Profesional de Ingeniería de Sistemas**

**Informe de Especificación de Requerimientos**

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

Informe de Especificación de Requerimientos

Versión *1.0*

### Control de Versiones

| Versión | Hecha por               | Revisada por            | Aprobada por | Fecha      | Motivo          |
| :-----: | :---------------------- | :---------------------- | :----------- | :--------- | :-------------- |
|   1.0   | KZM, JVE, FYG, ACV, VLN | KZM, JVE, FYG, ACV, VLN | T. Ale Nieto | 2026-07-07 | Versión inicial |

# ÍNDICE GENERAL

1. [Introducción](#1-introducción)
2. [Generalidades de la Empresa](#2-generalidades-de-la-empresa)
    1. [Nombre de la Empresa](#21-nombre-de-la-empresa)
    2. [Visión](#22-visión)
    3. [Misión](#23-misión)
    4. [Organigrama](#24-organigrama)
3. [Visionamiento de la Empresa](#3-visionamiento-de-la-empresa)
    1. [Descripcion del problema](#31-descripcion-del-problema)
    2. [Objetivo de Negocios](#32-objetivo-de-negocios)
    3. [Objetivo de diseño](#33-objetivo-de-diseño)
    4. [Alcance del proyecto](#34-alcance-del-proyecto)
    5. [Viabilidad del sistema](#35-viabilidad-del-sistema)
    6. [Informacion obtenida del Levantamiento de informacion](#36-informacion-obtenida-del-levantamiento-de-informacion)
4. [Analisis de procesos](#4-analisis-de-procesos)
    1. [Diagrama de Procesos Actual](#41-diagrama-de-procesos-actual)
    2. [Diagrama de Procesos Propuesto](#42-diagrama-de-procesos-propuesto)
5. [Especificacion de Requerimientos de Software](#5-especificacion-de-requerimientos-de-software)
    1. [Cuadro de Requerimientos funcionales Inicial](#51-cuadro-de-requerimientos-funcionales-inicial)
    2. [Cuadro de Requerimientos no funcionales](#52-cuadro-de-requerimientos-no-funcionales)
    3. [Cuadro de Requerimientos funcionales Final](#53-cuadro-de-requerimientos-funcionales-final)
    4. [Regla de Negocio](#54-regla-de-negocio)
6. [Fase de Desarrollo](#6-fase-de-desarrollo)
    1. [Perfil del Usuario](#61-perfil-del-usuario)
    2. [Modelo Conceptual](#62-modelo-conceptual)
        1. [Diagrama de paquetes](#621-diagrama-de-paquetes)
        2. [Diagrama de casos de uso](#622-diagrama-de-casos-de-uso)
        3. [Escenarios de casos de uso (narrativas)](#623-escenarios-de-casos-de-uso-narrativas)
    3. [Modelo Lógico](#63-modelo-lógico)
        1. [Analisis de Objetos](#631-analisis-de-objetos)
        2. [Diagrama de Actividades con objetos](#632-diagrama-de-actividades-con-objetos)
        3. [Diagrama de secuencia](#633-diagrama-de-secuencia)
        4. [Diagrama de clases](#634-diagrama-de-clases)
7. [Conclusiones](#7-conclusiones)
8. [Recomendaciones](#8-recomendaciones)
9. [Bibliografia](#9-bibliografia)
10. [Webgrafia](#10-webgrafia)

<div style="page-break-after: always; visibility: hidden">\pagebreak</div>

# 1. Introducción

El presente Informe de Especificación de Requerimientos de Software (ERS) define, de manera verificable, las capacidades
funcionales y no funcionales del sistema *CienciasNET*. Este documento integra la visión del proyecto (FD02), la
factibilidad evaluada (FD01) y los requerimientos aprobados por el cliente (Colegio Ciencias) para asegurar trazabilidad
real entre requisitos, implementación y pruebas.

El sistema está orientado a centralizar la operación académica, administrativa, financiera y disciplinaria del Colegio
Ciencias, con control de asistencia mediante reconocimiento facial, portales diferenciados por rol y una arquitectura
API-First con Laravel, React, PostgreSQL y Python.

# 2. Generalidades de la Empresa

## 2.1 Nombre de la empresa

Colegio Ciencias — Tacna, Perú.

## 2.2 Visión

Ser una institución educativa líder en Tacna, reconocida por la calidad de su formación integral, la seguridad de su
entorno escolar y la transparencia de su gestión académica y administrativa.

## 2.3 Misión

Brindar educación de calidad con valores, apoyada en herramientas tecnológicas que faciliten la comunicación entre la
comunidad educativa y aseguren el bienestar integral de los estudiantes.

## 2.4 Organigrama

```mermaid
flowchart TD
    PROM[Promotor / Superadmin] --> GEST[Gestor de Usuarios]
    PROM --> COORD[Coordinador Académico]
    PROM --> ADMIN[Administrativo - Yanina]
    PROM --> TOE[Departamento TOE]
    PROM --> PSIC[Psicología]
    COORD --> DOC[Docentes]
    TOE --> AUX[Auxiliar de Educación]
    DOC --> ALU[Alumnos]
    ADMIN --> PAD[Padres / Apoderados]
```

# 3. Visionamiento de la Empresa

## 3.1 Descripcion del problema

El Colegio Ciencias gestiona su operación con procesos predominantemente manuales: asistencia por lista física, notas
en formatos individuales, cobros en hojas de cálculo, incidencias en cuadernos físicos y comunicados por WhatsApp. Esta
dispersión genera errores, pérdida de información, falta de trazabilidad e imposibilidad de consulta en tiempo real por
parte de directivos, padres y alumnos.

## 3.2 Objetivo de negocios

Centralizar toda la operación del Colegio Ciencias en una plataforma web segura que reduzca tiempos operativos, elimine
errores manuales, mejore la seguridad del entorno escolar con reconocimiento facial y ofrezca transparencia a padres de
familia mediante portales de consulta en tiempo real.

## 3.3 Objetivo de diseño

Diseñar una solución web API-First con:

- Backend modular en Laravel 13 con módulos por dominio.
- Frontend SPA en React + TypeScript + Vite con portales por rol.
- Base de datos PostgreSQL 16 con UUID para dominio y BIGSERIAL para auditoría.
- Servicio facial Python/FastAPI independiente.
- Despliegue reproducible con Docker Compose en VPS Hetzner.

## 3.4 Alcance del proyecto

**Incluido en V1:**

- 8 módulos funcionales: Usuarios, Estructura académica, Asistencia alumnos, Asistencia/planilla docente, Finanzas,
  Evaluaciones, Incidencias/Psicología, Materiales/Horarios/Comunicados.
- 10 roles diferenciados con portales personalizados.
- Reconocimiento facial con estaciones web y método manual alternativo.
- Notificaciones por panel responsive y correo electrónico.

**Fuera de alcance en V1:**

- App móvil nativa, pasarela de pagos, exámenes en línea, WhatsApp/SMS, multi-tenancy.

## 3.5 Viabilidad del sistema

Con base en FD01, la viabilidad del sistema es **alta** en dimensiones técnica, operativa, económica, legal, social y
ambiental. El stack tecnológico es maduro y open-source, el modelo de negocio cubre la inversión y el cliente ha
aprobado los requerimientos.

## 3.6 Informacion obtenida del levantamiento de informacion

Fuentes de entrada para este ERS:

- Acta de reunión con requerimientos aprobados (`docs/product/approved-requirements.md`).
- Documento de factibilidad (`docs/fds/FD01-Informe-Factibilidad.md`).
- Documento de visión (`docs/fds/FD02-Informe-Vision.md`).
- Modelo de negocio (`docs/product/business-model.md`).
- Roles y permisos (`docs/product/roles-and-permissions.md`).
- Arquitectura general (`docs/architecture/system.md`).
- Esquema de base de datos (`docs/architecture/database-schema.md`).

# 4. Analisis de procesos

## 4.1 Diagrama de procesos actual

Proceso manual sin sistema integrado.

```mermaid
flowchart LR
    A[Auxiliar pasa lista manualmente] --> B[Secretaría registra asistencia en cuaderno]
    B --> C[Yanina calcula planilla en Excel]
    C --> D[Docente entrega notas en papel]
    D --> E[Coordinador consolida notas manualmente]
    E --> F[Padre consulta por teléfono o presencialmente]
```

## 4.2 Diagrama de procesos propuesto

Proceso automatizado con CienciasNET.

```mermaid
flowchart LR
    A[Alumno se presenta ante estación facial] --> B[Servicio Python identifica rostro]
    B --> C[Laravel valida y registra asistencia]
    C --> D[Sistema notifica a padres por correo]
    D --> E[Yanina gestiona finanzas desde el panel]
    E --> F[Docente registra notas en el sistema]
    F --> G[Coordinador publica resultados]
    G --> H[Padre consulta desde portal web responsive]
```

# 5. Especificacion de Requerimientos de Software

## 5.1 Cuadro de requerimientos funcionales inicial

| ID     | Requerimiento funcional inicial             | Criterio general de aceptación                                           |
|--------|---------------------------------------------|--------------------------------------------------------------------------|
| RFI-01 | Autenticar usuarios por rol                 | Login con Sanctum, redirección a portal según rol asignado               |
| RFI-02 | Gestionar cuentas y vínculos                | CRUD de usuarios, asignación de roles y vinculación padre-alumno         |
| RFI-03 | Administrar estructura académica            | Crear y gestionar períodos, grados, secciones, cursos y cargas docentes  |
| RFI-04 | Registrar asistencia facial                 | Identificación facial en estación web con registro automático            |
| RFI-05 | Gestionar pagos y deudas                    | Generación de deudas, registro de pagos y consulta de estado de cuenta   |
| RFI-06 | Registrar y publicar evaluaciones           | Docente registra notas, sistema genera rankings y libretas               |
| RFI-07 | Registrar incidencias                       | Auxiliar registra, TOE da seguimiento, Psicología atiende               |
| RFI-08 | Consultar información por portal            | Padre y alumno acceden a datos vinculados o propios                      |

## 5.2 Cuadro de requerimientos no funcionales

| ID     | Requerimiento no funcional      | Métrica / Umbral                                                 | Evidencia esperada                                   |
|--------|---------------------------------|------------------------------------------------------------------|------------------------------------------------------|
| RNF-01 | Seguridad de datos de menores   | HTTPS, Policies, R2 privado, auditoría                           | Cero filtraciones de datos sensibles                 |
| RNF-02 | Rendimiento facial              | Reconocimiento en <= 5 segundos                                  | Timeout configurado y medición en producción         |
| RNF-03 | Disponibilidad                  | >= 95% uptime mensual                                            | Health checks y alertas                              |
| RNF-04 | Usabilidad responsive           | Interfaz funcional en PC, tablet y celular                       | Pruebas en múltiples dispositivos                    |
| RNF-05 | Mantenibilidad                  | Módulos independientes con contratos API                         | Arquitectura documentada y pruebas por módulo        |
| RNF-06 | Escalabilidad                   | Soporte para 300+ alumnos, 30+ docentes                         | Pruebas de carga en entorno de referencia            |
| RNF-07 | Auditabilidad                   | Registro de operaciones sensibles                                | Logs estructurados sin datos secretos                |
| RNF-08 | Backups                         | Diarios cifrados con retención 30 días, RPO 24h, RTO 4h         | Restauración probada trimestralmente                 |

## 5.3 Cuadro de requerimientos funcionales final

| ID    | Requerimiento funcional final                                                         | Prioridad | Módulo responsable          |
|-------|---------------------------------------------------------------------------------------|-----------|-----------------------------|
| RF-01 | Autenticación Sanctum con sesión SPA para personas y credencial técnica para estaciones | Alta      | Auth                        |
| RF-02 | CRUD de usuarios con 10 roles, permisos granulares y Policies                          | Alta      | Usuarios                    |
| RF-03 | Vinculación padre-alumno (muchos a muchos) y selección de contexto por rol             | Alta      | Usuarios                    |
| RF-04 | Gestión de períodos, grados, secciones, cursos, matrículas y cargas docentes           | Alta      | Academico                   |
| RF-05 | Activación de estaciones web mediante QR/código temporal sin sesión personal            | Alta      | Asistencia                  |
| RF-06 | Reconocimiento facial con prueba de vida, umbrales configurables y método manual        | Alta      | Asistencia / Facial         |
| RF-07 | Registro de ingresos/salidas con reglas de horario y generación de faltas al cierre    | Alta      | Asistencia                  |
| RF-08 | Notificación automática a padres por correo ante ingreso, salida y emergencia          | Alta      | Asistencia / Notificaciones |
| RF-09 | Supervisión y resolución de excepciones de asistencia por Auxiliar                      | Alta      | Asistencia                  |
| RF-10 | Asistencia docente facial con cálculo de tardanzas contra primera clase programada     | Alta      | Asistencia                  |
| RF-11 | Planilla docente: tardanza, falta justificada/injustificada, sustituto y liquidación    | Alta      | Asistencia / Finanzas       |
| RF-12 | Gestión de conceptos de cobro, becas, descuentos y generación automática de deudas     | Alta      | Finanzas                    |
| RF-13 | Registro manual de pagos (efectivo, transferencia, Yape, Plin) con inmutabilidad        | Alta      | Finanzas                    |
| RF-14 | Estado de cuenta de alumnos con historial de deudas y pagos                             | Alta      | Finanzas                    |
| RF-15 | Registro de notas por docente según carga, con validación de período y sección          | Alta      | Academico                   |
| RF-16 | Rankings automáticos y generación de libretas por período                                | Media     | Academico                   |
| RF-17 | Cuaderno de incidencias virtual con flujo Auxiliar → TOE → Psicología                  | Media     | Incidencias / Psicología    |
| RF-18 | Registro confidencial de atenciones psicológicas (solo Psicología y superadmin)         | Media     | Psicología                  |
| RF-19 | Subida y consulta de materiales de estudio por curso                                    | Baja      | Materiales                  |
| RF-20 | Gestión de horarios y calendario escolar                                                | Baja      | Horarios                    |
| RF-21 | Comunicados segmentados con confirmación de lectura                                     | Baja      | Comunicados                 |
| RF-22 | Portal padre: notas, asistencia, estado de cuenta, incidencias de hijos vinculados      | Alta      | Frontend                    |
| RF-23 | Portal alumno: notas, asistencia, horarios, materiales y comunicados propios            | Media     | Frontend                    |

## 5.4 Regla de negocio

| ID    | Regla de negocio                                                                                          | Aplicación                              |
|-------|-----------------------------------------------------------------------------------------------------------|-----------------------------------------|
| RN-01 | No existe autorregistro; todas las cuentas son creadas por superadmin o gestor de usuarios                 | Módulo Usuarios                         |
| RN-02 | Un padre puede vincularse a varios alumnos y un alumno a varios padres                                    | Vinculación padre-alumno                |
| RN-03 | El primer pase facial del día es ingreso, el siguiente es salida; presencia sin salida crea anomalía       | Módulo Asistencia                       |
| RN-04 | La falta se genera al cierre configurable de la jornada si no existió ningún ingreso                       | Módulo Asistencia                       |
| RN-05 | Solo TOE o Auxiliar pueden justificar faltas de alumnos                                                   | Módulo Asistencia                       |
| RN-06 | La tardanza docente se calcula contra la primera clase programada del día                                  | Planilla docente                        |
| RN-07 | Cada deuda se paga en una sola operación (no existen pagos parciales)                                     | Módulo Finanzas                         |
| RN-08 | Las deudas pagadas/anuladas y los movimientos históricos nunca se modifican                                | Módulo Finanzas                         |
| RN-09 | Yanina es la única cuenta autorizada para gestión financiera y cierre de planilla                          | Permisos específicos                    |
| RN-10 | Las atenciones psicológicas son confidenciales, visibles solo por Psicología y superadmin                  | Módulo Psicología                       |
| RN-11 | Las estaciones web usan sesiones técnicas y nunca reciben la sesión personal de un trabajador              | Módulo Asistencia                       |
| RN-12 | El enrolamiento facial requiere consentimiento registrado de padres                                       | Servicio facial                         |

# 6. Fase de Desarrollo

## 6.1 Perfil del usuario

| Perfil                       | Características                                                                                 | Necesidades principales                                                                        |
|------------------------------|-------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| Promotor (superadmin)        | Director con acceso total al sistema. Toma decisiones estratégicas.                             | Control completo, reportes gerenciales, visibilidad global de la institución.                  |
| Gestor de Usuarios           | Delegado administrativo para operaciones de sistema.                                            | Gestión ágil de cuentas, perfiles, asignación de roles operativos y vínculos familiares.       |
| Administrativo (Yanina)      | Encargada de contabilidad, gestión financiera y planilla.                                       | Exactitud en cálculos, trazabilidad, generación de reportes financieros y auditoría de pagos.  |
| Coordinador académico        | Responsable de la currícula, asignación de cursos y períodos.                                   | Administración eficiente de grados, secciones, consolidación de notas y gestión académica.     |
| Docente                      | Imparte clases, responsable de calificar y registrar asistencia.                                | Interfaz intuitiva para ingresar notas, consultar sus horarios y subir material de estudio.    |
| Auxiliar                     | Primer contacto en control de puerta e incidencias.                                             | Herramienta rápida para resolver excepciones de asistencia facial y registro de incidencias.   |
| TOE (Tutoría/Orientación)    | Supervisa la disciplina y orientación de los alumnos.                                           | Seguimiento de incidencias reportadas por auxiliares, comunicación con padres y psicología.    |
| Psicología                   | Atiende el bienestar emocional y de salud mental del alumnado.                                  | Privacidad, acceso a historial de alumnos derivados y registro confidencial de atenciones.     |
| Padre / Apoderado            | Tutor legal o financiero del estudiante.                                                        | Portal claro, rápido y accesible desde móvil para monitorear asistencia, notas y pagos.        |
| Alumno                       | Estudiante activo de la institución.                                                            | Acceso a notas, horarios, comunicados, tareas y materiales de forma rápida.                    |

## 6.2 Modelo Conceptual

### 6.2.1 Diagrama de paquetes

```mermaid
flowchart TD
    subgraph Frontend [Aplicación Cliente]
        SPA[SPA React + Vite]
        PORTAL_P[Portal Padres]
        PORTAL_A[Portal Alumnos]
        PANEL[Panel Administrativo]
    end

    subgraph Backend [Laravel API]
        AUTH[Módulo Auth & Seguridad]
        USERS[Módulo Usuarios & Roles]
        ACAD[Módulo Académico]
        ASIST[Módulo Asistencia]
        FIN[Módulo Finanzas]
        INCID[Módulo Incidencias]
        PSIC[Módulo Psicología]
        COM[Módulo Comunicaciones & Materiales]
    end

    subgraph Infraestructura [Servicios Externos]
        FACIAL[Servicio Facial Python/FastAPI]
        DB[(PostgreSQL 16)]
        R2[Cloudflare R2 Storage]
        MAIL[SMTP / Servicio de Correo]
    end

    SPA --> AUTH
    SPA --> USERS
    SPA --> ACAD
    SPA --> FIN
    SPA --> ASIST
    
    ASIST --> FACIAL
    Backend --> DB
    Backend --> R2
    Backend --> MAIL
```

### 6.2.2 Diagramas de casos de uso por Módulo

**1. Módulo: Identidad y Acceso (Usuarios)**
```mermaid
flowchart LR
    GESTOR[Gestor / Promotor] --> UC1[Crear/Actualizar cuenta y restablecer clave]
    GESTOR --> UC2[Asignar rol y delegar permisos]
    GESTOR --> UC3[Vincular padre y alumno]
    USER[Cualquier Usuario] --> UC4[Seleccionar contexto de portal multi-rol]
```

**2. Módulo: Académico**
```mermaid
flowchart LR
    COORD[Coordinador] --> UC5[Gestionar estructura, matrícula y carga académica]
    COORD --> UC6[Gestionar horarios y sesiones de clase]
    COORD --> UC7[Revisar, cerrar evaluaciones y generar rankings/libretas]
    DOC[Docente] --> UC8[Crear evaluación y cargar notas individual/masivo]
    DOC --> UC9[Publicar materiales de estudio y calendario]
```

**3. Módulo: Asistencia y Planilla**
```mermaid
flowchart LR
    EST[Estación web] --> UC10[Procesar evento facial y capturar rostros]
    AUX[Auxiliar] --> UC11[Registrar asistencia manual y salidas de emergencia]
    AUX --> UC12[Resolver anomalías, dudosas y justificar faltas]
    YAN[Administrativo] --> UC13[Ajustar planilla docente y registrar sustitutos]
    YAN --> UC14[Cerrar liquidación mensual docente]
```

**4. Módulo: Finanzas**
```mermaid
flowchart LR
    YAN[Administrativo] --> UC15[Configurar conceptos, beneficios y vencimientos]
    YAN --> UC16[Generar deudas y ajustar pendientes masivamente]
    YAN --> UC17[Registrar pagos completos y generar recibo]
    YAN --> UC18[Registrar anulaciones y devoluciones]
    YAN --> UC19[Consultar estado de cuenta, morosos y reporte de caja]
```

**5. Módulo: Incidencias, Psicología y Comunicaciones**
```mermaid
flowchart LR
    AUX[Auxiliar] --> UC20[Registrar incidencia inicial y derivar a TOE]
    TOE[TOE] --> UC21[Dar seguimiento, comentar y resolver incidencia]
    PSIC[Psicología] --> UC22[Registrar atención psicológica confidencial]
    PROM[Gestor / Coord] --> UC23[Publicar comunicados segmentados]
    PAD[Padre / Alumno] --> UC24[Consultar comunicados y notificaciones]
```

### 6.2.3 Escenarios de casos de uso (narrativas) y Diagramas de Secuencia

Por cada módulo se describe un caso de uso principal con su respectivo diagrama de secuencia.

**Módulo 1: Identidad y Acceso**
#### CU-01: Vincular Padre y Alumno
**Actor:** Gestor de Usuarios
**Flujo Principal:**
1. El gestor busca el perfil del alumno en el sistema.
2. Ingresa el correo electrónico del padre o apoderado.
3. El sistema verifica si el correo existe; si no, crea una nueva cuenta de padre.
4. El sistema crea el vínculo N:M entre padre y alumno.
5. El sistema envía credenciales (si es cuenta nueva) al padre.
**Resultado:** Padre vinculado, capaz de acceder al portal familiar.

```mermaid
sequenceDiagram
    actor Gestor
    participant API as Laravel API
    participant DB as PostgreSQL
    participant MAIL as Servicio Correo

    Gestor ->> API: POST /api/v1/usuarios/vinculos (alumnoId, emailPadre)
    API ->> DB: Buscar emailPadre
    alt Email no existe
        API ->> DB: INSERT usuario (rol: padre)
        API ->> MAIL: Enviar credenciales
    end
    API ->> DB: INSERT vinculo_padre_alumno
    DB -->> API: OK
    API -->> Gestor: Vínculo registrado exitosamente
```

**Módulo 2: Académico**
#### CU-02: Crear evaluación y cargar notas masivamente
**Actor:** Docente
**Flujo Principal:**
1. El docente accede a su carga académica activa.
2. Crea una nueva evaluación para el periodo y sección.
3. El sistema carga la lista de estudiantes inscritos.
4. El docente ingresa las notas (borrador) y guarda.
5. Tras verificar, el docente o coordinador publica las notas (cierran la evaluación).
**Resultado:** Notas publicadas y ranking recalculado automáticamente.

```mermaid
sequenceDiagram
    actor Docente
    participant FRONT as Portal Docente
    participant API as Laravel API
    participant DB as PostgreSQL

    Docente ->> FRONT: Crear evaluación y cargar notas
    FRONT ->> API: POST /api/v1/evaluaciones (datos)
    API ->> DB: Validar carga activa y periodo
    API ->> DB: INSERT evaluación y notas en borrador
    DB -->> API: OK
    API -->> FRONT: Evaluaciones creadas
    Docente ->> FRONT: Publicar notas
    FRONT ->> API: PATCH /api/v1/evaluaciones/{id}/publicar
    API ->> DB: UPDATE estado='publicada'
    API ->> DB: Recalcular ranking de sección
    API -->> FRONT: Notas publicadas
```

**Módulo 3: Asistencia y Planilla**
#### CU-03: Procesar asistencia facial y notificar
**Actor:** Alumno / Servicio Python
**Flujo Principal:**
1. El alumno escanea su rostro en un dispositivo web autorizado.
2. Laravel envía la imagen a Python para validación biométrica.
3. Si la confianza es alta, Laravel identifica si es ingreso o salida.
4. Se registra el movimiento de asistencia en la base de datos.
5. Se despacha de forma asíncrona una notificación al padre.
**Resultado:** Registro inmutable del pase y padre notificado.

```mermaid
sequenceDiagram
    actor Alumno
    participant EST as Estación Web
    participant API as Laravel API
    participant PY as API Facial Python
    participant DB as PostgreSQL
    participant MAIL as Servicio Correo

    Alumno ->> EST: Se presenta frente a cámara
    EST ->> API: POST /api/v1/asistencia/captura (img)
    API ->> PY: POST /recognize (img)
    PY -->> API: { match: true, userId, confidence: 0.98 }
    API ->> DB: Determinar ingreso/salida y estado (tardanza)
    API ->> DB: INSERT movimiento_asistencia
    API ->> MAIL: Notificar a padres
    API -->> EST: { status: "success", msg: "Asistencia registrada" }
```

**Módulo 4: Finanzas**
#### CU-04: Registrar pago completo y generar recibo
**Actor:** Administrativo (Yanina)
**Flujo Principal:**
1. Yanina verifica el dinero en cuenta (ej. banco/Yape).
2. Localiza la obligación de pago del alumno correspondiente en el sistema.
3. Verifica el monto exacto (ordinario o pronto pago según vigencia).
4. Registra el pago inmutable por el monto completo.
5. La deuda cambia a estado "pagada" y se emite recibo electrónico.
**Resultado:** Deuda saldada, ingresos actualizados en el reporte de caja.

```mermaid
sequenceDiagram
    actor Yanina
    participant API as Laravel API
    participant DB as PostgreSQL

    Yanina ->> API: GET /api/v1/finanzas/alumnos/{id}/deudas
    API -->> Yanina: Lista de deudas pendientes
    Yanina ->> API: POST /api/v1/finanzas/pagos (deudaId, metodo, ref)
    API ->> DB: Validar deuda pendiente y monto exacto
    API ->> DB: UPDATE deuda SET estado='pagada'
    API ->> DB: INSERT movimiento_pago
    DB -->> API: Transacción OK
    API -->> Yanina: Comprobante/Recibo generado
```

**Módulo 5: Incidencias, Psicología y Comunicaciones**
#### CU-05: Derivar y resolver incidencia
**Actor:** Auxiliar, TOE
**Flujo Principal:**
1. Auxiliar registra la incidencia inicial vinculando a un alumno.
2. Auxiliar deriva la incidencia al departamento de TOE.
3. TOE recibe notificación, investiga y cita al apoderado (si aplica).
4. TOE registra las acciones correctivas, comentarios y cambia estado a "Resuelta".
**Resultado:** Incidencia trazable y archivada en el expediente del alumno.

```mermaid
sequenceDiagram
    actor Auxiliar
    actor TOE
    participant API as Laravel API
    participant DB as PostgreSQL

    Auxiliar ->> API: POST /api/v1/incidencias (datos, derivar_a: 'toe')
    API ->> DB: INSERT incidencia
    DB -->> API: OK
    API -->> TOE: (Notificación asíncrona) Nueva incidencia asignada
    TOE ->> API: GET /api/v1/incidencias/{id}
    API -->> TOE: Historial de la incidencia
    TOE ->> API: POST /api/v1/incidencias/{id}/acciones (comentario, resolucion)
    API ->> DB: INSERT accion_incidencia
    API ->> DB: UPDATE incidencia SET estado='resuelta'
    API -->> TOE: Incidencia cerrada exitosamente
```

## 6.3 Modelo Lógico

### 6.3.1 Analisis de objetos

| Objeto                    | Responsabilidad                                                    | Tipo                          |
|---------------------------|--------------------------------------------------------------------|-------------------------------|
| `User`                    | Representar una cuenta con roles y permisos                        | Entidad de dominio            |
| `Periodo`                 | Definir período académico con fechas y estado                      | Entidad de dominio            |
| `Grado` / `Seccion`       | Organizar estructura académica                                     | Entidad de dominio            |
| `Matricula`               | Vincular alumno con grado/sección en un período                    | Relación de dominio           |
| `CargaDocente`            | Asignar docente a curso/sección                                    | Relación de dominio           |
| `MovimientoAsistencia`    | Registrar un pase (ingreso/salida) con timestamp y método          | Evento de dominio             |
| `Deuda`                   | Representar obligación financiera congelada                        | Entidad financiera            |
| `Pago`                    | Registrar pago completo e inmutable                                | Evento financiero             |
| `Nota`                    | Registrar resultado de evaluación por alumno/curso                  | Entidad académica             |
| `Incidencia`              | Registrar evento disciplinario con flujo de derivación             | Entidad de seguimiento        |
| `AtencionPsicologica`     | Registrar atención confidencial                                    | Entidad protegida             |
| `Estacion`                | Representar dispositivo activado para asistencia facial            | Entidad de infraestructura    |

### 6.3.2 Diagrama de actividades con objetos

```mermaid
flowchart TD
    A([Inicio]) --> B[Alumno se presenta ante estación]
    B --> C[Estación captura imagen y envía a Laravel]
    C --> D[Laravel envía imagen a servicio Python]
    D --> E{Python reconoce?}
    E -- Sí, confianza >= 0.85 --> F[Laravel registra MovimientoAsistencia]
    E -- Dudoso, 0.65-0.85 --> G[Auxiliar revisa y confirma]
    E -- No reconocido --> H[Auxiliar aplica método manual]
    G --> F
    H --> F
    F --> I{Es ingreso o salida?}
    I -- Ingreso --> J[Notificar padre por correo]
    I -- Salida --> K[Notificar padre por correo]
    J --> L([Fin])
    K --> L
```

### 6.3.3 Diagrama de secuencia

```mermaid
sequenceDiagram
    actor Alumno
    participant EST as Estación Web
    participant API as Laravel API
    participant PY as Servicio Facial Python
    participant DB as PostgreSQL
    participant MAIL as Servicio de Correo
    Alumno ->> EST: Se presenta ante cámara
    EST ->> API: POST /api/v1/asistencia/captura (imagen)
    API ->> PY: POST /recognize (imagen, perfiles activos)
    PY -->> API: {match: true, userId, confianza: 0.92}
    API ->> DB: INSERT movimiento_asistencia
    DB -->> API: OK
    API ->> MAIL: Enviar notificación a padre
    MAIL -->> API: OK
    API -->> EST: {status: "ingreso_registrado"}
```

### 6.3.4 Diagrama de clases

```mermaid
classDiagram
    class User {
        +uuid: UUID
        +nombre: String
        +email: String
        +roles: Role[]
    }

    class Periodo {
        +uuid: UUID
        +nombre: String
        +fechaInicio: Date
        +fechaFin: Date
        +estado: String
    }

    class Matricula {
        +uuid: UUID
        +alumno: User
        +periodo: Periodo
        +grado: Grado
        +seccion: Seccion
    }

    class MovimientoAsistencia {
        +id: BigInt
        +persona: User
        +tipo: enum ingreso/salida
        +metodo: enum facial/manual
        +timestamp: DateTime
        +estacion: Estacion
    }

    class Deuda {
        +uuid: UUID
        +alumno: User
        +concepto: String
        +montoOrdinario: Decimal
        +montoProntoPago: Decimal
        +fechaLimite: Date
        +estado: enum pendiente/pagada/anulada
    }

    class Pago {
        +uuid: UUID
        +deuda: Deuda
        +monto: Decimal
        +medioPago: String
        +registradoPor: User
        +timestamp: DateTime
    }

    class Nota {
        +uuid: UUID
        +alumno: User
        +cargaDocente: CargaDocente
        +valor: Decimal
        +periodo: Periodo
    }

    class Incidencia {
        +uuid: UUID
        +alumno: User
        +descripcion: String
        +registradoPor: User
        +estado: enum abierta/en_seguimiento/resuelta
    }

    class Estacion {
        +uuid: UUID
        +nombre: String
        +codigoActivacion: String
        +activa: Boolean
    }

    User "1" --> "*" Matricula
    User "1" --> "*" MovimientoAsistencia
    User "1" --> "*" Deuda
    Deuda "1" --> "0..1" Pago
    User "1" --> "*" Nota
    User "1" --> "*" Incidencia
    MovimientoAsistencia --> Estacion
```

# 7. Conclusiones

1. El ERS define requerimientos verificables y trazables a los módulos reales del proyecto, reduciendo ambigüedad
   documental.
2. Los 23 requerimientos funcionales y 8 no funcionales cubren la operación completa del Colegio Ciencias.
3. Las 12 reglas de negocio reflejan las decisiones aprobadas con el cliente en la reunión de levantamiento.
4. Los diagramas de proceso, casos de uso, secuencia y clases documentan el flujo desde la perspectiva del usuario y
   la arquitectura técnica.
5. La arquitectura modular (módulos por dominio en Laravel) facilita el desarrollo incremental y el mantenimiento.

# 8. Recomendaciones

1. Mantener sincronizados FD01, FD02, FD03 y los documentos de producto en `docs/` al cerrar cada módulo.
2. Validar cada módulo con el cliente antes de avanzar al siguiente para evitar retrabajos.
3. Implementar pruebas Feature con Pest para cada endpoint del contrato API.
4. Realizar pruebas de reconocimiento facial en condiciones reales del colegio (iluminación, cámaras).
5. Definir métricas de adopción por rol para evaluar el impacto real del sistema.

# 9. Bibliografia

1. Pressman, R. S., & Maxim, B. R. (2020). *Software Engineering: A Practitioner's Approach*.
2. Sommerville, I. (2016). *Software Engineering*.
3. ISO/IEC 25010:2011. *Systems and software quality models*.
4. Laravel LLC. (2026). *Laravel Documentation*.
5. Meta Platforms. (2026). *React Documentation*.
6. The PostgreSQL Global Development Group. (2026). *PostgreSQL Documentation*.
7. Tiangolo, S. (2026). *FastAPI Documentation*.

# 10. Webgrafia

- Repositorio del proyecto: `README.md`
- Requerimientos aprobados: `docs/product/approved-requirements.md`
- Roles y permisos: `docs/product/roles-and-permissions.md`
- Arquitectura general: `docs/architecture/system.md`
- Backend modular: `docs/architecture/backend.md`
- Frontend SPA: `docs/architecture/frontend.md`
- Esquema de base de datos: `docs/architecture/database-schema.md`
- https://laravel.com/docs
- https://react.dev/
- https://www.postgresql.org/docs/
- https://fastapi.tiangolo.com/
- https://vitejs.dev/
