"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { handleGetTrendingProducts, handleToggleFavoriteProduct } from "@/lib/actions/product-action";
import ProductCard from "../../_components/Productcard";
import SpaProductCard from "../../_components/CardProduct";

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

// ─── Skeletons ────────────────────────────────────────────────────────────────

function BigCardSkeleton() {
  return <div className="h-full min-h-[440px] w-full rounded-[20px] bg-gray-100 animate-pulse" />;
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
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
        const res = await handleGetTrendingProducts(1, 5); // only top 5
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

  // products[0] = hero spa card, products[1..4] = the 4 small cards
  const heroProduct = products[0];
  const smallCards   = products.slice(1, 5);

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

        {/* ── 4-col grid: hero spans 2x2 top-left, 4 small cards fill the rest ── */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" style={{ gridAutoRows: "1fr" }}>
            <div className="col-span-2 row-span-2">
              <BigCardSkeleton />
            </div>
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : heroProduct ? (
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            style={{ gridAutoRows: "1fr" }}
          >
            {/* Hero card — spans 2 columns, 2 rows */}
            <div className="col-span-2 row-span-2">
              <SpaProductCard
                title={heroProduct.name}
                description={heroProduct.description}
                price={Number(heroProduct.price)}
                image={buildImageUrl(heroProduct.image)}
                badge="Hot Pick"
                eyebrow={heroProduct.productCategory}
                onShopNow={() => handleAddToCart(heroProduct._id)}
              />
            </div>

            {/* 4 small cards auto-fill the remaining 2x2 cells */}
            {smallCards.map((p) => (
              <ProductCard
                key={p._id}
                product={{
                  _id: p._id,
                  name: p.name,
                  price: Number(p.price),
                  image: buildImageUrl(p.image),
                  unit: p.unit ?? "",
                  inStock: Number(p.inStock ?? 0),
                  productCategory: p.productCategory,
                }}
                isFavorite={!!favorites[p._id]}
                onToggleWishlist={() => handleToggleWishlist(p._id)}
                onAddToCart={() => handleAddToCart(p._id)}
              />
            ))}
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