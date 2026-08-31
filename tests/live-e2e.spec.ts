import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

function e2eSecret() {
  const file = path.join(process.cwd(), ".env.local");
  const text = fs.readFileSync(file, "utf8");
  for (const line of text.split("\n")) {
    if (line.startsWith("INVITE_JWT_SECRET=")) {
      return line.slice("INVITE_JWT_SECRET=".length).trim();
    }
  }
  return process.env.INVITE_JWT_SECRET || "";
}

async function signupOwner(page: Page, input: { fullName: string; email: string; password: string; companyName: string }) {
  await page.goto("/signup");
  await page.getByLabel("Full name").fill(input.fullName);
  await page.getByLabel("Work email").fill(input.email);
  await page.getByLabel("Password").fill(input.password);
  await page.getByRole("button", { name: "Continue to workspace" }).click();
  await expect(page.getByLabel("Workspace name")).toBeVisible();
  await page.getByLabel("Workspace name").fill(input.companyName);
  await page.getByRole("radio", { name: "Emerald" }).click();
  const signupResponse = page.waitForResponse(
    (response) => response.url().includes("/api/auth/signup") && response.request().method() === "POST",
  );
  await page.getByRole("button", { name: "Create workspace" }).click();
  const signup = await signupResponse;
  expect(signup.ok(), await signup.text()).toBeTruthy();
  await expect(page).toHaveURL(/\/dashboard\/overview/, { timeout: 20_000 });
}

test.describe("Live invite and contract flow", () => {
  test("signup → workspace → invite → accept → onboard → send → sign lands in Supabase", async ({
    browser,
  }) => {
    test.setTimeout(120_000);
    const stamp = Date.now();
    const ownerEmail = `owner-${stamp}@example.com`;
    const freelancerEmail = `maya-${stamp}@example.com`;
    const ownerPassword = "RemoteWise1!";
    const freelancerPassword = "MayaJoins1!";
    const companyName = `Northstar ${stamp}`;

    const ownerContext = await browser.newContext();
    const ownerPage = await ownerContext.newPage();
    await signupOwner(ownerPage, {
      fullName: "Alex Rivera",
      email: ownerEmail,
      password: ownerPassword,
      companyName,
    });

    await ownerPage.goto("/dashboard/freelancers");
    await ownerPage.getByRole("button", { name: "Invite freelancer" }).first().click();
    await ownerPage.getByLabel("Full name").fill("Maya Chen");
    await ownerPage.getByLabel("Email").fill(freelancerEmail);
    await ownerPage.getByLabel("Role / title").fill("Brand Designer");

    const inviteResponsePromise = ownerPage.waitForResponse(
      (response) =>
        response.url().includes("/api/freelancers/invite") && response.request().method() === "POST",
    );
    await ownerPage.getByRole("button", { name: "Send invite" }).click();
    const inviteJson = (await (await inviteResponsePromise).json()) as { inviteUrl?: string };
    expect(inviteJson.inviteUrl).toBeTruthy();
    await expect(ownerPage.getByText(`Invite sent to ${freelancerEmail}`)).toBeVisible();

    const freelancerContext = await browser.newContext();
    const freelancerPage = await freelancerContext.newPage();
    await freelancerPage.goto(inviteJson.inviteUrl!);
    await freelancerPage.getByRole("button", { name: "Create my account" }).click();
    await freelancerPage.getByLabel("Password", { exact: true }).fill(freelancerPassword);
    await freelancerPage.getByLabel("Confirm password").fill(freelancerPassword);
    await freelancerPage.getByPlaceholder("Search countries").fill("United States");
    await freelancerPage.locator("#country").selectOption("US");
    await freelancerPage.getByRole("button", { name: "Join workspace" }).click();
    await expect(freelancerPage).toHaveURL(/\/onboarding\/profile/, { timeout: 20_000 });

    await freelancerPage.getByRole("button", { name: "Continue to payment setup" }).click();
    await freelancerPage.getByRole("button", { name: "Connect bank account" }).click();
    await expect(freelancerPage.getByRole("button", { name: "Go to my dashboard" })).toBeVisible({
      timeout: 10_000,
    });
    await freelancerPage.getByRole("button", { name: "Go to my dashboard" }).click();
    await expect(freelancerPage).toHaveURL(/\/freelancer\/dashboard/);

    await ownerPage.goto("/dashboard/contracts/new");
    await ownerPage.getByRole("link", { name: "Use this template" }).first().click();
    await expect(ownerPage.getByRole("heading", { name: "Contract details" })).toBeVisible();
    await ownerPage.locator("#freelancer").selectOption({ label: `Maya Chen — ${freelancerEmail}` });
    await ownerPage.getByRole("button", { name: "Preview contract" }).click();
    await expect(ownerPage).toHaveURL(/\/dashboard\/contracts\/.+\/review/, { timeout: 20_000 });
    await expect(ownerPage.getByRole("button", { name: "Send for signature" })).toBeVisible({
      timeout: 15_000,
    });
    await ownerPage.getByRole("button", { name: "Send for signature" }).click();
    const sendResponsePromise = ownerPage.waitForResponse(
      (response) => response.url().includes("/send") && response.request().method() === "POST",
    );
    await ownerPage.getByRole("button", { name: "Send contract" }).click();
    const sendJson = (await (await sendResponsePromise).json()) as { signingUrl?: string; sent?: boolean };
    expect(sendJson.sent).toBeTruthy();
    expect(sendJson.signingUrl).toBeTruthy();

    await freelancerPage.goto(sendJson.signingUrl!);
    await freelancerPage.getByPlaceholder("Type your full legal name to sign").fill("Maya Chen");
    await freelancerPage.getByText("I have read and agree to this contract").click();
    await freelancerPage.getByRole("button", { name: "Sign contract" }).click();
    await expect(freelancerPage.getByText("Contract signed successfully")).toBeVisible({
      timeout: 20_000,
    });

    const snapshot = await ownerPage.request.get(
      `/api/e2e/snapshot?ownerEmail=${encodeURIComponent(ownerEmail)}&freelancerEmail=${encodeURIComponent(freelancerEmail)}`,
      { headers: { "x-e2e-secret": e2eSecret() } },
    );
    expect(snapshot.ok(), await snapshot.text()).toBeTruthy();
    const rows = (await snapshot.json()) as {
      ownerUser: boolean;
      freelancerUser: boolean;
      company: { name: string; accent_color: string } | null;
      member: { role: string } | null;
      invite: { status: string } | null;
      freelancer: { status: string; user_id: string | null } | null;
      contract: { status: string; signer_name: string | null } | null;
    };

    expect(rows.ownerUser).toBe(true);
    expect(rows.freelancerUser).toBe(true);
    expect(rows.company?.name).toBe(companyName);
    expect(rows.company?.accent_color).toBe("#10B981");
    expect(rows.member?.role).toBe("owner");
    expect(rows.invite?.status).toBe("accepted");
    expect(rows.freelancer?.status).toBe("active");
    expect(rows.freelancer?.user_id).toBeTruthy();
    expect(rows.contract?.status).toBe("signed");
    expect(rows.contract?.signer_name).toBe("Maya Chen");

    await ownerContext.close();
    await freelancerContext.close();
  });
});
