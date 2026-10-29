"use client";

import { useCallback } from "react";
import { useOrderStore } from "@/store/order-store";
import { translate, type MessageKey } from ".";

export function useTranslation() {
  const language = useOrderStore((s) => s.settings.language);
  return useCallback(
    (key: MessageKey, params?: Record<string, string | number>) =>
      translate(language, key, params),
    [language],
  );
}
