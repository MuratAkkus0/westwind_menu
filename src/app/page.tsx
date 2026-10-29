"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { AppHeader, SettingsLink } from "@/components/app-header";
import { Loading } from "@/components/loading";
import { useTranslation } from "@/i18n/use-translation";
import { formatCents } from "@/lib/money";
import { itemCount, linesTotal, parseTableNumbers } from "@/lib/orders";
import { useStoreHydrated } from "@/store/hydration";
import { useOrderStore } from "@/store/order-store";

interface Feedback {
  messages: string[];
  isError: boolean;
}

export default function TablesPage() {
  const t = useTranslation();
  const hydrated = useStoreHydrated();
  const tabs = useOrderStore((s) => s.tabs);
  const addTables = useOrderStore((s) => s.addTables);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const { numbers, invalid } = parseTableNumbers(input);
    if (numbers.length === 0 && invalid.length === 0) {
      setFeedback({ messages: [t("tables.emptyInput")], isError: true });
      return;
    }
    const { added, existing } = addTables(numbers);
    const messages: string[] = [];
    if (added.length > 0)
      messages.push(t("tables.added", { count: added.length }));
    if (existing.length > 0)
      messages.push(t("tables.exists", { numbers: existing.join(", ") }));
    if (invalid.length > 0)
      messages.push(t("tables.invalid", { values: invalid.join(", ") }));
    setFeedback({ messages, isError: invalid.length > 0 });
    if (invalid.length === 0) setInput("");
  }

  const openTabs = Object.values(tabs).sort(
    (a, b) => a.tableNumber - b.tableNumber,
  );

  return (
    <>
      <AppHeader title={t("tables.title")} actions={<SettingsLink />} />
      <main className="mx-auto w-full max-w-3xl flex-1 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <label htmlFor="table-numbers" className="sr-only">
            {t("tables.inputLabel")}
          </label>
          <input
            id="table-numbers"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            inputMode="decimal"
            autoComplete="off"
            placeholder={t("tables.inputPlaceholder")}
            aria-describedby={feedback ? "table-feedback" : undefined}
            className="h-12 min-w-0 flex-1 rounded-xl border border-border bg-surface px-4 text-lg outline-none focus:border-primary"
          />
          {/* Disabled until hydrated, so an early tap cannot trigger a native form submit. */}
          <button
            type="submit"
            disabled={!hydrated}
            className="h-12 shrink-0 rounded-xl bg-accent px-5 font-semibold text-accent-fg active:opacity-80 disabled:opacity-50"
          >
            {t("tables.add")}
          </button>
        </form>
        {feedback && (
          <div
            id="table-feedback"
            role={feedback.isError ? "alert" : "status"}
            className={`mt-2 text-sm ${feedback.isError ? "text-danger" : "text-success"}`}
          >
            {feedback.messages.map((m) => (
              <p key={m}>{m}</p>
            ))}
          </div>
        )}

        {!hydrated ? (
          <Loading />
        ) : openTabs.length === 0 ? (
          <p className="mt-10 text-center text-muted">{t("tables.empty")}</p>
        ) : (
          <ul className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {openTabs.map((tab) => {
              const count = itemCount(tab.lines);
              return (
                <li key={tab.tableNumber}>
                  <Link
                    href={`/table?number=${tab.tableNumber}`}
                    aria-label={t("table.title", { number: tab.tableNumber })}
                    className={`flex aspect-square flex-col items-center justify-center rounded-2xl border-2 p-2 text-center shadow-sm active:scale-95 ${
                      count > 0
                        ? "border-primary bg-primary text-primary-fg"
                        : "border-border bg-surface"
                    }`}
                  >
                    <span className="text-xs uppercase tracking-wide opacity-75">
                      {t("tables.tile")}
                    </span>
                    <span className="text-4xl font-bold leading-tight">
                      {tab.tableNumber}
                    </span>
                    <span className="text-xs opacity-90">
                      {count > 0
                        ? `${t("tables.items", { count })} · ${formatCents(linesTotal(tab.lines))}`
                        : t("tables.noItems")}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </>
  );
}
