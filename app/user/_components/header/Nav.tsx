"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PET_CATEGORIES } from "@/lib/categories";

export default function Nav({
  onNavigate,
  isMobile = false,
}: {
  onNavigate?: () => void;
  isMobile?: boolean;
}) {
  const linkBase = isMobile
    ? "px-3 py-2 rounded-lg transition"
    : "text-sm font-medium transition";

  return (
    <div className={isMobile ? "flex flex-col gap-2" : "hidden md:flex items-center gap-8"}>

      <Link
        href="/user/dashboard"
        onClick={onNavigate}
        className={linkBase}
        style={{ color: "var(--text-primary)" }}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--interactive-primary)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-primary)")}
      >
        Home
      </Link>

      <Link
        href="/user/orders"
        onClick={onNavigate}
        className={linkBase}
        style={{ color: "var(--text-primary)" }}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--interactive-primary)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-primary)")}
      >
        Shop 
      </Link>
       <Link
        href="/user/orders"
        onClick={onNavigate}
        className={linkBase}
        style={{ color: "var(--text-primary)" }}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--interactive-primary)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--text-primary)")}
      >
    Trending now
      </Link>
      

      {/* Desktop dropdown */}
      {!isMobile && (
        <div className="relative group">
          <button
            className="flex items-center gap-1 text-sm font-medium transition"
            style={{ color: "var(--text-primary)" }}
          >
            Grooming Kits <ChevronDown size={16} />
          </button>

          <div
            className="absolute left-0 top-full mt-2 w-56 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition z-50"
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
            }}
          >
            {PET_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/user/category/${c.slug}`}
                className="block px-4 py-2 rounded-lg text-sm transition"
                style={{ color: "var(--text-primary)" }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = "var(--color-primary-50)";
                  e.currentTarget.style.color = "var(--interactive-primary)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--text-primary)";
                }}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile categories list */}
      {isMobile && (
        <div className="mt-3">
          <p
            className="px-3 text-xs font-semibold tracking-widest"
            style={{ color: "var(--text-secondary)" }}
          >
            GROOMING KITS
          </p>
          <div className="mt-2 flex flex-col gap-1">
            {PET_CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/user/category/${c.slug}`}
                onClick={onNavigate}
                className="px-3 py-2 rounded-lg text-sm transition"
                style={{ color: "var(--text-primary)" }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = "var(--color-primary-50)";
                  e.currentTarget.style.color = "var(--interactive-primary)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--text-primary)";
                }}
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}