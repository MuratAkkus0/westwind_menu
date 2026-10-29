import { describe, expect, it } from "vitest";
import { MENU } from "./menu";
import { ALL_PRODUCTS, PRODUCTS_BY_ID, searchProducts } from "./menu-index";

function priceOf(name: string, variantLabel = ""): number | undefined {
  const entry = ALL_PRODUCTS.find((e) => e.product.name === name);
  return entry?.product.variants.find((v) => v.label === variantLabel)?.price;
}

describe("menu data", () => {
  it("has the three printed menu cards", () => {
    expect(MENU.map((s) => s.name)).toEqual([
      "Speisekarte",
      "Mittagstisch",
      "Saisonale Speisen",
    ]);
  });

  it("uses unique section, category and product ids", () => {
    const sectionIds = MENU.map((s) => s.id);
    const categoryIds = MENU.flatMap((s) => s.categories.map((c) => c.id));
    expect(new Set(sectionIds).size).toBe(sectionIds.length);
    expect(new Set(categoryIds).size).toBe(categoryIds.length);
    expect(PRODUCTS_BY_ID.size).toBe(ALL_PRODUCTS.length);
  });

  it("gives every product at least one variant with a positive integer price", () => {
    for (const { product } of ALL_PRODUCTS) {
      expect(product.variants.length, product.id).toBeGreaterThan(0);
      const variantIds = product.variants.map((v) => v.id);
      expect(new Set(variantIds).size, product.id).toBe(variantIds.length);
      for (const v of product.variants) {
        expect(Number.isInteger(v.price) && v.price > 0, product.id).toBe(true);
      }
    }
  });

  it("keeps option groups consistent", () => {
    for (const { product } of ALL_PRODUCTS) {
      const groupIds = (product.optionGroups ?? []).map((g) => g.id);
      expect(new Set(groupIds).size, product.id).toBe(groupIds.length);
      for (const g of product.optionGroups ?? []) {
        expect(g.min <= g.max && g.max <= g.options.length, g.id).toBe(true);
        const optionIds = g.options.map((o) => o.id);
        expect(new Set(optionIds).size, g.id).toBe(optionIds.length);
        for (const o of g.options) {
          expect(Number.isInteger(o.price) && o.price >= 0, o.id).toBe(true);
        }
      }
    }
  });

  it("matches spot-checked prices from the PDFs", () => {
    expect(priceOf("Westwind", "für 2 Personen")).toBe(3290);
    expect(priceOf("Big for Two")).toBe(5990);
    expect(
      priceOf("Kalbsleber mit Zwiebeln, Apfelmus und Kartoffelpüree", "groß"),
    ).toBe(2390);
    expect(priceOf("Cappuccino", "groß")).toBe(550);
    expect(priceOf("Sauvignon Blanc", "0,5l Karaffe")).toBe(1850);
    expect(priceOf("Flasche Champagner 0,75l")).toBe(8800);
    expect(
      priceOf("10. Burger (150g Färsen Patty) / Pommes", "Cheeseburger"),
    ).toBe(1300);
    expect(priceOf("Currywurst XL / Pommes")).toBe(1190);
    expect(priceOf("Oldesloer Weizenkorn 2cl")).toBe(250);
  });
});

describe("searchProducts", () => {
  it("ignores case and accents", () => {
    const names = searchProducts("cafe").map((e) => e.product.name);
    expect(names).toContain("Café Crema");
    expect(searchProducts("KASE").length).toBeGreaterThan(0);
  });

  it("requires every term to match", () => {
    const names = searchProducts("pfannkuchen nutella").map(
      (e) => e.product.name,
    );
    expect(names).toEqual(["Pfannkuchen mit Nutella"]);
  });

  it("returns nothing for an empty query", () => {
    expect(searchProducts("  ")).toEqual([]);
  });
});
