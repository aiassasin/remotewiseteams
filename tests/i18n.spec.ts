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
  await expect(page.getByRole("heading", { name: "Ei laskuja vielä." })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Yhteenveto", exact: true })).toBeVisible();

  await page.getByLabel("Kieli").first().selectOption("en");
  await expect(page.getByRole("heading", { name: "Overview", exact: true })).toBeVisible();
});

test("dashboard heading, button and empty state switch to German", async ({ page }) => {
  await page.goto("/dashboard/overview");
  await page.getByLabel("Language").first().selectOption("de");
  await expect(page.getByRole("heading", { name: "Übersicht", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Freelancer einladen" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Noch keine Rechnungen." })).toBeVisible();
});

test("pricing landing hero and CTA switch to Finnish and German", async ({ page }) => {
  await page.goto("/pricing");
  const banner = page.getByRole("dialog", { name: "Cookies" });
  if (await banner.isVisible()) {
    await page.getByRole("button", { name: "Necessary only" }).click();
  }

  await expect(page.getByRole("heading", { name: /Invoice the world/ })).toBeVisible();

  await page.getByLabel("Language").first().selectOption("fi");
  await expect(page.getByRole("heading", { name: /Laskuta maailmaa/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Aloita" }).first()).toBeVisible();

  await page.getByLabel("Kieli").first().selectOption("de");
  await expect(page.getByRole("heading", { name: /Rechne weltweit/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Loslegen" }).first()).toBeVisible();
});
