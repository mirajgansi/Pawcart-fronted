"use client";

import { useState } from "react";
import Image from "next/image";

type ReviewModalProps = {
  open: boolean;
  onClose: () => void;
  productName: string;
  productImage?: string;
  pending?: boolean;
  onSubmit: (rating: number, text: string) => Promise<void> | void;
};

export default function ReviewModal({
  open,
  onClose,
  productName,
  productImage,
  pending = false,
  onSubmit,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");

  if (!open) return null;

  const handleSubmit = async () => {
    if (rating === 0) return;
    await onSubmit(rating, text.trim());
    setRating(0);
    setText("");
  };

  const handleClose = () => {
    setRating(0);
    setText("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Share Your Experience
          </h2>
          <p className="mt-1 text-xs" style={{ color: "var(--text-secondary)" }}>
            Tell us what you and your pet thought of our premium blend.
          </p>
        </div>

        <div className="mt-5 flex items-center gap-3 rounded-xl border p-3" style={{ borderColor: "var(--border-default)" }}>
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg" style={{ backgroundColor: "var(--color-tertiary)" }}>
            {productImage && (
              <Image src={productImage} alt={productName} fill className="object-contain p-1" unoptimized />
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: "var(--text-brand)" }}>
              Reviewing
            </p>
            <p className="text-sm font-semibold leading-snug" style={{ color: "var(--text-primary)" }}>
              {productName}
            </p>
          </div>
        </div>

        <div className="mt-5 text-center">
          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Overall Rating</p>
          <div className="mt-2 flex justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className="text-3xl leading-none transition hover:scale-110"
                style={{ color: s <= rating ? "#f59e0b" : "#e5e7eb" }}
                aria-label={`Rate ${s} star`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
            Your Thoughts
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tell us more about your experience..."
            rows={4}
            className="mt-2 w-full resize-none rounded-xl border px-3 py-2.5 text-sm outline-none"
            style={{ borderColor: "var(--border-default)", backgroundColor: "var(--color-tertiary)" }}
          />
        </div>

        <div className="mt-5 flex items-center gap-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={pending || rating === 0}
            className="flex-1 rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: "var(--color-primary-700)", color: "var(--interactive-primary-text)" }}
          >
            {pending ? "Submitting..." : "Submit Review"}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--text-secondary)" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}