import { describe, expect, it } from "vitest";
import { PRODUCTS_BY_ID } from "@/data/menu-index";
import {
  buildLine,
  isQuickAdd,
  lineKey,
  linesTotal,
  missingGroups,
  parseTableNumbers,
} from "./orders";

function product(id: string) {
  const entry = PRODUCTS_BY_ID.get(id);
  if (!entry) throw new Error(`missing product ${id}`);
  return entry.product;
}

const THAI_CURRY =
  "unsere-klassiker--thai-curry-mit-gemuese-und-basmatireis-vegan";
const CAPPUCCINO = "espresso-kaffee--cappuccino";
const ESPRESSO = "espresso-kaffee--espresso";
const OBSTSALAT = "fruehstueck--extras-zum-fruehstueck--frischer-obstsalat";

describe("parseTableNumbers", () => {
  it("accepts commas, dots, spaces and semicolons and removes duplicates", () => {
    expect(parseTableNumbers("3, 14,2;3  7.8")).toEqual({
      numbers: [3, 14, 2, 7, 8],
      invalid: [],
    });
  });

  it("reports invalid tokens", () => {
    expect(parseTableNumbers("0, a, 1000, -2, 5")).toEqual({
      numbers: [5],
      invalid: ["0", "a", "1000", "-2"],
    });
  });

  it("returns nothing for blank input", () => {
    expect(parseTableNumbers("  ,, ")).toEqual({ numbers: [], invalid: [] });
  });
});

describe("buildLine", () => {
  it("adds option surcharges to the variant price", () => {
    const line = buildLine(
      product(THAI_CURRY),
      "default",
      { sorte: ["gruen"], einlage: ["haehnchen"] },
      2,
      "  scharf ",
    );
    expect(line.unitPrice).toBe(1690);
    expect(line.options.map((o) => o.label)).toEqual(["Grün", "Hähnchen"]);
    expect(line.note).toBe("scharf");
    expect(linesTotal([{ ...line, id: "a" }])).toBe(3380);
  });

  it("uses the chosen variant", () => {
    const line = buildLine(product(CAPPUCCINO), "gross", {}, 1, "");
    expect(line.variantLabel).toBe("groß");
    expect(line.unitPrice).toBe(550);
  });
});

describe("missingGroups", () => {
  it("lists required groups without a selection", () => {
    const groups = product(THAI_CURRY).optionGroups ?? [];
    expect(missingGroups(groups, {}).map((g) => g.id)).toEqual(["sorte"]);
    expect(missingGroups(groups, { sorte: ["rot"] })).toEqual([]);
  });
});

describe("lineKey", () => {
  it("ignores option order but not notes", () => {
    const p = product(ESPRESSO);
    const a = buildLine(
      p,
      "default",
      { extras: ["hafermilch", "geeist"] },
      1,
      "",
    );
    const b = buildLine(
      p,
      "default",
      { extras: ["geeist", "hafermilch"] },
      3,
      "",
    );
    const c = buildLine(p, "default", { extras: ["geeist"] }, 1, "heiß");
    expect(lineKey(a)).toBe(lineKey(b));
    expect(lineKey(a)).not.toBe(lineKey(c));
  });
});

describe("isQuickAdd", () => {
  it("is true only for single-price products without required choices", () => {
    expect(isQuickAdd(product(OBSTSALAT))).toBe(true);
    expect(isQuickAdd(product(ESPRESSO))).toBe(true);
    expect(isQuickAdd(product(CAPPUCCINO))).toBe(false);
    expect(isQuickAdd(product(THAI_CURRY))).toBe(false);
  });
});
