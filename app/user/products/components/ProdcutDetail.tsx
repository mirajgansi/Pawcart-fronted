"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Heart,
  Minus,
  Plus,
  BadgePercent,
  BadgeX,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { handleAddCartItem } from "@/lib/actions/cart-action";
import { handleCreateOrder } from "@/lib/actions/order-action";
import { handleIncrementProductView } from "@/lib/actions/product-action";
import {
  handleToggleFavoriteProduct,
  handleRateProduct,
  handleAddProductComment,
} from "@/lib/actions/product-action";

// ─── Types ────────────────────────────────────────────────────────────────────

type AttributeBlock = {
  pattern?: string;
  colors?: string[];
  material?: string;
  size?: string;
  skinType?: string;
  coatType?: string;
  scent?: string;
  volume?: string;
  isHypoallergenic?: boolean;
  nutritionalInfo?: string;
  manufactureDate?: string | null;
  expireDate?: string | null;
};

type Product = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  images?: string[];
  price: number;
  category?: string[]; // pet categories — array, e.g. ["dogs", "cats"]
  productCategory?: string; // "food" | "accessories" | "toys" | "grooming" | "housing" | "health-care"
  inStock?: number;
  unit?: string;
  viewCount?: number;
  manufacturer?: string;
  averageRating?: number;
  reviewCount?: number;
  isFavorite?: boolean;

  foodAttributes?: AttributeBlock | null;
  accessoryAttributes?: AttributeBlock | null;
  toyAttributes?: AttributeBlock | null;
  groomingAttributes?: AttributeBlock | null;
  genericAttributes?: AttributeBlock | null;
};

type Comment = {
  _id: string;
  comment: string;
  userId?: string;
  username?: string;
  createdAt?: string;
};

// ─── Category label map (for breadcrumb) ───────────────────────────────────────

