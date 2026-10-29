"use client";

import { AppHeader, SettingsLink } from "@/components/app-header";
import { Loading } from "@/components/loading";
import { useTranslation } from "@/i18n/use-translation";
import { useStoreHydrated } from "@/store/hydration";

export default function TablesPage() {
  const t = useTranslation();
  const hydrated = useStoreHydrated();
  return (
    <>
      <AppHeader title={t("tables.title")} actions={<SettingsLink />} />
      <main className="flex-1">{hydrated ? null : <Loading />}</main>
    </>
  );
}
