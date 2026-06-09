import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const superadmin = {
  id: '00000000-0000-4000-8000-000000000001',
  name: 'Admin',
  email: 'admin@example.test',
  active: true,
  roles: ['superadmin'],
  permissions: []
}

const docenteJuan = {
  id: 'docente-juan-uuid',
  name: 'Docente Juan',
  email: 'juan@example.test',
  active: true,
  roles: ['docente'],
  permissions: []
}

const docentePedro = {
  id: 'docente-pedro-uuid',
  name: 'Docente Pedro',
  email: 'pedro@example.test',
  active: true,
  roles: ['docente'],
  permissions: []
}

const padreUser = {
  id: 'padre-uuid',
  name: 'Padre Carlos',
  email: 'carlos@example.test',
  active: true,
  roles: ['padre'],
  permissions: []
}

// Mocks Data
const mockAcademicPeriods = [
  { id: 'period-2026-uuid', name: 'Año Escolar 2026', start_date: '2026-03-01', end_date: '2026-12-20', status: 'active' }
]

const mockGrades = [
  { id: 'grade-1-uuid', name: '1° Secundaria', level: 'secundaria', order: 1, academic_period_id: 'period-2026-uuid' },
  { id: 'grade-5-uuid', name: '5° Secundaria', level: 'secundaria', order: 5, academic_period_id: 'period-2026-uuid' }
]

const mockSections = [
  { id: 'sec-1a-uuid', grade_id: 'grade-1-uuid', name: 'A', capacity: 30 },
  { id: 'sec-5a-uuid', grade_id: 'grade-5-uuid', name: 'A', capacity: 30 }
]

const mockCourses = [
  { id: 'course-mat-uuid', code: 'MAT-1', name: 'Matemática I' },
  { id: 'course-fis-uuid', code: 'FIS-5', name: 'Física Química V' }
]

const mockAssignments = [
  // Juan teaches Math to 1° Secundaria
  { id: 'load-juan-uuid', teacher_id: 'docente-juan-uuid', course_id: 'course-mat-uuid', section_id: 'sec-1a-uuid', academic_period_id: 'period-2026-uuid' },
  // Pedro teaches Physics to 5° Secundaria
  { id: 'load-pedro-uuid', teacher_id: 'docente-pedro-uuid', course_id: 'course-fis-uuid', section_id: 'sec-5a-uuid', academic_period_id: 'period-2026-uuid' }
]

const mockStudents = [
  { id: 'student-1-uuid', name: 'Juan Alumno', email: 'juan.al@example.test', active: true, roles: ['alumno'], permissions: [] },
  { id: 'student-2-uuid', name: 'Maria Alumna', email: 'maria.al@example.test', active: true, roles: ['alumno'], permissions: [] }
]

const mockEnrollments = [
  { id: 'enr-1-uuid', student_id: 'student-1-uuid', section_id: 'sec-1a-uuid', academic_period_id: 'period-2026-uuid' },
  { id: 'enr-2-uuid', student_id: 'student-2-uuid', section_id: 'sec-1a-uuid', academic_period_id: 'period-2026-uuid' }
]

const mockAssessments = [
  {
    id: 'eval-1-uuid',
    teaching_assignment_id: 'load-juan-uuid',
    title: 'Examen Mensual 1',
    assessment_type: 'exam' as const,
    max_score: '20.00',
    assessment_date: '2026-06-12',
    channel: 'general' as const,
    total_questions: 40,
    status: 'draft'
  }
]

let mockResults = [
  { id: 'res-1-uuid', student_id: 'student-1-uuid', score: '15.50', status: 'recorded' as const, observations: 'Buen desempeño' },
  { id: 'res-2-uuid', student_id: 'student-2-uuid', score: null, status: 'absent' as const, observations: 'Falta justificada' }
]

