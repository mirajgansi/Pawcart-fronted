"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import ProductCard, { ProductCardProduct } from "../../_components/Productcard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SortOption = {
  label: string;
  value: string;
};

export type FetchProductsParams = {
  page: number;
  sort?: string;
};

export type FetchProductsResult = {
  products: ProductCardProduct[];
  total: number;
  pageSize: number;
};

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type ProductResultsViewProps = {
  /** Fetches products for the given page/sort. Wire this to your API route per use case. */
  fetcher: (params: FetchProductsParams) => Promise<FetchProductsResult>;

  /**
   * Builds the H1 from the result count, e.g.:
   *   (count) => `Showing ${count} results for 'Leather'`
   *   (count) => `${count} Best Sellers`
   */
  resultsLabel: (count: number) => string;
  /** Small line under the title, e.g. "Premium handcrafted accessories and essentials" */
  subtitle?: string;
  breadcrumb?: BreadcrumbItem[];

  sortOptions?: SortOption[];
  defaultSort?: string;
  /** Hide the sort dropdown entirely (e.g. backend doesn't support sort yet) */
  showSort?: boolean;

  /** Called with the toggled product id when the wishlist heart is clicked */
  onToggleWishlist?: (productId: string) => Promise<void> | void;
  /** Called with the added product id when "add to cart" is clicked */
  onAddToCart?: (productId: string) => Promise<void> | void;
  /** ids currently favorited, so hearts render correctly on load */
  favoriteIds?: string[];

  columns?: 3 | 4;
  emptyStateMessage?: string;
};

const DEFAULT_SORT_OPTIONS: SortOption[] = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest", value: "newest" },
  { label: "Best Selling", value: "best_selling" },
];

// ─── Skeletons ────────────────────────────────────────────────────────────────

function CardSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden animate-pulse"
      style={{ backgroundColor: "var(--bg-surface)", border: "1px solid var(--border-default)" }}
    >
      <div className="aspect-square" style={{ backgroundColor: "var(--color-tertiary)" }} />
      <div className="p-4 space-y-2">
        <div className="h-2.5 w-16 rounded" style={{ backgroundColor: "var(--color-tertiary)" }} />
        <div className="h-4 w-4/5 rounded" style={{ backgroundColor: "var(--color-tertiary)" }} />
        <div className="h-3 w-1/2 rounded" style={{ backgroundColor: "var(--color-tertiary)" }} />
      </div>
    </div>
  );
}

/** Faint placeholder for cells that have no product — keeps the grid shape on partial last pages */
function EmptyCell() {
  return (
    <div
      className="rounded-2xl aspect-[3/4]"
      style={{ backgroundColor: "var(--color-tertiary)", opacity: 0.4 }}
    />
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function buildPageList(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([1, total, current]);
  if (current - 1 > 1) pages.add(current - 1);
  if (current + 1 < total) pages.add(current + 1);

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("ellipsis");
    result.push(sorted[i]);
  }
  return result;
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = buildPageList(page, totalPages);

  return (
    <div className="flex items-center justify-center gap-1.5 pt-8">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:opacity-40"
        style={{ color: "var(--text-secondary)" }}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`e-${i}`} className="px-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors"
            style={
              p === page
                ? { backgroundColor: "var(--color-primary-700)", color: "var(--interactive-primary-text)" }
                : { color: "var(--text-primary)" }
            }
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:opacity-40"
        style={{ color: "var(--text-secondary)" }}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Sort dropdown ────────────────────────────────────────────────────────────

function SortDropdown({
  options,
  value,
  onChange,
}: {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const current = options.find((o) => o.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2 rounded-full px-3 py-1.5 h-auto text-sm"
          style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}
        >
          <span style={{ color: "var(--text-secondary)" }}>Sort by:</span>
          <span className="font-medium">{current?.label}</span>
          <ChevronDown className="h-3.5 w-3.5" style={{ color: "var(--text-secondary)" }} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            onSelect={() => onChange(opt.value)}
            style={opt.value === value ? { color: "var(--interactive-primary)", fontWeight: 600 } : {}}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

const PAGE_SIZE_FALLBACK = 8;

export default function ProductResultsView({
  fetcher,
  resultsLabel,
  subtitle,
  breadcrumb,
  sortOptions = DEFAULT_SORT_OPTIONS,
  defaultSort = DEFAULT_SORT_OPTIONS[0].value,
  showSort = true,
  onToggleWishlist,
  onAddToCart,
  favoriteIds = [],
  columns = 4,
  emptyStateMessage = "No products found.",
}: ProductResultsViewProps) {
  const [products, setProducts] = useState<ProductCardProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_FALLBACK);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState(defaultSort);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Record<string, boolean>>(
    Object.fromEntries(favoriteIds.map((id) => [id, true]))
  );

  const load = useCallback(async (p: number, s?: string) => {
    setLoading(true);
    try {
      const res = await fetcher({ page: p, sort: s });
      setProducts(res.products);
      setTotal(res.total);
      setPageSize(res.pageSize || PAGE_SIZE_FALLBACK);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [fetcher]);

  useEffect(() => {
    load(page, sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort]);

  const handleSortChange = (value: string) => {
    setSort(value);
    setPage(1);
  };

  const handleToggleWishlist = async (productId: string) => {
    const wasOn = !!favorites[productId];
    setFavorites((prev) => ({ ...prev, [productId]: !wasOn }));
    try {
      await onToggleWishlist?.(productId);
      toast.success(wasOn ? "Removed from wishlist" : "Added to wishlist");
    } catch {
      setFavorites((prev) => ({ ...prev, [productId]: wasOn }));
      toast.error("Failed to update wishlist");
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await onAddToCart?.(productId);
      toast.success("Added to cart");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const gridColsClass = columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-4";

  // Pad the last row with empty cells so a partial row keeps the grid's shape
  const fillerCount = !loading && products.length > 0
    ? (columns - (products.length % columns)) % columns
    : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="max-w-6xl mx-auto px-5 py-8">

        {/* ── Breadcrumb ── */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs mb-4" style={{ color: "var(--text-secondary)" }}>
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                {item.href ? (
                  <Link href={item.href} className="hover:underline">
                    {item.label}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* ── Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
          <div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-brand)" }}>
              {loading ? "Searching…" : resultsLabel(total)}
            </h1>
            {subtitle && (
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {subtitle}
              </p>
            )}
          </div>

          {showSort && (
            <SortDropdown options={sortOptions} value={sort} onChange={handleSortChange} />
          )}
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className={`grid grid-cols-2 ${gridColsClass} gap-4`}>
            {Array.from({ length: columns * 2 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className={`grid grid-cols-2 ${gridColsClass} gap-4`}>
              {products.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  isFavorite={!!favorites[p._id]}
                  onToggleWishlist={() => handleToggleWishlist(p._id)}
                  onAddToCart={() => handleAddToCart(p._id)}
                />
              ))}
              {Array.from({ length: fillerCount }).map((_, i) => <EmptyCell key={`fill-${i}`} />)}
            </div>

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        ) : (
          <p className="text-sm py-12 text-center" style={{ color: "var(--text-secondary)" }}>
            {emptyStateMessage}
          </p>
        )}
      </div>
    </div>
  );
}