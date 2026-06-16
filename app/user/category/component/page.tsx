"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import ProductCard, { buildImageUrl } from "../../_components/Productcard";

export default function CategoryProductsClient({ products }: { products: any[] }) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const safeProducts = products ?? [];

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      {safeProducts.map((p) => (
        <ProductCard
          key={p._id}
          product={{
            _id: p._id,
            name: p.name,
            price: Number(p.price),
            image: buildImageUrl(p.image),
            unit: p.unit,
            inStock: Number(p.inStock ?? 0),
            productCategory: p.productCategory,
            averageRating: p.averageRating,
            reviewCount: p.reviewCount,
            totalSold: p.totalSold,
            createdAt: p.createdAt,
            badge: p.badge,
          }}
          isFavorite={!!favorites[p._id]}
          onToggleWishlist={() => {
            setFavorites((prev) => ({ ...prev, [p._id]: !prev[p._id] }));
            toast.success("Wishlist updated");
          }}
          onAddToCart={() => toast.success("Added to cart")}
        />
      ))}
    </div>
  );
}