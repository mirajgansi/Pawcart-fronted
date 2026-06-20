"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductCard from "../../_components/Productcard"; // adjust path to match your structure
import { handleGetRecentProducts } from "@/lib/actions/product-action";

// ─── Types ────────────────────────────────────────────────────────────────────

type Product = {
  _id: string;
  name: string;
  price: number;
  unit?: string;
  inStock: number;
  image?: string;
  productCategory?: string;
  averageRating?: number;
  reviewCount?: number;
  totalSold?: number;
  createdAt?: string;
  badge?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildImageUrl(image?: string) {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}/${image.replace(/^\/+/, "")}`;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-3 animate-pulse">
      <div className="aspect-square bg-gray-100 rounded-2xl mb-3" />
      <div className="h-3 w-16 bg-gray-100 rounded mb-2" />
      <div className="h-4 w-3/4 bg-gray-100 rounded mb-2" />
      <div className="h-3 w-1/2 bg-gray-100 rounded" />
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RecentlyAdded({ excludeId }: { excludeId?: string }) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleGetRecentProducts(1, 8)
      .then((res: any) => {
        if (res?.success) {
          const list: Product[] = res.data?.products ?? res.data ?? [];
          setItems(excludeId ? list.filter((p) => p._id !== excludeId) : list);
        }
      })
      .finally(() => setLoading(false));
  }, [excludeId]);

  if (!loading && items.length === 0) return null;

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          Recently Added
        </h2>
        <Link
          href="/user/products"
          className="text-sm hover:underline flex items-center gap-1"
          style={{ color: "var(--text-brand)" }}
        >
          See all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)
          : items.slice(0, 4).map((p) => (
              <ProductCard
                key={p._id}
                product={{
                  _id: p._id,
                  image: buildImageUrl(p.image),
                  name: p.name,
                  price: Number(p.price),
                  unit: p.unit ?? "per kg",
                  inStock: Number(p.inStock ?? 0),
                  productCategory: p.productCategory,
                  averageRating: p.averageRating,
                  reviewCount: p.reviewCount,
                  totalSold: p.totalSold,
                  createdAt: p.createdAt,
                }}
              />
            ))}
      </div>
    </section>
  );
}