import { expect, test } from "@playwright/test";

test("404 speaks in Wise Advisor voice", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "That page is not here." })).toBeVisible();
  await expect(page.getByText("We reply within 24h")).toBeVisible();
});

test("settings billing offers Y-tunnus upgrade path", async ({ page }) => {
  await page.goto("/dashboard/settings");
  await page.getByRole("button", { name: "Billing & plan" }).click();
  await expect(page.getByRole("heading", { name: "Y-tunnus + bookkeeping add-on" })).toBeVisible();
});

test("payouts page is not a placeholder", async ({ page }) => {
  await page.goto("/dashboard/payouts");
  await expect(page.getByRole("heading", { name: "Payouts", exact: true })).toBeVisible();
  await expect(page.getByText("lands here next")).toHaveCount(0);
});
