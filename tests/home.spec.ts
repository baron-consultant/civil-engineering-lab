import { expect, test } from "@playwright/test";

test("홈 페이지에서 시작하기 가이드로 이동한다", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { level: 1, name: "Welcome to Civil Engineering Lab" }),
  ).toBeVisible();

  const cta = page.getByRole("link", { name: "Get Started" });
  await expect(cta).toBeVisible();

  await cta.click();

  await expect(page).toHaveURL(/\/guides\/getting-started\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "Getting Started" })).toBeVisible();
});
