"use client";

import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { handleAddCartItem } from "@/lib/actions/cart-action"; // adjust path
import { handleGetFavoritesMe, handleToggleFavoriteProduct } from "@/lib/actions/product-action";
import { toast } from "react-toastify";
import { useCart } from "@/context/cartContext";
// ─── Types ────────────────────────────────────────────────────────────────────

export type ProductCardProduct = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  unit?: string;
  inStock?: number;
  productCategory?: string;
  averageRating?: number;
  reviewCount?: number;
  totalSold?: number;
  badge?: string;
  createdAt?: string;
  description?: string;
};

type ProductCardProps = {
  product: ProductCardProduct;
  isFavorite?: boolean;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function buildImageUrl(image?: string) {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}/${image.replace(/^\/+/, "")}`;
}

function isNew(createdAt?: string): boolean {
  if (!createdAt) return false;
  return (Date.now() - new Date(createdAt).getTime()) / 86400000 <= 14;
}

function getBadge(product: ProductCardProduct): { label: string; bgVar: string; textVar: string } | null {
  if (product.badge)               return { label: product.badge,    bgVar: "--color-primary-700", textVar: "--interactive-primary-text" };
  if (isNew(product.createdAt))    return { label: "NEW ARRIVAL",    bgVar: "--color-primary-500", textVar: "--interactive-primary-text" };
  if ((product.totalSold ?? 0) > 50) return { label: "BEST SELLER", bgVar: "--color-primary-800", textVar: "--interactive-primary-text" };
  return null;
}

// ─── Stars ────────────────────────────────────────────────────────────────────

function Stars({ rating = 0, count = 0 }: { rating?: number; count?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className="h-3 w-3"
          fill={s <= Math.round(rating) ? "#f59e0b" : "none"}
          stroke={s <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
        />
      ))}
      {count > 0 && (
        <span className="text-[10px] ml-1" style={{ color: "var(--text-secondary)" }}>
          ({count})
        </span>
      )}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductCard({
  product,
  isFavorite: initialFavorite = false,
}: ProductCardProps) {
  const badge   = getBadge(product);
  const inStock = product.inStock ?? 0;

  const [isFavorite, setIsFavorite] = useState(initialFavorite);

  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  const [favLoading, setFavLoading] = useState(false);
  const [adding, setAdding]         = useState(false);
  const [justAdded, setJustAdded]   = useState(false);
 const { incrementCart } = useCart();

  // ── Add to cart ──────────────────────────────────────────────────────────
   async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inStock <= 0 || adding) return;

    setAdding(true);
    const res = await handleAddCartItem({ productId: product._id, quantity: 1 });
    setAdding(false);

    if (!res.success) {
      toast.error(res.message || "Failed to add to cart");
      return;
    }

    incrementCart(1);
    toast.success("Added to cart");
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  }


  // ── Toggle wishlist ──────────────────────────────────────────────────────
  async function handleToggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (favLoading) return;

    setFavLoading(true);
    const next = !isFavorite;
    setIsFavorite(next); // optimistic update

    const res = await handleToggleFavoriteProduct(product._id);
    setFavLoading(false);

    if (!res.success) {
      setIsFavorite(!next); // revert on failure
      toast.error(res.message || "Failed to update wishlist");
      return;
    }

    toast.success(next ? "Added to wishlist" : "Removed from wishlist");
  }
useEffect(() => {
    let active = true;
    handleGetFavoritesMe().then((res: any) => {
      if (!active || !res?.success) return;
      const list = res.data?.products ?? res.data ?? [];
      const isInWishlist = list.some(
        (item: any) => (item.productId ?? item._id) === product._id
      );
      if (isInWishlist) setIsFavorite(true);
    });
    return () => { active = false; };
  }, [product._id]);

  
  return (
    <div
      className="relative rounded-2xl overflow-hidden group transition-all duration-300 flex flex-col"
      style={{
        backgroundColor: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 24px 0 rgba(127,29,29,0.10)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >

      {/* ── Wishlist ── */}
      <button
        onClick={handleToggleWishlist}
        disabled={favLoading}
        className="absolute top-3 right-3 z-10 rounded-full p-1.5 shadow-sm transition-opacity duration-200"
        style={{ backgroundColor: "var(--bg-surface)" }}
        aria-label="Toggle wishlist"
      >
        <Heart
          className="h-3.5 w-3.5 transition-colors"
          style={
            isFavorite
              ? { fill: "var(--color-primary-500)", color: "var(--color-primary-500)" }
              : { fill: "none", color: "var(--color-primary-300)" }
          }
        />
      </button>

      {/* ── Image ── */}
      <Link href={`/user/products/${product._id}`} className="block">
        <div className="aspect-square overflow-hidden relative" style={{ backgroundColor: "var(--color-tertiary)" }}>
          <Image
            src={buildImageUrl(product.image)}
            alt={product.name}
            fill
            unoptimized
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, 25vw"
          />

          {badge && (
            <span
              className="absolute bottom-3 left-3 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm"
              style={{
                backgroundColor: `var(${badge.bgVar})`,
                color: `var(${badge.textVar})`,
              }}
            >
              {badge.label}
            </span>
          )}

          {inStock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(254,242,242,0.75)" }}>
              <span
                className="text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1"
                style={{
                  color: "var(--color-primary-400)",
                  border: "1px solid var(--color-primary-200)",
                  backgroundColor: "var(--bg-surface)",
                }}
              >
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* ── Info ── */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">

        {product.productCategory && (
          <p
            className="text-[9px] font-bold uppercase tracking-widest"
            style={{ color: "var(--color-primary-500)" }}
          >
            {product.productCategory}
          </p>
        )}

        <Link href={`/user/products/${product._id}`}>
          <h3
            className="text-sm font-semibold line-clamp-2 leading-snug transition-colors"
            style={{ color: "var(--text-primary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-brand)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          >
            {product.name}
          </h3>
        </Link>

        <Stars rating={product.averageRating} count={product.reviewCount} />

        {product.unit && (
          <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
            {product.unit}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-base font-bold" style={{ color: "var(--text-brand)" }}>
            ${Number(product.price).toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={inStock <= 0 || adding}
            className="rounded-full p-2 transition-colors duration-200"
            style={
              inStock > 0
                ? { backgroundColor: justAdded ? "var(--color-primary-700)" : "var(--color-primary-50)", color: justAdded ? "var(--interactive-primary-text)" : "var(--color-primary-700)" }
                : { backgroundColor: "var(--color-tertiary)", color: "var(--color-primary-200)", cursor: "not-allowed" }
            }
            onMouseEnter={(e) => {
              if (inStock > 0 && !justAdded) {
                e.currentTarget.style.backgroundColor = "var(--color-primary-700)";
                e.currentTarget.style.color = "var(--interactive-primary-text)";
              }
            }}
            onMouseLeave={(e) => {
              if (inStock > 0 && !justAdded) {
                e.currentTarget.style.backgroundColor = "var(--color-primary-50)";
                e.currentTarget.style.color = "var(--color-primary-700)";
              }
            }}
            aria-label={inStock <= 0 ? "Out of stock" : "Add to cart"}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}