import { describe, expect, it } from "vitest";
import { formatCents } from "./money";

describe("formatCents", () => {
  it("formats cents as de-DE euro", () => {
    expect(formatCents(1390).replace(/ /g, " ")).toBe("13,90 €");
    expect(formatCents(0).replace(/ /g, " ")).toBe("0,00 €");
  });
});
