"use server";
import {
  addProductComment,
  createProduct,
  deleteProduct,
  getAllProduct,
  getMyFavoriteProducts,
  getOutOfStockProducts,
  getPopularProducts,
  getProductById,
  getProductComments,
  getRecentProducts,
  getTopRatedProducts,
  getTrendingProducts,
  incrementProductView,
  rateProduct,
  restockProduct,
  toggleFavoriteProduct,
  updateProduct,
  // Pet category fetchers
  getProductsByDogs,
  getProductsByCats,
  getProductsByBirds,
  getProductsByFish,
  getProductsByRabbits,
  getProductsBySmallPets,
  getProductsByPet,
  // Product type fetchers
  getProductsByFood,
  getProductsByAccessories,
  getProductsByHousing,
  getProductsByGrooming,
  getProductsByToys,
  getProductsByHealthCare,
  getProductsByType,
} from "@/lib/api/product";
import { revalidatePath } from "next/cache";

// ─── Admin CRUD ───────────────────────────────────────────────────────────────

export const handleCreateProduct = async (data: FormData) => {
  try {
    const response = await createProduct(data);
    if (response.success) {
      revalidatePath("/products");
      return {
        success: true,
        message: "Create Product successful",
        data: response.data,
      };
    }
    return {
      success: false,
      message: response.message || "Failed to create Product",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to create Product",
    };
  }
};

export async function handleUpdateProduct(
  productId: string,
  formData: FormData,
) {
  try {
    const res = await updateProduct(productId, formData);
    if (res?.success) {
      revalidatePath("/admin/products");
      revalidatePath(`/admin/products/edit/${productId}`);
      revalidatePath(`/products/${productId}`);
      revalidatePath("/products");
    }
    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update product",
    };
  }
}

export async function handleDeleteProduct(id: string) {
  try {
    const result = await deleteProduct(id);
    if (result?.success) {
      revalidatePath("/admin/products");
      revalidatePath("/products");
      return {
        success: true,
        message: result.message || "Product deleted successfully",
        data: result.data,
      };
    }
    return {
      success: false,
      message: result?.message || "Delete product failed",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Delete product failed",
    };
  }
}

export async function handleRestockProduct(
  productId: string,
  payload: { quantity: number; mode?: "set" | "add" },
) {
  try {
    const res = await restockProduct(productId, payload);
    if (res?.success) {
      revalidatePath("/admin/products");
      revalidatePath(`/admin/products/edit/${productId}`);
      revalidatePath(`/products/${productId}`);
      revalidatePath("/products");
    }
    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to restock product",
    };
  }
}

// ─── General ──────────────────────────────────────────────────────────────────

export const handleGetAllProducts = async (params?: {
  page?: number;
  size?: number;
  search?: string;
  category?: string;
  productCategory?: string;
}) => {
  try {
    const response = await getAllProduct(params);
    if (response.success) {
      return {
        success: true,
        message: "All products fetched successfully",
        products: response.data.products ?? response.data,
        pagination: response.data.pagination,
      };
    }
    return {
      success: false,
      message: response.message || "Failed to fetch products",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch products",
    };
  }
};

export const handleGetProductById = async (id: string) => {
  try {
    if (!id) return { success: false, message: "Missing product id" };
    const response = await getProductById(id);
    if (response.success) {
      return { success: true, product: response.data };
    }
    return {
      success: false,
      message: response.message || "Failed to fetch product",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch product",
    };
  }
};

export async function handleIncrementProductView(productId: string) {
  try {
    await incrementProductView(productId);
    return { success: true };
  } catch {
    return { success: true }; // silent fail — non-critical
  }
}

export async function handleGetOutOfStockProducts(params?: {
  page?: number;
  size?: number | "all";
  search?: string;
  category?: string;
}) {
  try {
    const res = await getOutOfStockProducts(params);
    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch out of stock products",
    };
  }
}

// ─── Curated lists ────────────────────────────────────────────────────────────

export async function handleGetRecentProducts(page = 1, size = 10) {
  try {
    return await getRecentProducts(page, size);
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch recent products",
    };
  }
}

export async function handleGetTrendingProducts(page = 1, size = 10) {
  try {
    return await getTrendingProducts(page, size);
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch trending products",
    };
  }
}

export async function handleGetPopularProducts(page = 1, size = 10) {
  try {
    return await getPopularProducts(page, size);
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch popular products",
    };
  }
}

export async function handleGetTopRatedProducts(page = 1, size = 10) {
  try {
    return await getTopRatedProducts(page, size);
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch top rated products",
    };
  }
}

// ─── User interactions ────────────────────────────────────────────────────────

export async function handleRateProduct(
  productId: string,
  payload: { rating: number },
) {
  try {
    const res = await rateProduct(productId, payload);
    if (res?.success) {
      revalidatePath(`/products/${productId}`);
      revalidatePath("/products");
    }
    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to rate product",
    };
  }
}

export async function handleToggleFavoriteProduct(productId: string) {
  try {
    return await toggleFavoriteProduct(productId);
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to toggle favorite",
    };
  }
}

export async function handleGetFavoritesMe() {
  try {
    return await getMyFavoriteProducts();
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch favorites",
    };
  }
}

export async function handleAddProductComment(
  productId: string,
  payload: { comment: string },
) {
  try {
    const res = await addProductComment(productId, payload);
    if (res?.success) {
      revalidatePath(`/products/${productId}`);
    }
    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to add comment",
    };
  }
}

export async function handleGetProductComments(productId: string) {
  try {
    return await getProductComments(productId);
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch product comments",
    };
  }
}

// ─── Pet category actions ─────────────────────────────────────────────────────

export async function handleGetProductsByDogs() {
  try {
    return await getProductsByDogs();
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}
export async function handleGetProductsByCats() {
  try {
    return await getProductsByCats();
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}
export async function handleGetProductsByBirds() {
  try {
    return await getProductsByBirds();
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}
export async function handleGetProductsByFish() {
  try {
    return await getProductsByFish();
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}
export async function handleGetProductsByRabbits() {
  try {
    return await getProductsByRabbits();
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}
export async function handleGetProductsBySmallPets() {
  try {
    return await getProductsBySmallPets();
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}
export async function handleGetProductsByPet(category: string) {
  try {
    return await getProductsByPet(category);
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch pet products",
    };
  }
}

// ─── Product type actions ─────────────────────────────────────────────────────

export async function handleGetProductsByFood() {
  try {
    return await getProductsByFood();
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}
export async function handleGetProductsByAccessories() {
  try {
    return await getProductsByAccessories();
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}
export async function handleGetProductsByHousing() {
  try {
    return await getProductsByHousing();
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}
export async function handleGetProductsByGrooming() {
  try {
    return await getProductsByGrooming();
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}
export async function handleGetProductsByToys() {
  try {
    return await getProductsByToys();
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}
export async function handleGetProductsByHealthCare() {
  try {
    return await getProductsByHealthCare();
  } catch (e: any) {
    return { success: false, message: e.message };
  }
}
export async function handleGetProductsByType(productCategory: string) {
  try {
    return await getProductsByType(productCategory);
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch products by type",
    };
  }
}
