import { expect, test } from '@playwright/test';

test('홈 페이지가 로드된다', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/CivilEngineeringLab/i);
});
