import { expect, test } from '@playwright/test';

test('runs a stateless workflow audit from the browser', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /RaeburnAI Workflow Auditor/i })).toBeVisible();

  await page.getByLabel(/Paste workflow/i).fill(
    'Customer support checks a shared inbox, copies customer details into CRM, sends templated email replies, escalates refunds and prepares weekly reports. This happens 120 times per week and takes 12 minutes each time.'
  );
  await page.getByLabel(/Fully loaded hourly cost/i).fill('35');
  await page.getByRole('button', { name: /Run AI workflow audit/i }).click();

  await expect(page.getByText(/Top automation opportunities/i)).toBeVisible();
  await expect(page.getByText(/Implementation roadmap/i)).toBeVisible();
});
