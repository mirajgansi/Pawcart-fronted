// app/products/best-sellers/page.tsx  (server component)

import { handleWhoami } from "@/lib/actions/auth-actions";
import { notFound } from "next/navigation";
import BestSellersClient from "./components/BestSellerspage";

export default async function Page() {
  const result = await handleWhoami();

  if (!result.success) {
    throw new Error("Error fetching user data");
  }

  if (!result.data) {
    notFound();
  }

  return <BestSellersClient />;
}