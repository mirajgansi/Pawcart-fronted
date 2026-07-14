"use client";

import { useEffect, useState } from "react";
import {
  X,
  Truck,
  CreditCard,
  Receipt,
  Banknote,
  Smartphone,
  ArrowRight,
} from "lucide-react";

export type ShippingAddress = {
  userName?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
};

export type PaymentMethod = "cod" | "wallet";

export default function ShippingAddressModal({
  open,
  initialData,
  subtotal = 0,
  shippingFee = 0,
  onClose,
  onSave,
}: {
  open: boolean;
  initialData?: ShippingAddress;
  subtotal?: number;
  shippingFee?: number;
  onClose: () => void;
  onSave: (data: ShippingAddress & { paymentMethod: PaymentMethod }) => void;
}) {
  const [form, setForm] = useState<ShippingAddress>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  useEffect(() => {
    if (open) {
      setForm(initialData ?? {});
      setPaymentMethod("cod");
    }
  }, [initialData, open]);

  if (!open) return null;

  const update = (k: keyof ShippingAddress, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const total = subtotal + shippingFee;
  const fmt = (n: number) => `Rs. ${n.toFixed(2)}`;

  const submit = () => {
    if (!form.userName || !form.phone || !form.address1) return;
    onSave({ ...form, paymentMethod });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4">
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-lg"
        style={{ backgroundColor: "var(--bg-surface)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4" style={{ borderColor: "var(--border-default)" }}>
          <div>
            <p className="text-lg font-bold" style={{ color: "var(--text-brand)" }}>Secure Checkout</p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Complete your order details below</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 transition-colors hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" style={{ color: "var(--text-secondary)" }} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-6">
          {/* Shipping */}
          <div>
            <SectionLabel icon={<Truck className="h-4 w-4" />}>Shipping Information</SectionLabel>

            <div className="grid grid-cols-2 gap-3">
              <Field
                label="Full Name"
                value={form.userName || ""}
                onChange={(v) => update("userName", v)}
                placeholder="John Doe"
              />
              <Field
                label="Phone Number"
                value={form.phone || ""}
                onChange={(v) => update("phone", v)}
                placeholder="+977 98XXXXXXXX"
              />
            </div>

            <div className="mt-3">
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
                Delivery Address
              </label>
              <textarea
                value={form.address1 || ""}
                onChange={(e) => update("address1", e.target.value)}
                placeholder="Street Name, House No., City"
                rows={3}
                className="w-full resize-none rounded-2xl border px-3 py-2.5 text-sm outline-none"
                style={{ borderColor: "var(--border-default)" }}
              />
            </div>
          </div>

          {/* Payment method */}
          <div>
            <SectionLabel icon={<CreditCard className="h-4 w-4" />}>Payment Method</SectionLabel>
            <div className="space-y-2">
              <PaymentOption
                icon={<Banknote className="h-5 w-5" />}
                title="Cash on Delivery"
                subtitle="Pay when your items arrive"
                selected={paymentMethod === "cod"}
                onSelect={() => setPaymentMethod("cod")}
              />
            </div>
          </div>

          {/* Order summary */}
          <div className="rounded-2xl p-4" style={{ backgroundColor: "var(--color-tertiary)" }}>
            <SectionLabel icon={<Receipt className="h-4 w-4" />}>Order Summary</SectionLabel>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                <span className="font-medium" style={{ color: "var(--text-primary)" }}>{fmt(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span style={{ color: "var(--text-secondary)" }}>Shipping Fee</span>
                {shippingFee === 0 ? (
                  <span className="text-xs font-semibold text-green-600">FREE</span>
                ) : (
                  <span className="font-medium" style={{ color: "var(--text-primary)" }}>{fmt(shippingFee)}</span>
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t pt-3" style={{ borderColor: "var(--border-default)" }}>
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Total Amount</span>
              <span className="text-lg font-bold" style={{ color: "var(--text-brand)" }}>{fmt(total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t px-5 py-4" style={{ borderColor: "var(--border-default)" }}>
          <button
            type="button"
            onClick={submit}
            disabled={!form.userName || !form.phone || !form.address1}
            className="flex-1 flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: "var(--color-primary-700)", color: "var(--interactive-primary-text)" }}
          >
            Confirm Order <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border px-5 py-3 text-sm font-semibold transition"
            style={{ borderColor: "var(--color-primary-700)", color: "var(--color-primary-700)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span style={{ color: "var(--color-primary-700)" }}>{icon}</span>
      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-brand)" }}>
        {children}
      </p>
    </div>
  );
}

function PaymentOption({
  icon,
  title,
  subtitle,
  selected,
  onSelect,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-colors"
      style={
        selected
          ? { borderColor: "var(--color-primary-700)", backgroundColor: "var(--color-tertiary)" }
          : { borderColor: "var(--border-default)" }
      }
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2"
          style={{ borderColor: selected ? "var(--color-primary-700)" : "var(--border-default)" }}
        >
          {selected && (
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--color-primary-700)" }} />
          )}
        </span>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{title}</p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{subtitle}</p>
        </div>
      </div>
      <span style={{ color: "var(--border-default)" }}>{icon}</span>
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border px-3 py-2.5 text-sm outline-none"
        style={{ borderColor: "var(--border-default)" }}
      />
    </div>
  );
}