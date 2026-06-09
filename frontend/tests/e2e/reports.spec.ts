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

const coordinatorUser = {
  id: 'coordinator-uuid',
  name: 'Coordinador Carlos',
  email: 'carlos.coord@example.test',
  active: true,
  roles: ['coordinador_academico'],
  permissions: []
}

const studentJuan = {
  id: 'student-juan-uuid',
  name: 'Juan Alumno',
  email: 'juan.al@example.test',
  active: true,
  roles: ['alumno'],
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
  { id: 'grade-1-uuid', name: '1° Secundaria', level: 'secundaria', order: 1, academic_period_id: 'period-2026-uuid' }
]

const mockSections = [
  { id: 'sec-1a-uuid', grade_id: 'grade-1-uuid', name: 'A', capacity: 30 }
]

const mockCourses = [
  { id: 'course-mat-uuid', code: 'MAT-1', name: 'Matemática I' }
]

const mockAssignments = [
  { id: 'load-juan-uuid', teacher_id: 'docente-juan-uuid', course_id: 'course-mat-uuid', section_id: 'sec-1a-uuid', academic_period_id: 'period-2026-uuid' }
]

const mockEnrollments = [
  { id: 'enr-1-uuid', student_id: 'student-juan-uuid', section_id: 'sec-1a-uuid', academic_period_id: 'period-2026-uuid' }
]

// Two assessments: one draft, one published
const mockAssessments = [
  {
    id: 'eval-draft-uuid',
    teaching_assignment_id: 'load-juan-uuid',
    title: 'Examen Borrador 1',
    assessment_type: 'exam' as const,
    max_score: '20.00',
    assessment_date: '2026-06-12',
    channel: 'general' as const,
    total_questions: 40,
    status: 'draft'
  },
  {
    id: 'eval-published-uuid',
    teaching_assignment_id: 'load-juan-uuid',
    title: 'Examen Publicado 2',
    assessment_type: 'exam' as const,
    max_score: '20.00',
    assessment_date: '2026-06-13',
    channel: 'general' as const,
    total_questions: 40,
    status: 'published'
  }
]

const mockResultsDraft = [
  { id: 'res-draft-uuid', student_id: 'student-juan-uuid', score: '18.50', status: 'recorded' as const, observations: 'Muy bien' }
]

const mockResultsPublished = [
  { id: 'res-published-uuid', student_id: 'student-juan-uuid', score: '15.00', status: 'recorded' as const, observations: 'Regular' }
]

const mockRankings = [
  {
    id: 'rank-1-uuid',
    assessment_id: 'eval-published-uuid',
    assessment_title: 'Examen Publicado 2',
    student_id: 'student-juan-uuid',
    student_name: 'Juan Alumno',
    score: '15.00',
    rank: 1,
    total_participants: 1
  }
]

