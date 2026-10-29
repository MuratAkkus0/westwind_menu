import type { OptionGroup, Product } from "@/data/menu-types";

export const MAX_TABLE_NUMBER = 999;

/** An option as chosen on an order line; label and price are snapshots of the menu. */
export interface SelectedOption {
  groupId: string;
  optionId: string;
  label: string;
  price: number;
}

/**
 * One position on a table's tab. Product name, variant label and prices are
 * copied at order time so later menu changes never alter an open tab.
 */
export interface OrderLine {
  id: string;
  productId: string;
  productName: string;
  variantId: string;
  variantLabel: string;
  options: SelectedOption[];
  /** Variant price plus option surcharges, in cents. */
  unitPrice: number;
  quantity: number;
  note: string;
}

export type LineInput = Omit<OrderLine, "id">;

export interface TableNumberParse {
  numbers: number[];
  invalid: string[];
}

/** Parses "3, 14,2" (commas, semicolons or spaces) into unique table numbers. */
export function parseTableNumbers(input: string): TableNumberParse {
  const numbers: number[] = [];
  const invalid: string[] = [];
  for (const token of input.split(/[\s,;]+/).filter(Boolean)) {
    const value = /^\d+$/.test(token) ? Number(token) : NaN;
    if (!Number.isInteger(value) || value < 1 || value > MAX_TABLE_NUMBER) {
      invalid.push(token);
    } else if (!numbers.includes(value)) {
      numbers.push(value);
    }
  }
  return { numbers, invalid };
}

export function lineTotal(line: Pick<OrderLine, "unitPrice" | "quantity">) {
  return line.unitPrice * line.quantity;
}

export function linesTotal(lines: OrderLine[]): number {
  return lines.reduce((sum, line) => sum + lineTotal(line), 0);
}

export function itemCount(lines: OrderLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

/** Lines with the same key are merged by adding quantities. */
export function lineKey(line: LineInput | OrderLine): string {
  const optionIds = line.options
    .map((o) => `${o.groupId}:${o.optionId}`)
    .sort()
    .join(",");
  return [line.productId, line.variantId, optionIds, line.note.trim()].join(
    "|",
  );
}

/** Product can be added with one tap: a single price and no required choice. */
export function isQuickAdd(product: Product): boolean {
  return (
    product.variants.length === 1 &&
    (product.optionGroups ?? []).every((g) => g.min === 0)
  );
}

/** Option groups whose minimum selection is not met. */
export function missingGroups(
  groups: OptionGroup[],
  selected: Record<string, string[]>,
): OptionGroup[] {
  return groups.filter((g) => (selected[g.id]?.length ?? 0) < g.min);
}

/** Builds a priced line from a product and the waiter's choices. */
export function buildLine(
  product: Product,
  variantId: string,
  selected: Record<string, string[]>,
  quantity: number,
  note: string,
): LineInput {
  const variant =
    product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const options: SelectedOption[] = (product.optionGroups ?? []).flatMap(
    (group) =>
      group.options
        .filter((option) => selected[group.id]?.includes(option.id))
        .map((option) => ({
          groupId: group.id,
          optionId: option.id,
          label: option.label,
          price: option.price,
        })),
  );
  return {
    productId: product.id,
    productName: product.name,
    variantId: variant.id,
    variantLabel: variant.label,
    options,
    unitPrice: variant.price + options.reduce((sum, o) => sum + o.price, 0),
    quantity,
    note: note.trim(),
  };
}
