"use client";

import {
  PET_CATEGORIES,
  PRODUCT_CATEGORIES,
  type PetCategorySlug,
  type ProductCategorySlug,
} from "@/lib/categories";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

// ─── Types ────────────────────────────────────────────────────────────────────

type AnyCategory = { slug: string; label: string; description?: string };
type AnySlug = PetCategorySlug | ProductCategorySlug;

type SingleProps = {
  mode?: "single";
  selected?: AnySlug;
  onSave: (value: AnySlug) => void;
};

type MultiProps = {
  mode: "multi";
  selected?: AnySlug[];
  onSave: (value: AnySlug[]) => void;
};

type CategoryModalProps = {
  open: boolean;
  onClose: () => void;
  categories?: readonly AnyCategory[];   // which list to show — defaults to PET_CATEGORIES
  title?: string;               // optional custom header title
} & (SingleProps | MultiProps);

// ─── Component ────────────────────────────────────────────────────────────────

export function CategoryModal(props: CategoryModalProps) {
  const {
    open,
    onClose,
    categories = PET_CATEGORIES,
    title,
  } = props;

  const isMulti = props.mode === "multi";

  const [q, setQ] = useState("");
  const [tempSingle, setTempSingle] = useState<AnySlug | "">(
    !isMulti ? (props.selected ?? "") : "",
  );
  const [tempMulti, setTempMulti] = useState<AnySlug[]>(
    isMulti ? (props.selected ?? []) : [],
  );

  useEffect(() => {
    if (!open) return;
    if (isMulti) {
      setTempMulti((props as MultiProps).selected ?? []);
    } else {
      setTempSingle((props as SingleProps).selected ?? "");
    }
    setQ("");
  }, [open]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return categories;
    return categories.filter(
      (c) =>
        c.label.toLowerCase().includes(query) ||
        c.slug.toLowerCase().includes(query) ||
        (c.description || "").toLowerCase().includes(query),
    );
  }, [q, categories]);

  if (!open) return null;

  const toggleMulti = (slug: AnySlug) => {
    setTempMulti((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const handleSave = () => {
    if (isMulti) {
      if (!tempMulti.length) return toast.error("Please select at least one category");
      (props as MultiProps).onSave(tempMulti);
    } else {
      if (!tempSingle) return toast.error("Please select a category");
      (props as SingleProps).onSave(tempSingle as AnySlug);
    }
    onClose();
  };

  const defaultTitle = isMulti ? "Select categories" : "Select a category";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
      <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-lime-700">
              {title ?? defaultTitle}
            </h2>
            {isMulti && tempMulti.length > 0 && (
              <p className="text-xs text-gray-400">{tempMulti.length} selected</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm hover:bg-black/5"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="mt-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search category..."
            className="h-10 w-full rounded-lg border px-3 text-sm outline-none focus:border-black/40"
          />
        </div>

        {/* List */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600">
            Results
            <span className="ml-1 text-xs text-gray-400">({filtered.length})</span>
          </p>

          <div className="mt-3 max-h-60 space-y-1 overflow-auto">
            {filtered.map((c) => (
              <label
                key={c.slug}
                className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-black/5"
              >
                {isMulti ? (
                  <input
                    type="checkbox"
                    checked={tempMulti.includes(c.slug as AnySlug)}
                    onChange={() => toggleMulti(c.slug as AnySlug)}
                    className="mt-1"
                  />
                ) : (
                  <input
                    type="radio"
                    name="categoryPick"
                    checked={tempSingle === c.slug}
                    onChange={() => setTempSingle(c.slug as AnySlug)}
                    className="mt-1"
                  />
                )}
                <div>
                  <p className="text-sm font-semibold text-lime-700">{c.label}</p>
                  {c.description && (
                    <p className="text-xs text-gray-500">{c.description}</p>
                  )}
                </div>
              </label>
            ))}

            {!filtered.length && (
              <p className="py-4 text-center text-sm text-gray-400">No categories found.</p>
            )}
          </div>
        </div>

        {/* Save */}
        <button
          type="button"
          onClick={handleSave}
          className="mt-5 h-10 w-full cursor-pointer rounded-lg bg-lime-800 text-sm font-semibold text-white hover:opacity-90"
        >
          Save
        </button>
      </div>
    </div>
  );
}