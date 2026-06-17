"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { handleGetAllProducts } from "@/lib/actions/product-action";

type SearchResult = {
  _id: string;
  name: string;
  category?: string;
  productCategory?: string;
  price: number;
  image?: string;
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setOpen(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await handleGetAllProducts({
          search: query,
          page: 1,
          size: 5,
        });

        if (res.success) {
          setResults((res.products as SearchResult[]) ?? []);
        } else {
          setResults([]);
        }
        setOpen(true);
      } catch {
        setResults([]);
        setOpen(true);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelect = (id: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/user/products/${id}`);
  };

  const handleViewAll = () => {
    setOpen(false);
    router.push(`/user/search?q=${encodeURIComponent(query)}`);

  };

  return (
<div ref={ref} className="relative hidden md:block">
      {/* Input */}
      <div
        className="flex items-center gap-2 px-3 h-9 rounded-lg border transition"
        style={{
  borderColor: open ? "var(--interactive-primary)" : "var(--border-default)",
}}
      >
        <Search size={15} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
          placeholder="Search products..."
          className="flex-1 bg-transparent text-sm outline-none"
          style={{ color: "var(--text-primary)" }}
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults([]); setOpen(false); }}>
            <X size={13} style={{ color: "var(--text-secondary)" }} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-full mt-2 w-80 rounded-xl overflow-hidden z-50"
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-default)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header */}
          <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--border-default)" }}>
            <span className="text-xs font-semibold tracking-widest" style={{ color: "var(--text-secondary)" }}>
              MATCHING PRODUCTS
            </span>
          </div>

          {loading && (
            <div className="px-4 py-6 text-sm text-center" style={{ color: "var(--text-secondary)" }}>
              Searching...
            </div>
          )}

          {!loading && results.length === 0 && query && (
            <div className="px-4 py-6 text-sm text-center" style={{ color: "var(--text-secondary)" }}>
              No results for "{query}"
            </div>
          )}

          {!loading && results.map((item) => (
            <button
              key={item._id}
              onClick={() => handleSelect(item._id)}
              className="w-full flex items-center gap-3 px-4 py-3 transition text-left"
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-primary-50)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              {/* Thumbnail */}
              <div
                className="w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden"
                style={{ backgroundColor: "var(--color-primary-50)" }}
              >
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                  {highlightMatch(item.name, query)}
                </p>
                {(item.category || item.productCategory) && (
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    {[item.category, item.productCategory].filter(Boolean).join(" • ")}
                  </p>
                )}
                <p className="text-sm font-semibold mt-1" style={{ color: "var(--interactive-primary)" }}>
                  ${Number(item.price).toFixed(2)}
                </p>
              </div>
            </button>
          ))}

          {/* Footer */}
          {!loading && results.length > 0 && (
            <button
              onClick={handleViewAll}
              className="w-full py-3 text-sm font-medium border-t transition"
              style={{
                color: "var(--interactive-primary)",
                borderColor: "var(--border-default)",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-primary-50)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              View all results for "{query}"
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function highlightMatch(text: string, query: string) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: "var(--interactive-primary)", fontWeight: 600 }}>
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}