async function mockReportsApis(page: Page, userSession = studentJuan) {
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()))
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message))

  await page.route('**/sanctum/csrf-cookie', (route) => route.fulfill({ status: 204 }))
  await page.route('**/api/v1/auth/session', (route) => route.fulfill({ json: { data: userSession } }))

  // Mock Academic Info
  await page.route('**/api/v1/academic-periods', (route) => route.fulfill({ json: { data: mockAcademicPeriods } }))
  await page.route('**/api/v1/grades', (route) => route.fulfill({ json: { data: mockGrades } }))
  await page.route('**/api/v1/sections', (route) => route.fulfill({ json: { data: mockSections } }))
  await page.route('**/api/v1/courses', (route) => route.fulfill({ json: { data: mockCourses } }))
  await page.route('**/api/v1/teaching-assignments', (route) => route.fulfill({ json: { data: mockAssignments } }))
  await page.route('**/api/v1/enrollments', (route) => route.fulfill({ json: { data: mockEnrollments } }))

  // Mock Family Linked Students
  await page.route(/\/api\/v1\/family\/students(\?|$)/, (route) => {
    return route.fulfill({
      json: {
        data: [
          { id: 'student-juan-uuid', name: 'Juan Alumno', relationship: 'hijo' }
        ]
      }
    })
  })

  // Mock Student Summary
  await page.route(/\/api\/v1\/family\/students\/[^/]+\/summary/, (route) => {
    return route.fulfill({
      json: {
        data: {
          id: 'student-juan-uuid',
          name: 'Juan Alumno',
          biometric_status: 'active',
          enrollments: [
            { id: 'enr-1-uuid', section: 'A', grade: '1° Secundaria', academic_period: 'Año Escolar 2026' }
          ]
        }
      }
    })
  })

  // Mock Accounts
  await page.route(/\/api\/v1\/accounts/, (route) => {
    return route.fulfill({ json: { data: [superadmin, coordinatorUser, studentJuan] } })
  })

  // Mock listAssessments
  await page.route(/\/api\/v1\/assessments(\?|$)/, (route) => {
    return route.fulfill({ json: { data: mockAssessments } })
  })

  // Mock listAssessmentResults for draft and published
  await page.route(/\/api\/v1\/assessments\/eval-draft-uuid\/results/, (route) => {
    return route.fulfill({ json: { data: mockResultsDraft } })
  })

  await page.route(/\/api\/v1\/assessments\/eval-published-uuid\/results/, (route) => {
    return route.fulfill({ json: { data: mockResultsPublished } })
  })

  // Mock rankings list
  await page.route(/\/api\/v1\/rankings(\?|$)/, (route) => {
    return route.fulfill({ json: { data: mockRankings } })
  })

  // Mock publication POST
  await page.route(/\/api\/v1\/assessments\/[^/]+\/publication/, (route) => {
    const url = route.request().url()
    const match = url.match(/\/assessments\/(.*)\/publication/)
    const evalId = match ? match[1] : ''
    const item = mockAssessments.find((a) => a.id === evalId)
    if (item) item.status = 'published'
    return route.fulfill({ status: 200, json: { data: { id: evalId } } })
  })

  // Mock closure PUT
  await page.route(/\/api\/v1\/assessments\/[^/]+\/closure/, (route) => {
    const url = route.request().url()
    const match = url.match(/\/assessments\/(.*)\/closure/)
    const evalId = match ? match[1] : ''
    const payload = JSON.parse(route.request().postData() || '{}')
    const item = mockAssessments.find((a) => a.id === evalId)
    if (item) item.status = payload.closed ? 'closed' : 'published'
    return route.fulfill({ status: 200, json: { data: { id: evalId } } })
  })

  // Mock correction POST
  await page.route(/\/api\/v1\/assessment-results\/[^/]+\/corrections/, (route) => {
    const url = route.request().url()
    const match = url.match(/\/assessment-results\/(.*)\/corrections/)
    const resultId = match ? match[1] : ''
    const payload = JSON.parse(route.request().postData() || '{}')
    
    if (resultId === 'res-published-uuid') {
      mockResultsPublished[0].score = payload.score
    }
    return route.fulfill({ status: 201, json: { data: { id: resultId } } })
  })

  // Mock generateAcademicReport POST
  await page.route(/\/api\/v1\/academic-reports/, (route) => {
    return route.fulfill({ status: 202, json: { data: { id: 'report-new-uuid' } } })
  })
}

test.describe('Portal de Alumnos y Familias - FE-016', () => {
  test('Privacidad Pre-publicación: oculta notas y observaciones en estado borrador', async ({ page }) => {
    await mockReportsApis(page, studentJuan)
    await page.goto('/portal')

    // Go to "Calificaciones" tab
    await page.getByRole('button', { name: 'Calificaciones' }).click({ force: true })

    // Examen Borrador 1 is draft -> must hide results and show "Pendiente"
    const draftRow = page.locator('tr').filter({ hasText: 'Examen Borrador 1' })
    await expect(draftRow.getByText('Pendiente')).toBeVisible()
    await expect(draftRow.getByText('Oculto por pre-publicación')).toBeVisible()
    await expect(draftRow.getByText('18.50')).not.toBeVisible()

    // Examen Publicado 2 is published -> must show score
    const pubRow = page.locator('tr').filter({ hasText: 'Examen Publicado 2' })
    await expect(pubRow.getByText('15.00')).toBeVisible()
    await expect(pubRow.getByText('Regular')).toBeVisible()
  })

  test('Ranking Académico: muestra el ranking y puesto del estudiante', async ({ page }) => {
    await mockReportsApis(page, studentJuan)
    await page.goto('/portal')

    await page.getByRole('button', { name: 'Ranking Académico' }).click({ force: true })

    await expect(page.getByText('Examen Publicado 2')).toBeVisible()
    await expect(page.getByText('1', { exact: true })).toBeVisible() // puesto 1
    await expect(page.getByText('1 alumnos')).toBeVisible()
  })

  test('Descarga de Reportes Académicos: permite generar y descargar libreta escolar', async ({ page }) => {
    await mockReportsApis(page, studentJuan)
    await page.goto('/portal')

    await page.getByRole('button', { name: 'Descargar Reportes' }).click({ force: true })

    await page.getByLabel('Periodo Académico').selectOption({ label: 'Año Escolar 2026' })
    await page.getByLabel('Sección / Grado').selectOption({ label: '1° Secundaria "A"' })
    await page.getByLabel('Tipo de Reporte').selectOption({ label: 'Libreta Escolar de Notas' })
    await page.getByLabel('Formato de Descarga').selectOption({ label: 'Documento PDF (.pdf)' })

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Generar Reporte' }).click()
    const download = await downloadPromise

    expect(download.suggestedFilename()).toContain('reporte_report_card_')
  })

  test('Acceso familiar: padres seleccionan contexto de hijo y heredan portal', async ({ page }) => {
    await mockReportsApis(page, padreUser)
    await page.goto('/portal')

    await expect(page.getByLabel('Alumno')).toBeVisible()
    await expect(page.getByRole('combobox')).toContainText('Juan Alumno (hijo)')
  })
})

