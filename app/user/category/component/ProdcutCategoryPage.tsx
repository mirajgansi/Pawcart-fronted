"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, ChevronDown, Search, X } from "lucide-react";
import { toast } from "react-toastify";
import { handleGetAllProducts, handleToggleFavoriteProduct } from "@/lib/actions/product-action";
import ProductCard from "../../_components/Productcard";

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
  unit?: string;
  
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

const HERO_CONFIG: Record<string, {
  headline: string;
  sub: string;
  badge: string;
  image: string;   // background image path (put in /public/heroes/)
}> = {
  food:          { headline: "Nutrition Tailored\nfor Longevity",    sub: "Scientifically formulated ingredients to keep your companion vibrant & healthy.", badge: "Premium Nutrition",    image: "/food.png" },
  accessories:   { headline: "Style Meets\nFunction",                sub: "From collars to carriers — gear that looks good and works harder.",               badge: "Top Accessories",      image: "/accessories.png" },
  toys:          { headline: "Playtime\nElevated",                   sub: "Stimulating toys designed to engage, reward, and bond.",                          badge: "Enrichment Picks",     image: "/pet_toys.png" },
  housing:       { headline: "Comfort\nThey'll Love",                sub: "Beds, crates, and habitats built for rest and security.",                         badge: "Home Essentials",      image: "/cat_house.png" },
  grooming:      { headline: "Groom With\nConfidence",               sub: "Gentle formulas and professional-grade tools for every coat type.",               badge: "Grooming Essentials",  image: "/grooming.png" },
  "health-care": { headline: "Wellness\nFirst",                      sub: "Supplements, treatments and daily care for a longer, happier life.",              badge: "Health & Wellness",    image: "/health-care.png" },
};

