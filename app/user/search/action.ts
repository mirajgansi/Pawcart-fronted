// app/user/search/actions.ts
"use server";

import { handleGetAllProducts } from "@/lib/actions/product-action";

export async function searchProducts({
  page,
  sort,
  query,
}: {
  page: number;
  sort?: string;
  query: string;
}) {
  const res = await handleGetAllProducts({ search: query, page, size: 8 });
  return {
    products: res.products ?? [],
    total: res.pagination?.total ?? 0,
    pageSize: 8,
  };
}
