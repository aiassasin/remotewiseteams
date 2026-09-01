import { expect, test } from "@playwright/test";
import path from "node:path";

test.describe("Contract builder overhaul", () => {
  test("dynamic data, Finland-first law, clauses, dates, type, preview, i18n", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/dashboard/contracts/new/nda");
    await expect(page.getByRole("heading", { name: "Contract details" })).toBeVisible();

    await expect(page.getByText("Northstar")).toHaveCount(0);
    await expect(page.getByText("England and Wales")).toHaveCount(0);
    await expect(page.getByLabel("Type", { exact: true })).toHaveCount(0);
    await expect(page.getByText("Additional clauses")).toHaveCount(0);

    await expect(page.getByText("Keep shared information confidential.")).toBeVisible();
    await expect(page.getByText("The ongoing relationship, pay, and how you end it.")).toBeVisible();
    await expect(page.getByText("This project: what, when, and for how much.")).toBeVisible();
    await expect(page.getByText("You are a contractor, not an employee.")).toBeVisible();
    await expect(page.getByText("Write your own scope; we wrap it in a clean frame.")).toBeVisible();

    await expect(page.getByLabel("Company name")).toBeEditable();
    await expect(page.getByLabel("Company address")).toBeEditable();
    await expect(page.getByLabel("Company ID (Y-tunnus)")).toBeEditable();
    await expect(page.getByLabel("Company name")).toHaveValue(/Playwright Studio/, { timeout: 15_000 });

    await expect(page.getByText("No freelancers yet — invite one first")).toBeVisible();
    await expect(page.getByRole("link", { name: "Invite freelancer" })).toBeVisible();

    await expect(page.locator("#law")).toHaveValue("FI");
    await expect(page.getByText("The country whose laws apply to this contract.")).toBeVisible();
    await expect(page.getByLabel("Start date")).toBeVisible();
    await expect(page.getByText("When this contract becomes active.")).toBeVisible();
    await expect(page.getByLabel("Signature deadline")).toBeVisible();
    await expect(page.getByText("If not signed by this date, the request is cancelled automatically.")).toBeVisible();

    await expect(page.getByText("Confidentiality period")).toBeVisible();
    await expect(page.getByText("Secrets stay secret for 2 years after the contract ends.")).toBeVisible();
    await expect(page.getByText("Intellectual property transfers to the client when the invoice is paid.")).toBeVisible();
    await expect(page.getByText(/Neither side poaches/)).toBeVisible();
    await expect(page.getByText("Personal data is handled under the GDPR.")).toBeVisible();
    await expect(page.getByText("Late invoices follow the Finnish Interest Act / EU Late Payment Directive.")).toBeVisible();

    await expect(page.getByRole("button", { name: "Preview contract" })).toBeVisible();
    await expect(page.locator("#contract-preview")).toContainText("Finland");
    await expect(page.locator("#contract-preview")).toContainText("Who this agreement is between.");
    await expect(page.locator("#contract-preview")).toContainText("This template is informational, not legal advice.");

    await page.getByRole("switch", { name: /Confidentiality period/ }).click();
    await expect(page.locator("#contract-preview")).toContainText("two (2) years after this contract ends");

    await page.locator("#language").selectOption("fi");
    await expect(page.getByRole("heading", { name: "Sopimuksen tiedot" })).toBeVisible();
    await expect(page.getByLabel("Sovellettava laki")).toBeVisible();
    await expect(page.locator("#contract-preview")).toContainText("Osapuolet");
    await expect(page.locator("#contract-preview")).toContainText("Tämä malli on informatiivinen, ei oikeudellista neuvontaa.");

    await page.screenshot({
      path: path.join(__dirname, "screenshots/contract-builder-overhaul-1440.png"),
      fullPage: true,
      animations: "disabled",
    });
  });

  test("mobile preview modal and dark mode", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/dashboard/contracts/new/nda");
    await expect(page.getByLabel("Company name")).toHaveValue(/Playwright Studio/, { timeout: 15_000 });
    await page.getByRole("button", { name: "Preview contract" }).click();
    await expect(page.getByRole("dialog")).toContainText("Playwright Studio");
    await expect(page.getByRole("dialog")).toContainText("This template is informational, not legal advice.");
    await page.getByRole("button", { name: "Close preview" }).click();

    await page.evaluate(() => document.documentElement.classList.add("dark"));
    await page.screenshot({
      path: path.join(__dirname, "screenshots/contract-builder-mobile-dark.png"),
      fullPage: true,
      animations: "disabled",
    });
  });
});