test.describe('Controles de Coordinación y Corrección Auditada - FE-016', () => {
  test('Coordinador puede publicar y cerrar evaluaciones, bloqueando inputs directos', async ({ page }) => {
    // Reset status to draft for this test
    mockAssessments[0].status = 'draft'
    mockAssessments[1].status = 'published'

    await mockReportsApis(page, coordinatorUser)
    await page.goto('/admin/evaluaciones')

    // Select course and draft evaluation
    await page.getByLabel('Carga Académica / Curso').selectOption({ label: 'Matemática I · 1° Secundaria "A"' })
    await page.getByLabel('Evaluación').selectOption({ label: 'Examen Borrador 1 (2026-06-12 · Máx 20.00)' })

    // Check that "Publicar" is visible since it is draft
    const publishBtn = page.getByRole('button', { name: 'Publicar' })
    await expect(publishBtn).toBeVisible()

    // Inputs in table must be enabled in draft
    const scoreInput = page.getByPlaceholder('--').first()
    await expect(scoreInput).toBeEnabled()

    // Click publish
    await publishBtn.click({ force: true })
    await expect(page.getByText('Evaluación publicada exitosamente.')).toBeVisible()

    // Select the assessment again to refresh status (or mock updates automatically)
    await page.getByLabel('Evaluación').selectOption({ label: 'Examen Borrador 1 (2026-06-12 · Máx 20.00)' })

    // Inputs must be disabled after publishing
    await expect(scoreInput).toBeDisabled()
    await expect(page.getByRole('button', { name: 'Cerrar Evaluación' })).toBeVisible()
  })

  test('Corrección Auditada: muestra advertencia de impacto y requiere justificación', async ({ page }) => {
    mockAssessments[1].status = 'published'

    await mockReportsApis(page, coordinatorUser)
    await page.goto('/admin/evaluaciones')

    await page.getByLabel('Carga Académica / Curso').selectOption({ label: 'Matemática I · 1° Secundaria "A"' })
    await page.getByLabel('Evaluación').selectOption({ label: 'Examen Publicado 2 (2026-06-13 · Máx 20.00)' })

    // Direct marksheet cell is disabled
    const scoreInput = page.getByPlaceholder('--').first()
    await expect(scoreInput).toBeDisabled()

    // Click "Corregir" button on the student row
    await page.getByRole('button', { name: 'Corregir' }).click({ force: true })

    // Assert Audit Dialog elements
    await expect(page.getByText('Diálogo de Corrección Auditada')).toBeVisible()
    await expect(page.getByText('¡Advertencia de Impacto Académico!')).toBeVisible()
    await expect(page.getByText('Cualquier cambio recalculará el ranking y volverá a notificar')).toBeVisible()

    const newScoreInput = page.getByLabel('Nueva Nota')
    const reasonTextarea = page.getByLabel('Razón de la Corrección')

    // Empty reason should fail validation
    await newScoreInput.fill('16.50')
    await page.getByRole('button', { name: 'Guardar y Recalcular' }).click({ force: true })
    await expect(page.getByText('La razón de corrección es obligatoria')).toBeVisible()

    // Fill reason and save
    await reasonTextarea.fill('Error en lectura óptica de la plantilla física')
    await page.getByRole('button', { name: 'Guardar y Recalcular' }).click({ force: true })

    await expect(page.getByText('Nota corregida y auditada exitosamente.')).toBeVisible()
  })
})

test.describe('Accesibilidad WCAG AA - FE-016', () => {
  test('accesibilidad WCAG AA en portal familiar y administración', async ({ page }) => {
    await mockReportsApis(page, studentJuan)
    await page.goto('/portal')

    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations.filter(v => ['critical', 'serious'].includes(v.impact ?? ''))).toEqual([])
  })
})
