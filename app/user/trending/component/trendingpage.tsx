"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handleGetTrendingProducts, handleToggleFavoriteProduct } from "@/lib/actions/product-action";
import TrendingProductCard from "./trendingProdcutCard";

// ─── Types ────────────────────────────────────────────────────────────────────

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  images?: string[];
  averageRating: number;
  reviewCount: number;
  inStock: number;
  productCategory: string;
  category: string[];
  totalSold?: number;
  unit?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildImageUrl(image?: string) {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}/${image.replace(/^\/+/, "")}`;
}

// Badges shown on each of the 5 trending slots, in order
const BADGES = ["Hot Pick", "Trending", "Hot", "Top Rated", "Popular"];

// ─── Skeletons ────────────────────────────────────────────────────────────────

function BigCardSkeleton() {
  return <div className="aspect-[16/10] w-full rounded-[20px] bg-gray-100 animate-pulse" />;
}

function SmallCardSkeleton() {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-3.5 space-y-2">
        <div className="h-3 w-20 bg-gray-100 rounded" />
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
        <div className="h-3 w-full bg-gray-100 rounded" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TrendingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await handleGetTrendingProducts(1, 5); // top 5
        if (res.success && res.products) {
          setProducts(res.products as Product[]);
        } else if (res.success && res.data) {
          setProducts(res.data as Product[]);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleToggleWishlist = async (productId: string) => {
    const wasOn = !!favorites[productId];
    setFavorites((prev) => ({ ...prev, [productId]: !wasOn }));
    try {
      await handleToggleFavoriteProduct(productId);
      toast.success(wasOn ? "Removed from wishlist" : "Added to wishlist");
    } catch {
      setFavorites((prev) => ({ ...prev, [productId]: wasOn }));
      toast.error("Failed to update wishlist");
    }
  };

  const handleAddToCart = (_productId: string) => {
    toast.success("Added to cart");
  };

  // products[0..1] = the 2 big top cards, products[2..4] = the 3 small bottom cards
  const bigCards = products.slice(0, 2);
  const smallCards = products.slice(2, 5);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="max-w-6xl mx-auto px-5 py-10">

        {/* ── Header ── */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-brand)" }}>
            Trending Now
          </h1>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Discover the most-loved products curated by our community. From organic
            treats to designer beds, these are the picks that wag the tail this season.
          </p>
        </div>

        {/* ── Top row: 2 big cards / Bottom row: 3 small cards ── */}
        {loading ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <BigCardSkeleton />
              <BigCardSkeleton />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => <SmallCardSkeleton key={i} />)}
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="space-y-4">
            {/* Top: 2 big cards side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bigCards.map((p, i) => (
                <TrendingProductCard
                  key={p._id}
                  size="big"
                  product={{
                    _id: p._id,
                    name: p.name,
                    description: p.description,
                    price: Number(p.price),
                    image: buildImageUrl(p.image),
                    badge: BADGES[i],
                  }}
                  isFavorite={!!favorites[p._id]}
                  onToggleWishlist={() => handleToggleWishlist(p._id)}
                  onAddToCart={() => handleAddToCart(p._id)}
                />
              ))}
            </div>

            {/* Bottom: 3 small cards */}
            {smallCards.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {smallCards.map((p, i) => (
                  <TrendingProductCard
                    key={p._id}
                    size="small"
                    product={{
                      _id: p._id,
                      name: p.name,
                      price: Number(p.price),
                      image: buildImageUrl(p.image),
                      unit: p.unit ?? "",
                      badge: BADGES[i + 2],
                    }}
                    isFavorite={!!favorites[p._id]}
                    onToggleWishlist={() => handleToggleWishlist(p._id)}
                    onAddToCart={() => handleAddToCart(p._id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            No trending products right now.
          </p>
        )}
      </div>
    </div>
  );
}