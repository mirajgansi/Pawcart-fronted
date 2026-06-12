// components/PromoBanner.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";

const slides = [
  {
    image: "/groomingkits.png",
    label: "Limited Time",
    title: "Luxury Grooming Kit — 30% Off",
    desc: "Professional-grade tools for at-home spa days. Your pet deserves it.",
    href: "/user/products?category=grooming",
    cta: "Shop Grooming",
  },
  {
    image: "/groomingkits2.png",
    label: "New Arrival",
    title: "Premium Pet Food — Buy 2 Get 1",
    desc: "Nutritionist-approved recipes your furry friend will beg for every meal.",
    href: "/user/products?category=food",
    cta: "Shop Food",
  },
  {
    image: "/groomingkits3.png",
    label: "Best Seller",
    title: "Cozy Pet Beds — From $29",
    desc: "Orthopedic comfort for pets of all sizes. Sleep better, live happier.",
    href: "/user/products?category=beds",
    cta: "Shop Beds",
  },
];

export default function PromoBanner() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("left");

  const goTo = (index: number, dir: "left" | "right") => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(index);
      setAnimating(false);
    }, 400);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (current + 1) % slides.length;
      goTo(next, "left");
    }, 4000);
    return () => clearInterval(timer);
  }, [current, animating]);

  const prev = () => goTo((current - 1 + slides.length) % slides.length, "right");
  const next = () => goTo((current + 1) % slides.length, "left");

  const slide = slides[current];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <style>{`
        @keyframes slideInLeft  { from { opacity: 0; transform: translateX(60px);  } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(-60px); } to { opacity: 1; transform: translateX(0); } }
        .slide-left  { animation: slideInLeft  0.4s ease-out forwards; }
        .slide-right { animation: slideInRight 0.4s ease-out forwards; }
      `}</style>

      <div
        className="rounded-3xl overflow-hidden relative group cursor-pointer"
        style={{ backgroundColor: "#7F1D1D" }}
      >
        {/* Image */}
        <img
          key={`img-${current}`}
          src={slide.image}
          alt={slide.title}
          className={`w-full h-[280px] object-cover object-center transition-transform duration-500 ease-in-out group-hover:scale-105 ${
            animating ? (direction === "left" ? "slide-left" : "slide-right") : ""
          }`}
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
        <div
          key={`text-${current}`}
          className={`absolute inset-0 z-10 p-8 md:p-10 flex flex-col justify-start ${
            animating ? (direction === "left" ? "slide-left" : "slide-right") : ""
          }`}
        >
          <span className="text-[var(--color-primary-200)] text-xs font-semibold uppercase tracking-widest block mb-2">
            {slide.label}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {slide.title}
          </h2>
          <p className="text-[var(--color-primary-200)] text-sm mb-5 max-w-sm">
            {slide.desc}
          </p>
          <Link
            href={slide.href}
            className="inline-flex items-center gap-2 bg-white text-[var(--color-primary-800)] font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-[var(--color-primary-50)] transition w-fit"
          >
            {slide.cta} <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition backdrop-blur-sm"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition backdrop-blur-sm"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? "left" : "right")}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "bg-white w-6 h-2" : "bg-white/40 w-2 h-2"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}