"use client";

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarIcon, Camera, Plus, X, Check } from "lucide-react";
import { format } from "date-fns";

import { handleCreateProduct } from "@/lib/actions/product-action";
import { ProductData, ProductSchema } from "../schema";
import { CategoryModal } from "./category_modal";
import CreateProductStep1Skeleton from "./skeleton_add_prdocut";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/app/_componets/dropdown";
import {
  PET_CATEGORIES,
  PetCategorySlug,
  PRODUCT_CATEGORIES,
  ProductCategorySlug,
} from "@/lib/categories";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActionResponse =
  | { success: true; message?: string; data?: any }
  | { success: false; message?: string; issues?: any };

type WizardData = ProductData;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getErrorMessage(err: unknown, fallback = "Create product failed") {
  if (!err) return fallback;
  if (err instanceof Error) return err.message || fallback;
  if (typeof err === "string") return err;
  if (typeof err === "object") {
    const e = err as any;
    if (typeof e.message === "string" && e.message.trim()) return e.message;
    if (Array.isArray(e.issues) && e.issues.length) {
      const first = e.issues[0];
      const path = Array.isArray(first.path) ? first.path.join(".") : "";
      return path ? `${path}: ${first.message}` : first.message || "Invalid input";
    }
  }
  return fallback;
}

function normalizeActionResponse(res: any): ActionResponse {
  if (!res) return { success: false, message: "No response from server" };
  if (typeof res.success === "boolean") return res as ActionResponse;
  return { success: false, message: "Unexpected server response" };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PET_CATEGORY_META: Record<PetCategorySlug, { label: string; icon: string }> = {
  dogs:       { label: "Dogs",       icon: "🐕" },
  cats:       { label: "Cats",       icon: "🐈" },
  birds:      { label: "Birds",      icon: "🦜" },
  fish:       { label: "Fish",       icon: "🐟" },
  rabbits:    { label: "Rabbits",    icon: "🐇" },
  "small-pets": { label: "Small Pets", icon: "🐹" },
};

const PRODUCT_CATEGORY_META: Record<ProductCategorySlug, { label: string; icon: string }> = {
  food:         { label: "Food",        icon: "🥩" },
  accessories:  { label: "Accessories", icon: "🎀" },
  housing:      { label: "Housing",     icon: "🏠" },
  grooming:     { label: "Grooming",    icon: "✨" },
  toys:         { label: "Toys",        icon: "🎾" },
  "health-care":{ label: "Health Care", icon: "💊" },
};

const COLORS = ["red","blue","orange","black","pink","green","yellow","purple","white","brown"] as const;
const COLOR_HEX: Record<string, string> = {
  green:"#E24B4A", blue:"#378ADD", orange:"#EF9F27", black:"#1a1a1a",
  pink:"#D4537E", red:"#639922", yellow:"#BA7517", purple:"#7F77DD",
  white:"#e5e5e5", brown:"#854F0B",
};

// Step fields for per-step validation
const stepFields: Record<number, (keyof WizardData)[]> = {
  1: ["name", "image", "description", "price", "inStock", "manufacturer"],
  2: ["category", "productCategory"],
  3: [],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs text-red-500">{msg}</p>;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
      {children}
    </p>
  );
}

function DatePickerField({
  control,
  name,
  label,
}: {
  control: any;
  name: string;
  label: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <Controller
        control={control}
        name={name as any}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-10 w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  format(new Date(field.value), "PPP")
                ) : (
                  <span className="text-muted-foreground">Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(d) => field.onChange(d ? d.toISOString() : null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
      />
    </div>
  );
}

// ─── Conditional fields per product category ──────────────────────────────────

function FoodFields({ control, register, errors }: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium">
          Nutritional Info <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/40"
          placeholder="e.g. Protein 28%, Fat 14%, Fibre 3%"
          {...register("nutritionalInfo")}
        />
        <FieldError msg={errors.nutritionalInfo?.message} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <DatePickerField control={control} name="manufactureDate" label="Manufacture Date" />
        <DatePickerField control={control} name="expireDate" label="Expiry Date" />
      </div>
    </div>
  );
}

