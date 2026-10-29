import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("adds several tables at once and keeps them after reload", async ({
  page,
}) => {
  const input = page.getByLabel("Tischnummern");
  await input.fill("3, 14,2");
  await page.getByRole("button", { name: "Hinzufügen" }).click();

  await expect(page.getByRole("status")).toHaveText("3 Tisch(e) hinzugefügt.");
  const tiles = page.getByRole("link", { name: /^Tisch \d+$/ });
  await expect(tiles).toHaveText([/2/, /3/, /14/]);
  await expect(input).toHaveValue("");

  await page.reload();
  await expect(tiles).toHaveCount(3);
});

test("reports tables that are already open", async ({ page }) => {
  const input = page.getByLabel("Tischnummern");
  await input.fill("3");
  await input.press("Enter");
  await input.fill("3, 5");
  await input.press("Enter");

  await expect(page.getByRole("status")).toContainText(
    "1 Tisch(e) hinzugefügt.",
  );
  await expect(page.getByRole("status")).toContainText("Bereits offen: 3.");
  await expect(page.getByRole("link", { name: /^Tisch \d+$/ })).toHaveCount(2);
});

test("rejects invalid input", async ({ page }) => {
  const input = page.getByLabel("Tischnummern");
  await input.fill("abc, 0");
  await input.press("Enter");

  await expect(page.locator("#table-feedback")).toContainText(
    "Ungültig: abc, 0.",
  );
  await expect(input).toHaveValue("abc, 0");
  await expect(page.getByRole("link", { name: /^Tisch \d+$/ })).toHaveCount(0);

  await input.fill(" ");
  await input.press("Enter");
  await expect(page.locator("#table-feedback")).toHaveText(
    "Bitte mindestens eine Tischnummer eingeben.",
  );
});
