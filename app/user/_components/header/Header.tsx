"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Nav from "./Nav";
import Actions from "./Actions";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import SearchBar from "./searchbar";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-default)" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-8">

        {/* LEFT — Logo + mobile hamburger */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2 rounded-lg transition"
                  aria-label="Open menu"
                  style={{ color: "var(--text-primary)" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-primary-50)")}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <Menu size={22} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <Nav isMobile onNavigate={() => setOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: "var(--text-brand)" }}
          >
            PawCart
          </span>
        </div>

        {/* CENTER — Desktop nav */}
        <div className="flex-1 flex justify-start">
          <Nav />
        </div>

        {/* RIGHT — Search + icons */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <SearchBar />
          <Actions />
        </div>

      </div>
    </header>
  );
}