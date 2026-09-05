import { expect, test } from "@playwright/test";

test("language switcher translates overview heading and primary CTAs to Finnish", async ({ page }) => {
  await page.goto("/dashboard/overview");
  await expect(page.getByRole("heading", { name: "Overview", exact: true })).toBeVisible();

  await page.getByLabel("Language").first().selectOption("fi");

  await expect(page.getByRole("heading", { name: "Yhteenveto", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Lähetä sopimus" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Kutsu freelancer" }).first()).toBeVisible();
  await expect(page.getByText("Odotettavat laskut")).toBeVisible();
  await expect(page.getByText("Allekirjoitetut sopimukset")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Päävalikko" }).getByRole("link", { name: "Laskut" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Päävalikko" }).getByRole("link", { name: "Yhteenveto" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ei laskuja vielä." })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: "Yhteenveto", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Lähetä sopimus" }).first()).toBeVisible();

  await page.getByLabel("Kieli").first().selectOption("en");
  await expect(page.getByRole("heading", { name: "Overview", exact: true })).toBeVisible();
});

test("dashboard heading, button and empty state switch to Swedish", async ({ page }) => {
  await page.goto("/dashboard/overview");
  await page.getByLabel("Language").first().selectOption("sv");
  await expect(page.getByRole("heading", { name: "Översikt", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Bjud in frilansare" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Inga fakturor ännu." })).toBeVisible();
});

test("language switcher is visible on the freelancers page", async ({ page }) => {
  await page.goto("/dashboard/freelancers");
  const header = page.locator("header").first();
  await expect(header.getByLabel("Language")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Freelancers", exact: true })).toBeVisible();
});

test("settings has a language section", async ({ page }) => {
  await page.goto("/dashboard/settings");
  await page.getByRole("button", { name: "Language", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Language", exact: true })).toBeVisible();
  await expect(page.getByLabel("Language")).toHaveCount(3);
});

test("freelancer profile leaves the loading state", async ({ page }) => {
  await page.route(/\/api\/freelancers\/(?!invite(?:\/|$))[^/?]+$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        freelancer: {
          id: "f1",
          companyId: "c1",
          userId: null,
          email: "lina@studio.co",
          fullName: "Lina Park",
          role: "Designer",
          hourlyRate: 90,
          currency: "EUR",
          country: "FI",
          timezone: null,
          bio: null,
          linkedin: null,
          website: null,
          avatarUrl: null,
          stripeAccountId: null,
          stripeOnboarded: false,
          status: "invited",
          createdAt: "2026-01-01T00:00:00.000Z",
        },
        contracts: [],
        stats: { totalPaid: 0, activeContracts: 0, avgPaymentTime: "—" },
      }),
    });
  });

  await page.goto("/dashboard/freelancers/f1");
  await expect(page.getByRole("heading", { name: "Lina Park" })).toBeVisible();
  await expect(page.getByText(/Loading profile/)).toHaveCount(0);
  await expect(page.locator("header").first().getByLabel("Language")).toBeVisible();
});

test("pricing landing hero and CTA switch to Finnish and Swedish", async ({ page }) => {
  await page.goto("/pricing");
  const banner = page.getByRole("dialog", { name: "Cookies" });
  if (await banner.isVisible()) {
    await page.getByRole("button", { name: "Necessary only" }).click();
  }

  await expect(page.getByRole("heading", { name: /Invoice the world/ })).toBeVisible();

  await page.getByLabel("Language").first().selectOption("fi");
  await expect(page.getByRole("heading", { name: /Laskuta maailmaa/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Aloita" }).first()).toBeVisible();

  await page.getByLabel("Kieli").first().selectOption("sv");
  await expect(page.getByRole("heading", { name: /Fakturera världen/ })).toBeVisible();
  await expect(page.getByRole("link", { name: "Kom igång" }).first()).toBeVisible();
});