function AccessoryFields({ control, register, errors }: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Pattern <span className="text-red-500">*</span></label>
          <FormSelect
            control={control}
            name="pattern"
            placeholder="Select pattern"
            options={["solid","striped","plaid","floral","polka-dot","geometric","camouflage","tie-dye"].map((v) => ({ value: v, label: v }))}
            error={errors.pattern?.message}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Material <span className="text-red-500">*</span></label>
          <FormSelect
            control={control}
            name="material"
            placeholder="Select material"
            options={["nylon","leather","cotton","polyester","rubber","metal"].map((v) => ({ value: v, label: v }))}
            error={errors.material?.message}
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Size <span className="text-red-500">*</span></label>
        <FormSelect
          control={control}
          name="size"
          placeholder="Select size"
          options={["XS","S","M","L","XL","XXL"].map((v) => ({ value: v, label: v }))}
          error={errors.size?.message}
        />
      </div>
      <ColorPicker control={control} name="colors" error={errors.colors?.message} />
    </div>
  );
}

function ToyFields({ control, register, errors }: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Pattern <span className="text-red-500">*</span></label>
          <FormSelect
            control={control}
            name="pattern"
            placeholder="Select pattern"
            options={["solid","striped","spotted","printed","multi-color"].map((v) => ({ value: v, label: v }))}
            error={errors.pattern?.message}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Material <span className="text-red-500">*</span></label>
          <FormSelect
            control={control}
            name="material"
            placeholder="Select material"
            options={["nylon","rubber","plush","rope","latex","plastic"].map((v) => ({ value: v, label: v }))}
            error={errors.material?.message}
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Size <span className="text-sm font-medium">*</span></label>
        <FormSelect
          control={control}
          name="size"
          placeholder="Select size"
          options={["XS","S","M","L","XL","XXL"].map((v) => ({ value: v, label: v }))}
          error={errors.size?.message}
        />
      </div>
      <ColorPicker control={control} name="colors" error={errors.colors?.message} />
    </div>
  );
}

function GroomingFields({ control, register, errors }: any) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Skin Type <span className="text-red-500">*</span></label>
          <FormSelect
            control={control}
            name="skinType"
            placeholder="Select skin type"
            options={["all","sensitive","dry","oily","normal"].map((v) => ({ value: v, label: v }))}
            error={errors.skinType?.message}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Coat Type <span className="text-red-500">*</span></label>
          <FormSelect
            control={control}
            name="coatType"
            placeholder="Select coat type"
            options={["short","long","curly","double-coat","wire-haired","all"].map((v) => ({ value: v, label: v }))}
            error={errors.coatType?.message}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Scent</label>
          <FormSelect
            control={control}
            name="scent"
            placeholder="Select scent"
            options={["unscented","lavender","citrus","mint","oatmeal","coconut"].map((v) => ({ value: v, label: v }))}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium">Volume</label>
          <FormSelect
            control={control}
            name="volume"
            placeholder="Select volume"
            options={["50ml","100ml","200ml","250ml","500ml","1L"].map((v) => ({ value: v, label: v }))}
          />
        </div>
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 accent-red-600"
          {...register("isHypoallergenic")}
        />
        Hypoallergenic formula
      </label>
    </div>
  );
}

function HousingFields() {
  return (
    <div className="rounded-md bg-gray-50 px-4 py-3 text-sm text-gray-500">
      No additional attributes required for housing products.
    </div>
  );
}

function HealthCareFields({ register, errors }: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium">Usage Instructions</label>
        <textarea
          className="min-h-[80px] w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/40"
          placeholder="e.g. Administer once daily with food..."
          {...register("usageInstructions")}
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium">Warnings / Contraindications</label>
        <textarea
          className="min-h-[80px] w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/40"
          placeholder="e.g. Not suitable for pregnant animals..."
          {...register("warnings")}
        />
      </div>
    </div>
  );
}

// ─── Color multi-picker ───────────────────────────────────────────────────────

function ColorPicker({ control, name, error }: { control: any; name: string; error?: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Colors <span className="text-red-500">*</span>
      </label>
      <Controller
        control={control}
        name={name as any}
        render={({ field }) => (
          <div className="flex flex-wrap gap-2">
            {COLORS.map((color) => {
              const selected = (field.value ?? []).includes(color);
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    const current: string[] = field.value ?? [];
                    field.onChange(
                      selected ? current.filter((c) => c !== color) : [...current, color]
                    );
                  }}
                  className={[
                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium capitalize transition-all",
                    selected
                      ? "border-red-600 bg-red-50 text-red-700"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50",
                  ].join(" ")}
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full border border-black/10"
                    style={{ background: COLOR_HEX[color] }}
                  />
                  {color}
                </button>
              );
            })}
          </div>
        )}
      />
      <FieldError msg={error} />
    </div>
  );
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

