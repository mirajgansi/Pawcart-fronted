"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingCart, Heart, Star, SlidersHorizontal, ChevronDown } from "lucide-react";
import { handleGetAllProducts, handleToggleFavoriteProduct } from "@/lib/actions/product-action";
import { toast } from "react-toastify";
import ProductCard, { buildImageUrl } from "../../_components/Productcard";
import SpaProductCard from "../../_components/CardProduct";

// ─── Types ────────────────────────────────────────────────────────────────────

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  averageRating?: number;
  reviewCount?: number;
  inStock: number;
  productCategory?: string;
  category?: string[];
  totalSold?: number;
  badge?: string;
  unit?: string;
  createdAt?: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { value: "popularity", label: "Popularity" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top Rated" },
  { value: "newest",     label: "Newest" },
];



// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-16 bg-gray-100 rounded" />
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
        <div className="h-3 w-1/2 bg-gray-100 rounded" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 w-16 bg-gray-100 rounded" />
          <div className="h-8 w-8 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}





const PAGE_SIZE = 6;

export default function GroomingPage() {
  const [products,  setProducts]  = useState<Product[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [sort,      setSort]      = useState("popularity");
  const [showSort,  setShowSort]  = useState(false);
  const [page,      setPage]      = useState(1);
  const [total,     setTotal]     = useState(0);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await handleGetAllProducts({
        productCategory: "grooming",
        page,
        size: PAGE_SIZE,
      });
      if (res.success && res.products) {
        setProducts(res.products as Product[]);
        setTotal(res.pagination?.total ?? res.products.length);
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleToggleWishlist = async (id: string) => {
    const was = !!favorites[id];
    setFavorites((prev) => ({ ...prev, [id]: !was }));
    try {
      await handleToggleFavoriteProduct(id);
      toast.success(was ? "Removed from wishlist" : "Added to wishlist");
    } catch {
      setFavorites((prev) => ({ ...prev, [id]: was }));
      toast.error("Failed to update wishlist");
    }
  };

  const sorted = [...products].sort((a, b) => {
    if (sort === "price-asc")  return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating")     return (b.averageRating ?? 0) - (a.averageRating ?? 0);
    if (sort === "newest")     return new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    return (b.totalSold ?? 0) - (a.totalSold ?? 0);
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── Header ── */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "var(--color-primary-500)" }}>
            PREMIUM CARE
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            Essential Grooming Sets
          </h1>
        </div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
  {!loading && sorted.length > 0 && (
    <SpaProductCard
      title={sorted[0].name}
      description={sorted[0].description}
      price={sorted[0].price}
      badge={sorted[0].badge ?? "Best Value"}
      image={buildImageUrl(sorted[0].image)}
    />
  )}
  {!loading && sorted.length > 1 && (
    <SpaProductCard
      title={sorted[1].name}
      description={sorted[1].description}
      price={sorted[1].price}
      badge={sorted[1].badge ?? "Featured"}
      image={buildImageUrl(sorted[1].image)}
    />
  )}
</div>

        {/* ── Sort + Count bar ── */}
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)} of {total} kits
          </p>

          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
            <span className="font-medium">SORT BY</span>
            <div className="relative">
              <button
                onClick={() => setShowSort((s) => !s)}
                className="flex items-center gap-1 font-semibold transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                {SORT_OPTIONS.find((o) => o.value === sort)?.label}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {showSort && (
                <div
                  className="absolute right-0 top-7 w-44 rounded-xl shadow-xl border overflow-hidden z-30"
                  style={{ backgroundColor: "#fff", borderColor: "var(--border-default)" }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => { setSort(o.value); setShowSort(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs transition-colors"
                      style={
                        sort === o.value
                          ? { fontWeight: 700, color: "var(--interactive-primary)", backgroundColor: "var(--color-tertiary)" }
                          : { color: "var(--text-secondary)" }
                      }
                      onMouseEnter={(e) => { if (sort !== o.value) e.currentTarget.style.backgroundColor = "#fef2f2"; }}
                      onMouseLeave={(e) => { if (sort !== o.value) e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Product Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
          {loading
            ? Array.from({ length: PAGE_SIZE }).map((_, i) => <CardSkeleton key={i} />)
            : sorted.length > 0
              ? sorted.map((p) => (
                  <div key={p._id} className="relative">
                    <ProductCard
                      product={p}
                      isFavorite={!!favorites[p._id]}
                      onToggleWishlist={() => handleToggleWishlist(p._id)}
                      onAddToCart={() => toast.success("Added to cart")}
                    />
                  </div>
                ))
              : (
                <div className="col-span-3 py-20 text-center">
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No grooming products found.</p>
                </div>
              )
          }
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors disabled:opacity-40"
              style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-8 h-8 rounded-full text-xs font-semibold transition-all border"
                style={
                  p === page
                    ? { backgroundColor: "var(--color-primary-700)", color: "#fff", borderColor: "var(--color-primary-700)" }
                    : { backgroundColor: "transparent", color: "var(--text-secondary)", borderColor: "var(--border-default)" }
                }
                onMouseEnter={(e) => { if (p !== page) e.currentTarget.style.borderColor = "var(--color-primary-400)"; }}
                onMouseLeave={(e) => { if (p !== page) e.currentTarget.style.borderColor = "var(--border-default)"; }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-full border flex items-center justify-center transition-colors disabled:opacity-40"
              style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}