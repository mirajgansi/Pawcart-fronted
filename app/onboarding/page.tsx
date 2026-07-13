"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, Truck, Heart, Sparkles, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 text-center"
    >
  <div className="w-full max-w-md border-2 border-black rounded-3xl p-8 bg-white text-center shadow-sm">

      {/* Badge */}
      <div
        className="inline-flex items-center gap-2 text-xs font-medium px-4 py-1.5 rounded-full border mb-8"
        style={{
          backgroundColor: "var(--color-primary-50)",
          color: "var(--color-primary-700)",
          borderColor: "var(--color-primary-200)",
        }}
      >
        <Sparkles size={13} />
        New arrivals every week
      </div>

      {/* Image area */}
      <div className="relative w-60 h-60 mb-10">

        {/* Floating tag — top left */}
        <div
          className="absolute -left-8 top-6 z-10 flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium shadow-sm border"
          style={{
            backgroundColor: "var(--bg-surface)",
            color: "var(--text-secondary)",
            borderColor: "var(--border-default)",
          }}
        >
          <Star size={12} style={{ color: "var(--color-primary-400)" }} fill="currentColor" />
          4.9 rated
        </div>

        {/* Floating tag — top right */}
        <div
          className="absolute -right-8 top-6 z-10 flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium shadow-sm border"
          style={{
            backgroundColor: "var(--bg-surface)",
            color: "var(--text-secondary)",
            borderColor: "var(--border-default)",
          }}
        >
          <Truck size={12} style={{ color: "var(--color-primary-500)" }} />
          Free delivery
        </div>

        {/* Floating tag — bottom */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium shadow-sm border whitespace-nowrap"
          style={{
            backgroundColor: "var(--bg-surface)",
            color: "var(--text-secondary)",
            borderColor: "var(--border-default)",
          }}
        >
          <Heart size={12} style={{ color: "var(--color-primary-400)" }} fill="currentColor" />
          10k+ happy pets
        </div>

        {/* Circle bg behind image */}
        <div
          className="absolute inset-0 rounded-full border-2"
          style={{
            backgroundColor: "var(--color-primary-50)",
            borderColor: "var(--color-primary-200)",
          }}
        />

        {/* Your paw image */}
        <div className="relative z-[1] w-full h-full flex items-center justify-center">
          <Image
            src="/paw.png"
            alt="Paw"
            fill
            className="object-contain p-6 rounded-full"
          />
        </div>
      </div>

      {/* Heading */}
      <h1
        className="text-3xl font-semibold leading-tight mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        Everything your pet<br />deserves, delivered
      </h1>
      <p
        className="text-sm max-w-xs mb-8 leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        Premium food, toys, and accessories for your furry, feathery, or scaly best friend.
      </p>

      {/* CTAs */}
      <div className="flex flex-col items-center gap-3 w-full max-w-xs">

        {/* Primary — Get Started → /login */}
        <button
          onClick={() => router.push("/login")}
          className="w-full flex items-center justify-center gap-2 text-base font-medium py-3.5 rounded-2xl transition-all duration-150 active:scale-95"
          style={{
            backgroundColor: "var(--interactive-primary)",
            color: "var(--interactive-primary-text)",
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--interactive-primary-hover)")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--interactive-primary)")}
        >
          Get started
          <ArrowRight size={18} />
        </button>

      
      </div>

</div>
     
    </div>
  );
}