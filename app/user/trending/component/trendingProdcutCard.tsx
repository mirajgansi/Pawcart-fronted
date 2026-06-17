"use client";

import { Heart, ShoppingCart } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TrendingProduct = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  badge?: string;
  unit?: string;
};

type TrendingProductCardProps = {
  product: TrendingProduct;
  size?: "big" | "small";
  isFavorite?: boolean;
  onToggleWishlist?: () => void;
  onAddToCart?: () => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function TrendingProductCard({
  product,
  size = "small",
  isFavorite = false,
  onToggleWishlist,
  onAddToCart,
}: TrendingProductCardProps) {
  const isBig = size === "big";

  return (
    <div
      className="group relative h-full w-full overflow-hidden rounded-[20px] bg-white border transition-shadow hover:shadow-md"
      style={{ borderColor: "var(--border-subtle, #F0EBE6)" }}
    >
      {/* ── Image ── */}
      <div
        className={`relative w-full overflow-hidden ${isBig ? "aspect-[16/10]" : "aspect-square"}`}
        style={{ backgroundColor: "var(--bg-muted, #F4F1EA)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />

        {/* Badge */}
        {product.badge && (
          <span
            className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white"
            style={{ backgroundColor: "var(--brand-accent, #8B1E2B)" }}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        {onToggleWishlist && (
          <button
            type="button"
            onClick={onToggleWishlist}
            aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isFavorite}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-colors hover:bg-white"
          >
            <Heart
              size={15}
              strokeWidth={2}
              className={isFavorite ? "fill-current" : ""}
              style={{ color: "var(--brand-accent, #8B1E2B)" }}
            />
          </button>
        )}
      </div>

      {/* ── Body ── */}
      <div className={isBig ? "p-5 pt-4" : "p-3.5"}>
        <h3
          className={`font-semibold leading-snug ${isBig ? "text-lg mb-1.5" : "text-sm mb-1 line-clamp-1"}`}
          style={{ color: "var(--text-brand, #1F1B16)" }}
        >
          {product.name}
        </h3>

        {isBig && product.description && (
          <p
            className="text-sm mb-3 line-clamp-2"
            style={{ color: "var(--text-secondary, #6B645C)" }}
          >
            {product.description}
          </p>
        )}

        {isBig ? (
          <div className="flex items-center justify-between">
            <p
              className="font-medium text-base"
              style={{ color: "var(--text-secondary, #6B645C)" }}
            >
              ${product.price.toFixed(2)}
              {product.unit ? <span className="text-xs"> / {product.unit}</span> : null}
            </p>

            <button
              type="button"
              onClick={onAddToCart}
              aria-label="Add to cart"
              className="flex h-11 w-11 items-center justify-center rounded-full text-white shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: "var(--brand-accent, #8B1E2B)" }}
            >
              <ShoppingCart size={17} strokeWidth={2} />
            </button>
          </div>
        ) : (
          <>
            <p
              className="font-medium text-sm mb-2.5"
              style={{ color: "var(--text-secondary, #6B645C)" }}
            >
              ${product.price.toFixed(2)}
              {product.unit ? <span className="text-xs"> / {product.unit}</span> : null}
            </p>

            <button
              type="button"
              onClick={onAddToCart}
              className="flex w-full items-center justify-center gap-1.5 rounded-full py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--brand-accent, #8B1E2B)" }}
            >
              <ShoppingCart size={13} strokeWidth={2} />
              Add to Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
}