"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Trash2, Plus, Minus, ShoppingCart, Lock } from "lucide-react";
import { toast } from "react-toastify";

import {
  getMyCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from "@/lib/api/cart";
import { handleWhoami } from "@/lib/actions/auth-actions";
import { handleCreateOrder } from "@/lib/actions/order-action";
import ShippingAddressModal from "./shippingAddressModal";
import CartItemCard from "./cartItemCard";

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

type Cart = { items: CartItem[] };

type ShippingAddress = {
  userName?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
};

/* ─── Helpers ────────────────────────────────────────────────────────── */
const TAX_RATE = 0.08;

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

function fmt(n: number): string {
  return `Rs ${n.toFixed(2)}`;
}

/* ─── Sub-components ─────────────────────────────────────────────────── */

/** Quantity stepper */
function QtyControl({
  value,
  onChange,
}: {
  value: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-[#f0c0c0] bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="w-8 h-8 flex items-center justify-center text-[#7F1D1D] hover:bg-[#FEF2F2] transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <input
        type="number"
        min={1}
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isFinite(n) && n >= 1) onChange(n);
        }}
        className="w-10 text-center text-sm font-medium text-[#3b1010] bg-transparent outline-none"
        aria-label="Quantity"
      />
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 flex items-center justify-center text-[#7F1D1D] hover:bg-[#FEF2F2] transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/** Single cart row */
function CartRow({
  item,
  onQtyChange,
  onRemove,
}: {
  item: CartItem;
  onQtyChange: (pid: string, qty: number) => void;
  onRemove: (pid: string) => void;
}) {
  const product = getProduct(item);
  const pid = getProductId(item);

  if (!product) {
    return (
      <tr className="border-b border-[#fce8e8]">
        <td colSpan={5} className="px-5 py-4 text-sm text-[#9a6060]">
          Product details unavailable.{" "}
          <button
            type="button"
            onClick={() => onRemove(pid)}
            className="text-[#A61E1E] underline"
          >
            Remove
          </button>
        </td>
      </tr>
    );
  }

  const lineTotal = product.price * item.quantity;

  return (
    <tr className="border-b border-[#fce8e8] last:border-0">
      {/* Product */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 flex-shrink-0 rounded-xl overflow-hidden bg-[#f5e8e8]">
            <Image
              src={buildImageUrl(product.image)}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <p className="text-sm font-medium text-[#3b1010] leading-snug">
              {product.name}
            </p>
            {product.variant && (
              <p className="text-xs text-[#9a5050] mt-0.5">{product.variant}</p>
            )}
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="px-5 py-4 text-sm font-medium text-[#574240]">
        {fmt(product.price)}
      </td>

      {/* Quantity */}
      <td className="px-5 py-4">
        <QtyControl
          value={item.quantity}
          onChange={(next) => onQtyChange(pid, next)}
        />
      </td>

      {/* Total */}
      <td className="px-5 py-4 text-sm font-semibold text-[#3b1010]">
        {fmt(lineTotal)}
      </td>

      {/* Remove */}
      <td className="px-5 py-4">
        <button
          type="button"
          onClick={() => onRemove(pid)}
          aria-label="Remove item"
          className="p-2 rounded-lg text-[#c0a0a0] hover:text-[#A61E1E] hover:bg-[#FEF2F2] transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

/** Order summary sidebar */
function OrderSummary({
  subtotal,
  onCheckout,
  loading,
  loadingUser,
  hasItems,
}: {
  subtotal: number;
  onCheckout: () => void;
  loading: boolean;
  loadingUser: boolean;
  hasItems: boolean;
}) {
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <div className="bg-white rounded-2xl border border-[#f0c8c8] p-5 sticky top-6">
      <h2 className="text-base font-semibold text-[#5F030A] pb-3 border-b border-[#fce8e8] mb-4">
        Order Summary
      </h2>

      <div className="space-y-3 text-sm text-[#574240]">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="font-medium text-[#3b1010]">{fmt(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Shipping</span>
          <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            FREE
          </span>
        </div>
        <div className="flex justify-between">
          <span>Taxes</span>
          <span className="font-medium text-[#3b1010]">{fmt(tax)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#fce8e8]">
        <span className="text-base font-semibold text-[#3b1010]">Total</span>
        <span className="text-lg font-bold text-[#5F030A]">{fmt(total)}</span>
      </div>

      <button
        type="button"
        disabled={!hasItems || loading || loadingUser}
        onClick={onCheckout}
        className="mt-5 w-full py-3 rounded-xl bg-[#7F1D1D] text-white text-sm font-semibold hover:bg-[#8b1515] disabled:opacity-50 transition-colors"
      >
        {loadingUser ? "Loading…" : "Proceed to Checkout"}
      </button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#9a6060]">
        <Lock className="h-3 w-3" />
        Secure checkout
      </p>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────── */
export default function CartPage() {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [loading, setLoading] = useState(true);
  const [loadingUser, setLoadingUser] = useState(false);

  const [shippingOpen, setShippingOpen] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<
    ShippingAddress | undefined
  >();

  /* fetch cart */
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await getMyCart();
      const items: CartItem[] =
        res?.data?.items ?? res?.items ?? res?.data?.data?.items ?? [];
      setCart({ items });
    } catch (e: unknown) {
      toast.error((e as Error).message ?? "Failed to load cart");
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* derived totals */
  const subtotal = useMemo(
    () =>
      cart.items.reduce((sum, item) => {
        const p = getProduct(item);
        return sum + (p?.price ?? 0) * item.quantity;
      }, 0),
    [cart.items]
  );

  /* actions */
  const changeQty = async (pid: string, qty: number) => {
    if (qty < 1) return;
    try {
      await updateCartItemQuantity(pid, qty);
      await fetchCart();
    } catch (e: unknown) {
      toast.error((e as Error).message ?? "Failed to update quantity");
    }
  };

  const removeItem = async (pid: string) => {
    try {
      await removeCartItem(pid);
      toast.success("Item removed");
      await fetchCart();
    } catch (e: unknown) {
      toast.error((e as Error).message ?? "Failed to remove item");
    }
  };

  const onClearCart = async () => {
    try {
      await clearCart();
      toast.success("Cart cleared");
      await fetchCart();
    } catch (e: unknown) {
      toast.error((e as Error).message ?? "Failed to clear cart");
    }
  };

  /* checkout */
  const loadUserShippingData = async () => {
    try {
      setLoadingUser(true);
      const res = await handleWhoami();
      const user = res?.data ?? res;
      if (!user) return;
      setShippingAddress({
        userName: user.userName ?? user.username ?? "",
        phone: user.phone ?? user.phoneNumber ?? "",
        address1: user.address1 ?? user.location ?? "",
        address2: user.address2 ?? "",
        city: user.city ?? "",
        state: user.state ?? "",
        zip: user.zip ?? "",
      });
    } catch {
      setShippingAddress(undefined);
    } finally {
      setLoadingUser(false);
    }
  };

  const onCheckout = async () => {
    await loadUserShippingData();
    setShippingOpen(true);
  };

  const onConfirmShipping = async (address: ShippingAddress) => {
    try {
      const who = await handleWhoami();
      const user = who?.data ?? who;
      const userId = user?._id;
      if (!userId) {
        toast.error("User not found. Please login again.");
        return;
      }

      const items = cart.items
        .map((item) => {
          const product = getProduct(item);
          if (!product) return null;
          return {
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: item.quantity,
            lineTotal: product.price * item.quantity,
          };
        })
        .filter(Boolean) as {
        productId: string;
        name: string;
        price: number;
        image?: string;
        quantity: number;
        lineTotal: number;
      }[];

      if (!items.length) {
        toast.error("Cart items are missing product details.");
        return;
      }

      const itemSubtotal = items.reduce((s, it) => s + it.lineTotal, 0);
      const shippingFee = 0;
      const totalAmount = itemSubtotal + shippingFee;

      const res = await handleCreateOrder({
        userId,
        items,
        subtotal: itemSubtotal,
        shippingFee,
        total: totalAmount,
        shippingAddress: address,
      });

      if (!res.success) {
        toast.error(res.message ?? "Checkout failed");
        return;
      }

      toast.success("Order placed successfully!");
      setShippingOpen(false);
      await fetchCart();
    } catch (e: unknown) {
      toast.error((e as Error).message ?? "Checkout failed");
    }
  };

  /* ── render ── */
  return (
    <main className="min-h-screen bg-[#FEF2F2] px-4 py-8 md:px-8">
      <h1 className="text-2xl font-semibold text-[#5F030A] mb-1">
        Your Shopping Cart
      </h1>
      <p className="text-sm text-[#8a4040] mb-6">
        Review your selections for your furry companions.
      </p>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ── Cart table ── */}
        <div className="flex-1  rounded-2xl   overflow-hidden">
          {loading ? (
            <p className="p-8 text-sm text-[#9a6060]">Loading cart…</p>
          ) : !cart.items.length ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="h-16 w-16 rounded-full bg-[#FEF2F2] flex items-center justify-center mb-4">
                <ShoppingCart className="h-8 w-8 text-[#c0a0a0]" />
              </div>
              <h3 className="text-base font-semibold text-[#3b1010]">
                Cart is empty
              </h3>
              <p className="mt-1 text-sm text-[#9a6060]">
                Add products and they will show up here.
              </p>
            </div>
          ) : (
            <div className="divide-y ">
  {cart.items.map((item) => (
    <div key={getProductId(item)} className="p-3">
      <CartItemCard
        item={item}
        onQtyChange={changeQty}
        onRemove={removeItem}
      />
    </div>
  ))}
</div>
  
          )}
        </div>

        {/* ── Order summary ── */}
        <div className="w-full lg:w-[300px]">
          <OrderSummary
            subtotal={subtotal}
            onCheckout={onCheckout}
            loading={loading}
            loadingUser={loadingUser}
            hasItems={cart.items.length > 0}
          />
        </div>
      </div>

      <ShippingAddressModal
        open={shippingOpen}
        initialData={shippingAddress}
        onClose={() => setShippingOpen(false)}
        onSave={onConfirmShipping}
      />
    </main>
  );
}