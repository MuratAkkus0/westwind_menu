"use client";

import { useState } from "react";
import { QuantityStepper } from "@/components/table/quantity-stepper";
import { useTranslation } from "@/i18n/use-translation";
import { formatCents } from "@/lib/money";
import { lineTotal, linesTotal, type OrderLine } from "@/lib/orders";
import { useOrderStore, type Tab } from "@/store/order-store";

interface OrderListProps {
  tab: Tab;
  onCheckout: () => void;
  onCancelTab: () => void;
}

export function OrderList({ tab, onCheckout, onCancelTab }: OrderListProps) {
  const t = useTranslation();
  const total = linesTotal(tab.lines);

  return (
    <div className="flex flex-1 flex-col">
      {tab.lines.length === 0 ? (
        <p className="p-6 text-center text-muted">{t("order.empty")}</p>
      ) : (
        <ul className="divide-y divide-border">
          {tab.lines.map((line) => (
            <OrderLineRow
              key={line.id}
              tableNumber={tab.tableNumber}
              line={line}
            />
          ))}
        </ul>
      )}

      <div className="sticky bottom-0 mt-auto border-t border-border bg-surface p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mb-3 flex items-baseline justify-between text-lg font-semibold">
          <span>{t("order.total")}</span>
          <span data-testid="order-total" className="tabular-nums">
            {formatCents(total)}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancelTab}
            className="h-12 rounded-xl border border-danger px-4 font-semibold text-danger active:opacity-80"
          >
            {t("order.cancelTab")}
          </button>
          <button
            type="button"
            onClick={onCheckout}
            disabled={tab.lines.length === 0}
            className="h-12 flex-1 rounded-xl bg-primary px-4 font-semibold text-primary-fg active:opacity-80 disabled:opacity-40"
          >
            {t("order.checkout")}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderLineRow({
  tableNumber,
  line,
}: {
  tableNumber: number;
  line: OrderLine;
}) {
  const t = useTranslation();
  const changeQuantity = useOrderStore((s) => s.changeQuantity);
  const removeLine = useOrderStore((s) => s.removeLine);
  const setNote = useOrderStore((s) => s.setNote);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(line.note);

  const details = [
    line.variantLabel,
    ...line.options.map((o) =>
      o.price > 0 ? `${o.label} (+${formatCents(o.price)})` : o.label,
    ),
  ].filter(Boolean);

  return (
    <li className="px-4 py-3">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium">{line.productName}</p>
          {details.length > 0 && (
            <p className="text-sm text-muted">{details.join(" · ")}</p>
          )}
          {line.note && !editing && (
            <p className="text-sm italic">„{line.note}“</p>
          )}
        </div>
        <div className="text-right">
          <p className="font-semibold tabular-nums">
            {formatCents(lineTotal(line))}
          </p>
          {line.quantity > 1 && (
            <p className="text-xs text-muted tabular-nums">
              {line.quantity} × {formatCents(line.unitPrice)}
            </p>
          )}
        </div>
      </div>

      {editing ? (
        <form
          className="mt-2 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setNote(tableNumber, line.id, draft);
            setEditing(false);
          }}
        >
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label={t("order.note")}
            placeholder={t("product.notePlaceholder")}
            className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-bg px-3 outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="h-11 rounded-xl bg-primary px-4 font-semibold text-primary-fg"
          >
            {t("order.saveNote")}
          </button>
        </form>
      ) : (
        <div className="mt-2 flex items-center gap-2">
          <QuantityStepper
            value={line.quantity}
            onChange={(next) =>
              changeQuantity(tableNumber, line.id, next - line.quantity)
            }
            decreaseLabel={t("order.decrease", { name: line.productName })}
            increaseLabel={t("order.increase", { name: line.productName })}
          />
          <button
            type="button"
            onClick={() => {
              setDraft(line.note);
              setEditing(true);
            }}
            className="ml-auto h-11 rounded-xl px-3 text-sm text-primary active:bg-surface-muted"
          >
            {line.note ? t("order.editNote") : t("order.addNote")}
          </button>
          <button
            type="button"
            aria-label={t("order.remove", { name: line.productName })}
            onClick={() => removeLine(tableNumber, line.id)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-xl text-danger active:bg-surface-muted"
          >
            ✕
          </button>
        </div>
      )}
    </li>
  );
}
