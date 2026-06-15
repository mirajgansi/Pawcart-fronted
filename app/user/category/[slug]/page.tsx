import { notFound } from "next/navigation";
import ProductsGrid from "../../_components/ProdcutGrid";
import { handleGetProductsByPet, handleGetProductsByType } from "@/lib/actions/product-action";
import CategoryShowcase from "../component/CategoryPage";
import CategoryHero from "../component/HeroPage";


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

        {/* Only show sub-category tiles on pet pages */}
        {isPetCategory && <CategoryHero petSlug={slug} />}

        {isPetCategory && <CategoryShowcase petSlug={slug} />}

        <div className="mb-6">
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>
Curated for Your Canine
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
Expertly selected favorites for performance and longevity.          </p>
        </div>

        {products.length ? (
          <ProductsGrid title="" mode="prefetched" initialProducts={products} />
        ) : (
          <div className="mt-10 rounded-2xl border p-8 text-center"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-default)" }}>
            <p style={{ color: "var(--text-secondary)" }}>
              No products available in {formattedName} at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}