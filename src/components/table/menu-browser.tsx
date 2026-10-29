"use client";

import { useMemo, useState } from "react";
import { MENU } from "@/data/menu";
import {
  PRODUCTS_BY_ID,
  searchProducts,
  type IndexedProduct,
} from "@/data/menu-index";
import type { Product } from "@/data/menu-types";
import { useTranslation } from "@/i18n/use-translation";
import { formatCents } from "@/lib/money";
import { isQuickAdd } from "@/lib/orders";
import { useOrderStore } from "@/store/order-store";

const RECENT = "recent";

const CATEGORY_NAMES = new Map(
  MENU.flatMap((s) => s.categories.map((c) => [c.id, c.name] as const)),
);

interface MenuBrowserProps {
  /** Adds the product's default variant without options. */
  onQuickAdd: (product: Product) => void;
  onOpenProduct: (product: Product) => void;
}

export function MenuBrowser({ onQuickAdd, onOpenProduct }: MenuBrowserProps) {
  const t = useTranslation();
  const recentIds = useOrderStore((s) => s.recent);
  const soldOut = useOrderStore((s) => s.soldOut);
  const [sectionId, setSectionId] = useState(MENU[0].id);
  const [categoryId, setCategoryId] = useState<string>(
    MENU[0].categories[0].id,
  );
  const [query, setQuery] = useState("");

  const section = MENU.find((s) => s.id === sectionId) ?? MENU[0];

  const entries: IndexedProduct[] = useMemo(() => {
    if (query.trim()) return searchProducts(query);
    if (categoryId === RECENT) {
      return recentIds.flatMap((id) => PRODUCTS_BY_ID.get(id) ?? []);
    }
    const category = section.categories.find((c) => c.id === categoryId);
    return (category?.products ?? []).flatMap(
      (p) => PRODUCTS_BY_ID.get(p.id) ?? [],
    );
  }, [query, categoryId, recentIds, section]);

  function selectSection(id: string) {
    const next = MENU.find((s) => s.id === id) ?? MENU[0];
    setSectionId(next.id);
    setCategoryId(next.categories[0].id);
  }

  const searching = query.trim().length > 0;
  const chip = (active: boolean) =>
    `h-9 shrink-0 rounded-full border px-3 text-sm whitespace-nowrap ${
      active
        ? "border-primary bg-primary text-primary-fg"
        : "border-border bg-surface"
    }`;

  return (
    <div className="flex flex-col">
      <div className="sticky top-26 z-10 border-b border-border bg-bg">
        <div role="tablist" className="flex gap-1 px-3 pt-3">
          {MENU.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={!searching && s.id === sectionId}
              onClick={() => {
                setQuery("");
                selectSection(s.id);
              }}
              className={`h-10 flex-1 truncate rounded-lg px-2 text-sm font-semibold ${
                !searching && s.id === sectionId
                  ? "bg-surface text-primary shadow-sm"
                  : "text-muted"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
        <div className="px-3 pt-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t("menu.searchLabel")}
            placeholder={t("menu.searchPlaceholder")}
            className="h-11 w-full rounded-xl border border-border bg-surface px-3 outline-none focus:border-primary"
          />
        </div>
        {!searching && (
          <div className="no-scrollbar flex gap-2 overflow-x-auto px-3 py-2">
            <button
              type="button"
              aria-pressed={categoryId === RECENT}
              onClick={() => setCategoryId(RECENT)}
              className={chip(categoryId === RECENT)}
            >
              ★ {t("menu.recent")}
            </button>
            {section.categories.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={c.id === categoryId}
                onClick={() => setCategoryId(c.id)}
                className={chip(c.id === categoryId)}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
        {searching && <div className="h-2" />}
      </div>

      {entries.length === 0 ? (
        <p className="p-6 text-center text-muted">
          {searching
            ? t("menu.noResults", { query: query.trim() })
            : t("menu.recentEmpty")}
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {entries.map(({ product, categoryId: productCategory }) => (
            <ProductRow
              key={product.id}
              product={product}
              subtitle={
                searching ? CATEGORY_NAMES.get(productCategory) : undefined
              }
              soldOut={soldOut.includes(product.id)}
              onQuickAdd={onQuickAdd}
              onOpen={onOpenProduct}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

interface ProductRowProps {
  product: Product;
  subtitle?: string;
  soldOut: boolean;
  onQuickAdd: (product: Product) => void;
  onOpen: (product: Product) => void;
}

function ProductRow({
  product,
  subtitle,
  soldOut,
  onQuickAdd,
  onOpen,
}: ProductRowProps) {
  const t = useTranslation();
  const prices = product.variants.map((v) => v.price);
  const minPrice = Math.min(...prices);
  const priceText =
    prices.length > 1
      ? t("menu.from", { price: formatCents(minPrice) })
      : formatCents(minPrice);
  const hasChoices =
    product.variants.length > 1 || (product.optionGroups ?? []).length > 0;
  const quick = isQuickAdd(product);

  return (
    <li className={`flex items-stretch ${soldOut ? "opacity-50" : ""}`}>
      <button
        type="button"
        disabled={soldOut}
        onClick={() => (hasChoices ? onOpen(product) : onQuickAdd(product))}
        className="flex min-h-14 flex-1 items-center gap-3 px-4 py-2 text-left active:bg-surface-muted"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-medium">{product.name}</span>
          {subtitle && (
            <span className="block text-xs text-muted">{subtitle}</span>
          )}
          {product.description && (
            <span className="line-clamp-1 block text-xs text-muted">
              {product.description}
            </span>
          )}
        </span>
        <span className="shrink-0 text-right text-sm tabular-nums">
          {soldOut ? (
            <span className="font-semibold text-danger">
              {t("menu.soldOut")}
            </span>
          ) : (
            <>
              {priceText}
              {hasChoices && <span className="ml-1 text-muted">›</span>}
            </>
          )}
        </span>
      </button>
      {hasChoices && quick && !soldOut && (
        <button
          type="button"
          aria-label={t("menu.quickAdd", { name: product.name })}
          onClick={() => onQuickAdd(product)}
          className="flex w-14 shrink-0 items-center justify-center border-l border-border text-2xl font-semibold text-primary active:bg-surface-muted"
        >
          +
        </button>
      )}
    </li>
  );
}
