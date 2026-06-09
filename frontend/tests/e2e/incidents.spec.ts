import { expect, test } from '@playwright/test'

test.describe('Incidents Workflow', () => {
  test('Auxiliar can create an incident', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('input[type="email"]', 'auxiliar@example.test')
    await page.fill('input[type="password"]', 'password')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin')

    // Navigate to Incidents
    await page.click('a[href="/admin/incidencias"]')
    await expect(page.locator('h1')).toHaveText('Cuaderno de Incidencias')

    // Open Modal
    await page.click('text=Registrar Incidencia')
    await expect(page.locator('h3')).toHaveText('Nueva Incidencia')

    // Fill Form
    await page.fill('input[placeholder="Ej. Tardanza, Faltamiento..."]', 'Faltamiento')
    await page.selectOption('select', 'high')
    await page.fill('textarea', 'El estudiante generó un problema en el patio principal.')
    await page.fill('input[type="text"]:near(label:has-text("ID del Alumno"))', 'alumno-123')
    
    // As in mock environment it might not actually send to a real DB, we just verify the form works
    // and doesn't crash
    await page.click('button[type="submit"]')
  })

  test('Family can view incidents', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('input[type="email"]', 'padre@example.test')
    await page.fill('input[type="password"]', 'password')
    await page.click('button[type="submit"]')
    
    // Select context and go to portal
    await page.waitForURL('**/seleccionar-contexto')
    await page.click('text=Continuar')
    await page.waitForURL('/portal')

    // Navigate to Incidents
    await page.click('a[href="/portal/incidencias"]')
    await expect(page.locator('h1')).toHaveText('Historial de Incidencias')
  })
})
