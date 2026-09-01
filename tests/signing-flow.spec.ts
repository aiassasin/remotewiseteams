import { expect, test } from "@playwright/test";
import path from "node:path";

test.describe("Signing flow", () => {
  test("invalid token shows an error", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/sign/not-a-real-token");
    await expect(page.getByText("This signing link is invalid or expired.")).toBeVisible();
  });

  test("sign page enables the button after name and checkbox", async ({ page }) => {
    await page.route("**/api/sign/*/validate", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          valid: true,
          contractHtml: "1. Confidentiality\nBoth parties agree to keep secrets.",
          companyName: "Studio Oy",
          freelancerName: "Ahmed Hassan",
          freelancerEmail: "ahmed@studio.co",
          title: "NDA — Studio Oy",
          type: "NDA",
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          status: "sent",
        }),
      });
    });
    await page.route("**/api/sign/*/complete", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, downloadUrl: "data:application/pdf;base64,AA==" }),
      });
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/sign/mock-token");
    await expect(page.getByText("Secure document signing")).toBeVisible();
    const signButton = page.getByRole("button", { name: "Sign contract" });
    await expect(signButton).toBeDisabled();
    await page.getByPlaceholder("Type your full legal name to sign").fill("Ahmed Hassan");
    await expect(signButton).toBeDisabled();
    await page.getByText("I have read and agree to this contract").click();
    await expect(signButton).toBeEnabled();
    await page.screenshot({
      path: path.join(__dirname, "screenshots/sign-page-1440.png"),
      fullPage: true,
      animations: "disabled",
    });
    await signButton.click();
    await expect(page.getByText("Contract signed successfully")).toBeVisible();
  });
});
