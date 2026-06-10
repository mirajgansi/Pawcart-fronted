// lib/categories.ts
export const PET_CATEGORIES = [
  { slug: "dogs", label: "Dogs", description: "Products for dogs" },
  { slug: "cats", label: "Cats", description: "Products for cats" },
  { slug: "birds", label: "Birds", description: "Products for birds" },
  { slug: "fish", label: "Fish", description: "Products for fish" },
  { slug: "rabbits", label: "Rabbits", description: "Products for rabbits" },
  {
    slug: "small-pets",
    label: "Small Pets",
    description: "Products for small pets",
  },
] as const;

export const PRODUCT_CATEGORIES = [
  { slug: "food", label: "Food", description: "Pet food and treats" },
  {
    slug: "accessories",
    label: "Accessories",
    description: "Collars, leashes, etc.",
  },
  { slug: "housing", label: "Housing", description: "Cages, beds, tanks" },
  {
    slug: "grooming",
    label: "Grooming",
    description: "Shampoos, brushes, etc.",
  },
  { slug: "toys", label: "Toys", description: "Play and enrichment" },
  {
    slug: "health-care",
    label: "Health Care",
    description: "Vitamins, medicine, etc.",
  },
] as const;

export type PetCategorySlug = (typeof PET_CATEGORIES)[number]["slug"];
export type ProductCategorySlug = (typeof PRODUCT_CATEGORIES)[number]["slug"];
