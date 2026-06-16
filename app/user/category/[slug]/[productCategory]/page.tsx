// app/user/category/[slug]/[productCategory]/page.tsx

import ProductCategoryPage from "../../component/ProdcutCategoryPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; productCategory: string }>;
}) {
  const { slug, productCategory } = await params;
  return <ProductCategoryPage petSlug={slug} productCategory={productCategory} />;
}