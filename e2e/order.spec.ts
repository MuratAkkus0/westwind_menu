import { expect, test, type Page } from "@playwright/test";

async function openTable(page: Page, number: number) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByLabel("Tischnummern").fill(String(number));
  await page.getByRole("button", { name: "Hinzufügen" }).click();
  await page.getByRole("link", { name: `Tisch ${number}` }).click();
  await expect(
    page.getByRole("heading", { name: `Tisch ${number}` }),
  ).toBeVisible();
}

function search(page: Page, query: string) {
  return page.getByLabel("Menü durchsuchen").fill(query);
}

test("takes an order with variants, options and a note, then closes the tab", async ({
  page,
}) => {
  await openTable(page, 3);

  // One-tap product without choices.
  await search(page, "obstsalat");
  await page.getByRole("button", { name: /^Frischer Obstsalat/ }).click();
  await expect(page.getByRole("status")).toHaveText(
    "Frischer Obstsalat hinzugefügt",
  );

  // Product with a required choice and a surcharge.
  await search(page, "thai curry");
  await page.getByRole("button", { name: /^Thai Curry/ }).click();
  const sheet = page.getByRole("dialog");
  await sheet.getByRole("button", { name: /^Hinzufügen/ }).click();
  await expect(sheet.getByRole("alert")).toHaveText("Bitte wählen: Sorte");
  await sheet.getByLabel("Grün").check();
  await sheet.getByLabel("Hähnchen").check();
  await sheet.getByPlaceholder("z. B. ohne Zwiebeln").fill("extra scharf");
  await sheet.getByRole("button", { name: "Menge erhöhen" }).click();
  await sheet.getByRole("button", { name: "Hinzufügen · 33,80 €" }).click();
  await expect(sheet).toBeHidden();

  // Category chips: Cappuccino variant.
  await search(page, "");
  await page.getByRole("button", { name: /^Espresso & Kaffee/ }).click();
  await page.getByRole("button", { name: /^Cappuccino/ }).click();
  await page.getByRole("dialog").getByLabel("groß").check();
  await page.getByRole("dialog").getByLabel("Hafermilch").check();
  await page.getByRole("button", { name: "Hinzufügen · 6,00 €" }).click();

  await page.getByRole("tab", { name: /Bestellung/ }).click();
  await expect(page.getByTestId("order-total")).toHaveText("47,30 €");
  await expect(page.getByText("„extra scharf“")).toBeVisible();
  await expect(page.getByText("Grün · Hähnchen (+3,00 €)")).toBeVisible();

  // Quantity controls.
  await page
    .getByRole("button", { name: "Frischer Obstsalat erhöhen" })
    .click();
  await expect(page.getByTestId("order-total")).toHaveText("54,80 €");

  // Persists across reloads.
  await page.reload();
  await page.getByRole("tab", { name: /Bestellung/ }).click();
  await expect(page.getByTestId("order-total")).toHaveText("54,80 €");

  await page.getByRole("button", { name: "Abrechnen" }).click();
  const checkout = page.getByRole("dialog", { name: "Tisch 3 abrechnen" });
  await checkout.getByText("Karte").click();
  await checkout.getByRole("button", { name: "Abschließen" }).click();

  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("link", { name: /^Tisch \d+$/ })).toHaveCount(0);
  const history = await page.evaluate(
    () => JSON.parse(localStorage.getItem("westwind:v1") ?? "{}").state.history,
  );
  expect(history[0]).toMatchObject({
    tableNumber: 3,
    total: 5480,
    paymentMethod: "card",
  });
});

test("cancels an open tab after confirmation", async ({ page }) => {
  await openTable(page, 7);
  await page.getByRole("tab", { name: /Bestellung/ }).click();
  await page.getByRole("button", { name: "Tisch stornieren" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Stornieren" })
    .click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("link", { name: /^Tisch \d+$/ })).toHaveCount(0);
});

test("shows sold-out items as unavailable", async ({ page }) => {
  await openTable(page, 4);
  await page.goto("/settings");
  await page.getByLabel("Artikel suchen…").fill("obstsalat");
  await page.getByLabel("Frischer Obstsalat").check();

  await page.goto("/table?number=4");
  await search(page, "obstsalat");
  const row = page.getByRole("button", { name: /^Frischer Obstsalat/ });
  await expect(row).toBeDisabled();
  await expect(row).toContainText("ausverkauft");
});

test("explains when a table is not open", async ({ page }) => {
  await page.goto("/table?number=42");
  await expect(page.getByText("Tisch 42 ist nicht geöffnet.")).toBeVisible();
});

test("browses the menu through main category cards", async ({ page }) => {
  await openTable(page, 5);

  // No section tabs any more; the menu starts with the category grid.
  await expect(page.getByRole("tab", { name: "Speisekarte" })).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: /^Mittagstisch/ }),
  ).toBeVisible();

  await page.getByRole("button", { name: /^Frühstück/ }).click();
  await expect(
    page.getByRole("heading", { name: "Extras zum Frühstück" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /^Frischer Obstsalat/ }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Alle Kategorien" }).click();
  await page.getByRole("button", { name: /^Tapas/ }).click();
  for (const heading of ["Veggi", "Fleisch", "Fisch"]) {
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }

  await page.getByRole("button", { name: /^Gebratene Sardellen/ }).click();
  await page.getByRole("button", { name: "Alle Kategorien" }).click();
  await page.getByRole("button", { name: /^★ Zuletzt/ }).click();
  await expect(
    page.getByRole("button", { name: /^Gebratene Sardellen/ }),
  ).toBeVisible();
});
