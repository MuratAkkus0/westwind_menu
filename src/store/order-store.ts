import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_LANGUAGE, type Language } from "@/i18n";
import { orderSink } from "@/lib/order-sink";
import {
  lineKey,
  linesTotal,
  type LineInput,
  type OrderLine,
} from "@/lib/orders";

export const STORAGE_KEY = "westwind:v1";
export const STORAGE_VERSION = 1;
const MAX_HISTORY = 200;
const MAX_RECENT = 12;

export type PaymentMethod = "cash" | "card";

/** The single open tab of a table. */
export interface Tab {
  tableNumber: number;
  openedAt: string;
  lines: OrderLine[];
}

export interface ClosedTab extends Tab {
  closedAt: string;
  total: number;
  paymentMethod: PaymentMethod | null;
}

export interface Settings {
  language: Language;
}

interface PersistedState {
  /** Open tabs keyed by table number. */
  tabs: Record<number, Tab>;
  history: ClosedTab[];
  /** Product ids marked as sold out. */
  soldOut: string[];
  /** Most recently ordered product ids, newest first. */
  recent: string[];
  settings: Settings;
}

interface Actions {
  /** Opens a tab for each number not already open. */
  addTables(numbers: number[]): { added: number[]; existing: number[] };
  addLine(tableNumber: number, input: LineInput): void;
  changeQuantity(tableNumber: number, lineId: string, delta: number): void;
  removeLine(tableNumber: number, lineId: string): void;
  setNote(tableNumber: number, lineId: string, note: string): void;
  closeTab(tableNumber: number, paymentMethod: PaymentMethod | null): void;
  cancelTab(tableNumber: number): void;
  toggleSoldOut(productId: string): void;
  setLanguage(language: Language): void;
}

export type OrderState = PersistedState & Actions;

const initialState: PersistedState = {
  tabs: {},
  history: [],
  soldOut: [],
  recent: [],
  settings: { language: DEFAULT_LANGUAGE },
};

function newId(): string {
  return crypto.randomUUID();
}

function withoutTable(tabs: Record<number, Tab>, tableNumber: number) {
  const rest = { ...tabs };
  delete rest[tableNumber];
  return rest;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => {
      const updateLines = (
        tableNumber: number,
        update: (lines: OrderLine[]) => OrderLine[],
      ) =>
        set((state) => {
          const tab = state.tabs[tableNumber];
          if (!tab) return state;
          return {
            tabs: {
              ...state.tabs,
              [tableNumber]: { ...tab, lines: update(tab.lines) },
            },
          };
        });

      return {
        ...initialState,

        addTables(numbers) {
          const { tabs } = get();
          const added = numbers.filter((n) => !tabs[n]);
          const existing = numbers.filter((n) => tabs[n]);
          if (added.length > 0) {
            const openedAt = new Date().toISOString();
            set({
              tabs: {
                ...tabs,
                ...Object.fromEntries(
                  added.map((n) => [
                    n,
                    { tableNumber: n, openedAt, lines: [] },
                  ]),
                ),
              },
            });
          }
          return { added, existing };
        },

        addLine(tableNumber, input) {
          if (!get().tabs[tableNumber]) return;
          const key = lineKey(input);
          updateLines(tableNumber, (lines) =>
            lines.some((l) => lineKey(l) === key)
              ? lines.map((l) =>
                  lineKey(l) === key
                    ? { ...l, quantity: l.quantity + input.quantity }
                    : l,
                )
              : [...lines, { ...input, id: newId() }],
          );
          set((state) => ({
            recent: [
              input.productId,
              ...state.recent.filter((id) => id !== input.productId),
            ].slice(0, MAX_RECENT),
          }));
        },

        changeQuantity(tableNumber, lineId, delta) {
          updateLines(tableNumber, (lines) =>
            lines
              .map((l) =>
                l.id === lineId ? { ...l, quantity: l.quantity + delta } : l,
              )
              .filter((l) => l.quantity > 0),
          );
        },

        removeLine(tableNumber, lineId) {
          updateLines(tableNumber, (lines) =>
            lines.filter((l) => l.id !== lineId),
          );
        },

        setNote(tableNumber, lineId, note) {
          updateLines(tableNumber, (lines) =>
            lines.map((l) =>
              l.id === lineId ? { ...l, note: note.trim() } : l,
            ),
          );
        },

        closeTab(tableNumber, paymentMethod) {
          const tab = get().tabs[tableNumber];
          if (!tab) return;
          const closed: ClosedTab = {
            ...tab,
            closedAt: new Date().toISOString(),
            total: linesTotal(tab.lines),
            paymentMethod,
          };
          set((state) => ({
            tabs: withoutTable(state.tabs, tableNumber),
            history: [closed, ...state.history].slice(0, MAX_HISTORY),
          }));
          orderSink.tabClosed(closed);
        },

        cancelTab(tableNumber) {
          set((state) => ({ tabs: withoutTable(state.tabs, tableNumber) }));
        },

        toggleSoldOut(productId) {
          set((state) => ({
            soldOut: state.soldOut.includes(productId)
              ? state.soldOut.filter((id) => id !== productId)
              : [...state.soldOut, productId],
          }));
        },

        setLanguage(language) {
          set((state) => ({ settings: { ...state.settings, language } }));
        },
      };
    },
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      // Rehydrated on the client by <StoreHydrator /> so the static HTML and
      // the first client render match.
      skipHydration: true,
      partialize: ({ tabs, history, soldOut, recent, settings }) => ({
        tabs,
        history,
        soldOut,
        recent,
        settings,
      }),
    },
  ),
);
