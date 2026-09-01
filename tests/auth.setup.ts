import { test as setup, expect } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

const AUTH_DIR = path.join(process.cwd(), "playwright/.auth");
const AUTH_FILE = path.join(AUTH_DIR, "owner.json");

setup("authenticate owner", async ({ page }) => {
  fs.mkdirSync(AUTH_DIR, { recursive: true });
  const email = `pw-owner-${Date.now()}@example.com`;
  const response = await page.request.post("/api/auth/signup", {
    data: {
      fullName: "Playwright Owner",
      email,
      password: "RemoteWise1!",
      companyName: "Playwright Studio",
      accentColor: "#4F46E5",
    },
  });
  expect(response.ok(), await response.text()).toBeTruthy();
  await page.context().addCookies([
    {
      name: "rw_cookie_consent",
      value: "necessary",
      url: "http://127.0.0.1:3000",
    },
  ]);
  await page.goto("/dashboard/overview");
  await page.evaluate(() => localStorage.setItem("rw_cookie_consent", "necessary"));
  await page.context().storageState({ path: AUTH_FILE });
});
