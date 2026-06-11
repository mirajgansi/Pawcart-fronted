"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { PET_CATEGORIES } from "@/lib/categories";

export default function Nav({
  onNavigate,
  isMobile = false,
}: {
  onNavigate?: () => void;
  isMobile?: boolean;
}) {
  const pathname = usePathname();

  const linkBase = isMobile
    ? "px-3 py-2 rounded-lg transition"
    : "text-sm font-medium transition";

  const getStyle = (href: string) => ({
    color: pathname === href ? "var(--interactive-primary)" : "var(--text-primary)",
    borderBottom: (!isMobile && pathname === href)
      ? "2px solid var(--interactive-primary)"
      : "2px solid transparent",
    paddingBottom: !isMobile ? "2px" : undefined,
  });

  return (
    <div className={isMobile ? "flex flex-col gap-2" : "hidden md:flex items-center gap-8"}>
      <Link
        href="/user/dashboard"
        onClick={onNavigate}
        className={linkBase}
        style={getStyle("/user/dashboard")}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--interactive-primary)")}
        onMouseLeave={e => (e.currentTarget.style.color = getStyle("/user/dashboard").color)}
      >
        Home
      </Link>

      <Link
        href="/user/trending"
        onClick={onNavigate}
        className={linkBase}
        style={getStyle("/user/trending")}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--interactive-primary)")}
        onMouseLeave={e => (e.currentTarget.style.color = getStyle("/user/trending").color)}
      >
        Trending
      </Link>
 <Link
        href="/user/grooming-kits"
        onClick={onNavigate}
        className={linkBase}
        style={getStyle("/user/grooming-kits")}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--interactive-primary)")}
        onMouseLeave={e => (e.currentTarget.style.color = getStyle("/user/grooming-kits").color)}
      >
        Grooming kits
      </Link>
    </div>
  );
}