const PRODUCT_CATEGORY_LABELS: Record<string, string> = {
  food: "Food",
  accessories: "Accessories",
  toys: "Toys",
  grooming: "Grooming",
  housing: "Housing",
  "health-care": "Health Care",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function getActiveAttributes(product: Product): AttributeBlock | null {
  switch (product.productCategory) {
    case "food":
      return product.foodAttributes ?? null;
    case "accessories":
      return product.accessoryAttributes ?? null;
    case "toys":
      return product.toyAttributes ?? null;
    case "grooming":
      return product.groomingAttributes ?? null;
    default:
      return product.genericAttributes ?? null;
  }
}

// ─── Stars ────────────────────────────────────────────────────────────────────

function Stars({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={disabled}
          onClick={() => onChange(s)}
          className={`text-base leading-none transition ${
            disabled ? "cursor-not-allowed opacity-60" : "hover:scale-105"
          }`}
          style={{ color: s <= value ? "#f59e0b" : "#d1d5db" }}
          aria-label={`Rate ${s} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function Breadcrumb({ category }: { category: string }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
      <Link href="/" className="hover:underline">Home</Link>
      <ChevronRight className="h-3 w-3" />
      <Link href="/user/products" className="hover:underline">Shop</Link>
      <ChevronRight className="h-3 w-3" />
      <span className="font-semibold" style={{ color: "var(--text-brand)" }}>{category}</span>
    </nav>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────

function AccordionSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b last:border-0" style={{ borderColor: "var(--border-default)" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3.5 text-sm font-semibold transition-colors"
        style={{ color: "var(--text-brand)" }}
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-4 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {children}
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 py-1">
      <span style={{ color: "var(--text-secondary)" }}>{label}</span>
      <span className="text-right font-medium" style={{ color: "var(--text-primary)" }}>
        {value || "—"}
      </span>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ProductDetailClient({
  product,
  images,
}: {
  product: Product;
  images: string[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!product?._id) return;
    handleIncrementProductView(product._id);
  }, [product?._id]);

  const inStock = product.inStock ?? 0;
  const outOfStock = inStock <= 0;

  const safeImages = images?.length ? images : ["/cookie.jpg"];
  const [activeImage, setActiveImage] = useState(safeImages[0]);

  const [quantity, setQuantity] = useState(1);

  const [expanded, setExpanded] = useState(false);
  const DESCRIPTION_LIMIT = 160;
  const fullDescription = product.description || "No description available.";
  const isLong = fullDescription.length > DESCRIPTION_LIMIT;
  const shortDescription = isLong
    ? fullDescription.slice(0, DESCRIPTION_LIMIT) + "..."
    : fullDescription;

  const totalPrice = useMemo(() => {
    const base = Number(product.price || 0);
    return (base * quantity).toFixed(2);
  }, [product.price, quantity]);

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const [isFav, setIsFav] = useState<boolean>(!!product.isFavorite);
  useEffect(() => {
    setIsFav(!!product.isFavorite);
  }, [product.isFavorite]);

  const initialAvg = Number(product.averageRating ?? 0);
  const [avgRating, setAvgRating] = useState(Number.isFinite(initialAvg) ? initialAvg : 0);
  const [ratingCount, setRatingCount] = useState<number>(Number(product.reviewCount ?? 0) || 0);
  const [myRating, setMyRating] = useState<number>(0);

  
  const onToggleFav = () => {
    startTransition(async () => {
      const prev = isFav;
      setIsFav(!prev);
      try {
        const res = await handleToggleFavoriteProduct(product._id);
        if (!res?.success) {
          setIsFav(prev);
          toast.error(res?.message || "Failed to toggle favorite");
          return;
        }
        toast.success(!prev ? "Added to favorites" : "Removed from favorites");
        router.refresh();
      } catch (e: any) {
        setIsFav(prev);
        toast.error(e?.message || "Failed to toggle favorite");
      }
    });
  };

  const onRate = (rating: number) => {
    startTransition(async () => {
      setMyRating(rating);
      try {
        const res = await handleRateProduct(product._id, { rating });
        if (!res?.success) {
          toast.error(res?.message || "Failed to rate");
          return;
        }
        const nextAvg = Number(res?.data?.averageRating ?? NaN);
        const nextCount = Number(res?.data?.reviewCount ?? NaN);
        if (Number.isFinite(nextAvg)) setAvgRating(nextAvg);
        if (Number.isFinite(nextCount)) setRatingCount(nextCount);
        toast.success("Thanks for rating!");
        router.refresh();
      } catch (e: any) {
        toast.error(e?.message || "Failed to rate");
      }
    });
  };



  const onAddToCart = () => {
    if (outOfStock) return;
    startTransition(async () => {
      try {
        const res = await handleAddCartItem({ productId: product._id, quantity } as any);
        if (res?.success) {
          toast.success("Added to cart!");
          router.refresh();
        } else {
          toast.error(res?.message || "Failed to add to cart");
        }
      } catch (e: any) {
        toast.error(e?.message || "Failed to add to cart");
      }
    });
  };

  const onShopNow = () => {
    if (outOfStock) return;
    startTransition(async () => {
      try {
        const res = await handleCreateOrder({ items: [{ productId: product._id, quantity }] } as any);
        if (res?.success) {
          toast.success("Order created!");
          router.refresh();
        } else {
          toast.error(res?.message || "Failed to create order");
        }
      } catch (e: any) {
        toast.error(e?.message || "Failed to create order");
      }
    });
  };

  // ── Category-driven accordion content ─────────────────────────────────────
  const categoryLabel =
    PRODUCT_CATEGORY_LABELS[product.productCategory ?? ""] ??
    (Array.isArray(product.category) ? product.category.join(", ") : product.category) ??
    "Product";

  const attrs = getActiveAttributes(product);
  const hasExpiryInfo = !!(attrs?.manufactureDate || attrs?.expireDate);

  return (
    <div className="space-y-5">
      <Breadcrumb category={categoryLabel} />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* LEFT: Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl" style={{ backgroundColor: "var(--color-tertiary)" }}>
            <Image
              src={activeImage}
              alt={product.name}
              fill
              className="object-contain p-4"
              unoptimized
              priority
            />

            <button
              type="button"
              onClick={onToggleFav}
              disabled={pending}
              aria-label="Toggle favorite"
              className="absolute top-3 right-3 rounded-full p-2 shadow-sm"
              style={{ backgroundColor: "var(--bg-surface)" }}
            >
              <Heart
                className="h-4 w-4"
                style={
                  isFav
                    ? { fill: "var(--color-primary-500)", color: "var(--color-primary-500)" }
                    : { fill: "none", color: "var(--color-primary-300)" }
                }
              />
            </button>
          </div>

          <div className="flex gap-2">
            {safeImages.slice(0, 4).map((img, idx) => {
              const isActive = img === activeImage;
              return (
                <button
                  key={`${img}-${idx}`}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className="h-16 w-16 rounded-xl border bg-white p-1.5 shadow-sm transition"
                  style={
                    isActive
                      ? { borderColor: "var(--color-primary-500)" }
                      : { borderColor: "var(--border-default)" }
                  }
                >
                  <div className="relative h-full w-full">
                    <Image src={img} alt="thumb" fill className="object-contain" unoptimized />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Details */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold leading-snug" style={{ color: "var(--text-primary)" }}>
              {product.name}
            </h1>

            <div className="mt-1.5 flex items-center gap-2">
              <Stars value={myRating || Math.round(avgRating)} onChange={onRate} disabled={pending} />
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {ratingCount} Verified Review{ratingCount !== 1 ? "s" : ""}
              </span>
            </div>

            <p className="mt-2 text-xl font-bold" style={{ color: "var(--text-brand)" }}>
              ${Number(product.price).toFixed(2)}
              <span className="ml-1 text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                /{product.unit ?? "per kg"}
              </span>
            </p>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {expanded ? fullDescription : shortDescription}
            {isLong && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="ml-1.5 font-semibold hover:underline"
                style={{ color: "var(--text-brand)" }}
              >
                {expanded ? "Read less" : "Read more"}
              </button>
            )}
          </p>

          {/* Quantity + stock */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border px-1 py-1" style={{ borderColor: "var(--border-default)" }}>
              <button
                type="button"
                onClick={() => setQuantity((q) => clamp(q - 1, 1, 999))}
                className="rounded-full p-1.5 transition-colors"
                style={{ backgroundColor: "var(--color-tertiary)" }}
              >
                <Minus className="h-3.5 w-3.5" style={{ color: "var(--color-primary-700)" }} />
              </button>

              <input
                type="number"
                min={1}
                max={999}
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setQuantity(1);
                    return;
                  }
                  const num = Number(value);
                  if (!Number.isFinite(num)) return;
                  setQuantity(clamp(Math.floor(num), 1, 999));
                }}
                className="no-spinner w-10 text-center text-sm font-semibold outline-none"
                style={{ color: "var(--text-primary)", backgroundColor: "transparent" }}
              />

              <button
                type="button"
                onClick={() => setQuantity((q) => clamp(q + 1, 1, 999))}
                className="rounded-full p-1.5 transition-colors"
                style={{ backgroundColor: "var(--color-primary-700)" }}
              >
                <Plus className="h-3.5 w-3.5" style={{ color: "var(--interactive-primary-text)" }} />
              </button>
            </div>

            {outOfStock ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: "var(--color-primary-400)" }}>
                <BadgeX className="h-4 w-4" /> Out of stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                <BadgePercent className="h-4 w-4" style={{ color: "var(--color-primary-500)" }} />
                In stock & ready to ship
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={onAddToCart}
              disabled={pending || outOfStock}
              className="flex-1 min-w-[140px] rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
              style={{ backgroundColor: "var(--color-primary-700)", color: "var(--interactive-primary-text)" }}
            >
              {pending ? "Working..." : "Add to Cart"}
            </button>

            <button
              type="button"
              onClick={onShopNow}
              disabled={pending || outOfStock}
              className="flex-1 min-w-[140px] rounded-xl border px-5 py-2.5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
              style={{ borderColor: "var(--color-primary-700)", color: "var(--color-primary-700)", backgroundColor: "var(--bg-surface)" }}
            >
              Buy Now
            </button>
          </div>

          {/* Accordion: category-aware details */}
          <div className="rounded-2xl border" style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
            <div className="px-4">
              {product.productCategory === "food" && attrs?.nutritionalInfo && (
                <AccordionSection title="Nutrition & Ingredients" defaultOpen>
                  <p>{attrs.nutritionalInfo}</p>
                </AccordionSection>
              )}

              {(product.productCategory === "accessories" || product.productCategory === "toys") && (
                <AccordionSection title="Product Attributes">
                  <DetailRow label="Pattern" value={attrs?.pattern} />
                  <DetailRow label="Material" value={attrs?.material} />
                  <DetailRow label="Size" value={attrs?.size} />
                  <DetailRow label="Colors" value={attrs?.colors?.join(", ")} />
                </AccordionSection>
              )}

              {product.productCategory === "grooming" && (
                <AccordionSection title="Formula Details">
                  <DetailRow label="Skin type" value={attrs?.skinType} />
                  <DetailRow label="Coat type" value={attrs?.coatType} />
                  <DetailRow label="Scent" value={attrs?.scent} />
                  <DetailRow label="Volume" value={attrs?.volume} />
                  <DetailRow label="Hypoallergenic" value={attrs?.isHypoallergenic ? "Yes" : "No"} />
                </AccordionSection>
              )}

              <AccordionSection title="Manufacturer Info">
                <DetailRow label="Manufacturer" value={product.manufacturer} />
                <DetailRow label="Category" value={categoryLabel} />
              </AccordionSection>

              {hasExpiryInfo && (
                <AccordionSection title="Expiry & Storage">
                  <DetailRow label="Manufacture date" value={formatDate(attrs?.manufactureDate)} />
                  <DetailRow label="Expiry date" value={formatDate(attrs?.expireDate)} />
                </AccordionSection>
              )}
            </div>
          </div>

         
        </div>
      </div>
    </div>
  );
}