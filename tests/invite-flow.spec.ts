import { expect, test, type Page } from "@playwright/test";
import path from "node:path";

const SCREENSHOT_DIR = path.join(__dirname, "screenshots");

async function openInviteModal(page: Page) {
  await page.goto("/dashboard/freelancers");
  await expect(page.getByRole("heading", { name: "Freelancers", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Invite freelancer" }).first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Invite freelancer" })).toBeVisible();
}

test.describe("Freelancer invite modal", () => {
  test("opens the invite modal and captures 1440px and 375px screenshots", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openInviteModal(page);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "invite-modal-1440.png"),
      fullPage: true,
      animations: "disabled",
    });
    await expect(page.getByRole("dialog")).toHaveScreenshot("invite-modal-desktop.png");

    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, "invite-modal-375.png"),
      fullPage: true,
      animations: "disabled",
    });
    await expect(page.getByRole("dialog")).toHaveScreenshot("invite-modal-mobile.png");
  });

  test("shows validation errors for empty submit and invalid email", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openInviteModal(page);

    await page.getByRole("button", { name: "Send invite" }).click();
    await expect(page.getByText("Full name is required")).toBeVisible();
    await expect(page.getByText("Email is required")).toBeVisible();

    await page.getByLabel("Full name").fill("Ahmed Hassan");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByRole("button", { name: "Send invite" }).click();
    await expect(page.getByText("Enter a valid email address")).toBeVisible();
  });

  test("submits a valid invite and shows a success toast", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.route("**/api/freelancers/invite", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          inviteId: "invite_test",
          message: "Invite sent to ahmed@studio.co",
        }),
      });
    });

    await openInviteModal(page);

    await page.getByLabel("Full name").fill("Ahmed Hassan");
    await page.getByLabel("Email").fill("ahmed@studio.co");
    await page.getByLabel("Role / title").fill("UI Designer");
    await page.getByLabel("Hourly rate").fill("85");
    await page.getByLabel("Personal note").fill("Excited to work together on the new brand.");

    await page.getByRole("button", { name: "Send invite" }).click();
    await expect(page.getByRole("button", { name: "Sending invite..." })).toBeDisabled();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(page.getByText("Invite sent to ahmed@studio.co")).toBeVisible();
  });

  test("Cancel closes the modal without submitting", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openInviteModal(page);
    await page.getByLabel("Full name").fill("Temp");
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});
