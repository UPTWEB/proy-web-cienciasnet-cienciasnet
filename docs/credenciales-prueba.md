# 🔐 Credenciales de Prueba — CienciasNet

> **Contraseña universal para todos los usuarios de prueba:** `password`
>
> Entorno: `http://localhost:3000` (frontend) / `http://localhost:8000` (API)

---

## 👥 Usuarios de Administración y Staff

| Rol                   | Email                           | Contraseña | Nombre Completo              |
|-----------------------|---------------------------------|------------|------------------------------|
| Superadmin            | superadmin@ciencias.test        | password   | Carlos Ramos Herrera          |
| Coordinador Académico | coordinador@ciencias.test       | password   | María Elena Torres Vásquez   |
| Gestor de Usuarios    | gestor@ciencias.test            | password   | Ana Lucía Mendoza Paredes     |
| TOE                   | toe@ciencias.test               | password   | Rosa Isabel Flores Quispe     |
| Psicología            | psicologia@ciencias.test        | password   | Silvia Patricia Rojas Llanos  |
| Auxiliar              | auxiliar@ciencias.test          | password   | Pedro Antonio Salinas Cruz    |
| Administrativo        | administrativo@ciencias.test    | password   | Jorge Luis Huanca Mamani      |
| Superadmin (original) | superadmin@example.test         | password   | Superadmin Demo               |

---

## 👨‍🏫 Docentes

| DNI      | Email                      | Contraseña | Nombre Completo              | Teléfono   |
|----------|----------------------------|------------|------------------------------|------------|
| 70100001 | docente1@ciencias.test     | password   | Roberto Quispe Mamani         | 987654321  |
| 70100002 | docente2@ciencias.test     | password   | Carmen Reyes Atahuaman        | 987654322  |
| 70100003 | docente3@ciencias.test     | password   | Luis Ccori Huanca             | 987654323  |
| 70100004 | docente4@ciencias.test     | password   | Patricia Vargas Condori       | 987654324  |
| 70100005 | docente5@ciencias.test     | password   | Miguel Apaza Huayta           | 987654325  |
| 70100006 | docente6@ciencias.test     | password   | Sandra Lazo Cutipa            | 987654326  |
| 70000003 | docente@example.test       | password   | Docente Demo                  | 900000002  |

---

## 👨‍🎓 Alumnos (muestra)

Todos los alumnos tienen contraseña: `password`

| DNI      | Email                      | Nombres                  | Apellidos         | Sección              |
|----------|----------------------------|--------------------------|-------------------|----------------------|
| 70200001 | alumno001@ciencias.test    | Alejandro                | Mamani Quispe     | 1ro Primaria A       |
| 70200002 | alumno002@ciencias.test    | Brenda                   | Huanca Condori    | 1ro Primaria A       |
| 70200003 | alumno003@ciencias.test    | Carlos                   | Flores García     | 1ro Primaria A       |
| 70200004 | alumno004@ciencias.test    | Diana                    | López Torres      | 1ro Primaria A       |
| 70200005 | alumno005@ciencias.test    | Emilio                   | Pérez Chávez      | 1ro Primaria A       |
| 70200031 | alumno006@ciencias.test    | Fernando                 | Mamani Quispe     | 1ro Primaria B       |
| 70200032 | alumno007@ciencias.test    | Gabriela                 | Huanca Condori    | 1ro Primaria B       |
| 70200061 | alumno011@ciencias.test    | Alejandro                | Mamani Quispe     | 3ro Primaria A       |
| 70200091 | alumno016@ciencias.test    | Alejandro                | Mamani Quispe     | 5to Primaria A       |
| 70200121 | alumno021@ciencias.test    | Alejandro                | Mamani Quispe     | 1ro Secundaria A     |
| 70200122 | alumno022@ciencias.test    | Brenda                   | Huanca Condori    | 1ro Secundaria A     |
| 70200151 | alumno026@ciencias.test    | Alejandro                | Mamani Quispe     | 3ro Secundaria A     |
| 70000001 | alumno@example.test        | Alumno                   | Demo              | 3ro Secundaria A     |

> **Nota:** El sistema genera 5 alumnos por sección × 12 secciones = 60 alumnos en total.  
> Para ver la lista completa: `GET /api/v1/alumnos` (requiere rol coordinador o superior).

---

## 👨‍👩‍👧 Padres de Familia (muestra)

| DNI      | Email                      | Contraseña | Alumno Vinculado             |
|----------|----------------------------|------------|------------------------------|
| 70300001 | padre001@ciencias.test     | password   | alumno001 (Alejandro Mamani) |
| 70300002 | padre002@ciencias.test     | password   | alumno002 (Brenda Huanca)    |
| 70300003 | padre003@ciencias.test     | password   | alumno003 (Carlos Flores)    |
| 70300004 | padre004@ciencias.test     | password   | alumno004 (Diana López)      |
| 70300005 | padre005@ciencias.test     | password   | alumno005 (Emilio Pérez)     |
| 70000002 | padre@example.test         | password   | Alumno Demo                  |

---

## 🏫 Estructura Académica Generada

### Período Académico
| Campo         | Valor                     |
|---------------|---------------------------|
| Nombre        | Año Escolar 2026          |
| Tipo          | anual                     |
| Inicio        | 2026-03-09                |
| Fin           | 2026-12-18                |
| Estado        | activo                    |

