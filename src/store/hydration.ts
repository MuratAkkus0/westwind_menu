"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useOrderStore } from "./order-store";

/** Loads the persisted state from localStorage once, after the first client render. */
export function StoreHydrator() {
  useEffect(() => {
    void useOrderStore.persist.rehydrate();
  }, []);
  return null;
}

/** True once localStorage has been read; false during prerender and the first render. */
export function useStoreHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useOrderStore.persist.onFinishHydration(onChange),
    () => useOrderStore.persist.hasHydrated(),
    () => false,
  );
}
