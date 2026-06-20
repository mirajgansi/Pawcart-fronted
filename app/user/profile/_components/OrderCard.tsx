"use client";

import Image from "next/image";
import { Check, Package, Truck, Home } from "lucide-react";

export type OrderStatus = "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

export type Order = {
  _id: string;
  orderNumber: string; // e.g. "PC-99210-23"
  title: string; // e.g. "Premium Kibble & Chew Toys"
  placedAt: string; // ISO date string
  total: number;
  status: OrderStatus;
  thumbnail?: string;
};

const STEPS: { key: OrderStatus; label: string; icon: typeof Check }[] = [
  { key: "confirmed", label: "Confirmed", icon: Check },
  { key: "processing", label: "Processed", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: Home },
];

function statusToStepIndex(status: OrderStatus): number {
  const idx = STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function fmtMoney(n: number) {
  return `$${n.toFixed(2)}`;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const config: Record<OrderStatus, { label: string; bg: string; text: string; dot?: boolean }> = {
    confirmed:  { label: "Confirmed",  bg: "#FEF3C7", text: "#92400E", dot: true },
    processing: { label: "Processing", bg: "#FEF3C7", text: "#92400E", dot: true },
    shipped:    { label: "Shipped",    bg: "#FCE7E7", text: "#A61E1E", dot: true },
    delivered:  { label: "Delivered",  bg: "#F3F4F6", text: "#374151" },
    cancelled:  { label: "Cancelled",  bg: "#FEE2E2", text: "#991B1B" },
  };
  const c = config[status] ?? { label: status ?? "Unknown", bg: "#F3F4F6", text: "#6B7280" };

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {c.dot && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.text }} />}
      {status === "delivered" && <Check className="h-3 w-3" />}
      {c.label}
    </span>
  );
}
function OrderTracker({ currentStep }: { currentStep: number }) {
  const progressPct = (currentStep / (STEPS.length - 1)) * 100;

  return (
    <div className="relative pt-1">
      <div className="absolute left-0 right-0 top-[19px] h-0.5" style={{ backgroundColor: "var(--border-default)" }} />
      <div
        className="absolute left-0 top-[19px] h-0.5 transition-all"
        style={{ backgroundColor: "var(--color-primary-700)", width: `${progressPct}%` }}
      />
      <div className="relative flex justify-between">
        {STEPS.map((step, i) => {
          const isDone = i <= currentStep;
          const Icon = step.icon;
          return (
            <div key={step.key} className="flex flex-col items-center gap-2" style={{ width: `${100 / STEPS.length}%` }}>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={
                  isDone
                    ? { backgroundColor: "var(--color-primary-700)", color: "var(--interactive-primary-text)" }
                    : { backgroundColor: "var(--color-tertiary)", color: "var(--text-secondary)" }
                }
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: isDone ? "var(--text-primary)" : "var(--text-secondary)" }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrderCard({
  order,
  onViewDetails,
  onTrackPackage,
  onReorder,
}: {
  order: Order;
  onViewDetails?: (orderId: string) => void;
  onTrackPackage?: (orderId: string) => void;
  onReorder?: (orderId: string) => void;
}) {
  const isDelivered = order.status === "delivered";
  const currentStep = statusToStepIndex(order.status);

  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: "var(--border-default)", backgroundColor: "var(--bg-surface)" }}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-brand)" }}>
            Order #{order.orderNumber}
          </p>
          <h3 className="mt-1 text-base font-bold" style={{ color: "var(--text-primary)" }}>
            {order.title}
          </h3>
          <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
            Placed on {formatDate(order.placedAt)} • Total: {fmtMoney(order.total)}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {isDelivered ? (
        <div className="mt-4 flex items-center justify-between gap-3">
          {order.thumbnail && (
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl" style={{ backgroundColor: "var(--color-tertiary)" }}>
              <Image src={order.thumbnail} alt={order.title} fill className="object-cover" unoptimized />
            </div>
          )}
          <button
            type="button"
            onClick={() => onReorder?.(order._id)}
            className="text-sm font-semibold hover:underline"
            style={{ color: "var(--text-brand)" }}
          >
            Reorder Items
          </button>
        </div>
      ) : (
        <>
          <div className="mt-6 px-2">
            <OrderTracker currentStep={currentStep} />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onViewDetails?.(order._id)}
              className="rounded-full border px-4 py-2 text-sm font-semibold transition"
              style={{ borderColor: "var(--border-default)", color: "var(--text-primary)" }}
            >
              Order Details
            </button>
            <button
              type="button"
              onClick={() => onTrackPackage?.(order._id)}
              className="rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition"
              style={{ backgroundColor: "var(--color-primary-700)", color: "var(--interactive-primary-text)" }}
            >
              Track Package
            </button>
          </div>
        </>
      )}
    </div>
  );
}