import { expect, test, type Page } from '@playwright/test'

const page = <T>(data: T[]) => ({ data, meta: { current_page: 1, last_page: 1, total: data.length }, links: {} })
const superadmin = { id: '00000000-0000-4000-8000-000000000001', name: 'Admin', email: 'admin@example.test', active: true, roles: ['superadmin'], permissions: ['gestionar_usuarios'] }
const manager = { ...superadmin, roles: ['gestor_usuarios'] }
const parent = { ...superadmin, roles: ['padre'], permissions: [] }

async function mockPhaseOne(pageInstance: Page, user = superadmin) {
  await pageInstance.route('**/api/v1/auth/session', route => route.fulfill({ json: { data: user } }))
  await pageInstance.route('**/api/v1/accounts**', route => route.fulfill({ json: page([{ ...superadmin, created_at: '2026-06-07', last_login_at: null }]) }))
  await pageInstance.route('**/api/v1/family-links**', route => route.fulfill({ json: page([{ id: 'link-1', student_id: 'student-1', parent_account_id: parent.id, student_name: 'Ana Alumna', parent_name: 'Familia Demo', relationship: 'madre' }]) }))
  await pageInstance.route('**/api/v1/academic-periods**', route => route.fulfill({ json: page([{ id: 'period-1', name: '2026', status: 'active' }]) }))
  await pageInstance.route('**/api/v1/grades**', route => route.fulfill({ json: page([{ id: 'grade-1', name: 'Tercero', level: 'secundaria' }]) }))
  await pageInstance.route('**/api/v1/sections**', route => route.fulfill({ json: page([{ id: 'section-1', name: 'A' }]) }))
  await pageInstance.route('**/api/v1/courses**', route => route.fulfill({ json: page([{ id: 'course-1', name: 'Matemática', code: 'MAT' }]) }))
  await pageInstance.route('**/api/v1/enrollments**', route => route.fulfill({ json: page([]) }))
  await pageInstance.route('**/api/v1/teaching-assignments**', route => route.fulfill({ json: page([{ id: 'assignment-1', teacher_id: 'teacher-1', active: false, valid_until: '2026-05-31' }]) }))
}

test('shows phase one administration according to permissions', async ({ page: browserPage }) => {
  await mockPhaseOne(browserPage, manager)
  await browserPage.goto('/admin/cuentas')
  await expect(browserPage.getByRole('heading', { name: 'Cuentas y roles' })).toBeVisible()
  await expect(browserPage.getByRole('option', { name: 'superadmin' })).toHaveCount(0)
  await browserPage.goto('/admin/familias')
  await expect(browserPage.getByText('No existe autorregistro.')).toBeVisible()
})

test('renders responsive academic tables and historical validity', async ({ page: browserPage }) => {
  await mockPhaseOne(browserPage)
  await browserPage.goto('/admin/academia')
  await expect(browserPage.getByRole('heading', { name: 'Periodos, grados y cargas' })).toBeVisible()
  await expect(browserPage.getByText('Histórica hasta 2026-05-31')).toBeVisible()
  await expect(browserPage.getByRole('table')).toHaveCount(5)
})

test('family portal switches only linked contexts without biometric data', async ({ page: browserPage }) => {
  await mockPhaseOne(browserPage, parent)
  await browserPage.route('**/api/v1/family/students', route => route.fulfill({ json: { data: [{ id: 'student-1', name: 'Ana Alumna', relationship: 'madre' }, { id: 'student-2', name: 'Luis Alumno', relationship: 'madre' }] } }))
  await browserPage.route('**/api/v1/family/students/*/summary', route => route.fulfill({ json: { data: { id: 'student-1', name: 'Ana Alumna', biometric_status: 'active', enrollments: [] } } }))
  await browserPage.goto('/portal')
  await expect(browserPage.getByRole('heading', { name: 'Resumen del alumno' })).toBeVisible()
  await expect(browserPage.getByText('No se muestran fotos ni datos biométricos.')).toBeVisible()
  await expect(browserPage.getByRole('link', { name: /crear|editar|eliminar/i })).toHaveCount(0)
})
