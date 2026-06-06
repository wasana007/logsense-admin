import { test, expect } from '@playwright/test';

test.describe('Logs page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/logs');
  });

  test('should show search form', async ({ page }) => {
    await expect(page.getByPlaceholder('Søk etter keyword...')).toBeVisible();
    await expect(page.getByRole('combobox')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Søk' })).toBeVisible();
  });

  test('should search by keyword and show results', async ({ page }) => {
    await page.getByPlaceholder('Søk etter keyword...').fill('PAYROLL');
    await page.getByRole('button', { name: 'Søk' }).click();
    await expect(page).toHaveURL(/q=PAYROLL/);
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('should filter by status COMPLETED', async ({ page }) => {
    await page.getByRole('combobox').selectOption('COMPLETED');
    await page.getByRole('button', { name: 'Søk' }).click();
    await expect(page).toHaveURL(/status=COMPLETED/);
  });

  test('should show Ingen resultater when no results', async ({ page }) => {
    await page.getByPlaceholder('Søk etter keyword...').fill('xyznotfound123');
    await page.getByRole('button', { name: 'Søk' }).click();
    await expect(page.getByText('Ingen resultater.')).toBeVisible();
  });

  test('should navigate to log detail on correlationId click', async ({ page }) => {
    await page.getByPlaceholder('Søk etter keyword...').fill('PAYROLL');
    await page.getByRole('button', { name: 'Søk' }).click();

    const firstLink = page.locator('tbody tr:first-child td:nth-child(2) a');
    await firstLink.click();
    await expect(page).toHaveURL(/\/logs\/.+/);
    await expect(page.getByText('📋 Log detaljer')).toBeVisible();
  });

  test('should go back to logs from detail page', async ({ page }) => {
    await page.getByPlaceholder('Søk etter keyword...').fill('PAYROLL');
    await page.getByRole('button', { name: 'Søk' }).click();

    const firstLink = page.locator('tbody tr:first-child td:nth-child(2) a');
    await firstLink.click();
    await page.getByText('← Tilbake').click();
    await expect(page).toHaveURL(/\/logs/);
  });

  test('should show AI-analyse on detail page when result exists', async ({ page }) => {
    await page.getByPlaceholder('Søk etter keyword...').fill('PAYROLL');
    await page.getByRole('button', { name: 'Søk' }).click();

    const firstLink = page.locator('tbody tr:first-child td:nth-child(2) a');
    await firstLink.click();
    await expect(page.getByText('🤖 AI-analyse')).toBeVisible();
  });

  test('should redirect / to /logs', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveURL(/\/logs/);
  });
});
