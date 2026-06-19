"use client";

import Image from "next/image";
import { Trash2, Plus, Minus } from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────── */
type Product = {
  _id: string;
  name: string;
  price: number;
  image?: string;
  variant?: string;
};

type CartItem = {
  _id: string;
  productId: string | Product;
  quantity: number;
};

interface CartItemCardProps {
  item: CartItem;
  onQtyChange: (pid: string, qty: number) => void;
  onRemove: (pid: string) => void;
}

/* ─── Helpers ────────────────────────────────────────────────────────── */
function buildImageUrl(image?: string): string {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  return `${base}/${image.replace(/^\/+/, "")}`;
}

function getProduct(item: CartItem): Product | null {
  return typeof item.productId === "string" ? null : item.productId;
}

function getProductId(item: CartItem): string {
  return typeof item.productId === "string"
    ? item.productId
    : item.productId._id;
}

/* ─── Component ──────────────────────────────────────────────────────── */
export default function CartItemCard({
  item,
  onQtyChange,
  onRemove,
}: CartItemCardProps) {
  const product = getProduct(item);
  const pid = getProductId(item);

  if (!product) {
    return (
      <div className="flex items-center justify-between bg-white rounded-2xl border border-[#f0c8c8] px-4 py-3">
        <p className="text-sm text-[#9a6060]">Product details unavailable.</p>
        <button
          type="button"
          onClick={() => onRemove(pid)}
          className="text-xs text-[#A61E1E] underline"
        >
          Remove
        </button>
      </div>
    );
  }

  const lineTotal = product.price * item.quantity;

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-[#f0c8c8] px-4 py-3">
      {/* Product image */}
      <div className="relative h-[72px] w-[72px] flex-shrink-0 rounded-xl overflow-hidden bg-[#f5e8e8]">
        <Image
          src={buildImageUrl(product.image)}
          alt={product.name}
          fill
          className="object-cover"
          unoptimized
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[#3b1010] leading-snug truncate">
          {product.name}
        </p>
        {product.variant && (
          <p className="text-xs text-[#9a5050] mt-0.5 truncate">
            {product.variant}
          </p>
        )}

        {/* Qty stepper */}
        <div className="mt-2 inline-flex items-center rounded-lg border border-[#f0c0c0] bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => onQtyChange(pid, Math.max(1, item.quantity - 1))}
            className="w-7 h-7 flex items-center justify-center text-[#7F1D1D] hover:bg-[#FEF2F2] transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-3 w-3" />
          </button>

          <input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isFinite(n) && n >= 1) onQtyChange(pid, n);
            }}
            className="w-8 text-center text-sm font-medium text-[#3b1010] bg-transparent outline-none"
            aria-label="Quantity"
          />

          <button
            type="button"
            onClick={() => onQtyChange(pid, item.quantity + 1)}
            className="w-7 h-7 flex items-center justify-center text-[#7F1D1D] hover:bg-[#FEF2F2] transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Price + delete */}
      <div className="flex flex-col items-end justify-between h-[72px] flex-shrink-0">
        <button
          type="button"
          onClick={() => onRemove(pid)}
          aria-label="Remove item"
          className="p-1.5 rounded-lg text-[#c0a0a0] hover:text-[#A61E1E] hover:bg-[#FEF2F2] transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        <p className="text-sm font-bold text-[#5F030A]">
          Rs {lineTotal.toFixed(2)}
        </p>
      </div>
    </div>
  );
}