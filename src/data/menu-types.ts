/** Where an item is prepared; reserved for v2 kitchen/bar routing. */
export type Station = "kitchen" | "bar";

/** A priced form of a product (size, portion, preparation). Prices are integer cents. */
export interface Variant {
  id: string;
  /** Empty when the product has a single, unnamed price. */
  label: string;
  price: number;
}

export interface Option {
  id: string;
  label: string;
  /** Surcharge in integer cents; 0 for a free choice. */
  price: number;
}

/** A set of choices attached to a product, e.g. milk alternatives or a required flavour. */
export interface OptionGroup {
  id: string;
  label: string;
  /** Minimum selections; 1 makes the group required. */
  min: number;
  /** Maximum selections; 1 makes the group a single choice. */
  max: number;
  options: Option[];
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  station: Station;
  /** Zusatzstoffe numbers as printed on the menu; not shown in the v1 UI. */
  additives?: number[];
  variants: Variant[];
  optionGroups?: OptionGroup[];
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}

/** One printed menu card (Speisekarte, Mittagstisch, Saisonale Speisen). */
export interface Section {
  id: string;
  name: string;
  categories: Category[];
}
