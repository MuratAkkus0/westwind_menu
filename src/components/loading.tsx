"use client";

import { useTranslation } from "@/i18n/use-translation";

export function Loading() {
  const t = useTranslation();
  return (
    <p role="status" className="p-6 text-center text-muted">
      {t("common.loading")}
    </p>
  );
}
