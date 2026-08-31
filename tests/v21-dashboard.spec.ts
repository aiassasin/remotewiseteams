import { expect, test } from "@playwright/test";

test("settings is a real page with persisted tabs", async ({ page }) => {
  await page.goto("/dashboard/settings");
  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  await expect(page.getByText("lands here next")).toHaveCount(0);
  await expect(page.getByRole("navigation", { name: "Settings sections" })).toBeVisible();
  await page.getByRole("button", { name: "Appearance" }).click();
  await expect(page.getByRole("heading", { name: "Appearance" })).toBeVisible();
  await page.getByRole("button", { name: "Company" }).click();
  await expect(page.getByRole("heading", { name: "Company" })).toBeVisible();
  await page.getByRole("button", { name: "Members" }).click();
  await expect(page.getByRole("heading", { name: "Members" })).toBeVisible();
  await page.getByRole("button", { name: "Notifications" }).click();
  await expect(page.getByRole("heading", { name: "Notifications" })).toBeVisible();
  await page.getByRole("button", { name: "Billing & plan" }).click();
  await expect(page.getByRole("heading", { name: "Billing & plan" })).toBeVisible();
  await page.getByRole("button", { name: "Security" }).click();
  await expect(page.getByRole("heading", { name: "Security" })).toBeVisible();
  await page.getByRole("button", { name: "Data & privacy" }).click();
  await expect(page.getByRole("heading", { name: "Data & privacy" })).toBeVisible();
});

test("overview shows checklist, charts, and help", async ({ page }) => {
  await page.goto("/dashboard/overview");
  await expect(page.getByRole("heading", { name: "Get your first payout" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Monthly payouts" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Invoice status" })).toBeVisible();
  await page.goto("/dashboard/help");
  await expect(page.getByText("We reply within 24h")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Contact" })).toBeVisible();
});

test("invoices page is not a placeholder", async ({ page }) => {
  await page.goto("/dashboard/invoices");
  await expect(page.getByRole("heading", { name: "Invoices", exact: true })).toBeVisible();
  await expect(page.getByText("lands here next")).toHaveCount(0);
});
