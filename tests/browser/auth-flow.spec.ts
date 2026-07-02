import { expect, test } from '@playwright/test';

test('shows first-party workspace auth UI', async ({ page }) => {
  await page.goto('/auth');
  await expect(page.getByRole('heading', { name: /Access RaeburnAI Workflow Auditor/i })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await page.getByRole('button', { name: /Register workspace/i }).click();
  await expect(page.getByLabel(/Organisation name/i)).toBeVisible();
  await expect(page.getByText(/RBAC model/i)).toBeVisible();
});
