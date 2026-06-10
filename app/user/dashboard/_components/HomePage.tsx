"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, BadgePercent, BadgeX, Search, ChevronRight, Star } from "lucide-react";

const NAV_LINKS = ["Home", "Shop", "Categories", "About", "Contact"];

const CATEGORIES = [
  { id: "1", name: "Dog Food", icon: "🐕", href: "/user/products?category=dog-food" },
  { id: "2", name: "Cat Food", icon: "🐈", href: "/user/products?category=cat-food" },
  { id: "3", name: "Grooming", icon: "✂️", href: "/user/products?category=grooming" },
  { id: "4", name: "Toys", icon: "🧸", href: "/user/products?category=toys" },
  { id: "5", name: "Accessories", icon: "🎀", href: "/user/products?category=accessories" },
  { id: "6", name: "Health", icon: "💊", href: "/user/products?category=health" },
];

const TRENDING = [
  { _id: "t1", name: "Organic Salmon Bites", price: 12.99, unit: "per pack", inStock: 24, image: "/cookie.jpg" },
  { _id: "t2", name: "Natural Cat Kibble", price: 8.49, unit: "per kg", inStock: 0, image: "/cookie.jpg" },
  { _id: "t3", name: "Dental Chew Sticks", price: 6.99, unit: "per bag", inStock: 15, image: "/cookie.jpg" },
  { _id: "t4", name: "Grain Free Formula", price: 18.00, unit: "per kg", inStock: 8, image: "/cookie.jpg" },
];

const NEW_ARRIVALS = [
  { _id: "n1", name: "Hypoallergenic Dog Shampoo", price: 9.99, unit: "per bottle", inStock: 30, image: "/cookie.jpg" },
  { _id: "n2", name: "Interactive Feather Toy", price: 4.50, unit: "each", inStock: 0, image: "/cookie.jpg" },
  { _id: "n3", name: "Stainless Bowl Set", price: 14.99, unit: "per set", inStock: 12, image: "/cookie.jpg" },
  { _id: "n4", name: "Calming Chews", price: 22.00, unit: "per jar", inStock: 6, image: "/cookie.jpg" },
];

const TESTIMONIALS = [
  { name: "Sarah M.", rating: 5, text: "My dogs absolutely love the treats from here. Fast delivery and great packaging!", avatar: "SM" },
  { name: "James K.", rating: 5, text: "Best pet store online. The grooming kit exceeded my expectations.", avatar: "JK" },
  { name: "Priya R.", rating: 4, text: "Wide selection and good prices. My cat is obsessed with the new kibble.", avatar: "PR" },
];

