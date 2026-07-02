import { expect, test } from '@playwright/test';

test('shows account management interface', async ({ page }) => {
  await page.goto('/account');
  await expect(page.getByRole('heading', { name: /Users, roles and audit events/i })).toBeVisible();
  await expect(page.getByText(/Invite user/i)).toBeVisible();
  await expect(page.getByText(/Durable audit events/i)).toBeVisible();
});