### Grados y Secciones
| Grado          | Nivel      | Sección A (turno) | Sección B (turno) |
|----------------|------------|-------------------|-------------------|
| 1ro Primaria   | Primaria   | Mañana            | Tarde             |
| 3ro Primaria   | Primaria   | Mañana            | Tarde             |
| 5to Primaria   | Primaria   | Mañana            | Tarde             |
| 1ro Secundaria | Secundaria | Mañana            | Tarde             |
| 3ro Secundaria | Secundaria | Mañana            | Tarde             |
| 5to Secundaria | Secundaria | Mañana            | Tarde             |

### Cursos por Nivel

**Primaria:**
| Código    | Nombre                   | Área          |
|-----------|--------------------------|---------------|
| MAT-P-*   | Matemática               | Ciencias      |
| COM-P-*   | Comunicación             | Letras        |
| CTA-P-*   | Ciencia y Tecnología     | Ciencias      |
| ART-P-*   | Arte y Cultura           | Humanidades   |

**Secundaria:**
| Código    | Nombre                               | Área          |
|-----------|--------------------------------------|---------------|
| MAT-S-*   | Matemática                           | Ciencias      |
| COM-S-*   | Comunicación                         | Letras        |
| CTA-S-*   | CTA                                  | Ciencias      |
| HGE-S-*   | Historia, Geografía y Economía       | Letras        |
| ING-S-*   | Inglés                               | Idiomas       |
| FCC-S-*   | Formación Ciudadana                  | Humanidades   |

---

## 📋 Datos por Módulo

### 📅 Horarios
- Cada carga académica tiene al menos 1 bloque de horario semanal asignado.
- Días: Lunes a Viernes (dia_semana 1–5)
- Horario tipo: 07:30 – 09:00 en distintas aulas

### 📝 Exámenes y Notas
- **Examen Bimestral I** (cerrado, aplicado 2026-05-15, puntaje máximo 20)
- **Examen Bimestral II** (publicado, aplicado 2026-07-10, puntaje máximo 20)
- Notas registradas para todos los alumnos de las primeras 6 cargas académicas.

### 📊 Asistencias
- **Alumnos:** Últimos 10 días hábiles, 20 alumnos con estados variados:
  - `presente` (mayoría)
  - `tardanza`
  - `falta_injustificada`
- **Docentes:** Últimos 10 días hábiles, 4 docentes con estados variados.

### 🗓️ Eventos de Calendario
| Evento                    | Tipo        | Fecha              |
|---------------------------|-------------|--------------------|
| Día del Maestro           | evento      | 2026-07-06         |
| Fiestas Patrias           | no_laboral  | 2026-07-28/29      |
| Examen Bimestral I        | examen      | 2026-05-15         |
| Simulacro ECE Primaria    | simulacro   | 2026-09-05         |
| Día de la Familia         | evento      | 2026-08-20         |
| Examen Bimestral II       | examen      | 2026-07-10         |
| Navidad                   | no_laboral  | 2026-12-25         |
| Ceremonia de Clausura 2026| evento      | 2026-12-18         |

### 📢 Comunicados
1. Inicio del Año Escolar 2026 *(importante)*
2. Reunión de Padres de Familia - I Bimestre *(importante)*
3. Recordatorio: Pago de Mensualidad Junio
4. Actualización del Reglamento Interno
5. Simulacro de Sismo *(importante)*

### 💰 Finanzas
- **Conceptos de pago:** Matrícula 2026 (S/ 400) + Mensualidades Mar–Jul (S/ 350 c/u)
- **Obligaciones:** 5 alumnos × 4 conceptos con estados: `pagado`, `pendiente`, `vencido`
- **Movimientos de pago:** Recibos de caja generados para las obligaciones pagadas (medio: efectivo)

### 🚨 Incidencias y Psicología
| Tipo               | Severidad | Asignado a  | Estado                |
|--------------------|-----------|-------------|-----------------------|
| Conducta           | Leve      | Auxiliar    | Resuelto              |
| Académico          | Moderada  | TOE         | Derivado TOE          |
| Tardanza constante | Leve      | Auxiliar    | Notificado padre      |
| Conducta           | Grave     | Psicología  | Derivado psicología   |
| Otro               | Leve      | TOE         | Abierto               |

- **3 atenciones psicológicas** vinculadas a las primeras incidencias.

---

## 🚀 Cómo ejecutar los seeders

```bash
# Desde el directorio /backend

# Opción 1: Fresh migration + todos los seeders (recomendado para desarrollo)
php artisan migrate:fresh --seed

# Opción 2: Solo ejecutar seeders (sin borrar datos existentes)
php artisan db:seed

# Opción 3: Solo el seeder completo de demo
php artisan db:seed --class=DemoCompleteSeeder
```

> ⚠️ **Advertencia:** `migrate:fresh` borra TODOS los datos existentes.  
> Use solo en entorno de desarrollo/testing.

---

## 🔑 Resumen de Accesos Rápidos

| Quiero probar...         | Usuario                      | Contraseña |
|--------------------------|------------------------------|------------|
| Panel completo (admin)   | superadmin@ciencias.test     | password   |
| Gestión académica        | coordinador@ciencias.test    | password   |
| Vista de docente         | docente1@ciencias.test       | password   |
| Vista de padre           | padre001@ciencias.test       | password   |
| Vista de alumno          | alumno001@ciencias.test      | password   |
| Módulo psicología        | psicologia@ciencias.test     | password   |
| Módulo TOE               | toe@ciencias.test            | password   |
| Módulo auxiliar          | auxiliar@ciencias.test       | password   |
