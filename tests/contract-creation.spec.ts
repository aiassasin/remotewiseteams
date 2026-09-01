import { expect, test } from "@playwright/test";
import path from "node:path";

test.describe("Contract creation", () => {
  test("choose template and open builder", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/dashboard/contracts/new");
    await expect(page.getByRole("heading", { name: "New contract" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "NDA" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "MSA" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "SOW" })).toBeVisible();
    await page.screenshot({
      path: path.join(__dirname, "screenshots/contract-templates-1440.png"),
      fullPage: true,
      animations: "disabled",
    });
    await page.getByRole("link", { name: "Use this template" }).first().click();
    await expect(page.getByRole("heading", { name: "Contract details" })).toBeVisible();
    await expect(page.getByText("Keep shared information confidential.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Preview contract" })).toBeVisible();
    await page.screenshot({
      path: path.join(__dirname, "screenshots/contract-builder-1440.png"),
      fullPage: true,
      animations: "disabled",
    });
  });
});
