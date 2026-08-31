import { expect, test } from "@playwright/test";

test.describe("pricing v2.1", () => {
  test("shows 5.5% and Why RemoteWise instead of competitor table", async ({ page }) => {
    await page.goto("/pricing");
    await expect(page.getByRole("heading", { name: "Why RemoteWise" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "How we work" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Why we are better" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Smart tips" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Our promise to you" })).toBeVisible();
    await expect(page.getByText("Honest comparison")).toHaveCount(0);
    await expect(page.getByText("We are not the cheapest.")).toHaveCount(0);
    await expect(page.getByText("5.5% all-in").first()).toBeVisible();
    await expect(page.getByText("Invoice €5,000.00 → you keep €4,725.00")).toBeVisible();
    await expect(page.getByLabel("Currency")).toHaveValue("EUR");
    await expect(page.getByLabel("Currency")).toContainText("USD");
    await expect(page.getByLabel("Currency")).toContainText("GBP");
    await expect(page.getByLabel("Currency")).toContainText("RUB");
    await expect(page.getByLabel("Currency")).toContainText("CNY");
    await expect(page.getByText("You receive")).toBeVisible();
  });
});

test.describe("legal", () => {
  test("privacy, terms, invoicing, cookies have real copy and footer", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: "Privacy policy" })).toBeVisible();
    await expect(page.getByText("General Data Protection Regulation")).toBeVisible();
    await page.goto("/terms");
    await expect(page.getByText("tri-party")).toBeVisible();
    await page.goto("/invoicing-terms");
    await expect(page.getByText("draft or sent")).toBeVisible();
    await page.goto("/cookies");
    await expect(page.getByRole("heading", { name: "Cookie policy" })).toBeVisible();
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Privacy" })).toBeVisible();
  });

  test("cookie banner can be dismissed", async ({ page }) => {
    await page.goto("/pricing");
    const banner = page.getByRole("dialog", { name: "Cookies" });
    if (await banner.isVisible()) {
      await page.getByRole("button", { name: "Necessary only" }).click();
      await expect(banner).toHaveCount(0);
    }
  });
});
