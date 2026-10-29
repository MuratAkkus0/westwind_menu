"use client";

import { useState, type ReactNode } from "react";
import { MENU } from "@/data/menu";
import {
  CATEGORY_LABELS,
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

const ITEM_COUNTS = new Map(
  MENU.map((m) => [
    m.id,
    m.categories.reduce((sum, c) => sum + c.products.length, 0),
  ]),
);

interface MenuBrowserProps {
  /** Adds the product's default variant without options. */
  onQuickAdd: (product: Product) => void;
  onOpenProduct: (product: Product) => void;
}

/**
 * Menu tab: a grid of main-category cards (plus "Zuletzt"); tapping a card
 * lists its products under their sub-category headings. Search spans the whole menu.
 */
export function MenuBrowser({ onQuickAdd, onOpenProduct }: MenuBrowserProps) {
  const t = useTranslation();
  const recentIds = useOrderStore((s) => s.recent);
  const soldOut = useOrderStore((s) => s.soldOut);
  /** null shows the category grid. */
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const searching = query.trim().length > 0;
  const main = MENU.find((m) => m.id === openId);

  function open(id: string | null) {
    setOpenId(id);
    window.scrollTo({ top: 0 });
  }

  const row = (entry: IndexedProduct, showCategory = false) => (
    <ProductRow
      key={entry.product.id}
      product={entry.product}
      subtitle={
        showCategory ? CATEGORY_LABELS.get(entry.categoryId) : undefined
      }
      soldOut={soldOut.includes(entry.product.id)}
      onQuickAdd={onQuickAdd}
      onOpen={onOpenProduct}
    />
  );

  let content: ReactNode;
  if (searching) {
    const results = searchProducts(query);
    content =
      results.length === 0 ? (
        <EmptyText>{t("menu.noResults", { query: query.trim() })}</EmptyText>
      ) : (
        <ul className="divide-y divide-border">
          {results.map((e) => row(e, true))}
        </ul>
      );
  } else if (openId === RECENT) {
    const recent = recentIds.flatMap((id) => PRODUCTS_BY_ID.get(id) ?? []);
    content =
      recent.length === 0 ? (
        <EmptyText>{t("menu.recentEmpty")}</EmptyText>
      ) : (
        <ul className="divide-y divide-border">
          {recent.map((e) => row(e, true))}
        </ul>
      );
  } else if (main) {
    content = main.categories.map((category) => (
      <section key={category.id} aria-labelledby={`heading-${category.id}`}>
        {/* A sub-category that repeats the main name needs no extra heading. */}
        <h3
          id={`heading-${category.id}`}
          className={
            category.id === main.id
              ? "sr-only"
              : "bg-surface-muted px-4 py-2 text-sm font-semibold tracking-wide text-muted uppercase"
          }
        >
          {category.name}
        </h3>
        <ul className="divide-y divide-border">
          {category.products.flatMap((p) => {
            const entry = PRODUCTS_BY_ID.get(p.id);
            return entry ? [row(entry)] : [];
          })}
        </ul>
      </section>
    ));
  } else {
    content = (
      <ul className="grid grid-cols-3 gap-3 p-3 sm:grid-cols-4">
        <li>
          <CategoryCard
            name={`★ ${t("menu.recent")}`}
            detail={t("menu.itemCount", { count: recentIds.length })}
            highlighted
            onClick={() => open(RECENT)}
          />
        </li>
        {MENU.map((m) => (
          <li key={m.id}>
            <CategoryCard
              name={m.name}
              detail={t("menu.itemCount", {
                count: ITEM_COUNTS.get(m.id) ?? 0,
              })}
              onClick={() => open(m.id)}
            />
          </li>
        ))}
      </ul>
    );
  }

  const title = openId === RECENT ? t("menu.recent") : main?.name;

  return (
    <div className="flex flex-col">
      <div className="sticky top-26 z-10 border-b border-border bg-bg px-3 py-2">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={t("menu.searchLabel")}
          placeholder={t("menu.searchPlaceholder")}
          className="h-11 w-full rounded-xl border border-border bg-surface px-3 outline-none focus:border-primary"
        />
        {!searching && title && (
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => open(null)}
              className="flex h-10 items-center gap-1 rounded-lg pr-3 text-sm font-semibold text-primary active:bg-surface-muted"
            >
              <span aria-hidden className="text-xl leading-none">
                ‹
              </span>
              {t("menu.allCategories")}
            </button>
            <h2 className="min-w-0 flex-1 truncate text-right font-semibold">
              {title}
            </h2>
          </div>
        )}
      </div>
      {content}
    </div>
  );
}

function EmptyText({ children }: { children: ReactNode }) {
  return <p className="p-6 text-center text-muted">{children}</p>;
}

interface CategoryCardProps {
  name: string;
  detail: string;
  highlighted?: boolean;
  onClick: () => void;
}

function CategoryCard({
  name,
  detail,
  highlighted,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-2xl border p-2 text-center shadow-sm active:scale-95 ${
        highlighted
          ? "border-accent bg-accent text-accent-fg"
          : "border-border bg-surface"
      }`}
    >
      <span className="text-sm leading-tight font-semibold break-words hyphens-auto">
        {name}
      </span>
      <span className="text-xs opacity-70">{detail}</span>
    </button>
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
