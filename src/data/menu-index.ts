import { MENU } from "./menu";
import type { Product } from "./menu-types";

export interface IndexedProduct {
  product: Product;
  mainCategoryId: string;
  categoryId: string;
  /** Lowercased, accent-free name and description for search. */
  searchText: string;
}

/** Lowercases and strips accents so "cafe" matches "Café" and "kase" matches "Käse". */
export function normalizeSearch(text: string): string {
  return text
    .toLowerCase()
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export const ALL_PRODUCTS: IndexedProduct[] = MENU.flatMap((main) =>
  main.categories.flatMap((category) =>
    category.products.map((product) => ({
      product,
      mainCategoryId: main.id,
      categoryId: category.id,
      searchText: normalizeSearch(
        `${product.name} ${product.description ?? ""}`,
      ),
    })),
  ),
);

export const PRODUCTS_BY_ID: ReadonlyMap<string, IndexedProduct> = new Map(
  ALL_PRODUCTS.map((entry) => [entry.product.id, entry]),
);

/** "Tapas · Fisch", or just "Salate" when the sub-category repeats the main name. */
export const CATEGORY_LABELS: ReadonlyMap<string, string> = new Map(
  MENU.flatMap((main) =>
    main.categories.map((c) => [
      c.id,
      c.id === main.id ? main.name : `${main.name} · ${c.name}`,
    ]),
  ),
);

export function searchProducts(query: string): IndexedProduct[] {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return ALL_PRODUCTS.filter((entry) =>
    terms.every((term) => entry.searchText.includes(term)),
  );
}
