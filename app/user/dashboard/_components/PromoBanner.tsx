// components/PromoBanner.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const promo = {
  image: "/groomingkits.png",
  label: "Limited Time",
  title: "Luxury Grooming Kit — 30% Off",
  desc: "Professional-grade tools for at-home spa days. Your pet deserves it.",
  href: "/user/groomingkits",
  cta: "Shop Grooming",
};

export default function PromoBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div
        className="rounded-3xl overflow-hidden relative group cursor-pointer"
        style={{ backgroundColor: "#7F1D1D" }}
      >
        {/* Image */}
        <img
          src={promo.image}
          alt={promo.title}
          className="w-full h-[280px] object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105"
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(95,3,10,0.85) 0%, rgba(95,3,10,0.4) 50%, rgba(95,3,10,0) 100%)",
          }}
        />

        {/* Text */}
        <div className="absolute inset-0 z-10 p-8 md:p-10 flex flex-col justify-start">
          <span className="text-[var(--color-primary-200)] text-xs font-semibold uppercase tracking-widest block mb-2">
            {promo.label}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {promo.title}
          </h2>
          <p className="text-[var(--color-primary-200)] text-sm mb-5 max-w-sm">
            {promo.desc}
          </p>
          <Link
            href={promo.href}
            className="inline-flex items-center gap-2 bg-white text-[var(--color-primary-800)] font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-[var(--color-primary-50)] transition w-fit"
          >
            {promo.cta} <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}