function MiniProductCard({
  id, image, name, price, unit = "per kg", inStock = 0, isFavorite = false,
  onAddToCart, onToggleWishlist,
}: {
  id: string; image: string; name: string; price: number; unit?: string;
  inStock?: number; isFavorite?: boolean;
  onAddToCart?: () => void; onToggleWishlist?: () => void;
}) {
  return (
    <div className="w-full bg-[var(--bg-surface)] rounded-2xl p-3 shadow-sm relative group border border-[var(--border-default)]">
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleWishlist?.(); }}
        className="absolute top-3 right-3 z-10 bg-[var(--bg-surface)] p-2 rounded-full shadow hover:scale-105 transition"
        aria-label="Toggle favorite"
      >
        <Heart className={`h-5 w-5 transition ${isFavorite ? "fill-[var(--color-primary-500)] text-[var(--color-primary-500)]" : "text-[var(--color-primary-300)] hover:text-[var(--color-primary-500)]"}`} />
      </button>

      <Link href={`/user/products/${id}`} className="block">
        <div className="bg-[var(--color-tertiary)] rounded-xl w-full relative overflow-hidden flex items-center justify-center h-28 sm:h-32">
          <Image src={image} alt={name} fill unoptimized className="object-contain p-2" sizes="25vw" />
        </div>

        {inStock <= 0 ? (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-50)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-primary-700)]">
            <BadgeX className="h-4 w-4" /> Out of stock
          </div>
        ) : (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[var(--color-primary-50)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-primary-600)]">
            <BadgePercent className="h-4 w-4" /> {inStock} in stock
          </div>
        )}

        <h3 className="mt-2 text-sm font-semibold text-[var(--text-primary)] line-clamp-2">{name}</h3>
      </Link>

      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-[var(--text-brand)] text-sm font-bold whitespace-nowrap">
          RS{price.toFixed(2)}
          <span className="text-[var(--text-secondary)] text-[11px] font-normal">/{unit}</span>
        </p>
        <button
          onClick={onAddToCart}
          disabled={inStock <= 0}
          className={`shrink-0 rounded-full p-2 shadow transition ${
            inStock <= 0
              ? "cursor-not-allowed bg-gray-200 text-gray-400"
              : "bg-[var(--interactive-primary)] text-[var(--interactive-primary-text)] hover:bg-[var(--interactive-primary-hover)]"
          }`}
          aria-label="Add to cart"
        >
          <ShoppingCart className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [cartCount, setCartCount] = useState(0);

  const toggleFav = (id: string) => setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  const addToCart = () => setCartCount((c) => c + 1);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] font-sans">

    

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <div className="bg-[var(--color-primary-50)] rounded-3xl overflow-hidden flex flex-col md:flex-row items-center min-h-[320px] md:min-h-[380px] relative border border-[var(--color-primary-100)]">
          <div className="flex-1 p-8 md:p-12 z-10">
            <span className="inline-block bg-[var(--color-primary-500)] text-white text-xs font-semibold rounded-full px-3 py-1 mb-4">
              🐾 New Collection
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight mb-4">
              Curated Compassion<br />
              <span className="text-[var(--text-brand)]">for Your Furry Family</span>
            </h1>
            <p className="text-[var(--text-secondary)] text-sm md:text-base mb-6 max-w-sm">
              Premium food, grooming essentials, and accessories — everything your pet needs, delivered fast.
            </p>
            <Link href="/user/products"
              className="inline-flex items-center gap-2 bg-[var(--interactive-primary)] hover:bg-[var(--interactive-primary-hover)] text-white font-semibold px-6 py-3 rounded-full transition text-sm shadow-sm">
              Shop Now <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex-1 flex items-end justify-center h-48 md:h-full md:absolute md:right-0 md:top-0 md:bottom-0 md:w-1/2">
            <div className="w-56 h-56 md:w-80 md:h-80 bg-[var(--color-primary-100)] rounded-full flex items-center justify-center text-9xl select-none mr-8 mb-4 md:mb-0">
              🐕
            </div>
          </div>
        </div>
      </section>

      {/* ── Shop by Category ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Shop by Category</h2>
          <Link href="/user/products" className="text-sm text-[var(--text-brand)] hover:underline flex items-center gap-1">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={cat.href}
              className="flex flex-col items-center gap-2 bg-[var(--bg-surface)] rounded-2xl p-4 border border-[var(--border-default)] hover:border-[var(--color-primary-300)] hover:shadow-md transition group">
              <span className="text-3xl group-hover:scale-110 transition">{cat.icon}</span>
              <span className="text-xs font-medium text-[var(--text-secondary)] text-center leading-tight group-hover:text-[var(--text-brand)] transition">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Trending ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Trending Now</h2>
          <Link href="/user/products" className="text-sm text-[var(--text-brand)] hover:underline flex items-center gap-1">
            See all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TRENDING.map((p) => (
            <MiniProductCard key={p._id} id={p._id} image={p.image} name={p.name} price={p.price}
              unit={p.unit} inStock={p.inStock} isFavorite={favorites[p._id] ?? false}
              onToggleWishlist={() => toggleFav(p._id)} onAddToCart={addToCart} />
          ))}
        </div>
      </section>

      {/* ── Promo Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-[var(--color-primary-800)] rounded-3xl flex flex-col md:flex-row items-center overflow-hidden min-h-[180px]">
          <div className="flex-1 p-8 md:p-10">
            <span className="text-[var(--color-primary-200)] text-xs font-semibold uppercase tracking-widest block mb-2">
              Limited Time
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Luxury Grooming Kit — 30% Off
            </h2>
            <p className="text-[var(--color-primary-200)] text-sm mb-5">
              Professional-grade tools for at-home spa days. Your pet deserves it.
            </p>
            <Link href="/user/products?category=grooming"
              className="inline-flex items-center gap-2 bg-white text-[var(--color-primary-800)] font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-[var(--color-primary-50)] transition">
              Shop Grooming <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="flex items-center justify-center p-6 md:p-10 text-7xl select-none">
            ✂️🛁
          </div>
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">New Arrivals</h2>
          <Link href="/user/products" className="text-sm text-[var(--text-brand)] hover:underline flex items-center gap-1">
            See all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {NEW_ARRIVALS.map((p) => (
            <MiniProductCard key={p._id} id={p._id} image={p.image} name={p.name} price={p.price}
              unit={p.unit} inStock={p.inStock} isFavorite={favorites[p._id] ?? false}
              onToggleWishlist={() => toggleFav(p._id)} onAddToCart={addToCart} />
          ))}
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-[var(--bg-surface)] rounded-3xl p-8 md:p-10 border border-[var(--border-default)]">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">The Professional Choice</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Why thousands of pet owners trust PawCart</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { emoji: "🚚", title: "Fast Delivery", desc: "Next-day dispatch on all orders over RS 500" },
              { emoji: "🌿", title: "Natural Ingredients", desc: "Vet-approved, free from harmful additives" },
              { emoji: "🛡️", title: "Quality Guarantee", desc: "30-day returns, no questions asked" },
              { emoji: "💬", title: "24/7 Support", desc: "Our pet care team is always here to help" },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center gap-2">
                <span className="text-3xl">{item.emoji}</span>
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Happy Customers</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-[var(--bg-surface)] rounded-2xl p-5 border border-[var(--border-default)]">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t.rating ? "fill-[var(--color-primary-400)] text-[var(--color-primary-400)]" : "text-gray-200"}`} />
                ))}
              </div>
              <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-700)] flex items-center justify-center text-xs font-bold">
                  {t.avatar}
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-12 bg-[var(--color-primary-900)] text-[var(--color-primary-200)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🐾</span>
              <span className="text-white font-bold text-lg">PawCart</span>
            </div>
            <p className="text-xs leading-relaxed">
              Premium pet care products delivered with love. Trusted by over 50,000 pet owners.
            </p>
          </div>
          {[
            { heading: "Shop", links: ["Dog Food", "Cat Food", "Grooming", "Accessories"] },
            { heading: "Help", links: ["Track Order", "Returns", "FAQ", "Contact Us"] },
            { heading: "Company", links: ["About", "Blog", "Careers", "Press"] },
          ].map((col) => (
            <div key={col.heading}>
              <h4 className="text-white text-sm font-semibold mb-3">{col.heading}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link href="#" className="text-xs hover:text-[var(--color-primary-100)] transition">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[var(--color-primary-800)] py-4 text-center text-xs text-[var(--color-primary-400)]">
          © 2025 PawCart. All rights reserved.
        </div>
      </footer>
    </div>
  );
}