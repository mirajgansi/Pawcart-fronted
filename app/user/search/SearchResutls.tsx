// app/user/search/SearchResults.tsx
"use client";
import { useEffect, useState } from "react";
import ProductResultsView from "../products/components/AllProduct";
import { searchProducts } from "./action";

export default function SearchResults({ query }: { query: string }) {
  const fetcher = ({ page, sort }: { page: number; sort?: string }) =>
    searchProducts({ page, sort, query });

  return (
    <ProductResultsView
      fetcher={fetcher}
      resultsLabel={(count) => `${count} results for "${query}"`}
      breadcrumb={[{ label: "Home", href: "/" }, { label: `Search: ${query}` }]}
      emptyStateMessage={`No products found for "${query}".`}
    />
  );
}