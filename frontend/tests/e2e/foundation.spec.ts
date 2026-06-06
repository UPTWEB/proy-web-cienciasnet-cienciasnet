import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('loads without console errors and has no serious accessibility violations', async ({ page }) => {
  const errors: string[] = []
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text())
  })

  await page.goto('/')
  await expect(page.getByRole('heading', { name: /jornada escolar/i })).toBeVisible()

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([])
  expect(errors).toEqual([])
})

test('renders portal states and keeps station context separate', async ({ page }) => {
  await page.goto('/portal')
  await expect(page.getByRole('heading', { name: 'Portal humano' })).toBeVisible()
  await expect(page.getByRole('alert')).toContainText('No se pudo cargar')

  await page.goto('/estacion')
  await expect(page.getByText('Sesión técnica limitada')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Estación de asistencia' })).toBeVisible()
})
