"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useTranslation } from "@/i18n/use-translation";

interface AppHeaderProps {
  title: string;
  /** Shows a back link to this href. */
  backHref?: string;
  /** Right-aligned content, e.g. a total or a settings link. */
  actions?: ReactNode;
}

export function AppHeader({ title, backHref, actions }: AppHeaderProps) {
  const t = useTranslation();
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-primary px-3 text-primary-fg">
      {backHref && (
        <Link
          href={backHref}
          aria-label={t("nav.back")}
          className="-ml-1 flex h-11 w-11 items-center justify-center rounded-full text-2xl hover:bg-white/10"
        >
          ‹
        </Link>
      )}
      <h1 className="min-w-0 flex-1 truncate text-lg font-semibold">{title}</h1>
      {actions}
    </header>
  );
}

export function SettingsLink() {
  const t = useTranslation();
  return (
    <Link
      href="/settings"
      aria-label={t("nav.settings")}
      className="flex h-11 w-11 items-center justify-center rounded-full text-xl hover:bg-white/10"
    >
      ⚙
    </Link>
  );
}
