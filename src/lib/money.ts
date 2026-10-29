const formatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

/** Formats an integer amount of cents as a EUR string (de-DE). */
export function formatCents(cents: number): string {
  return formatter.format(cents / 100);
}
