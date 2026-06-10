export const API = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    WHOAMI: "/api/auth/whoami",
    UPDATEPROFILE: "/api/auth/update-profile",
    REQUEST_PASSWORD_RESET: "/api/auth/request-password-reset",
    VERIFY_RESET_CODE: "/api/auth/verify-reset-code",
    RESET_PASSWORD: `/api/auth/reset-password`,
    DELETEME: "/api/auth/me",
  },
  PRODUCT: {
    // ─── Admin CRUD ───────────────────────────────────────────────────────────
    CREATE: "/api/products/",
    GET_ALL: "/api/products/",
    GET_ONE: (id: string) => `/api/products/${id}`,
    UPDATE: (id: string) => `/api/products/${id}`,
    DELETE: (id: string) => `/api/products/${id}`,
    RESTOCK: (id: string) => `/api/products/${id}/restock`,

    // ─── User interactions ────────────────────────────────────────────────────
    RATE: (id: string) => `/api/products/${id}/rate`,
    FAVORITE_TOGGLE: (id: string) => `/api/products/${id}/favorite`,
    ADD_COMMENT: (id: string) => `/api/products/${id}/comment`,
    GET_COMMENTS: (id: string) => `/api/products/${id}/comments`,
    FAVORITES_ME: "/api/products/favorites/me",

    // ─── Curated lists ────────────────────────────────────────────────────────
    RECENT: "/api/products/recent",
    TRENDING: "/api/products/trending",
    POPULAR: "/api/products/popular",
    TOP_RATED: "/api/products/top-rated",

    // ─── Admin views ──────────────────────────────────────────────────────────
    OUT_OF_STOCK: "/api/products/out-of-stock",

    // ─── Pet category routes ──────────────────────────────────────────────────
    BY_PET_DOGS: "/api/products/pet/dogs",
    BY_PET_CATS: "/api/products/pet/cats",
    BY_PET_BIRDS: "/api/products/pet/birds",
    BY_PET_FISH: "/api/products/pet/fish",
    BY_PET_RABBITS: "/api/products/pet/rabbits",
    BY_PET_SMALL_PETS: "/api/products/pet/small-pets",
    BY_PET: (category: string) =>
      `/api/products/pet/${encodeURIComponent(category)}`,

    // ─── Product type/category routes ─────────────────────────────────────────
    BY_TYPE_FOOD: "/api/products/type/food",
    BY_TYPE_ACCESSORIES: "/api/products/type/accessories",
    BY_TYPE_HOUSING: "/api/products/type/housing",
    BY_TYPE_GROOMING: "/api/products/type/grooming",
    BY_TYPE_TOYS: "/api/products/type/toys",
    BY_TYPE_HEALTH_CARE: "/api/products/type/health-care",
    BY_TYPE: (productCategory: string) =>
      `/api/products/type/${encodeURIComponent(productCategory)}`,

    // ─── General ──────────────────────────────────────────────────────────────
    INCREMENT_VIEW: (id: string) => `/api/products/${id}/view`,
  },

  ADMIN: {
    USER: {
      CREATE: "/api/admin/users/",
      GETALLUSER: "/api/admin/users/",
      DELETEUSER: (id: string) => `/api/admin/users/${id}`,
    },
    ANALYTICS: {
      KPIS: "/api/admin/analytics/kpis",
      EARNINGS: "/api/admin/analytics/earnings",
      CATEGORY_SHARE: "/api/admin/analytics/category-share", // ?from=&to=
      TOP_PRODUCTS: "/api/admin/analytics/top-products",
      DRIVERS: "/api/admin/analytics/drivers",
      TOP_VIEWED_PRODUCTS: "/api/admin/analytics/topView",
    },
  },
  DRIVER: {
    GET_ALL: "/api/driver/stats",

    GET_STATS: "/api/driver/stats", // same thing (you can keep only one)
    GET_ONE_STATS: (id: string) => `/api/driver/stats/${id}`,
    GET_ONE_DRIVER: (id: string) => `/api/driver/${id}/detail`,

    // extra (since backend has these)
    UPDATE_AVAILABILITY: (id: string) => `/api/driver/${id}/status`,
    UPDATE_ORDER_STATUS: (id: string) => `/api/driver/orders/${id}/status`,
  },
  CART: {
    GET_MY_CART: "/api/cart/",
    ADD_ITEM: "/api/cart/items",
    UPDATE_ITEM_QTY: (productId: string) => `/api/cart/items/${productId}`,
    REMOVE_ITEM: (productId: string) => `/api/cart/items/${productId}`,
    CLEAR: "/api/cart/",
  },
  ORDER: {
    CREATE: "/api/orders",
    GET_MY: "/api/orders/me",
    GET_ONE: (id: string) => `/api/orders/${id}`,

    // admin
    GET_ALL: "/api/orders/",
    UPDATE_STATUS: (id: string) => `/api/orders/${id}/status`,
    CANCEL: (id: string) => `/api/orders/${id}/cancel`,
    ASSIGN_DRIVER: (id: string) => `/api/orders/${id}/assign-driver`,

    GET_MY_ASSIGNED: "/api/orders/driver/my-orders",
    DRIVER_UPDATE_STATUS: (id: string) => `/api/orders/driver/${id}/status`,

    GET_DRIVERS: "/api/admin/users",
  },
  NOTIFICATION: {
    GET_MY: "/api/notifications/me",
    UNREAD_COUNT: "/api/notifications/me/unread-count",
    READ_ALL: "/api/notifications/me/read-all",
    MARK_READ: (id: string) => `/api/notifications/${id}/read`,

    // admin only (optional)
    CREATE: "/api/notifications",
  },
};