export default function CreateProductWizard() {
  const [pending, startTransition] = useTransition();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [completed, setCompleted] = useState({ 1: false, 2: false, 3: false });
  const [pageLoading, setPageLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WizardData>({
    resolver: zodResolver(ProductSchema),
    shouldUnregister: false,
    mode: "onSubmit",
   defaultValues: {
  inStock: 0,
  image: [] as File[],
  category: [] as PetCategorySlug[],
  productCategory: undefined, 
},

  });

  const selectedProductCategory = watch("productCategory") as ProductCategorySlug | undefined;
  const selectedCategories: PetCategorySlug[] = watch("category") ?? [];
  const watchedImages: File[] = watch("image") ?? [];

  useEffect(() => {
    const t = setTimeout(() => setPageLoading(false), 700);
    return () => clearTimeout(t);
  }, []);

  // ── Image handling ──────────────────────────────────────────────────────────

  const handleImagesChange = (newFiles: File[], onChange: (f: File[]) => void, current: File[] = []) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    const valid = newFiles.filter((f) => allowed.includes(f.type) && f.size <= 5 * 1024 * 1024);
    if (valid.length !== newFiles.length) toast.error("Only JPG/PNG/WEBP under 5MB allowed");
    const merged = [...current, ...valid].slice(0, 3);
    if (current.length + valid.length > 3) toast.error("Max 3 images allowed");
    onChange(merged);
  };

  // ── Pet category toggle (multi-select) ─────────────────────────────────────

  const togglePetCategory = (slug: PetCategorySlug) => {
    const current: PetCategorySlug[] = selectedCategories;
    const next = current.includes(slug)
      ? current.filter((c) => c !== slug)
      : [...current, slug];
    setValue("category", next, { shouldValidate: true });
  };

  // ── Product category select (single) ───────────────────────────────────────

  const selectProductCategory = (slug: ProductCategorySlug) => {
    setValue("productCategory", slug, { shouldValidate: true });
  };

  // ── Navigation ─────────────────────────────────────────────────────────────

  const goNext = async () => {
    const fields = stepFields[step] as (keyof WizardData)[];
    const ok = await trigger(fields, { shouldFocus: true });
    if (!ok) return;
    setCompleted((p) => ({ ...p, [step]: true }));
    setStep((s) => (s === 1 ? 2 : 3) as 1 | 2 | 3);
  };

  const goBack = () => setStep((s) => (s === 3 ? 2 : 1) as 1 | 2 | 3);

  // ── Submit ─────────────────────────────────────────────────────────────────

  const onSubmit: SubmitHandler<WizardData> = async (data) => {
    if (step !== 3 || pending || isSubmitting) return;
    const ok = await trigger(undefined, { shouldFocus: true });
    if (!ok) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", String(data.price));
        formData.append("manufacturer", data.manufacturer);
        formData.append("inStock", String(data.inStock ?? 0));
        formData.append("productCategory", data.productCategory);

        // multi pet categories
(data.category ?? []).forEach((c: string) => formData.append("category", c));

        // category-specific fields
        if (data.productCategory === "food") {
          if (data.nutritionalInfo) formData.append("nutritionalInfo", data.nutritionalInfo);
          if (data.manufactureDate) formData.append("manufactureDate", data.manufactureDate);
          if (data.expireDate) formData.append("expireDate", data.expireDate);
        }
        if (data.productCategory === "accessories" || data.productCategory === "toys") {
          if ((data as any).pattern) formData.append("pattern", (data as any).pattern);
          if ((data as any).material) formData.append("material", (data as any).material);
          if ((data as any).size) formData.append("size", (data as any).size);
          ((data as any).colors ?? []).forEach((c: string) => formData.append("colors[]", c));
        }
        if (data.productCategory === "grooming") {
          if ((data as any).skinType) formData.append("skinType", (data as any).skinType);
          if ((data as any).coatType) formData.append("coatType", (data as any).coatType);
          if ((data as any).scent) formData.append("scent", (data as any).scent);
          if ((data as any).volume) formData.append("volume", (data as any).volume);
          formData.append("isHypoallergenic", String(!!(data as any).isHypoallergenic));
        }
        if (data.productCategory === "health-care") {
          if ((data as any).usageInstructions) formData.append("usageInstructions", (data as any).usageInstructions);
          if ((data as any).warnings) formData.append("warnings", (data as any).warnings);
        }

        (data.image ?? []).forEach((f: File) => formData.append("image", f));

        const raw = await handleCreateProduct(formData);
        const response = normalizeActionResponse(raw);
        if (!response.success) throw new Error(response.message || "Create product failed");

        toast.success(response.message || "Product created successfully");
        reset({ inStock: 0, image: [], category: [] });
        if (fileInputRef.current) fileInputRef.current.value = "";
        setCompleted({ 1: false, 2: false, 3: false });
        setStep(1);
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    });
  };

  // ── Stepper bubble ─────────────────────────────────────────────────────────

  const StepBubble = ({ n, label }: { n: 1 | 2 | 3; label: string }) => {
    const active = step === n;
    const done = completed[n];
    return (
      <button
        type="button"
        onClick={() => { if (n < step) setStep(n); }}
        className="flex items-center gap-2 text-left"
      >
        <span
          className={[
            "grid h-6 w-6 place-items-center rounded-full text-xs font-bold transition-colors",
            done || active ? "bg-red-600 text-white" : "bg-gray-100 text-gray-500",
          ].join(" ")}
        >
          {done ? <Check className="h-3 w-3" /> : n}
        </span>
        <span className={active ? "text-sm font-semibold text-black" : "text-sm text-gray-400"}>
          {label}
        </span>
      </button>
    );
  };

  if (pageLoading) return <CreateProductStep1Skeleton />;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Stepper */}
      <div className="flex flex-wrap items-center gap-4">
        <StepBubble n={1} label="Basic Info" />
        <div className="h-px w-6 bg-gray-200" />
        <StepBubble n={2} label="Categories" />
        <div className="h-px w-6 bg-gray-200" />
        <StepBubble n={3} label="Product Details" />
      </div>

      <AnimatePresence mode="wait">

        {/* ── STEP 1: Basic Info ── */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <SectionLabel>Product information</SectionLabel>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/40"
                placeholder="e.g. Royal Canin Adult Dog Food"
                {...register("name")}
              />
              <FieldError msg={errors.name?.message} />
            </div>

            {/* Images */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Images <span className="text-red-500">*</span>
              </label>
              <Controller
                name="image"
                control={control}
                render={({ field: { value = [], onChange } }) => (
                  <div
                    className="rounded-xl border border-dashed border-gray-300 p-5"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleImagesChange(Array.from(e.dataTransfer.files ?? []), onChange, value);
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.webp"
                      className="hidden"
                      onChange={(e) => handleImagesChange(Array.from(e.target.files ?? []), onChange, value)}
                    />
                    {value.length > 0 ? (
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-3">
                          {value.map((file: File, idx: number) => (
                            <div key={idx} className="relative">
                              <img
                                src={URL.createObjectURL(file)}
                                className="h-24 w-24 rounded-lg object-cover border border-black/10"
                                alt={`preview-${idx}`}
                              />
                              <button
                                type="button"
                                onClick={() => onChange(value.filter((_: any, i: number) => i !== idx))}
                                className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-red-500 text-white"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        {value.length < 3 && (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white"
                          >
                            <Plus className="h-3 w-3" /> Add more
                          </button>
                        )}
                      </div>
                    ) : (
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full">
                        <div className="grid place-items-center gap-2 py-6">
                          <div className="grid h-10 w-10 place-items-center rounded-full bg-gray-100">
                            <Camera className="h-5 w-5 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500">Browse or drag & drop</p>
                          <p className="text-xs text-gray-400">JPG, PNG, WEBP · max 5 MB · up to 3 images</p>
                        </div>
                      </button>
                    )}
                  </div>
                )}
              />
              <FieldError msg={String(errors.image?.message ?? "")} />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="min-h-[100px] w-full rounded-md border border-black/10 px-3 py-2 text-sm outline-none focus:border-black/40"
                placeholder="Describe the product, its benefits, ingredients or materials..."
                {...register("description")}
              />
              <FieldError msg={errors.description?.message} />
            </div>

            {/* Price + Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/40"
                  placeholder="0.00"
                  {...register("price", { valueAsNumber: true })}
                />
                <FieldError msg={errors.price?.message} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">
                  In Stock <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/40"
                  {...register("inStock", { valueAsNumber: true })}
                />
                <FieldError msg={errors.inStock?.message} />
              </div>
            </div>

            {/* Manufacturer */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Manufacturer <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="h-10 w-full rounded-md border border-black/10 px-3 text-sm outline-none focus:border-black/40"
                placeholder="e.g. Royal Canin"
                {...register("manufacturer")}
              />
              <FieldError msg={errors.manufacturer?.message} />
            </div>
          </motion.div>
        )}

        {/* ── STEP 2: Categories ── */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Pet categories — multi-select */}
            <div className="space-y-3">
              <div>
                <SectionLabel>Pet categories</SectionLabel>
                <p className="text-xs text-gray-400 -mt-2 mb-3">Select all that apply</p>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
                {(Object.keys(PET_CATEGORY_META) as PetCategorySlug[]).map((slug) => {
                  const { label, icon } = PET_CATEGORY_META[slug];
                  const selected = selectedCategories.includes(slug);
                  return (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => togglePetCategory(slug)}
                      className={[
                        "relative flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                        selected
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      <span className="text-base">{icon}</span>
                      <span>{label}</span>
                      {selected && (
                        <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-red-600">
                          <Check className="h-2.5 w-2.5 text-white" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedCategories.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedCategories.map((slug) => (
                    <span
                      key={slug}
                      className="flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700"
                    >
                      {PET_CATEGORY_META[slug].icon} {PET_CATEGORY_META[slug].label}
                      <button type="button" onClick={() => togglePetCategory(slug)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <FieldError msg={(errors as any).category?.message} />
            </div>

            {/* Product type — single select */}
            <div className="space-y-3">
              <div>
                <SectionLabel>Product type</SectionLabel>
                <p className="text-xs text-gray-400 -mt-2 mb-3">Choose one — this determines the extra fields in the next step</p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(PRODUCT_CATEGORY_META) as ProductCategorySlug[]).map((slug) => {
                  const { label, icon } = PRODUCT_CATEGORY_META[slug];
                  const selected = selectedProductCategory === slug;
                  return (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => selectProductCategory(slug)}
                      className={[
                        "relative flex flex-col items-center gap-1 rounded-lg border py-3 text-sm font-medium transition-all",
                        selected
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50",
                      ].join(" ")}
                    >
                      <span className="text-xl">{icon}</span>
                      <span className="text-xs">{label}</span>
                      {selected && (
                        <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-red-600">
                          <Check className="h-2.5 w-2.5 text-white" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <FieldError msg={(errors as any).productCategory?.message} />
            </div>
          </motion.div>
        )}

        {/* ── STEP 3: Product Details (conditional by productCategory) ── */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Summary badge */}
            {selectedProductCategory && (
              <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <span className="text-base">{PRODUCT_CATEGORY_META[selectedProductCategory]?.icon}</span>
                <span className="font-medium">{PRODUCT_CATEGORY_META[selectedProductCategory]?.label}</span>
                {selectedCategories.length > 0 && (
                  <span className="text-red-500">
                    · for {selectedCategories.map((c) => PET_CATEGORY_META[c].label).join(", ")}
                  </span>
                )}
              </div>
            )}

            {!selectedProductCategory && (
              <div className="rounded-md bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                ⚠️ Please go back and select a product type first.
              </div>
            )}

            {/* Conditional fields */}
            {selectedProductCategory === "food" && (
              <FoodFields control={control} register={register} errors={errors} />
            )}
            {selectedProductCategory === "accessories" && (
              <AccessoryFields control={control} register={register} errors={errors} />
            )}
            {selectedProductCategory === "toys" && (
              <ToyFields control={control} register={register} errors={errors} />
            )}
            {selectedProductCategory === "grooming" && (
              <GroomingFields control={control} register={register} errors={errors} />
            )}
            {selectedProductCategory === "housing" && (
              <HousingFields />
            )}
            {selectedProductCategory === "health-care" && (
              <HealthCareFields register={register} errors={errors} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => {
            if (step === 1) {
              reset({ inStock: 0, image: [], category: [] });
              if (fileInputRef.current) fileInputRef.current.value = "";
              setCompleted({ 1: false, 2: false, 3: false });
              toast.info("Form cleared");
              return;
            }
            goBack();
          }}
          className="h-10 rounded-md border border-gray-200 px-4 text-sm font-medium hover:bg-gray-50"
        >
          {step === 1 ? "Cancel" : "← Back"}
        </button>

        {step < 3 ? (
          <button
            type="button"
            onClick={goNext}
            className="h-10 rounded-md bg-red-600 px-6 text-sm font-semibold text-white hover:bg-red-700"
          >
            Continue →
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting || pending}
            className="h-10 rounded-md bg-red-600 px-6 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {isSubmitting || pending ? "Saving..." : "Create Product"}
          </button>
        )}
      </div>
    </form>
  );
}