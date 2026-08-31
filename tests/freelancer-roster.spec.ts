import { expect, test } from "@playwright/test";
import path from "node:path";

test.describe("Freelancer roster", () => {
  test("empty state, then table and card views after invite", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/dashboard/freelancers");
    await expect(page.getByRole("heading", { name: "No freelancers yet" })).toBeVisible();

    await page.route("**/api/freelancers/invite", async (route) => {
      const json = route.request().postDataJSON() as { email: string; name: string };
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ inviteId: "inv_1", message: `Invite sent to ${json.email}` }),
      });
    });

    await page.getByRole("button", { name: "Invite freelancer" }).first().click();
    await page.getByLabel("Full name").fill("Lina Park");
    await page.getByLabel("Email").fill("lina@studio.co");
    await page.getByLabel("Role / title").fill("Brand Designer");
    await page.getByLabel("Hourly rate").fill("90");
    await page.getByRole("button", { name: "Send invite" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);

    await expect(page.getByText("Lina Park")).toBeVisible();
    await page.getByPlaceholder("Search by name or email...").fill("lina");
    await expect(page.getByText("lina@studio.co", { exact: true })).toBeVisible();
    await page.getByLabel("Filter by status").selectOption("invited");
    await expect(page.getByText("Brand Designer")).toBeVisible();

    await page.getByRole("button", { name: "Card view" }).click();
    await expect(page.getByRole("link", { name: "View profile" })).toBeVisible();
    await page.screenshot({
      path: path.join(__dirname, "screenshots/roster-cards-1440.png"),
      animations: "disabled",
    });

    await page.getByRole("button", { name: "Table view" }).click();
    await page.screenshot({
      path: path.join(__dirname, "screenshots/roster-table-1440.png"),
      animations: "disabled",
    });
  });
});
