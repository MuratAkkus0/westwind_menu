"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { Loading } from "@/components/loading";
import { Sheet } from "@/components/sheet";
import { CheckoutSheet } from "@/components/table/checkout-sheet";
import { MenuBrowser } from "@/components/table/menu-browser";
import { OrderList } from "@/components/table/order-list";
import { ProductSheet } from "@/components/table/product-sheet";
import type { Product } from "@/data/menu-types";
import { useTranslation } from "@/i18n/use-translation";
import { formatCents } from "@/lib/money";
import {
  buildLine,
  itemCount,
  linesTotal,
  parseTableNumbers,
  type LineInput,
} from "@/lib/orders";
import { useStoreHydrated } from "@/store/hydration";
import { useOrderStore } from "@/store/order-store";

type View = "menu" | "order";
type Dialog = "checkout" | "cancel" | null;

const TOAST_MS = 1800;

export function TableScreen() {
  const t = useTranslation();
  const router = useRouter();
  const params = useSearchParams();
  const hydrated = useStoreHydrated();
  const tableNumber =
    parseTableNumbers(params.get("number") ?? "").numbers[0] ?? null;
  const tab = useOrderStore((s) =>
    tableNumber === null ? undefined : s.tabs[tableNumber],
  );
  const addLine = useOrderStore((s) => s.addLine);
  const closeTab = useOrderStore((s) => s.closeTab);
  const cancelTab = useOrderStore((s) => s.cancelTab);

  const [view, setView] = useState<View>("menu");
  const [openProduct, setOpenProduct] = useState<Product | null>(null);
  const [dialog, setDialog] = useState<Dialog>(null);
  // Set when the tab is closed or cancelled, so the screen does not flash
  // "table not open" while navigating back.
  const [leaving, setLeaving] = useState(false);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  const add = useCallback(
    (line: LineInput) => {
      if (tableNumber === null) return;
      addLine(tableNumber, line);
      setToast({
        id: Date.now(),
        text: t("menu.added", {
          name:
            line.quantity > 1
              ? `${line.quantity} × ${line.productName}`
              : line.productName,
        }),
      });
    },
    [addLine, tableNumber, t],
  );

  const closeProduct = useCallback(() => setOpenProduct(null), []);
  const closeDialog = useCallback(() => setDialog(null), []);

  const title =
    tableNumber === null
      ? t("tables.title")
      : t("table.title", { number: tableNumber });

  if (!hydrated || leaving) {
    return (
      <>
        <AppHeader title={title} backHref="/" />
        <Loading />
      </>
    );
  }

  if (!tab || tableNumber === null) {
    return (
      <>
        <AppHeader title={title} backHref="/" />
        <main className="flex flex-col items-center gap-4 p-6 text-center">
          <p className="text-muted">
            {t("table.notOpen", { number: params.get("number") ?? "?" })}
          </p>
          <Link
            href="/"
            className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-fg"
          >
            {t("table.toTables")}
          </Link>
        </main>
      </>
    );
  }

  const total = linesTotal(tab.lines);
  const count = itemCount(tab.lines);

  return (
    <>
      <AppHeader
        title={title}
        backHref="/"
        actions={
          <span className="text-lg font-semibold tabular-nums">
            {formatCents(total)}
          </span>
        }
      />
      <div
        role="tablist"
        className="sticky top-14 z-20 flex h-12 border-b border-border bg-surface"
      >
        {(["menu", "order"] as const).map((v) => (
          <button
            key={v}
            type="button"
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={`flex-1 border-b-2 font-semibold ${
              view === v
                ? "border-accent text-text"
                : "border-transparent text-muted"
            }`}
          >
            {v === "menu"
              ? t("table.menu")
              : `${t("table.order")}${count > 0 ? ` (${count})` : ""}`}
          </button>
        ))}
      </div>

      <main className="flex flex-1 flex-col">
        {view === "menu" ? (
          <>
            <MenuBrowser
              onQuickAdd={(product) =>
                add(buildLine(product, product.variants[0].id, {}, 1, ""))
              }
              onOpenProduct={setOpenProduct}
            />
            {count > 0 && (
              <div className="sticky bottom-0 mt-auto p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <button
                  type="button"
                  onClick={() => setView("order")}
                  className="h-12 w-full rounded-xl bg-primary font-semibold text-primary-fg shadow-lg active:opacity-80"
                >
                  {t("table.orderSummary", {
                    count,
                    total: formatCents(total),
                  })}
                </button>
              </div>
            )}
          </>
        ) : (
          <OrderList
            tab={tab}
            onCheckout={() => setDialog("checkout")}
            onCancelTab={() => setDialog("cancel")}
          />
        )}
      </main>

      {toast && (
        <div
          key={toast.id}
          role="status"
          className="pointer-events-none fixed inset-x-0 bottom-20 z-50 mx-auto w-fit max-w-[90vw] rounded-full bg-text px-4 py-2 text-sm text-bg shadow-lg"
        >
          {toast.text}
        </div>
      )}

      {openProduct && (
        <ProductSheet
          product={openProduct}
          onClose={closeProduct}
          onAdd={(line) => {
            add(line);
            setOpenProduct(null);
          }}
        />
      )}

      {dialog === "checkout" && (
        <CheckoutSheet
          tableNumber={tableNumber}
          total={total}
          onClose={closeDialog}
          onConfirm={(method) => {
            setLeaving(true);
            closeTab(tableNumber, method);
            router.push("/");
          }}
        />
      )}

      {dialog === "cancel" && (
        <Sheet
          title={t("cancelTab.title", { number: tableNumber })}
          onClose={closeDialog}
          footer={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={closeDialog}
                className="h-12 flex-1 rounded-xl border border-border px-4 font-semibold"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLeaving(true);
                  cancelTab(tableNumber);
                  router.push("/");
                }}
                className="h-12 flex-1 rounded-xl bg-danger px-4 font-semibold text-danger-fg"
              >
                {t("cancelTab.confirm")}
              </button>
            </div>
          }
        >
          <p>{t("cancelTab.body")}</p>
        </Sheet>
      )}
    </>
  );
}
