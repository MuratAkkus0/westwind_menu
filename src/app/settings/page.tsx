"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { Loading } from "@/components/loading";
import { ALL_PRODUCTS, searchProducts } from "@/data/menu-index";
import { LANGUAGES, type Language } from "@/i18n";
import { useTranslation } from "@/i18n/use-translation";
import { useStoreHydrated } from "@/store/hydration";
import { useOrderStore } from "@/store/order-store";

export default function SettingsPage() {
  const t = useTranslation();
  const hydrated = useStoreHydrated();
  const language = useOrderStore((s) => s.settings.language);
  const setLanguage = useOrderStore((s) => s.setLanguage);
  const soldOut = useOrderStore((s) => s.soldOut);
  const toggleSoldOut = useOrderStore((s) => s.toggleSoldOut);
  const [query, setQuery] = useState("");

  // Sold-out items first, then search results.
  const soldOutEntries = ALL_PRODUCTS.filter((e) =>
    soldOut.includes(e.product.id),
  );
  const results = query.trim()
    ? searchProducts(query).filter((e) => !soldOut.includes(e.product.id))
    : [];

  return (
    <>
      <AppHeader title={t("settings.title")} backHref="/" />
      {!hydrated ? (
        <Loading />
      ) : (
        <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4">
          <section>
            <label
              htmlFor="language"
              className="mb-2 block text-lg font-semibold"
            >
              {t("settings.language")}
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="h-12 w-full rounded-xl border border-border bg-surface px-3"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {t(`settings.language.${l}`)}
                </option>
              ))}
            </select>
          </section>

          <section>
            <h2 className="text-lg font-semibold">{t("settings.soldOut")}</h2>
            <p className="mb-3 text-sm text-muted">
              {t("settings.soldOutHint")}
            </p>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t("settings.soldOutSearch")}
              placeholder={t("settings.soldOutSearch")}
              className="mb-3 h-11 w-full rounded-xl border border-border bg-surface px-3 outline-none focus:border-primary"
            />
            {soldOutEntries.length === 0 && results.length === 0 ? (
              <p className="text-sm text-muted">{t("settings.soldOutNone")}</p>
            ) : (
              <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
                {[...soldOutEntries, ...results].map(({ product }) => (
                  <li key={product.id}>
                    <label className="flex min-h-12 cursor-pointer items-center gap-3 px-3 py-2">
                      <input
                        type="checkbox"
                        checked={soldOut.includes(product.id)}
                        onChange={() => toggleSoldOut(product.id)}
                        className="h-5 w-5 accent-danger"
                      />
                      <span className="flex-1">{product.name}</span>
                      {soldOut.includes(product.id) && (
                        <span className="text-sm font-semibold text-danger">
                          {t("menu.soldOut")}
                        </span>
                      )}
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      )}
    </>
  );
}
