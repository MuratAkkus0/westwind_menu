"use client";

import { useState } from "react";
import { Sheet } from "@/components/sheet";
import { useTranslation } from "@/i18n/use-translation";
import { formatCents } from "@/lib/money";
import type { PaymentMethod } from "@/store/order-store";

/** Menu note: card payment ("EC-Karte") only from 15,00 €. */
const CARD_MINIMUM = 1500;

interface CheckoutSheetProps {
  tableNumber: number;
  total: number;
  onConfirm: (paymentMethod: PaymentMethod | null) => void;
  onClose: () => void;
}

export function CheckoutSheet({
  tableNumber,
  total,
  onConfirm,
  onClose,
}: CheckoutSheetProps) {
  const t = useTranslation();
  const [method, setMethod] = useState<PaymentMethod | null>(null);
  const choices: { value: PaymentMethod | null; label: string }[] = [
    { value: "cash", label: t("checkout.cash") },
    { value: "card", label: t("checkout.card") },
    { value: null, label: t("checkout.none") },
  ];

  return (
    <Sheet
      title={t("checkout.title", { number: tableNumber })}
      onClose={onClose}
      footer={
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-xl border border-border px-4 font-semibold"
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={() => onConfirm(method)}
            className="h-12 flex-1 rounded-xl bg-primary px-4 font-semibold text-primary-fg active:opacity-80"
          >
            {t("checkout.confirm")}
          </button>
        </div>
      }
    >
      <div className="mb-4 flex items-baseline justify-between text-2xl font-bold">
        <span>{t("checkout.total")}</span>
        <span className="tabular-nums">{formatCents(total)}</span>
      </div>
      <fieldset>
        <legend className="mb-2 font-semibold">{t("checkout.payment")}</legend>
        <div className="grid grid-cols-3 gap-2">
          {choices.map((choice) => (
            <label
              key={choice.label}
              className={`flex h-12 cursor-pointer items-center justify-center rounded-xl border text-center text-sm font-semibold ${
                method === choice.value
                  ? "border-primary bg-primary text-primary-fg"
                  : "border-border"
              }`}
            >
              <input
                type="radio"
                name="payment"
                className="sr-only"
                checked={method === choice.value}
                onChange={() => setMethod(choice.value)}
              />
              {choice.label}
            </label>
          ))}
        </div>
      </fieldset>
      {method === "card" && total < CARD_MINIMUM && (
        <p role="note" className="mt-3 text-sm text-danger">
          {t("checkout.cardMinimum")}
        </p>
      )}
    </Sheet>
  );
}
