"use client";

import { useState } from "react";
import type { OptionGroup, Product } from "@/data/menu-types";
import { Sheet } from "@/components/sheet";
import { QuantityStepper } from "@/components/table/quantity-stepper";
import { useTranslation } from "@/i18n/use-translation";
import { formatCents } from "@/lib/money";
import { buildLine, missingGroups, type LineInput } from "@/lib/orders";

interface ProductSheetProps {
  product: Product;
  onAdd: (line: LineInput) => void;
  onClose: () => void;
}

function surcharge(price: number) {
  return price > 0 ? `+ ${formatCents(price)}` : "";
}

export function ProductSheet({ product, onAdd, onClose }: ProductSheetProps) {
  const t = useTranslation();
  const [variantId, setVariantId] = useState(product.variants[0].id);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [showMissing, setShowMissing] = useState(false);

  const groups = product.optionGroups ?? [];
  const line = buildLine(product, variantId, selected, quantity, note);
  const missing = missingGroups(groups, selected);

  function toggle(group: OptionGroup, optionId: string) {
    setSelected((current) => {
      const chosen = current[group.id] ?? [];
      if (chosen.includes(optionId)) {
        return {
          ...current,
          [group.id]: chosen.filter((id) => id !== optionId),
        };
      }
      const next = group.max === 1 ? [optionId] : [...chosen, optionId];
      return { ...current, [group.id]: next.slice(-group.max) };
    });
  }

  function handleAdd() {
    if (missing.length > 0) {
      setShowMissing(true);
      return;
    }
    onAdd(line);
  }

  return (
    <Sheet
      title={product.name}
      onClose={onClose}
      footer={
        <div className="flex flex-col gap-2">
          {showMissing && missing.length > 0 && (
            <p role="alert" className="text-sm text-danger">
              {t("product.missing", {
                groups: missing.map((g) => g.label).join(", "),
              })}
            </p>
          )}
          <div className="flex items-center gap-3">
            <QuantityStepper
              value={quantity}
              min={1}
              onChange={setQuantity}
              decreaseLabel={t("product.decrease")}
              increaseLabel={t("product.increase")}
            />
            <button
              type="button"
              onClick={handleAdd}
              className="h-12 flex-1 rounded-xl bg-accent px-4 font-semibold text-accent-fg active:opacity-80"
            >
              {t("product.add", {
                price: formatCents(line.unitPrice * quantity),
              })}
            </button>
          </div>
        </div>
      }
    >
      {product.description && (
        <p className="mb-3 text-sm text-muted">{product.description}</p>
      )}

      {product.variants.length > 1 && (
        <fieldset className="mb-4">
          <legend className="mb-2 font-semibold">{t("product.variant")}</legend>
          <div className="flex flex-col gap-2">
            {product.variants.map((v) => (
              <ChoiceRow
                key={v.id}
                type="radio"
                name="variant"
                label={v.label}
                detail={formatCents(v.price)}
                checked={variantId === v.id}
                onChange={() => setVariantId(v.id)}
              />
            ))}
          </div>
        </fieldset>
      )}

      {groups.map((group) => {
        const isMissing = showMissing && missing.includes(group);
        const single = group.max === 1;
        return (
          <fieldset key={group.id} className="mb-4">
            <legend
              className={`mb-2 font-semibold ${isMissing ? "text-danger" : ""}`}
            >
              {group.label}{" "}
              <span className="text-sm font-normal text-muted">
                {group.min > 0 ? t("product.required") : t("product.optional")}
                {!single &&
                  group.max < group.options.length &&
                  ` · ${t("product.upTo", { max: group.max })}`}
              </span>
            </legend>
            <div className="flex flex-col gap-2">
              {group.options.map((option) => (
                <ChoiceRow
                  key={option.id}
                  type={single && group.min > 0 ? "radio" : "checkbox"}
                  name={group.id}
                  label={option.label}
                  detail={surcharge(option.price)}
                  checked={selected[group.id]?.includes(option.id) ?? false}
                  onChange={() => toggle(group, option.id)}
                />
              ))}
            </div>
          </fieldset>
        );
      })}

      <label className="block">
        <span className="mb-2 block font-semibold">{t("product.note")}</span>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t("product.notePlaceholder")}
          className="h-11 w-full rounded-xl border border-border bg-bg px-3 outline-none focus:border-primary"
        />
      </label>
    </Sheet>
  );
}

interface ChoiceRowProps {
  type: "radio" | "checkbox";
  name: string;
  label: string;
  detail: string;
  checked: boolean;
  onChange: () => void;
}

function ChoiceRow({
  type,
  name,
  label,
  detail,
  checked,
  onChange,
}: ChoiceRowProps) {
  return (
    <label
      className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 ${
        checked ? "border-primary bg-surface-muted" : "border-border"
      }`}
    >
      <input
        type={type}
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 accent-primary"
      />
      <span className="flex-1">{label}</span>
      {detail && <span className="text-sm text-muted">{detail}</span>}
    </label>
  );
}
