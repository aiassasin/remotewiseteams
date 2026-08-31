import { expect, test } from "@playwright/test";
import path from "node:path";

const pages = [
  { name: "overview", url: "/dashboard/overview" },
  { name: "freelancers", url: "/dashboard/freelancers" },
  { name: "contracts", url: "/dashboard/contracts" },
  { name: "invite-email", url: "/preview/invite-email" },
  { name: "onboarding", url: "/onboarding/profile" },
];

for (const item of pages) {
  test(`visual ${item.name} 1440 and 375`, async ({ page }) => {
    for (const width of [1440, 375] as const) {
      await page.setViewportSize({
        width,
        height: width === 1440 ? 900 : 812,
      });
      await page.goto(item.url);
      await page.screenshot({
        path: path.join(__dirname, "screenshots", `${item.name}-${width}.png`),
        fullPage: true,
        animations: "disabled",
      });
      await expect(page.locator("body")).toHaveScreenshot(`${item.name}-${width}.png`);
    }
  });
}
