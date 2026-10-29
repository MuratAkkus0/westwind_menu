import { beforeEach, describe, expect, it } from "vitest";
import type { LineInput } from "@/lib/orders";
import { STORAGE_KEY, migrateState, useOrderStore } from "./order-store";

const espresso: LineInput = {
  productId: "espresso-kaffee--espresso",
  productName: "Espresso",
  variantId: "default",
  variantLabel: "",
  options: [],
  unitPrice: 300,
  quantity: 1,
  note: "",
};

const store = () => useOrderStore.getState();

beforeEach(() => {
  localStorage.clear();
  useOrderStore.setState({
    tabs: {},
    history: [],
    soldOut: [],
    recent: [],
  });
});

describe("order store", () => {
  it("opens only tables that are not open yet", () => {
    expect(store().addTables([3, 14])).toEqual({
      added: [3, 14],
      existing: [],
    });
    expect(store().addTables([14, 2])).toEqual({ added: [2], existing: [14] });
    expect(Object.keys(store().tabs)).toEqual(["2", "3", "14"]);
  });

  it("merges identical lines and keeps different notes apart", () => {
    store().addTables([3]);
    store().addLine(3, espresso);
    store().addLine(3, { ...espresso, quantity: 2 });
    store().addLine(3, { ...espresso, note: "doppelt" });
    const lines = store().tabs[3].lines;
    expect(lines.map((l) => [l.note, l.quantity])).toEqual([
      ["", 3],
      ["doppelt", 1],
    ]);
    expect(store().recent).toEqual([espresso.productId]);
  });

  it("ignores lines for tables that are not open", () => {
    store().addLine(9, espresso);
    expect(store().tabs[9]).toBeUndefined();
    expect(store().recent).toEqual([]);
  });

  it("removes a line when its quantity reaches zero", () => {
    store().addTables([3]);
    store().addLine(3, espresso);
    const id = store().tabs[3].lines[0].id;
    store().changeQuantity(3, id, 1);
    expect(store().tabs[3].lines[0].quantity).toBe(2);
    store().changeQuantity(3, id, -2);
    expect(store().tabs[3].lines).toEqual([]);
  });

  it("moves a closed tab to history with its total and frees the table", () => {
    store().addTables([3]);
    store().addLine(3, { ...espresso, quantity: 2 });
    store().closeTab(3, "card");
    expect(store().tabs[3]).toBeUndefined();
    expect(store().history[0]).toMatchObject({
      tableNumber: 3,
      total: 600,
      paymentMethod: "card",
    });
  });

  it("drops a cancelled tab without history", () => {
    store().addTables([3]);
    store().cancelTab(3);
    expect(store().tabs[3]).toBeUndefined();
    expect(store().history).toEqual([]);
  });

  it("keeps the price snapshot of an open line", () => {
    store().addTables([3]);
    store().addLine(3, espresso);
    expect(store().tabs[3].lines[0].unitPrice).toBe(300);
    expect(store().tabs[3].lines[0].productName).toBe("Espresso");
  });

  it("persists to localStorage under the versioned key", () => {
    store().addTables([5]);
    store().toggleSoldOut("x");
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    expect(saved.version).toBe(2);
    expect(Object.keys(saved.state.tabs)).toEqual(["5"]);
    expect(saved.state.soldOut).toEqual(["x"]);
  });

  it("drops product ids that no longer exist when migrating from v1", () => {
    const migrated = migrateState(
      {
        tabs: {},
        history: [],
        soldOut: ["speisekarte--espresso-kaffee--espresso", espresso.productId],
        recent: ["speisekarte--tee--frische-minze", espresso.productId],
        settings: { language: "de" },
      },
      1,
    );
    expect(migrated.soldOut).toEqual([espresso.productId]);
    expect(migrated.recent).toEqual([espresso.productId]);
  });
});
