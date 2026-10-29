import type {
  Category,
  Option,
  OptionGroup,
  Product,
  MainCategory,
  Station,
} from "./menu-types";

const UMLAUTS: Record<string, string> = {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  ß: "ss",
};

/** Builds a stable, URL-safe id from German menu text. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äöüß]/g, (c) => UMLAUTS[c])
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface GroupOptions {
  /** Defaults to 0 (optional). */
  min?: number;
  /** Defaults to the number of options (multi-select). */
  max?: number;
}

/** Option group; options given as [label, surchargeCents] pairs. */
export function group(
  label: string,
  options: [string, number][],
  { min = 0, max = options.length }: GroupOptions = {},
): OptionGroup {
  return {
    id: slugify(label),
    label,
    min,
    max,
    options: options.map(([optionLabel, price]): Option => ({
      id: slugify(optionLabel),
      label: optionLabel,
      price,
    })),
  };
}

/** Required single choice without surcharge, e.g. a flavour or a side. */
export function choice(label: string, labels: string[]): OptionGroup {
  return group(
    label,
    labels.map((l) => [l, 0]),
    { min: 1, max: 1 },
  );
}

export interface ItemInput {
  name: string;
  /** Single price in cents; use `variants` for several sizes. */
  price?: number;
  /** [label, priceCents] pairs. */
  variants?: [string, number][];
  description?: string;
  options?: OptionGroup[];
  additives?: number[];
  station?: Station;
}

export interface CategoryInput {
  name: string;
  station: Station;
  /** Applied to every item in addition to its own options. */
  options?: OptionGroup[];
  items: ItemInput[];
}

function buildProduct(
  categoryId: string,
  input: ItemInput,
  station: Station,
  sharedOptions: OptionGroup[],
): Product {
  const pairs: [string, number][] =
    input.variants ?? (input.price === undefined ? [] : [["", input.price]]);
  const optionGroups = [...(input.options ?? []), ...sharedOptions];
  return {
    id: `${categoryId}--${slugify(input.name)}`,
    name: input.name,
    station: input.station ?? station,
    variants: pairs.map(([label, price]) => ({
      id: label ? slugify(label) : "default",
      label,
      price,
    })),
    ...(input.description && { description: input.description }),
    ...(input.additives && { additives: input.additives }),
    ...(optionGroups.length > 0 && { optionGroups }),
  };
}

export function mainCategory(
  name: string,
  categories: CategoryInput[],
  id = slugify(name),
): MainCategory {
  return {
    id,
    name,
    categories: categories.map((c): Category => {
      // A sub-category named like its main category ("Salate" in "Salate") shares its id.
      const slug = slugify(c.name);
      const categoryId = slug === id ? id : `${id}--${slug}`;
      return {
        id: categoryId,
        name: c.name,
        products: c.items.map((item) =>
          buildProduct(categoryId, item, c.station, c.options ?? []),
        ),
      };
    }),
  };
}
