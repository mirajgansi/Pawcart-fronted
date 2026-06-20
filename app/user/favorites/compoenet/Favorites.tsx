"use client";

import { useEffect, useState } from "react";
import ProductsGrid from "../../_components/ProdcutGrid";
import { handleAddCartItem } from "@/lib/actions/cart-action";
import { handleGetFavoritesMe } from "@/lib/actions/product-action";
import { toast } from "react-toastify";

type FavoriteProduct = { _id: string; inStock?: number };

async function handleAddAllToCart(products: FavoriteProduct[]) {
  const inStockOnly = products.filter((p) => (p.inStock ?? 0) > 0);

  if (inStockOnly.length === 0) {
    toast.error("All wishlist items are out of stock");
    return;
  }

  const results = await Promise.allSettled(
    inStockOnly.map((p) => handleAddCartItem({ productId: p._id, quantity: 1 }))
  );

  const succeeded = results.filter(
    (r) => r.status === "fulfilled" && r.value.success
  ).length;
  const failed = results.length - succeeded;

  if (succeeded > 0) {
    toast.success(`Added ${succeeded} item${succeeded !== 1 ? "s" : ""} to cart`);
  }
  if (failed > 0) {
    toast.error(`${failed} item${failed !== 1 ? "s" : ""} couldn't be added`);
  }
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleGetFavoritesMe()
      .then((res: any) => {
        if (res?.success) {
          const list = res.data?.products ?? res.data ?? [];
          setFavorites(list);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">My Wishlist</h1>
            <p className="mt-2 text-sm text-gray-500">Your curated collection of favorite finds.</p>
          </div>

          {!loading && favorites.length > 0 && (
            <button
              type="button"
              onClick={() => handleAddAllToCart(favorites)}
              className="rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition shrink-0"
              style={{ backgroundColor: "var(--color-primary-700)", color: "var(--interactive-primary-text)" }}
            >
              Add All to Cart
            </button>
          )}
        </div>

        <ProductsGrid title="" mode="favorites" />
      </div>
    </div>
  );
}