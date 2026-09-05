import { expect, test } from "@playwright/test";

test.use({ storageState: { cookies: [], origins: [] } });

function rgbOf(color: string) {
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return { r: 0, g: 0, b: 0 };
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) };
}

function near(actual: number, expected: number, tolerance = 4) {
  return Math.abs(actual - expected) <= tolerance;
}

function isPearl({ r, g, b }: { r: number; g: number; b: number }) {
  return near(r, 248) && near(g, 249) && near(b, 250);
}

function isWhite({ r, g, b }: { r: number; g: number; b: number }) {
  return r >= 250 && g >= 250 && b >= 250;
}

function isGold({ r, g, b }: { r: number; g: number; b: number }) {
  return near(r, 250, 8) && near(g, 218, 8) && near(b, 94, 12);
}

function isDeepNavy({ r, g, b }: { r: number; g: number; b: number }) {
  return near(r, 11, 8) && near(g, 26, 10) && near(b, 51, 12);
}

function isGoldBorder({ r, g, b }: { r: number; g: number; b: number }) {
  return near(r, 250, 8) && near(g, 218, 8) && near(b, 94, 12);
}

function isLightGreen({ r, g, b }: { r: number; g: number; b: number }) {
  return g > r && g > b && g > 180 && r < 230 && b < 230;
}

async function openLogin(
  page: import("@playwright/test").Page,
  width: number,
  theme: "light" | "dark" = "light",
) {
  await page.setViewportSize({ width, height: width < 500 ? 812 : 900 });
  await page.addInitScript((nextTheme) => {
    window.localStorage.setItem("rw_cookie_consent", "necessary");
    window.localStorage.setItem("rw-theme", nextTheme);
    document.cookie = "rw_cookie_consent=necessary; path=/";
  }, theme);
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /sign in to manage contracts/i })).toBeVisible();
}

test("login canvas is pearl with a white card at rest", async ({ page }) => {
  await openLogin(page, 1280);

  const shell = page.locator(".rw-auth-shell");
  const frame = page.getByTestId("login-frame");
  const submit = page.getByRole("button", { name: /sign in/i });
  await expect(shell).toBeVisible();
  await expect(frame).toBeVisible();
  await expect(page.getByLabel("Language").first()).toBeVisible();
  await expect(page.getByText("Manage contracts, invoices, and payouts.")).toBeVisible();

  const shellBg = await shell.evaluate((el) => getComputedStyle(el).backgroundColor);
  const frameBg = await frame.evaluate((el) => getComputedStyle(el).backgroundColor);
  const headingColor = await page
    .getByRole("heading", { name: /sign in to manage contracts/i })
    .evaluate((el) => getComputedStyle(el).color);
  const submitBg = await submit.evaluate((el) => getComputedStyle(el).backgroundColor);
  const submitColor = await submit.evaluate((el) => getComputedStyle(el).color);

  expect(isPearl(rgbOf(shellBg)), `shell ${shellBg}`).toBeTruthy();
  expect(isWhite(rgbOf(frameBg)), `frame ${frameBg}`).toBeTruthy();
  expect(isDeepNavy(rgbOf(headingColor)), `heading ${headingColor}`).toBeTruthy();
  expect(isGold(rgbOf(submitBg)), `submit ${submitBg}`).toBeTruthy();
  expect(isDeepNavy(rgbOf(submitColor)), `submit text ${submitColor}`).toBeTruthy();
  await expect(frame).not.toHaveClass(/rw-login-frame-success/);
});

test("login inputs use gold focus ring", async ({ page }) => {
  await openLogin(page, 1280);

  const email = page.locator("#email");
  await email.click();
  await page.waitForTimeout(200);

  const border = await email.evaluate((el) => getComputedStyle(el).borderColor);
  const shadow = await email.evaluate((el) => getComputedStyle(el).boxShadow);
  expect(isGoldBorder(rgbOf(border)), `border ${border}`).toBeTruthy();
  expect(shadow).toContain("250, 218, 94");
});

test("wrong password keeps the white card", async ({ page }) => {
  await openLogin(page, 1280);

  await page.getByLabel("Email").fill("nobody@example.com");
  await page.getByLabel("Password").fill("not-the-password");
  await page.getByRole("button", { name: /sign in/i }).click();
  await expect(page.locator(".rw-field-error")).toBeVisible();

  const frame = page.getByTestId("login-frame");
  const frameBg = await frame.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(isWhite(rgbOf(frameBg)), `frame ${frameBg}`).toBeTruthy();
  await expect(frame).not.toHaveClass(/rw-login-frame-success/);
});

test("success class turns the frame light green", async ({ page }) => {
  await openLogin(page, 1280);

  const frame = page.getByTestId("login-frame");
  await frame.evaluate((el) => el.classList.add("rw-login-frame-success"));
  await page.waitForTimeout(350);

  const frameBg = await frame.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(isLightGreen(rgbOf(frameBg)), `frame ${frameBg}`).toBeTruthy();
});

test("login API success applies the green frame before redirect", async ({ page }) => {
  await openLogin(page, 1280);

  await page.route("**/api/auth/login", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ redirect: "/dashboard/overview" }),
    });
  });
  await page.route("**/dashboard/**", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await route.abort();
  });

  await page.getByLabel("Email").fill("owner@example.com");
  await page.getByLabel("Password").fill("RemoteWise1!");
  await page.getByRole("button", { name: /sign in/i }).click();

  const frame = page.getByTestId("login-frame");
  await expect(frame).toHaveClass(/rw-login-frame-success/);
  await page.waitForTimeout(350);
  const frameBg = await frame.evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(isLightGreen(rgbOf(frameBg)), `frame ${frameBg}`).toBeTruthy();
});

test("login frame stays white at ~400px", async ({ page }) => {
  await openLogin(page, 400);

  const shellBg = await page.locator(".rw-auth-shell").evaluate((el) => getComputedStyle(el).backgroundColor);
  const frameBg = await page.getByTestId("login-frame").evaluate((el) => getComputedStyle(el).backgroundColor);
  const submitBg = await page.getByRole("button", { name: /sign in/i }).evaluate((el) => getComputedStyle(el).backgroundColor);

  expect(isPearl(rgbOf(shellBg)), `shell ${shellBg}`).toBeTruthy();
  expect(isWhite(rgbOf(frameBg)), `frame ${frameBg}`).toBeTruthy();
  expect(isGold(rgbOf(submitBg)), `submit ${submitBg}`).toBeTruthy();
});

test("login stays pearl with a white card when html.dark is on", async ({ page }) => {
  await openLogin(page, 1280, "dark");

  await expect(page.locator("html")).toHaveClass(/dark/);
  const shellBg = await page.locator(".rw-auth-shell").evaluate((el) => getComputedStyle(el).backgroundColor);
  const frameBg = await page.getByTestId("login-frame").evaluate((el) => getComputedStyle(el).backgroundColor);
  const bodyBg = await page.locator("body").evaluate((el) => getComputedStyle(el).backgroundColor);
  const submitBg = await page.getByRole("button", { name: /sign in/i }).evaluate((el) => getComputedStyle(el).backgroundColor);

  expect(isPearl(rgbOf(shellBg)), `shell ${shellBg}`).toBeTruthy();
  expect(isPearl(rgbOf(bodyBg)), `body ${bodyBg}`).toBeTruthy();
  expect(isWhite(rgbOf(frameBg)), `frame ${frameBg}`).toBeTruthy();
  expect(isGold(rgbOf(submitBg)), `submit ${submitBg}`).toBeTruthy();
});
