"use client";

// app/products/best-sellers/BestSellersClient.tsx  (client component)

import AllProductsPage, { type FetchProductsParams } from "../components/AllProduct";
import { handleGetPopularProducts, handleToggleFavoriteProduct } from "@/lib/actions/product-action";

export default function BestSellersClient() {
  const fetcher = async ({ page }: FetchProductsParams) => {
    const res = await handleGetPopularProducts(page, 8);

    if (!res.success) {
      throw new Error(res.message || "Failed to fetch products");
    }

    const products = res.products ?? res.data ?? [];

    return {
      products,
      total: res.pagination?.total ?? products.length,
      pageSize: res.pagination?.size ?? 8,
    };
  };

  return (
    <AllProductsPage
      fetcher={fetcher}
      resultsLabel={(count) => `Showing ${count} results for 'Best Sellers'`}
      subtitle="Premium handcrafted accessories and essentials"
      breadcrumb={[
        { label: "Home", href: "/" },
        { label: "Best Sellers" },
      ]}
      showSort={false}
      onAddToCart={async () => { /* wire your real cart action here */ }}
      onToggleWishlist={async (productId) => { await handleToggleFavoriteProduct(productId); }}
    />
  );
}