"use client";

import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  id: string;
  image: string;
  name: string;
  price: number;
  unit?: string;
  inStock?: number;
  isFavorite?: boolean;
  category?: string;
  rating?: number;
  reviewCount?: number;
  createdAt?: string | Date; 
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
};

const NEW_THRESHOLD_DAYS = 14; 
function isNewProduct(createdAt?: string | Date): boolean {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const diffMs = Date.now() - created.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= NEW_THRESHOLD_DAYS;
}

export default function ProductCard({
  id,
  image,
  name,
  price,
  isFavorite = false,
  inStock = 0,
  category ,
  rating = 4,
  reviewCount = 0,
  createdAt,
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  const showNewBadge = isNewProduct(createdAt);

  return (
    <div className="w-full bg-white rounded-3xl p-3 shadow-sm relative flex flex-col">

      {/* Wishlist button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleWishlist?.();
        }}
        className="absolute top-4 right-4 z-10 bg-white p-1.5 rounded-full shadow-sm hover:scale-105 transition"
        aria-label="Toggle favorite"
      >
        <Heart
          className={`h-4 w-4 transition ${
            isFavorite ? "fill-red-500 text-red-500" : "text-gray-300"
          }`}
        />
      </button>

      <Link href={`/user/products/${id}`} className="block flex-1">
        {/* Image area */}
        <div className="bg-gray-100 rounded-2xl w-full relative overflow-hidden flex items-center justify-center h-40">
          <Image
            src={image}
            alt={name}
            fill
            unoptimized
            className="object-contain p-4"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          />

          {/* NEW badge — only if recently added */}
          {showNewBadge && (
            <span className="absolute bottom-3 left-3 bg-[var(--color-primary-800)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              New
            </span>
          )}
        </div>

        {/* Category */}
        <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--text-secondary)] px-1">
          {category}
        </p>

        {/* Name */}
        <h3 className="mt-0.5 text-sm font-semibold text-gray-900 line-clamp-2 px-1">
          {name}
        </h3>

        {/* Stars */}
        <div className="mt-1 flex items-center gap-1 px-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < Math.round(rating)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-gray-200 text-gray-200"
              }`}
            />
          ))}
          {reviewCount > 0 && (
            <span className="text-[11px] text-[var(--text-secondary)] ml-1">
              ({reviewCount})
            </span>
          )}
        </div>
      </Link>

      {/* Price + Cart */}
      <div className="mt-3 flex items-center justify-between px-1">
        <p className="text-gray-900 text-base font-bold">
          ${price.toFixed(2)}
        </p>

        <button
          onClick={onAddToCart}
          disabled={inStock <= 0}
          className={`shrink-0 rounded-full p-2.5 transition ${
            inStock <= 0
              ? "cursor-not-allowed bg-gray-100 text-gray-400"
              : "bg-gray-100 text-gray-600 hover:bg-[var(--color-primary-800)] hover:text-white"
          }`}
          aria-label="Add to cart"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}