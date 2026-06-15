"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, Heart, Star, SlidersHorizontal, ChevronDown, Search, X } from "lucide-react";
import { handleGetAllProducts } from "@/lib/actions/product-action";
import { handleToggleFavoriteProduct } from "@/lib/actions/product-action";

// ─── Types ────────────────────────────────────────────────────────────────────

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  images?: string[];
  averageRating: number;
  reviewCount: number;
  inStock: number;
  productCategory: string;
  category: string[];
  totalSold?: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const PET_LABELS: Record<string, string> = {
  dogs: "Dog", cats: "Cat", birds: "Bird",
  fish: "Fish", rabbits: "Rabbit", "small-pets": "Small Pet",
};

const PRODUCT_LABELS: Record<string, string> = {
  food: "Food", accessories: "Accessories", housing: "Housing",
  grooming: "Grooming", toys: "Toys", "health-care": "Health Care",
};

const HERO_CONFIG: Record<string, { headline: string; sub: string; badge: string; bg: string }> = {
  food:         { headline: "Nutrition Tailored\nfor Longevity", sub: "Scientifically formulated with ingredients to ensure your companion lives vibrant & healthy.", badge: "Premium Nutrition", bg: "from-stone-800 via-amber-950 to-stone-900" },
  accessories:  { headline: "Style Meets\nFunction", sub: "From collars to carriers — gear that looks good and works harder.", badge: "Top Accessories", bg: "from-slate-800 via-indigo-950 to-slate-900" },
  toys:         { headline: "Playtime\nElevated", sub: "Stimulating toys designed to engage, reward, and bond.", badge: "Enrichment Picks", bg: "from-emerald-900 via-teal-950 to-emerald-900" },
  housing:      { headline: "Comfort\nThey'll Love", sub: "Beds, crates, and habitats built for rest and security.", badge: "Home Essentials", bg: "from-orange-900 via-rose-950 to-orange-900" },
  grooming:     { headline: "Groom With\nConfidence", sub: "Gentle formulas and professional-grade tools for every coat type.", badge: "Grooming Essentials", bg: "from-violet-900 via-purple-950 to-violet-900" },
  "health-care":{ headline: "Wellness\nFirst", sub: "Supplements, treatments and daily care for a longer, happier life.", badge: "Health & Wellness", bg: "from-cyan-900 via-sky-950 to-cyan-900" },
};

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

const PET_FILTERS = [
  { slug: "all", label: "All Types" },
  { slug: "dogs", label: "Dog" },
  { slug: "cats", label: "Cat" },
  { slug: "birds", label: "Bird" },
  { slug: "fish", label: "Fish" },
  { slug: "rabbits", label: "Rabbit" },
  { slug: "small-pets", label: "Small Pet" },
];

// ─── Star Rating ──────────────────────────────────────────────────────────────