async function mockAssessmentsApis(page: Page, userSession = superadmin) {
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()))
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message))
  page.on('request', request => console.log('>>', request.method(), request.url()))
  page.on('response', response => console.log('<<', response.status(), response.url()))

  await page.route('**/sanctum/csrf-cookie', (route) => route.fulfill({ status: 204 }))
  await page.route('**/api/v1/auth/session', (route) => route.fulfill({ json: { data: userSession } }))

  // Mock Academic Info
  await page.route('**/api/v1/academic-periods', (route) => route.fulfill({ json: { data: mockAcademicPeriods } }))
  await page.route('**/api/v1/grades', (route) => route.fulfill({ json: { data: mockGrades } }))
  await page.route('**/api/v1/sections', (route) => route.fulfill({ json: { data: mockSections } }))
  await page.route('**/api/v1/courses', (route) => route.fulfill({ json: { data: mockCourses } }))
  await page.route('**/api/v1/teaching-assignments', (route) => route.fulfill({ json: { data: mockAssignments } }))
  await page.route('**/api/v1/enrollments', (route) => route.fulfill({ json: { data: mockEnrollments } }))

  // Mock Accounts (for student names matching)
  await page.route('**/api/v1/accounts**', (route) => {
    const list = [superadmin, docenteJuan, docentePedro, ...mockStudents]
    return route.fulfill({ json: { data: list } })
  })

  // Mock Assessments
  await page.route(/\/api\/v1\/assessments(\?|$)/, (route) => {
    if (route.request().method() === 'POST') {
      const payload = JSON.parse(route.request().postData() || '{}')
      const newEval = {
        id: `eval-new-${Date.now()}`,
        teaching_assignment_id: payload.teaching_assignment_id,
        title: payload.title,
        assessment_type: payload.assessment_type,
        max_score: payload.max_score,
        assessment_date: payload.assessment_date,
        channel: payload.channel || null,
        total_questions: payload.total_questions || null,
        status: 'draft'
      }
      mockAssessments.push(newEval)
      return route.fulfill({ status: 201, json: { data: newEval } })
    }
    return route.fulfill({ json: { data: mockAssessments } })
  })

  // Mock Assessment Results
  await page.route(/\/api\/v1\/assessments\/.*\/results/, (route) => {
    if (route.request().method() === 'PUT') {
      const payload = JSON.parse(route.request().postData() || '{}')
      mockResults = payload.results.map((r: { student_id: string; score: string | null; status: 'recorded' | 'absent' | 'exempt'; observations?: string }, idx: number) => ({
        id: `res-up-${idx}`,
        student_id: r.student_id,
        score: r.score,
        status: r.status,
        observations: r.observations || ''
      }))
      return route.fulfill({ status: 200, json: { data: mockResults } })
    }
    return route.fulfill({ json: { data: mockResults } })
  })

  // Mock CSV Importer
  await page.route('**/api/v1/assessment-result-imports', (route) => {
    return route.fulfill({ status: 202, json: { data: { message: 'Resultados importados correctamente' } } })
  })
}

