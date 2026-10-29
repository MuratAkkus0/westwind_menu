import { MENU } from "./menu";
import type { Product } from "./menu-types";

export interface IndexedProduct {
  product: Product;
  sectionId: string;
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

export const ALL_PRODUCTS: IndexedProduct[] = MENU.flatMap((section) =>
  section.categories.flatMap((category) =>
    category.products.map((product) => ({
      product,
      sectionId: section.id,
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

export function searchProducts(query: string): IndexedProduct[] {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return ALL_PRODUCTS.filter((entry) =>
    terms.every((term) => entry.searchText.includes(term)),
  );
}