function Stars({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className="h-3 w-3"
          fill={s <= Math.round(rating) ? "#f59e0b" : "none"}
          stroke={s <= Math.round(rating) ? "#f59e0b" : "#d1d5db"}
        />
      ))}
      <span className="text-[11px] text-gray-400 ml-0.5">({count})</span>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const [faved, setFaved] = useState(false);
  const [adding, setAdding] = useState(false);

  const img = product.images?.[0] ?? product.image ?? "/placeholder.png";
  const isNew = product.totalSold !== undefined && product.totalSold < 10;
  const isBestSeller = (product.totalSold ?? 0) > 50;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Badge */}
      {(isNew || isBestSeller) && (
        <div className={`absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isBestSeller ? "bg-amber-400 text-amber-900" : "bg-emerald-500 text-white"}`}>
          {isBestSeller ? "Best Seller" : "New Arrival"}
        </div>
      )}

      {/* Favorite */}
      <button
        onClick={async () => {
          setFaved((f) => !f);
          await handleToggleFavoriteProduct(product._id);
        }}
        className="absolute top-3 right-3 z-10 h-8 w-8 grid place-items-center rounded-full bg-white/90 shadow-sm hover:scale-110 transition-transform"
      >
        <Heart className={`h-4 w-4 ${faved ? "fill-red-500 stroke-red-500" : "stroke-gray-400"}`} />
      </button>

      {/* Image */}
      <Link href={`/products/${product._id}`}>
        <div className="aspect-square overflow-hidden bg-gray-50">
          <img
            src={img}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="p-3.5 space-y-2">
        <Stars rating={product.averageRating} count={product.reviewCount} />

        <Link href={`/products/${product._id}`}>
          <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-gray-400 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between pt-1">
          <span className="text-base font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button
            disabled={product.inStock === 0 || adding}
            onClick={() => {
              setAdding(true);
              setTimeout(() => setAdding(false), 800);
            }}
            className="h-8 w-8 grid place-items-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
          </button>
        </div>

        {product.inStock === 0 && (
          <p className="text-[11px] text-red-400 font-medium">Out of stock</p>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-3.5 space-y-2">
        <div className="h-3 w-20 bg-gray-100 rounded" />
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-2/3 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProductCategoryPage() {
  const params = useParams();
  const petSlug = params?.petSlug as string;
  const productCategory = params?.productCategory as string;

  const hero = HERO_CONFIG[productCategory] ?? HERO_CONFIG["food"];
  const petLabel = PET_LABELS[petSlug] ?? "All Pets";
  const categoryLabel = PRODUCT_LABELS[productCategory] ?? productCategory;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePet, setActivePet] = useState(petSlug ?? "all");
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  const [showSort, setShowSort] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await handleGetAllProducts({
        category: activePet === "all" ? undefined : activePet,
        productCategory,
        size: 24,
      });
      if (res.success && res.products) {
        setProducts(res.products as Product[]);
      }
    } finally {
      setLoading(false);
    }
  }, [activePet, productCategory]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Client-side sort + search
  const displayed = [...products]
    .filter((p) =>
      search.trim()
        ? p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating") return b.averageRating - a.averageRating;
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#f7f5f2]">

      {/* ── Hero ── */}
      <div className={`relative bg-gradient-to-br ${hero.bg} overflow-hidden`}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 70% 50%, white 0%, transparent 60%)" }}
        />
        <div className="relative max-w-6xl mx-auto px-5 py-12 flex items-end justify-between gap-6">
          <div className="space-y-3 max-w-lg">
            <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-white/60 border border-white/20 rounded-full px-3 py-1">
              {hero.badge}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight whitespace-pre-line">
              {hero.headline}
            </h1>
            <p className="text-sm text-white/60 leading-relaxed max-w-sm">{hero.sub}</p>
            <button className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-5 py-2.5 transition-colors">
              Explore {categoryLabel}
            </button>
          </div>

          {/* Breadcrumb pill */}
          <div className="hidden md:flex items-center gap-2 text-xs text-white/40 self-start mt-2">
            <Link href="/" className="hover:text-white/70">Home</Link>
            <span>/</span>
            <Link href={`/user/category/${petSlug}`} className="hover:text-white/70 capitalize">{petLabel}</Link>
            <span>/</span>
            <span className="text-white/80 capitalize">{categoryLabel}</span>
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4 flex-wrap">

          {/* Pet type tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {PET_FILTERS.map((f) => (
              <button
                key={f.slug}
                onClick={() => setActivePet(f.slug)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  activePet === f.slug
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "border-gray-200 text-gray-500 hover:border-gray-400"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Right: search + sort */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-8 pr-8 h-8 text-xs rounded-full border border-gray-200 bg-gray-50 outline-none focus:border-emerald-400 w-40"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <X className="h-3 w-3 text-gray-400" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setShowSort((s) => !s)}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-full px-3 h-8 hover:border-gray-400 transition-colors"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Sort: {SORT_OPTIONS.find((o) => o.value === sort)?.label}
                <ChevronDown className="h-3 w-3" />
              </button>
              {showSort && (
                <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-30">
                  {SORT_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => { setSort(o.value); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 transition-colors ${sort === o.value ? "font-semibold text-emerald-700 bg-emerald-50" : "text-gray-600"}`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Product grid ── */}
      <div className="max-w-6xl mx-auto px-5 py-8">

        {/* Count */}
        {!loading && (
          <p className="text-xs text-gray-400 mb-5">
            {displayed.length} product{displayed.length !== 1 ? "s" : ""} in{" "}
            <span className="font-semibold text-gray-600">{categoryLabel}</span>
            {activePet !== "all" && (
              <> for <span className="font-semibold text-gray-600">{PET_LABELS[activePet]}</span></>
            )}
          </p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
            : displayed.length > 0
              ? displayed.map((p) => <ProductCard key={p._id} product={p} />)
              : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-gray-400 text-sm">No products found.</p>
                  {search && (
                    <button onClick={() => setSearch("")} className="mt-3 text-xs text-emerald-600 underline">
                      Clear search
                    </button>
                  )}
                </div>
              )
          }
        </div>
      </div>
    </div>
  );
}