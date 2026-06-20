import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { handleGetOrderById } from "@/lib/actions/order-action";
import CancelOrderButton from "../components/CancelButton";
import { OrderStatusPill } from "@/app/_componets/OrderStatusPill";
import { ArrowLeft, Truck, MapPin, CreditCard, Package, CheckCircle2, MessageSquare } from "lucide-react";

function money(n: any) {
  const num = Number(n ?? 0);
  return `Rs ${num.toFixed(2)}`;
}

function dt(v: any) {
  const d = v ? new Date(v) : null;
  if (!d || isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function shortDt(v: any) {
  const d = v ? new Date(v) : null;
  if (!d || isNaN(d.getTime())) return null;
  return d.toLocaleString(undefined, { month: "short", day: "2-digit", hour: "numeric", minute: "2-digit" });
}

function buildImageUrl(image?: string) {
  if (!image) return "/cookie.jpg";
  if (image.startsWith("http")) return image;

  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";
  return `${base}/${image.replace(/^\/+/, "")}`;
}

// Real status values used directly as tracker step labels, per product decision.
// "cancelled" is handled separately since it doesn't fit a linear progression.
const TRACKER_STEPS: { key: string; label: string; icon: typeof Package }[] = [
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: MapPin },
];

function OrderTracker({ status, timestamps }: { status: string; timestamps?: Record<string, any> }) {
  const currentIndex = TRACKER_STEPS.findIndex((s) => s.key === status);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6">
      <div className="relative">
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-[#EDEAE8]" />
        <div
          className="absolute left-0 top-5 h-0.5 bg-[#7A1F1F] transition-all"
          style={{ width: `${(activeIndex / (TRACKER_STEPS.length - 1)) * 100}%` }}
        />
        <div className="relative flex justify-between">
          {TRACKER_STEPS.map((step, i) => {
            const isDone = i <= activeIndex;
            const Icon = step.icon;
            const stamp = timestamps?.[step.key] ? shortDt(timestamps[step.key]) : null;

            return (
              <div key={step.key} className="flex flex-col items-center gap-2 text-center" style={{ width: `${100 / TRACKER_STEPS.length}%` }}>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${
                    isDone ? "bg-[#7A1F1F] text-white" : "bg-[#F0EDEC] text-[#B3A8A6]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`text-xs font-semibold ${isDone ? "text-[#1F1717]" : "text-[#B3A8A6]"}`}>
                  {step.label}
                </span>
                {stamp && <span className="text-[11px] text-[#9C9290]">{stamp}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await handleGetOrderById(id);
  if (!res.success) return notFound();

  const order = res.data;

  const items = order?.items ?? order?.orderItems ?? [];
  const shippingFee = order?.shippingFee ?? order?.deliveryFee ?? order?.shipping ?? 0;

  const subtotal =
    order?.subtotal ??
    items.reduce(
      (sum: number, it: any) =>
        sum + Number(it?.price ?? it?.product?.price ?? 0) * Number(it?.qty ?? it?.quantity ?? 1),
      0,
    );

  const total = order?.total ?? order?.totalAmount ?? order?.grandTotal ?? Number(subtotal) + Number(shippingFee);

  const status = String(order?.status ?? "").toLowerCase();
  const isCancelled = status === "cancelled";
  const createdAt = order?.createdAt ?? order?.date;

  // ⚠️ PLACEHOLDER — payment data isn't in any order shape shared so far.
  // Swap these for real fields (e.g. order.payment?.brand, .last4, .transactionId) once available.
  const payment = {
    brand: order?.payment?.brand ?? "Card",
    last4: order?.payment?.last4 ?? "••••",
    transactionId: order?.payment?.transactionId ?? "Not available",
  };

  return (
    <div className="min-h-screen bg-[#F5F4F2] px-4 py-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              href="/user/orders"
              className="inline-flex items-center gap-1.5 text-sm text-[#7A1F1F] hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Orders
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-[#1F1717]">
              #{String(order?.orderNumber ?? order?._id ?? id).toUpperCase()}
            </h1>
            <p className="mt-1 text-sm text-[#8A7E7C]">Placed on {dt(createdAt)}</p>
          </div>

          <div className="rounded-2xl border border-black/5 bg-white px-4 py-3">
            <p className="text-[10px] font-bold tracking-wide text-[#9C9290]">ORDER STATUS</p>
            <div className="mt-1.5">
              <OrderStatusPill type="order" value={order?.status} />
            </div>
          </div>
        </div>

        {/* Tracker */}
        {!isCancelled && (
          <div className="mt-6">
            <OrderTracker status={status} timestamps={order?.statusTimestamps} />
          </div>
        )}

        {isCancelled && (
          <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 text-center">
            <p className="text-sm font-semibold text-[#1F1717]">This order was cancelled.</p>
            <p className="mt-1 text-xs text-[#9C9290]">No further updates will be shown on this order.</p>
          </div>
        )}

        {/* Content */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2 rounded-2xl border border-black/5 bg-white">
            <div className="flex items-center justify-between border-b border-black/5 p-5">
              <h2 className="text-base font-bold text-[#1F1717]">Order Items</h2>
              <span className="rounded-full bg-[#F4F2F1] px-3 py-1 text-xs font-semibold text-[#3A302E]">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>

            <div className="divide-y divide-black/5">
              {items.map((it: any, idx: number) => {
                const name = it?.name ?? it?.product?.name ?? "Item";
                const qty = Number(it?.qty ?? it?.quantity ?? 1);
                const price = Number(it?.price ?? it?.product?.price ?? 0);
                const lineTotal = qty * price;
                const img = it?.image || it?.product?.image || it?.productId?.image || "";

                return (
                  <div key={it?._id ?? `${name}-${idx}`} className="flex items-start justify-between gap-4 p-5">
                    <div className="flex items-start gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#F4F2F1]">
                        <Image
                          src={buildImageUrl(img)}
                          alt={name}
                          fill
                          className="object-contain p-2"
                          sizes="64px"
                          unoptimized
                        />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[#1F1717]">{name}</p>
                        <p className="mt-1 text-xs text-[#9C9290]">
                          Qty: <span className="font-medium text-[#3A302E]">{qty}</span>
                        </p>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-[#1F1717]">{money(lineTotal)}</p>
                  </div>
                );
              })}

              {!items.length && (
                <div className="p-6 text-sm text-[#9C9290]">No items found for this order.</div>
              )}
            </div>

            <div className="border-t border-black/5 p-5">
              <CancelOrderButton orderId={order?._id ?? id} status={order?.status} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary */}
            <div className="rounded-2xl border border-black/5 bg-white">
              <div className="border-b border-black/5 p-5">
                <h2 className="text-base font-bold text-[#1F1717]">Order Summary</h2>
              </div>

              <div className="space-y-3 p-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#8A7E7C]">Subtotal</span>
                  <span className="font-semibold text-[#1F1717]">{money(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#8A7E7C]">Shipping</span>
                  <span className="font-semibold text-[#1F1717]">{money(shippingFee)}</span>
                </div>

                <div className="my-1 flex items-center justify-between border-t border-black/5 pt-3">
                  <span className="font-semibold text-[#3A302E]">Total</span>
                  <span className="text-lg font-bold text-[#7A1F1F]">{money(total)}</span>
                </div>
              </div>

              {!isCancelled && (
                <div className="px-5 pb-5">
                  <button
                    type="button"
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#7A1F1F] text-sm font-semibold text-white hover:bg-[#671A1A] transition"
                  >
                    <Truck className="h-4 w-4" /> Track Shipment
                  </button>
                </div>
              )}
            </div>

            {/* Shipping info */}
            {order?.shippingAddress && (
              <div className="rounded-2xl border border-black/5 bg-white p-5">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#7A1F1F]" />
                  <p className="text-sm font-bold text-[#1F1717]">Shipping Info</p>
                </div>
                <p className="mt-3 text-sm font-semibold text-[#1F1717]">
                  {order.shippingAddress?.userName ?? ""}
                </p>
                <p className="mt-1 text-sm text-[#8A7E7C] leading-relaxed">
                  {order.shippingAddress?.address1 ?? ""} {order.shippingAddress?.address2 ?? ""}
                  <br />
                  {order.shippingAddress?.city ?? ""} {order.shippingAddress?.state ?? ""}{" "}
                  {order.shippingAddress?.zip ?? ""}
                  <br />
                  {order.shippingAddress?.phone ?? ""}
                </p>
              </div>
            )}

            {/* Payment info — placeholder values, see note above */}
            <div className="rounded-2xl border border-black/5 bg-white p-5">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-[#7A1F1F]" />
                <p className="text-sm font-bold text-[#1F1717]">Payment Info</p>
              </div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#F4F2F1] px-3 py-2 text-xs font-semibold text-[#3A302E]">
                {payment.brand} ending in {payment.last4}
              </div>
              <p className="mt-3 text-xs text-[#9C9290]">
                Transaction ID: <span className="font-medium text-[#3A302E]">{payment.transactionId}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}