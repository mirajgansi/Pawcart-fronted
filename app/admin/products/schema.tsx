import { PET_CATEGORIES, PRODUCT_CATEGORIES, PetCategorySlug, ProductCategorySlug } from "@/lib/categories";
import { z } from "zod";

const PET_CATEGORY_SLUGS = ["dogs", "cats", "birds", "fish", "rabbits", "small-pets"] as const;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// ─── Attribute constants (mirror your backend) ────────────────────────────────

export const ACCESSORY_PATTERNS = ["solid","striped","plaid","floral","polka-dot","geometric","camouflage","tie-dye"] as const;
export const ACCESSORY_COLORS   = ["red","blue","orange","black","pink","green","yellow","purple","white","brown"] as const;
export const ACCESSORY_MATERIALS = ["nylon","leather","cotton","polyester","rubber","metal"] as const;
export const ACCESSORY_SIZES    = ["XS","S","M","L","XL","XXL"] as const;

export const TOY_PATTERNS   = ["solid","striped","spotted","printed","multi-color"] as const;
export const TOY_MATERIALS  = ["nylon","rubber","plush","rope","latex","plastic"] as const;

export const GROOMING_SKIN_TYPES = ["all","sensitive","dry","oily","normal"] as const;
export const GROOMING_COAT_TYPES = ["short","long","curly","double-coat","wire-haired","all"] as const;
export const GROOMING_SCENTS     = ["unscented","lavender","citrus","mint","oatmeal","coconut"] as const;
export const GROOMING_VOLUMES    = ["50ml","100ml","200ml","250ml","500ml","1L"] as const;

// ─── Base fields (shared across all categories) ───────────────────────────────

const BaseSchema = z.object({
  name:         z.string().min(2, "Name must be at least 2 characters"),
  description:  z.string().min(10, "Description must be at least 10 characters"),
  price:        z.coerce.number().positive("Price must be greater than 0"),
  inStock:      z.coerce.number().int().min(0).default(0),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  category: z.array(z.enum(PET_CATEGORY_SLUGS)).min(1, "Select at least one pet category"),
  image: z
    .array(z.instanceof(File))
    .min(1, "At least 1 image is required")
    .max(3, "Max 3 images")
    .refine((files) => files.every((f) => f.size <= MAX_FILE_SIZE), { message: "Each image must be max 5MB" })
    .refine((files) => files.every((f) => ACCEPTED_IMAGE_TYPES.includes(f.type)), { message: "Only jpg/png/webp allowed" })
    .optional(),
});

// ─── Category-specific schemas ────────────────────────────────────────────────

const FoodSchema = BaseSchema.extend({
  productCategory:  z.literal("food"),
  nutritionalInfo:  z.string().min(1, "Nutritional info is required for food"),
  manufactureDate:  z.string().optional().nullable(),
  expireDate:       z.string().optional().nullable(),
});

const AccessorySchema = BaseSchema.extend({
  productCategory: z.literal("accessories"),
  pattern:  z.enum(ACCESSORY_PATTERNS,  { message: "Pattern is required" }),
  colors:   z.array(z.enum(ACCESSORY_COLORS)).min(1, "At least one color required"),
  material: z.enum(ACCESSORY_MATERIALS, { message: "Material is required" }),
  size:     z.enum(ACCESSORY_SIZES,     { message: "Size is required" }),
  nutritionalInfo: z.string().optional().nullable(),
  manufactureDate: z.string().optional().nullable(),
  expireDate:      z.string().optional().nullable(),
});

const ToySchema = BaseSchema.extend({
  productCategory: z.literal("toys"),
  pattern:  z.enum(TOY_PATTERNS,   { message: "Pattern is required" }),
  colors:   z.array(z.enum(ACCESSORY_COLORS)).min(1, "At least one color required"),
  material: z.enum(TOY_MATERIALS,  { message: "Material is required" }),
  size:     z.enum(ACCESSORY_SIZES,{ message: "Size is required" }),
  nutritionalInfo: z.string().optional().nullable(),
  manufactureDate: z.string().optional().nullable(),
  expireDate:      z.string().optional().nullable(),
});

const GroomingSchema = BaseSchema.extend({
  productCategory:    z.literal("grooming"),
  skinType:           z.enum(GROOMING_SKIN_TYPES, { message: "Skin type is required" }),
  coatType:           z.enum(GROOMING_COAT_TYPES, { message: "Coat type is required" }),
  scent:              z.enum(GROOMING_SCENTS).optional(),
  volume:             z.enum(GROOMING_VOLUMES).optional(),
  isHypoallergenic:   z.boolean().default(false),
  nutritionalInfo:    z.string().optional().nullable(),
  manufactureDate:    z.string().optional().nullable(),
  expireDate:         z.string().optional().nullable(),
});

const HousingSchema = BaseSchema.extend({
  productCategory:  z.literal("housing"),
  nutritionalInfo:  z.string().optional().nullable(),
  manufactureDate:  z.string().optional().nullable(),
  expireDate:       z.string().optional().nullable(),
});

const HealthCareSchema = BaseSchema.extend({
  productCategory:  z.literal("health-care"),
  nutritionalInfo:  z.string().optional().nullable(),
  manufactureDate:  z.string().optional().nullable(),
  expireDate:       z.string().optional().nullable(),
});

// ─── Final discriminated union ────────────────────────────────────────────────

export const ProductSchema = z.discriminatedUnion("productCategory", [
  FoodSchema,
  AccessorySchema,
  ToySchema,
  GroomingSchema,
  HousingSchema,
  HealthCareSchema,
]);

export type ProductData = z.input<typeof ProductSchema>;
export const ProductEditSchema = ProductSchema.options.map((s) => s.partial());
export type ProductEditData = z.input<typeof ProductEditSchema>;