import ProductsGrid from "@/app/user/_components/ProdcutGrid";
import { handleGetProductsByPet, handleGetProductsByType } from "@/lib/actions/product-action";
import { notFound } from "next/navigation";
import CategoryShowcase from "../../component/CategoryPage";
import CategoryHero from "../../component/HeroPage";
import ProductCategoryPage from "../../component/ProdcutCategoryPage";

// All known slugs and which handler they belong to
const PET_CATEGORIES = ["dogs", "cats", "birds", "fish", "rabbits", "small-pets"];
const TYPE_CATEGORIES = ["food", "accessories", "housing", "grooming", "toys", "health-care"];

function formatSlug(slug: string) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

async function getProductsByCategory(slug: string) {
  if (PET_CATEGORIES.includes(slug)) {
    return handleGetProductsByPet(slug);
  }
  if (TYPE_CATEGORIES.includes(slug)) {
    return handleGetProductsByType(slug);
  }
  return null;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await getProductsByCategory(slug);
  if (!res?.success) return notFound();

  const products = res.products ?? res.data ?? [];
  const formattedName = formatSlug(slug);
  const isPetCategory = PET_CATEGORIES.includes(slug); // ← add this

  return (
    <div className="w-full">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">

        {isPetCategory && <ProductCategoryPage  />}
       
      </div>
    </div>
  );
}