test.describe('Evaluaciones y Notas - FE-015', () => {
  test('debe restringir acceso si el usuario no tiene rol de docente o coordinador', async ({ page }) => {
    await mockAssessmentsApis(page, padreUser)
    await page.goto('/admin/evaluaciones')
    await expect(page.getByText('Sin permiso')).toBeVisible()
  })

  test('aislamiento de carga: docente Juan solo ve su curso asignado', async ({ page }) => {
    await mockAssessmentsApis(page, docenteJuan)
    await page.goto('/admin/evaluaciones')

    const select = page.getByLabel('Carga Académica / Curso')
    await expect(select).toBeVisible()

    // Juan teaches Matemática I
    await expect(page.getByRole('combobox', { name: 'Carga Académica / Curso' })).toContainText('Matemática I')
    // Pedro teaches Física Química V; Juan must NOT see it
    await expect(page.getByRole('combobox', { name: 'Carga Académica / Curso' })).not.toContainText('Física Química V')
  })

  test('tabla editable de notas: carga datos, valida límites y tiene navegación por teclado', async ({ page }) => {
    await mockAssessmentsApis(page, docenteJuan)
    await page.goto('/admin/evaluaciones')

    // Select Matematica I
    await page.getByLabel('Carga Académica / Curso').selectOption({ label: 'Matemática I · 1° Secundaria "A"' })

    // Select Examen Mensual 1
    await page.getByLabel('Evaluación').selectOption({ label: 'Examen Mensual 1 (2026-06-12 · Máx 20.00)' })

    // Assert student table renders
    await expect(page.getByText('Juan Alumno')).toBeVisible()
    await expect(page.getByText('Maria Alumna')).toBeVisible()

    const score1 = page.getByPlaceholder('--').first()
    const score2 = page.getByPlaceholder('--').nth(1)

    // Maria is currently absent. Change status to recorded to enable input first
    const statusSelect2 = page.getByRole('combobox').nth(3) // 1st is course, 2nd is eval, 3rd is Juan status, 4th is Maria status
    await statusSelect2.selectOption('recorded')

    // Focus first score input and check values
    await score1.focus()
    await expect(score1).toHaveValue('15.50')

    // Enforce navigation: Press ArrowDown to shift focus to second input
    await score1.press('ArrowDown')
    await expect(score2).toBeFocused()

    // Input invalid score > max_score (20)
    await score2.fill('22.50')
    await expect(page.getByText('Máximo 20')).toBeVisible()
    // The "Guardar Notas" button must be disabled when validation fails
    await expect(page.getByRole('button', { name: 'Guardar Notas' })).toBeDisabled()

    // Correct the score
    await score2.fill('18.00')
    await expect(page.getByText('Máximo 20')).not.toBeVisible()
    await expect(page.getByRole('button', { name: 'Guardar Notas' })).toBeEnabled()

    // Save notes
    await page.getByRole('button', { name: 'Guardar Notas' }).click()
    await expect(page.getByText('Notas guardadas y actualizadas exitosamente.')).toBeVisible()
  })

  test('importador masiva: muestra vista previa de errores y bloquea confirmación', async ({ page }) => {
    await mockAssessmentsApis(page, docenteJuan)
    await page.goto('/admin/evaluaciones')
    await page.getByLabel('Carga Académica / Curso').selectOption({ label: 'Matemática I · 1° Secundaria "A"' })
    await page.getByLabel('Evaluación').selectOption({ label: 'Examen Mensual 1 (2026-06-12 · Máx 20.00)' })

    await page.getByRole('button', { name: 'Importar CSV' }).click({ force: true })

    // Upload invalid CSV file (Juan Alumno score 25 exceeds 20, exempt is spelled wrongly)
    const invalidCsv = `student_id,score,status,observations
student-1-uuid,25.00,recorded,
student-2-uuid,10.00,exempt_wrong,observations`

    await page.locator('input[type="file"]').setInputFiles([
      { name: 'invalid.csv', mimeType: 'text/csv', buffer: Buffer.from(invalidCsv) }
    ])

    // Verify error banners show up and confirm button is disabled
    await expect(page.getByText('Errores de Validación Encontrados')).toBeVisible()
    await expect(page.getByText('excede el puntaje máximo permitido')).toBeVisible()
    await expect(page.getByText('no es válido. Debe ser uno de:')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Confirmar e Importar' })).toBeDisabled()

    // Upload clean CSV
    const validCsv = `student_id,score,status,observations
student-1-uuid,19.50,recorded,Todo bien
student-2-uuid,,exempt,Exento`

    await page.locator('input[type="file"]').setInputFiles([
      { name: 'valid.csv', mimeType: 'text/csv', buffer: Buffer.from(validCsv) }
    ])

    // Error banner should be gone, preview records rendered, and confirm button enabled
    await expect(page.getByText('Errores de Validación Encontrados')).not.toBeVisible()
    await expect(page.getByText('Previsualización de Registros a Importar')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Confirmar e Importar' })).toBeEnabled()

    // Click confirm
    await page.getByRole('button', { name: 'Confirmar e Importar' }).click({ force: true })
    await expect(page.getByText('Resultados importados correctamente.')).toBeVisible()
  })

  test('accesibilidad WCAG AA en evaluaciones', async ({ page }) => {
    await mockAssessmentsApis(page, superadmin)
    await page.goto('/admin/evaluaciones')
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations.filter(v => ['critical', 'serious'].includes(v.impact ?? ''))).toEqual([])
  })
})
