import { expect, test } from "@playwright/test";

test("language switcher translates overview and invoices nav to Finnish", async ({ page }) => {
  await page.goto("/dashboard/overview");
  await expect(page.getByRole("heading", { name: "Overview", exact: true })).toBeVisible();

  await page.getByLabel("Language").first().selectOption("fi");

  await expect(page.getByRole("heading", { name: "Yhteenveto", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Lähetä sopimus" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Kutsu freelancer" }).first()).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Päävalikko" }).getByRole("link", { name: "Laskut" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Päävalikko" }).getByRole("link", { name: "Yhteenveto" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Yhteenveto", exact: true })).toBeVisible();

  await page.getByLabel("Kieli").first().selectOption("en");
  await expect(page.getByRole("heading", { name: "Overview", exact: true })).toBeVisible();
});
