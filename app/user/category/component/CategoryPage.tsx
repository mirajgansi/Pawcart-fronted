"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CategoryTile = {
  label: string;
  image: string;
  href: string;
  description?: string;
  labelPosition?: "bottom-left" | "top-right";
};

type CategoryShowcaseProps = {
  categories?: CategoryTile[];
};

const DEFAULT_CATEGORIES: CategoryTile[] = [
  {
    label: "Food",
    image: "/Dogfood.png",
    href: "/user/category/food",
    description: "Nutrition-first whole recipes",
    labelPosition: "bottom-left",
  },
  {
    label: "Toys",
    image: "/toys.png",
    href: "/user/category/toys",
    labelPosition: "bottom-left",
  },
  {
    label: "Beds",
    image: "/bed.png",
    href: "/user/category/housing",
    labelPosition: "top-right",
  },
  {
    label: "Collars",
    image: "/collars.png",
    href: "/user/category/accessories",
    labelPosition: "top-right",
  },
];

export default function CategoryShowcase({
  categories = DEFAULT_CATEGORIES,
}: CategoryShowcaseProps) {
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