const SORT_OPTIONS = [
  { value: "featured",   label: "Featured" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating",     label: "Top Rated" },
  { value: "newest",     label: "Newest" },
];

const PET_FILTERS = [
  { slug: "all",        label: "All Types" },
  { slug: "dogs",       label: "Dog" },
  { slug: "cats",       label: "Cat" },
  { slug: "birds",      label: "Bird" },
  { slug: "fish",       label: "Fish" },
  { slug: "rabbits",    label: "Rabbit" },
  { slug: "small-pets", label: "Small Pet" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildImageUrl(image?: string) {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return `${base}/${image.replace(/^\/+/, "")}`;
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

export default function ProductCategoryPage({ petSlug, productCategory }: { petSlug: string; productCategory: string }) {
  const params = useParams();
  
  const hero          = HERO_CONFIG[productCategory] ?? HERO_CONFIG["food"];
 const categoryLabel = PRODUCT_LABELS[productCategory] ?? productCategory;

  const [products,  setProducts]  = useState<Product[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [activePet, setActivePet] = useState(petSlug ?? "all");
  const [sort,      setSort]      = useState("featured");
  const [search,    setSearch]    = useState("");
  const [showSort,  setShowSort]  = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

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

  // ── Wishlist toggle ──────────────────────────────────────────────────────────
  const handleToggleWishlist = async (productId: string) => {
    const wasOn = !!favorites[productId];
    setFavorites((prev) => ({ ...prev, [productId]: !wasOn }));
    try {
      await handleToggleFavoriteProduct(productId);
      toast.success(wasOn ? "Removed from wishlist" : "Added to wishlist");
    } catch {
      setFavorites((prev) => ({ ...prev, [productId]: wasOn }));
      toast.error("Failed to update wishlist");
    }
  };

  // ── Add to cart ──────────────────────────────────────────────────────────────
  const handleAddToCart = (_productId: string) => {
    toast.success("Added to cart");
  };

  // ── Client-side sort + search ────────────────────────────────────────────────
  const displayed = [...products]
    .filter((p) =>
      search.trim()
        ? p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .sort((a, b) => {
      if (sort === "price-asc")  return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "rating")     return b.averageRating - a.averageRating;
      return 0;
    });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-page)" }}>

      {/* ── Hero ── */}
      <div
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url(${hero.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "280px",
        }}
      >
        {/* Light gradient overlay — just enough contrast for text, photo stays visible */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(127,29,29,0.55) 0%, rgba(166,30,30,0.35) 50%, rgba(92,17,17,0.15) 100%)",
          }}
        />

        {/* Subtle radial shine */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 75% 40%, #f29e9e 0%, transparent 60%)",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-5 py-14 flex items-end justify-between gap-6">
          <div className="space-y-3 max-w-lg">
            {/* Badge */}
            <span
              className="inline-block text-[11px] font-bold uppercase tracking-widest rounded-full px-3 py-1 border"
              style={{
                color: "#f9c5c5",
                borderColor: "rgba(249,197,197,0.35)",
                backgroundColor: "rgba(249,197,197,0.10)",
              }}
            >
              {hero.badge}
            </span>

            {/* Headline */}
            <h1
              className="text-3xl md:text-4xl font-extrabold leading-tight whitespace-pre-line text-white"
              style={{ textShadow: "0 2px 12px rgba(0,0,0,0.45)" }}
            >
              {hero.headline}
            </h1>

            {/* Sub */}
            <p
              className="text-sm leading-relaxed max-w-sm"
              style={{ color: "#fdeaea", textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
            >
              {hero.sub}
            </p>

            {/* CTA */}
            <button
              className="mt-2 inline-flex items-center gap-2 rounded-full text-sm font-semibold px-5 py-2.5 transition-colors border"
              style={{
                backgroundColor: "rgba(249,197,197,0.15)",
                borderColor: "rgba(249,197,197,0.35)",
                color: "#ffffff",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(249,197,197,0.28)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(249,197,197,0.15)")
              }
            >
              Explore {categoryLabel}
            </button>
          </div>

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center gap-2 text-xs self-start mt-2" style={{ color: "#f29e9e99" }}>
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                 
            <span>/</span>
            <span className="capitalize" style={{ color: "#f9c5c5" }}>{categoryLabel}</span>
          </div>
        </div>
      </div>

      {/* ── Filter bar ── */}
      <div
        className="sticky top-0 z-20 border-b shadow-sm backdrop-blur"
        style={{
          backgroundColor: "rgba(254,242,242,0.90)",
          borderColor: "var(--border-default)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4 flex-wrap">

          {/* Pet type tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {PET_FILTERS.map((f) => (
              <button
                key={f.slug}
                onClick={() => setActivePet(f.slug)}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
                style={
                  activePet === f.slug
                    ? {
                        backgroundColor: "var(--interactive-primary)",
                        borderColor: "var(--interactive-primary)",
                        color: "#ffffff",
                      }
                    : {
                        backgroundColor: "transparent",
                        borderColor: "var(--border-default)",
                        color: "var(--text-secondary)",
                      }
                }
                onMouseEnter={(e) => {
                  if (activePet !== f.slug) {
                    e.currentTarget.style.borderColor = "var(--interactive-primary)";
                    e.currentTarget.style.color = "var(--interactive-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activePet !== f.slug) {
                    e.currentTarget.style.borderColor = "var(--border-default)";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Right: search + sort */}
          <div className="flex items-center gap-2">

            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5"
                style={{ color: "var(--text-secondary)" }}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-8 pr-8 h-8 text-xs rounded-full outline-none w-40 border"
                style={{
                  backgroundColor: "#fff",
                  borderColor: "var(--border-default)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = "var(--focus-ring)")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border-default)")
                }
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  <X className="h-3 w-3" style={{ color: "var(--text-secondary)" }} />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setShowSort((s) => !s)}
                className="flex items-center gap-1.5 text-xs font-medium rounded-full px-3 h-8 transition-colors border"
                style={{
                  borderColor: "var(--border-default)",
                  color: "var(--text-secondary)",
                  backgroundColor: "#fff",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--interactive-primary)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border-default)")
                }
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Sort: {SORT_OPTIONS.find((o) => o.value === sort)?.label}
                <ChevronDown className="h-3 w-3" />
              </button>

              {showSort && (
                <div
                  className="absolute right-0 top-10 w-44 rounded-xl shadow-lg border overflow-hidden z-30"
                  style={{
                    backgroundColor: "#fff",
                    borderColor: "var(--border-default)",
                  }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <button
                      key={o.value}
                      onClick={() => { setSort(o.value); setShowSort(false); }}
                      className="w-full text-left px-4 py-2.5 text-xs transition-colors"
                      style={
                        sort === o.value
                          ? {
                              fontWeight: 600,
                              color: "var(--interactive-primary)",
                              backgroundColor: "var(--color-tertiary)",
                            }
                          : { color: "var(--text-secondary)" }
                      }
                      onMouseEnter={(e) => {
                        if (sort !== o.value)
                          e.currentTarget.style.backgroundColor = "#fef2f2";
                      }}
                      onMouseLeave={(e) => {
                        if (sort !== o.value)
                          e.currentTarget.style.backgroundColor = "transparent";
                      }}
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
          <p className="text-xs mb-5" style={{ color: "var(--text-secondary)" }}>
            {displayed.length} product{displayed.length !== 1 ? "s" : ""} in{" "}
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
              {categoryLabel}
            </span>
            {activePet !== "all" && (
              <>
                {" "}for{" "}
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  {PET_LABELS[activePet]}
                </span>
              </>
            )}
          </p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
            : displayed.length > 0
              ? displayed.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={{
                      _id: p._id,
                      name: p.name,
                      price: Number(p.price),
                      image: buildImageUrl(p.image),
                      unit: p.unit ?? "",
                      inStock: Number(p.inStock ?? 0),
                      productCategory: categoryLabel,
                    }}
                    isFavorite={!!favorites[p._id]}
                    onToggleWishlist={() => handleToggleWishlist(p._id)}
                    onAddToCart={() => handleAddToCart(p._id)}
                  />
                ))
              : (
                <div className="col-span-full py-20 text-center">
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    No products found.
                  </p>
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="mt-3 text-xs underline transition-colors"
                      style={{ color: "var(--interactive-primary)" }}
                    >
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