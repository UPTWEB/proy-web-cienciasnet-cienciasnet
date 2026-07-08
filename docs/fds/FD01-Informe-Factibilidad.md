<center>

![Logo UPT](./media/logo-upt.png)

**UNIVERSIDAD PRIVADA DE TACNA**

**FACULTAD DE INGENIERÍA**

**Escuela Profesional de Ingeniería de Sistemas**

**Informe de Factibilidad**

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

Informe de Factibilidad

Versión *1.0*

| CONTROL DE VERSIONES |                     |              |                    |            |                  |
|:--------------------:|:--------------------|:-------------|:-------------------|:-----------|:-----------------|
|       Versión        | Hecha por           | Revisada por | Aprobada por       | Fecha      | Motivo           |
|         1.0          | KZM, JVE, FYG, ACV, VLN | KZM, JVE, FYG, ACV, VLN | T. Ale Nieto | 2026-07-07 | Versión original |

# ÍNDICE GENERAL

1. [Descripción del Proyecto](#1-descripción-del-proyecto)
2. [Riesgos](#2-riesgos)
3. [Análisis de la Situación Actual](#3-análisis-de-la-situación-actual)
4. [Estudio de Factibilidad](#4-estudio-de-factibilidad)
    - 4.1 [Factibilidad Técnica](#41-factibilidad-técnica)
    - 4.2 [Factibilidad Económica](#42-factibilidad-económica)
    - 4.3 [Factibilidad Operativa](#43-factibilidad-operativa)
    - 4.4 [Factibilidad Legal](#44-factibilidad-legal)
    - 4.5 [Factibilidad Social](#45-factibilidad-social)
    - 4.6 [Factibilidad Ambiental](#46-factibilidad-ambiental)
5. [Análisis Financiero](#5-análisis-financiero)
6. [Conclusiones](#6-conclusiones)

<div style="page-break-after: always; visibility: hidden">\pagebreak</div>

# Informe de Factibilidad

## 1. Descripción del Proyecto

### 1.1. Nombre del proyecto

**Sistema Web Académico y Administrativo — CienciasNET**

### 1.2. Duración del proyecto

El proyecto tiene una duración estimada de aproximadamente **10 semanas**, distribuidas entre el levantamiento de
requerimientos, diseño de arquitectura, desarrollo iterativo de módulos, pruebas y despliegue en producción.

| Fase                                                  | Semanas      | Duración   |
|-------------------------------------------------------|--------------|------------|
| Levantamiento de requerimientos y definición de alcance | Sem. 1 – 2  | 2 semanas  |
| Diseño de arquitectura y contratos API                | Sem. 3 – 4   | 2 semanas  |
| Desarrollo de módulos core (auth, estructura, asistencia) | Sem. 5 – 7 | 3 semanas  |
| Desarrollo de módulos complementarios y frontend      | Sem. 7 – 9   | 3 semanas  |
| Pruebas, despliegue y capacitación                    | Sem. 9 – 10  | 2 semanas  |

### 1.3. Descripción

CienciasNET es una intranet web diseñada para centralizar la operación académica, administrativa, financiera y
disciplinaria del **Colegio Ciencias** de Tacna. El sistema integra control de asistencia mediante reconocimiento facial,
gestión de estructura académica (períodos, matrículas, cursos y cargas docentes), planilla docente con cálculo automático
de tardanzas y faltas, gestión financiera de pagos manuales con beneficios y descuentos, evaluaciones con rankings y
libretas, cuaderno de incidencias con derivaciones a TOE y Psicología, materiales de estudio, horarios, calendario y
comunicados segmentados.

La importancia del proyecto radica en que el Colegio Ciencias opera actualmente con procesos manuales y herramientas
dispersas (hojas de cálculo, cuadernos físicos, comunicaciones informales) que generan pérdida de información, falta
de trazabilidad y demoras en la toma de decisiones. La propuesta centraliza toda esta operación en una plataforma web
segura, accesible desde cualquier dispositivo, con portales diferenciados para cada rol (Promotor, administrativos,
coordinador, docentes, padres y alumnos).

El sistema utiliza una arquitectura **API-First** con **Laravel 13** como backend, **React + TypeScript + Vite** como
frontend SPA, **PostgreSQL 16** como base de datos, un servicio de **reconocimiento facial en Python/FastAPI** y
almacenamiento privado en **Cloudflare R2** para datos biométricos.

El proyecto se desarrolla como trabajo del curso de Programación Web 1 en la Escuela Profesional de Ingeniería de
Sistemas de la Universidad Privada de Tacna, con un cliente real y un modelo de negocio definido (pago único +
mantenimiento mensual).

### 1.4. Objetivos

#### 1.4.1. Objetivo general

Desarrollar un sistema web académico y administrativo que centralice la gestión del Colegio Ciencias, integrando control
de asistencia con reconocimiento facial, gestión académica, financiera y disciplinaria, con portales diferenciados por
rol y una arquitectura segura y escalable.

#### 1.4.2. Objetivos específicos

1. **Implementar un módulo de autenticación y gestión de usuarios** con 10 roles diferenciados, permisos granulares
   mediante Spatie Laravel Permission y Policies de recurso, para garantizar que cada actor acceda únicamente a la
   información que le corresponde.

2. **Desarrollar un sistema de asistencia con reconocimiento facial** que permita registrar entradas y salidas de
   alumnos y docentes mediante estaciones web activadas por código temporal, con supervisión del Auxiliar y notificación
   automática a padres por correo electrónico.

3. **Construir un módulo de gestión financiera** que administre conceptos de cobro, becas, descuentos, generación
   automática de deudas por período y registro manual de pagos, con inmutabilidad de movimientos históricos y auditoría
   completa.

4. **Implementar un módulo de evaluación y academia** que gestione períodos, grados, secciones, matrículas, cursos,
   carga docente y registro de notas, con generación automática de rankings y libretas.

5. **Desarrollar un módulo de incidencias y psicología** con flujo de derivación Auxiliar → TOE → Psicología,
   incluyendo registros confidenciales visibles únicamente por Psicología y el Promotor.

6. **Diseñar e implementar una arquitectura API-First** con contratos OpenAPI aprobados, separación estricta entre
   backend (Laravel) y frontend (React SPA), y despliegue en VPS Hetzner con Docker Compose.

## 2. Riesgos

| #  | Riesgo                                                                                                                                                                         | Probabilidad | Impacto | Mitigación                                                                                                                                                          |
|----|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:------------:|:-------:|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| R1 | **Complejidad del reconocimiento facial**: la precisión del servicio Python puede verse afectada por condiciones de iluminación, calidad de cámaras o resistencia de usuarios. |    Media     |  Alto   | Prueba de vida obligatoria, umbrales configurables (aceptación 0.85, revisión 0.65), método manual alternativo y supervisión del Auxiliar.                           |
| R2 | **Sensibilidad de datos de menores y biometría**: el sistema maneja datos personales de menores, embeddings faciales y notas psicológicas confidenciales.                      |     Alta     |  Alto   | HTTPS obligatorio, almacenamiento R2 privado, auditoría de accesos, Policies restrictivas, backups cifrados y datos sensibles excluidos de logs.                    |
| R3 | **Cambios en requerimientos del cliente**: el Colegio Ciencias puede solicitar modificaciones durante el desarrollo que impacten el alcance.                                   |    Media     |  Medio  | Acta de reunión con requerimientos aprobados, contratos API versionados y gestión de cambios con cotización separada.                                                |
| R4 | **Disponibilidad del VPS y servicios externos**: caídas del servidor Hetzner, Cloudflare R2 o servicios de correo pueden interrumpir la operación.                             |     Baja     |  Alto   | Health checks, alertas automáticas, backups cifrados fuera del VPS, RPO 24h y RTO 4h, Docker Compose para recuperación rápida.                                       |
| R5 | **Integración entre múltiples tecnologías**: la coordinación entre Laravel, React, Python, PostgreSQL y R2 introduce complejidad de integración.                               |    Media     |  Medio  | Arquitectura API-First con contratos aprobados antes de implementar, pruebas de integración y Docker Compose para desarrollo local reproducible.                    |
| R6 | **Carga concurrente en horarios pico**: la entrada y salida de alumnos genera un pico de solicitudes de reconocimiento facial simultáneas.                                     |    Media     |  Alto   | Rate limiting, procesamiento en memoria sin persistir capturas rutinarias, colas Laravel para tareas diferidas y timeout de 5 segundos por reconocimiento.           |
| R7 | **Resistencia al cambio del personal**: el personal administrativo y docente puede mostrar resistencia a adoptar un sistema digital nuevo.                                     |    Media     |  Medio  | Capacitación incluida en la entrega, manual PDF por rol, interfaz responsive e intuitiva y soporte técnico durante los primeros meses.                               |

## 3. Análisis de la Situación Actual

### 3.1. Planteamiento del problema

El Colegio Ciencias de Tacna es una institución educativa privada que gestiona su operación académica y administrativa
mediante procesos predominantemente manuales. Esta situación genera varios problemas críticos:

**Asistencia manual y sin trazabilidad.** El registro de asistencia de alumnos se realiza mediante listas físicas o
llamado en aula, lo que dificulta la detección oportuna de ausencias, impide la notificación inmediata a padres y no
permite generar reportes históricos confiables. La asistencia docente se controla de forma similar, complicando el
cálculo de tardanzas y descuentos en planilla.

**Gestión financiera dispersa.** Los cobros de matrícula, mensualidades, cuotas de ingreso, becas y descuentos se
administran en hojas de cálculo, lo que genera riesgo de errores, dificulta la auditoría y no permite al padre de
familia consultar su estado de cuenta en tiempo real.

**Evaluaciones y resultados sin centralización.** Las notas se registran en formatos físicos o archivos individuales
por docente, lo que retrasa la publicación de resultados, dificulta la generación de rankings y libretas, y no ofrece
a padres y alumnos un portal de consulta unificado.

**Incidencias sin seguimiento formal.** El cuaderno de incidencias es físico, las derivaciones a TOE y Psicología se
realizan de forma verbal o mediante notas informales, y no existe un historial digital que permita dar seguimiento
a casos y proteger la confidencialidad de las atenciones psicológicas.

**Comunicaciones fragmentadas.** Los comunicados se distribuyen mediante circulares físicas, grupos de WhatsApp u otros
medios informales, sin garantía de entrega ni confirmación de lectura.

### 3.2. Consideraciones de hardware y software

**Hardware disponible para el desarrollo:**

| Recurso                    | Especificación                                           | Disponibilidad                                |
|----------------------------|----------------------------------------------------------|-----------------------------------------------|
| Equipos de desarrollo      | CPU 4+ núcleos, 8+ GB RAM, SSD                          | Disponibles (equipos del equipo de desarrollo) |
| VPS de producción          | Hetzner CX32: 4 vCPU, 8 GB RAM, 80 GB SSD               | Contratado (incluido en mantenimiento)        |
| Estaciones de asistencia   | PC, celular o tablet con cámara web                      | Proporcionados por el Colegio                 |

**Software requerido:**

| Software                      | Versión  | Propósito                                | Licencia        |
|-------------------------------|----------|------------------------------------------|-----------------|
| PHP                           | 8.3+     | Lenguaje del backend                     | PHP License     |
| Laravel                       | 13       | Framework backend API                    | MIT             |
| React                         | 19+      | Biblioteca frontend SPA                  | MIT             |
| TypeScript                    | 5.x      | Tipado estático para frontend            | Apache 2.0      |
| Vite                          | 6.x      | Build tool y dev server frontend         | MIT             |
| PostgreSQL                    | 16       | Base de datos relacional                 | PostgreSQL Lic. |
| Python                        | 3.11+    | Servicio de reconocimiento facial        | PSF License     |
| FastAPI                       | 0.100+   | Framework para servicio facial           | MIT             |
| Nginx                         | 1.x      | Reverse proxy y servidor de archivos     | BSD-2           |
| Docker / Docker Compose       | 26.x     | Entorno reproducible y despliegue        | Apache 2.0      |
| Node.js                       | 22.x     | Runtime para herramientas frontend       | MIT             |
| Git                           | 2.x      | Control de versiones                     | GPL v2          |

**Servicios externos:**

| Servicio            | Proveedor   | Plan                | Propósito                                     |
|---------------------|-------------|---------------------|-----------------------------------------------|
| Hetzner Cloud       | Hetzner     | CX32 (~€8/mes)      | VPS de producción                             |
| Cloudflare R2       | Cloudflare  | Gratuito (<10 GB)   | Almacenamiento privado de biometría           |
| Servicio de correo  | Configurar  | Variable            | Notificaciones a padres y personal            |
| Dominio + SSL       | Cloudflare  | Variable            | Acceso HTTPS al sistema                       |

## 4. Estudio de Factibilidad

El estudio de factibilidad fue preparado para evaluar la viabilidad del proyecto desde las dimensiones técnica,
económica, operativa, legal, social y ambiental. El resultado del estudio determina si el proyecto puede ejecutarse con
los recursos disponibles y si sus beneficios justifican la inversión.

### 4.1. Factibilidad Técnica

El proyecto es técnicamente factible. Todas las tecnologías seleccionadas son maduras, ampliamente documentadas y con
soporte activo de la comunidad.

**Backend (Laravel 13).** Laravel es el framework PHP más utilizado a nivel mundial, con una comunidad de millones de
desarrolladores, documentación exhaustiva y un ecosistema de paquetes (Sanctum para autenticación, Spatie Permission
para roles, colas para tareas asíncronas) que cubre todas las necesidades del proyecto.

**Frontend (React + Vite).** React es la biblioteca de interfaces más adoptada globalmente. Combinada con TypeScript
para tipado estático, Vite para builds rápidos, TanStack Query para gestión de estado servidor, y shadcn/ui para
componentes, el frontend puede desarrollarse con alta productividad y mantenibilidad.

**Base de datos (PostgreSQL 16).** PostgreSQL es la base de datos relacional open-source más avanzada, con soporte
nativo para UUID, JSON, índices parciales, constraints complejas y transacciones ACID, lo que cubre las necesidades de
integridad y auditoría del sistema.

**Reconocimiento facial (Python/FastAPI).** El servicio facial utiliza bibliotecas maduras como face_recognition y
dlib para detección, embedding y comparación de rostros. FastAPI provee un endpoint HTTP ligero y eficiente que
Laravel consume de forma controlada.

**Infraestructura (Hetzner + Docker).** Hetzner ofrece VPS europeos de alta disponibilidad a costos competitivos.
Docker Compose permite un despliegue reproducible y recuperable del stack completo.

**Evaluación:** No se requiere inversión en infraestructura especializada más allá del VPS y los equipos de desarrollo
disponibles. **La factibilidad técnica es ALTA.**

### 4.2. Factibilidad Económica

El proyecto tiene un modelo de negocio comercial definido con el cliente (Colegio Ciencias) bajo la modalidad de
pago único por desarrollo más mantenimiento mensual.

#### 4.2.1. Costos Generales

| Ítem                                    | Costo (S/.) |
|-----------------------------------------|:-----------:|
| Materiales de oficina y útiles menores  |   150.00    |
| **Total Costos Generales**              | **150.00**  |

#### 4.2.2. Costos Operativos Durante el Desarrollo

| Ítem                                                            | Cantidad (meses) | Costo Mensual (S/.) | Costo Total (S/.) |
|-----------------------------------------------------------------|:----------------:|:-------------------:|:-----------------:|
| Servicio de internet (parte proporcional, 5 integrantes)        |        3         |       350.00        |    1,050.00       |
| Energía eléctrica (consumo de equipos de desarrollo, estimado)  |        3         |       175.00        |      525.00       |
| **Total Costos Operativos**                                     |                  |                     |  **1,575.00**     |

#### 4.2.3. Costos del Ambiente

| Ítem                                                      | Costo (S/.) |
|-----------------------------------------------------------|:-----------:|
| Hetzner VPS CX32 (3 meses de desarrollo, ~€8/mes)        |    100.00   |
| Dominio .com (registro anual)                             |     60.00   |
| Cloudflare R2 (plan gratuito durante desarrollo)          |      0.00   |
| GitHub (plan gratuito para repositorio privado)           |      0.00   |
| Licencias de herramientas (Figma, Postman Pro, etc.)      |    190.00   |
| **Total Costos del Ambiente**                             | **350.00**  |

#### 4.2.4. Costos de Personal

| Ítem                                                                 | Costo (S/.) |
|----------------------------------------------------------------------|:-----------:|
| Equipo de desarrollo (5 integrantes, valorización referencial)       | 12,000.00   |
| **Total Costos de Personal**                                         |**12,000.00**|

#### 4.2.5. Costos Totales del Desarrollo del Sistema

| Categoría                               | Costo (S/.)  |
|-----------------------------------------|:------------:|
| Costos Generales                        |    150.00    |
| Costos Operativos durante el desarrollo |  1,575.00    |
| Costos del Ambiente                     |    350.00    |
| Costos de Personal                      | 12,000.00    |
| **TOTAL**                               |**14,075.00** |

### 4.3. Factibilidad Operativa

**Beneficios para los usuarios finales.** CienciasNET está orientado a toda la comunidad educativa del Colegio
Ciencias: Promotor, personal administrativo, coordinación académica, docentes, auxiliares, TOE, Psicología, padres de
familia y alumnos. El sistema reduce significativamente el tiempo invertido en procesos manuales, elimina errores de
transcripción, mejora la trazabilidad de la información y habilita la consulta en tiempo real desde cualquier
dispositivo.

**Capacidad de mantenimiento.** El sistema se entrega con un contrato de mantenimiento mensual que incluye corrección
de bugs, actualizaciones de seguridad, backups diarios y soporte técnico. La arquitectura modular (módulos por dominio
en el backend, componentes reutilizables en el frontend) facilita el mantenimiento y la evolución independiente de cada
funcionalidad.

**Lista de interesados:**

| Interesado                         | Rol                               | Interés                                                                                |
|------------------------------------|------------------------------------|----------------------------------------------------------------------------------------|
| Promotor (Colegio Ciencias)        | Cliente y Superadministrador       | Centralizar operación, control total del sistema y visibilidad de todas las áreas      |
| Yanina (Contabilidad)              | Administradora financiera          | Gestión de pagos, planilla docente y reportes financieros confiables                   |
| Coordinador Académico              | Responsable de estructura académica| Gestión de períodos, cursos, cargas docentes y evaluaciones                             |
| Docentes                           | Usuarios operativos                | Registro de notas y consulta de horarios/materiales                                    |
| Auxiliar de Educación              | Supervisor de asistencia           | Control de puertas, resolución de excepciones y registro de incidencias                |
| TOE                                | Departamento disciplinario         | Seguimiento de incidencias y comunicación con padres                                   |
| Psicología                         | Atención confidencial              | Registro protegido de atenciones psicológicas                                          |
| Padres de familia                  | Usuarios de consulta               | Visibilidad de notas, asistencia, estado de cuenta e incidencias de sus hijos          |
| Alumnos                            | Usuarios de consulta               | Consulta de notas, asistencia, horarios y materiales propios                           |
| Equipo de desarrollo               | Desarrolladores                    | Completar el proyecto con calidad y cumplir objetivos académicos                       |
| Universidad Privada de Tacna       | Institución académica              | Promover proyectos aplicados con impacto real                                          |

**Evaluación:** El producto cubre una necesidad real y urgente del Colegio Ciencias. El modelo de mantenimiento
garantiza operación sostenida. **La factibilidad operativa es ALTA.**

### 4.4. Factibilidad Legal

**Protección de datos personales.** El sistema procesa datos de menores de edad, información biométrica (embeddings
faciales), registros psicológicos confidenciales y datos financieros. Se implementan controles técnicos estrictos:
HTTPS obligatorio, almacenamiento privado en R2 para biometría, Policies de acceso restrictivo, auditoría de
operaciones sensibles y exclusión de datos sensibles de logs.

**Consentimiento biométrico.** El enrolamiento facial requiere consentimiento registrado de los padres o apoderados.
Se mantiene un método manual alternativo para quienes no consientan el reconocimiento facial.

**Licencias de software.** Todo el stack tecnológico utiliza licencias permisivas: Laravel (MIT), React (MIT),
PostgreSQL (PostgreSQL License), Python (PSF License), FastAPI (MIT), Docker (Apache 2.0). No existen conflictos de
licencia.

**Propiedad intelectual.** El código fuente es propiedad del equipo de desarrollo. La entrega al cliente incluye
licencia de uso del sistema bajo los términos del contrato comercial.

**Evaluación:** Los controles de seguridad cubren las obligaciones de protección de datos de menores y biometría. No
existen impedimentos legales. **La factibilidad legal es ALTA.**

### 4.5. Factibilidad Social

El proyecto tiene un impacto social positivo directo en la comunidad educativa del Colegio Ciencias:

- **Padres de familia:** acceso transparente a notas, asistencia y estado de cuenta de sus hijos, reduciendo
  incertidumbre y mejorando la comunicación familia-colegio.
- **Alumnos:** acceso digital a materiales, horarios y resultados académicos.
- **Personal del colegio:** reducción de carga administrativa, eliminación de procesos manuales repetitivos y mayor
  confiabilidad en la información.
- **Seguridad escolar:** el reconocimiento facial en entradas y salidas mejora el control de acceso y la seguridad de
  los menores.

No se identifican impactos sociales negativos. El sistema protege la privacidad de menores, ofrece alternativas al
reconocimiento facial y no recopila información innecesaria.

**Evaluación:** El proyecto mejora la calidad del servicio educativo y la seguridad escolar. **La factibilidad social
es ALTA.**

### 4.6. Factibilidad Ambiental

El proyecto es una solución de software con infraestructura en la nube. Su impacto ambiental es mínimo:

- **Reducción de papel:** el sistema reemplaza cuadernos de incidencias, listas de asistencia, circulares impresas,
  libretas físicas y recibos de pago por formatos digitales.
- **Consumo energético:** el VPS Hetzner utiliza infraestructura que opera con energía renovable según los reportes de
  sostenibilidad del proveedor.
- **Distribución digital:** todo el sistema es accesible vía web, sin componentes físicos adicionales.

**Evaluación:** El proyecto reduce el consumo de papel del Colegio y no genera residuos físicos. **La factibilidad
ambiental es ALTA.**

## 5. Análisis Financiero

### 5.1. Justificación de la Inversión

#### 5.1.1. Beneficios del Proyecto

**Beneficios tangibles:**

| Beneficio                                                                                    | Estimación                                                                        |
|----------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------|
| Reducción de tiempo en registro y control de asistencia                                      | De 1-2 horas/día a menos de 10 minutos (automático facial)                        |
| Eliminación de errores en cálculo de planilla docente                                        | Cálculo automático de tardanzas, faltas y descuentos                              |
| Reducción de tiempo en gestión financiera                                                    | De 4-6 horas/semana a menos de 1 hora con generación automática de deudas         |
| Acceso inmediato de padres a estado de cuenta, notas y asistencia                            | Eliminación de consultas presenciales y llamadas telefónicas                       |
| Trazabilidad completa de incidencias y atenciones psicológicas                               | Historial digital auditable vs. cuadernos físicos                                 |

**Beneficios intangibles:**

- Mejora de la imagen institucional del Colegio Ciencias al ofrecer tecnología moderna a padres y alumnos.
- Mayor seguridad en el control de acceso al centro educativo.
- Protección de la confidencialidad de atenciones psicológicas.
- Disponibilidad de información en tiempo real para la toma de decisiones directivas.
- Escalabilidad del modelo para otros colegios del Perú.

#### 5.1.2. Criterios de Inversión

El análisis financiero se realiza desde la perspectiva del modelo de negocio definido con el cliente. Los ingresos
provienen del pago único por desarrollo y del mantenimiento mensual recurrente.

**Parámetros del análisis:**

| Parámetro                                      | Valor           |
|-------------------------------------------------|-----------------|
| Inversión total del proyecto (costo desarrollo) | S/. 14,075.00   |
| Ingreso por desarrollo (pago único del cliente) | S/. 15,000.00   |
| Ingreso mensual por mantenimiento               | S/. 800.00      |
| Costo mensual real de infraestructura           | S/. 85.00       |
| Tasa de descuento mensual (referencial 12% anual)| 1% mensual     |
| Horizonte de evaluación                         | 24 meses        |

##### 5.1.2.1. Relación Beneficio/Costo (B/C)

Los beneficios totales a 24 meses incluyen el pago único (S/. 15,000) más el ingreso neto por mantenimiento
(S/. 715/mes × 24 = S/. 17,160). Total: S/. 32,160.

```
B/C = Beneficios Totales / Costo Total de Inversión
B/C = 32,160.00 / 14,075.00
B/C = 2.28

```

Como el B/C = **2.28 > 1**, el proyecto **se acepta**. Por cada sol invertido, se generan S/. 2.28 en retorno.

##### 5.1.2.2. Valor Actual Neto (VAN)

```
VAN = -14,075.00 + 15,000.00 + Σ [715 / (1 + 0.01)^t] para t = 1..24
VAN = -14,075.00 + 15,000.00 + 715 × [(1 - (1.01)^-24) / 0.01]
VAN = -14,075.00 + 15,000.00 + 715 × 21.24
VAN = -14,075.00 + 15,000.00 + 15,186.60
VAN = S/. 16,111.60

```

Como el VAN = **S/. 16,111.60 > 0**, el proyecto **se acepta**.

##### 5.1.2.3. Tasa Interna de Retorno (TIR)

La TIR es la tasa a la que el VAN = 0. Dado que la inversión se recupera en el primer mes (pago único > costo) y se
genera flujo positivo mensual sostenido, la TIR es significativamente superior al costo de oportunidad.

**Resumen del análisis financiero:**

| Indicador    |      Resultado       |  Decisión   |
|--------------|:--------------------:|:-----------:|
| Relación B/C |         2.28         |  Aceptado   |
| VAN          |   S/. 16,111.60      |  Aceptado   |
| TIR          |   > 12% anual        |  Aceptado   |

## 6. Conclusiones

El análisis de factibilidad realizado sobre el proyecto **CienciasNET — Sistema Web Académico y Administrativo** arroja
resultados positivos en todas las dimensiones evaluadas:

1. **Factibilidad Técnica:** El proyecto es técnicamente viable. El stack tecnológico (Laravel, React, PostgreSQL,
   Python, Docker) es maduro, open-source y ampliamente documentado. La infraestructura requerida (VPS Hetzner) es
   accesible y de alta disponibilidad.

2. **Factibilidad Económica:** El costo total de desarrollo asciende a S/. 14,075.00, cubierto por el pago único del
   cliente (S/. 15,000.00) y complementado con ingresos recurrentes por mantenimiento mensual (S/. 800.00/mes).

3. **Factibilidad Operativa:** El sistema cubre una necesidad real del Colegio Ciencias, reemplazando procesos manuales
   ineficientes por una plataforma digital integrada. El modelo de mantenimiento asegura operación continua.

4. **Factibilidad Legal:** Se implementan controles de seguridad adecuados para proteger datos de menores, información
   biométrica y registros confidenciales. Todas las tecnologías utilizan licencias permisivas.

5. **Factibilidad Social y Ambiental:** El proyecto mejora la calidad del servicio educativo, la seguridad escolar
   y la comunicación familia-colegio. Reduce el consumo de papel y tiene un impacto ambiental despreciable.

6. **Análisis Financiero:** Los indicadores (B/C = 2.28 y VAN = S/. 16,111.60) superan los umbrales de aceptación,
   confirmando la viabilidad financiera del proyecto.

**En conclusión, el proyecto CienciasNET es viable y factible desde todas las perspectivas analizadas, y se
recomienda su ejecución.**
