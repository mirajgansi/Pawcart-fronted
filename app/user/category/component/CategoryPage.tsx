"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CategoryHero from "./HeroPage";

type CategoryTile = {
  label: string;
  image: string;
  href: string;
  description?: string;
  labelPosition?: "bottom-left" | "top-right";
};

type CategoryShowcaseProps = {
  categories?: CategoryTile[];
  petSlug: string;
};

const PET_SUBCATEGORIES: Record<string, CategoryTile[]> = {
  dogs: [
    { label: "Food",    image: "/Dogfood.png",   href: "", description: "Nutrition-first whole recipes" },
    { label: "Toys",    image: "/toys.png",       href: "" },
    { label: "Beds",    image: "/bed.png",        href: "" },
    { label: "Collars", image: "/collars.png",    href: "" },
  ],
  cats: [
    { label: "Food",    image: "/Dogfood.png",   href: "", description: "Gourmet feline recipes" },
    { label: "Toys",    image: "/toys.png",       href: "" },
    { label: "Beds",    image: "/bed.png",        href: "" },
    { label: "Collars", image: "/collars.png",    href: "" },
  ],
  birds: [
    { label: "Food",    image: "/bird_food.jpg",  href: "", description: "Premium seeds & pellets" },
    { label: "Toys",    image: "/bird-toys.png",  href: "" },
    { label: "Cages",   image: "/cage.png",       href: "" },
    { label: "Perches", image: "/perch.jpg",      href: "" },
  ],
  fish: [
    { label: "Food",      image: "/fish-food.png",    href: "", description: "Flakes, pellets & more" },
    { label: "Decor",     image: "/fish-decor.png",   href: "" },
    { label: "Aquariums", image: "/aquarium.png",     href: "" },
    { label: "Filters",   image: "/filter.jpg",       href: "" },
  ],
  rabbits: [
    { label: "Food",    image: "/rabbit-food.png", href: "", description: "Hay, pellets & treats" },
    { label: "Toys",    image: "/rabbit-toys.png", href: "" },
    { label: "Hutches", image: "/hutch.png",       href: "" },
    { label: "Bedding", image: "/bedding.png",     href: "" },
  ],
};

// Fallback for unknown pets
const DEFAULT_SUBCATEGORIES: CategoryTile[] = [
  { label: "Food",        image: "/Dogfood.png",  href: "", description: "Premium recipes" },
  { label: "Toys",        image: "/toys.png",     href: "" },
  { label: "Accessories", image: "/collars.png",  href: "" },
  { label: "Housing",     image: "/bed.png",      href: "" },
];

export default function CategoryShowcase({ petSlug }: CategoryShowcaseProps) {
  const baseCategories = PET_SUBCATEGORIES[petSlug] ?? DEFAULT_SUBCATEGORIES;

  // Inject dynamic hrefs based on petSlug
  const SLUG_MAP: Record<string, string> = {
    Food: "food", Toys: "toys", Beds: "housing", Collars: "accessories",
    Cages: "housing", Perches: "accessories", Aquariums: "housing",
    Filters: "accessories", Decor: "accessories", Hutches: "housing",
    Bedding: "accessories", Housing: "housing",
  };

  const categories = baseCategories.map((cat) => ({
    ...cat,
    href: `/user/category/${petSlug}/${SLUG_MAP[cat.label] ?? cat.label.toLowerCase()}`,
  }));

  const [food, toys, beds, collars] = categories;

  return (
    <div className="rounded-2xl p-3" style={{ background: "#f5ede4" }}>
   <div
        className="grid gap-2.5"
        style={{

            gridTemplateColumns: "2.4fr 1fr 1.4fr",
          gridTemplateRows: "1fr 1fr",
          height: "300px",
        }}
      >
        {/* Left — Food, full height */}
        <Link href={food.href} className="row-span-2 rounded-2xl overflow-hidden relative group">
          <img src={food.image} alt={food.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0) 52%)" }} />
          <div className="absolute bottom-3.5 left-3.5 flex flex-col">
            <span className="text-white font-bold text-base">{food.label}</span>
            {food.description && <span className="text-white/70 text-xs mt-0.5">{food.description}</span>}
            <ArrowRight className="h-4 w-4 text-white mt-1.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </div>
        </Link>

        {/* Center — Toys, full height */}
        <Link href={toys.href} className="row-span-2 rounded-2xl overflow-hidden relative group">
          <img src={toys.image} alt={toys.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 52%)" }} />
          <span className="absolute bottom-3 left-3.5 text-white font-bold text-sm">{toys.label}</span>
        </Link>

        {/* Right top — Beds */}
        <Link href={beds.href} className="rounded-2xl overflow-hidden relative group">
          <img src={beds.image} alt={beds.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute top-3 right-3.5 text-white font-bold text-sm">{beds.label}</span>
        </Link>

        {/* Right bottom — Collars */}
        <Link href={collars.href} className="rounded-2xl overflow-hidden relative group">
          <img src={collars.image} alt={collars.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <span className="absolute top-3 right-3.5 text-white font-bold text-sm">{collars.label}</span>
        </Link>
      </div>
    </div>
  );
}