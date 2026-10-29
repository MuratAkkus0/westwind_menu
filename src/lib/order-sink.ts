import type { ClosedTab } from "@/store/order-store";

/**
 * Hand-off point to an external system (the restaurant's main POS, v2).
 * The v1 implementation does nothing; replace it once the POS integration is known.
 */
export interface OrderSink {
  tabClosed(tab: ClosedTab): void;
}

export const orderSink: OrderSink = {
  tabClosed() {},
};
