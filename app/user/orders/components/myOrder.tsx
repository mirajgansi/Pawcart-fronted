"use client";

import { OrderStatusPill } from "@/app/_componets/OrderStatusPill";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { buildImageUrl } from "../../_components/Productcard";

// ⚠️ PLACEHOLDER SHAPE — confirm against your real order/item schema and adjust.
// Expected: order.items = [{ name: string; image?: string; quantity?: number }]
type OrderItem = {
  name?: string;
  image?: string;
  quantity?: number;
};

const FILTERS = [
  { key: "all", label: "All Orders" },
  { key: "pending", label: "Pending" },
  { key: "shipped", label: "Shipped" },
  { key: "cancelled", label: "Cancelled" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function formatDate(d: any) {
  const dt = d ? new Date(d) : null;
  if (!dt || isNaN(dt.getTime())) return "—";
  return dt.toLocaleDateString(undefined, { month: "short", day: "2-digit", year: "numeric" });
}

function getItemSummary(items: OrderItem[] | undefined) {
  if (!items?.length) return { title: "Order", thumbnail: undefined as string | undefined };
  const first = items[0];
  const extra = items.length - 1;
  return {
    title: extra > 0 ? `${first?.name ?? "Item"} + ${extra} other${extra > 1 ? "s" : ""}` : first?.name ?? "Item",
    thumbnail: first?.image,
  };
}

export default function OrdersList({ orders }: { orders: any[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return orders.filter((o) => {
      const status = String(o?.status ?? "").toLowerCase();
      const matchesFilter = filter === "all" || status === filter;
      if (!matchesFilter) return false;

      if (!query) return true;
      const id = String(o?._id ?? o?.id ?? "").toLowerCase();
      return id.includes(query);
    });
  }, [q, filter, orders]);

  if (!orders?.length) {
    return (
      <div className="rounded-2xl border border-black/5 bg-white p-10 text-center">
        <p className="text-lg font-semibold text-[#1F1717]">No orders yet</p>
        <p className="mt-1 text-sm text-[#8A7E7C]">When you place an order, it will show up here.</p>
        <Link
          href="/user/products"
          className="mt-5 inline-flex h-10 items-center justify-center rounded-full bg-[#7A1F1F] px-5 text-sm font-semibold text-white hover:bg-[#671A1A] transition"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#7A1F1F]">Track Your Orders</h1>
        <p className="mt-1.5 text-sm text-[#8A7E7C] max-w-md">
          Manage your active deliveries and review your purchase history with curated care.
        </p>
      </div>

      {/* Search + filters */}
      <div className="rounded-2xl border border-black/5 bg-white p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9C9290]"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by order number..."
              className="h-11 w-full rounded-full border-0 bg-[#F4F2F1] pl-10 pr-4 text-sm text-[#2A2120] placeholder:text-[#9C9290] outline-none transition focus:ring-2 focus:ring-[#7A1F1F]/30"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={`h-11 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition ${
                    active
                      ? "bg-[#7A1F1F] text-white"
                      : "border border-black/10 bg-white text-[#3A302E] hover:bg-black/5"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order cards */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-black/5 bg-white p-10 text-center">
            <p className="text-sm text-[#8A7E7C]">No orders match your search or filter.</p>
          </div>
        ) : (
          filtered.map((o) => {
            const id = o?._id ?? o?.id;
            const createdAt = o?.createdAt ?? o?.date;
            const status = String(o?.status ?? "").toLowerCase();
            const { title, thumbnail } = getItemSummary(o?.items);
            const isCancelled = status === "cancelled";

            return (
              <div
                key={String(id)}
                className="flex items-center gap-4 rounded-2xl bg-white border border-black/5 p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
              >
               <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F4F2F1]">
  {thumbnail ? (
    <Image
      src={buildImageUrl(thumbnail)}
      alt={title}
      width={64}
      height={64}
      className="h-full w-full object-cover"
      unoptimized
    />
  ) : null}
</div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs text-[#9C9290]">
                    Order #{String(id).slice(-8)}
                    <span className="mx-1.5">·</span>
                    {formatDate(createdAt)}
                  </p>
                  <p className="mt-0.5 truncate text-[15px] font-bold text-[#1F1717]">{title}</p>
                  <div className="mt-1.5">
                    <OrderStatusPill type="order" value={o?.status} />
                  </div>
                </div>

                <Link
                  href={isCancelled ? `/user/products` : id ? `/user/orders/${id}` : "#"}
                  className="shrink-0 rounded-full bg-[#F4F2F1] px-4 py-2.5 text-sm font-semibold text-[#3A302E] hover:bg-black/10 transition whitespace-nowrap"
                >
                  {isCancelled ? "Reorder Items" : "View Details"}
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}