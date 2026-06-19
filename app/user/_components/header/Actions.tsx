"use client";

import { useAuth } from "@/context/AuthContext";
import { Heart, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMyCart } from "@/lib/api/cart";
import { CART_UPDATED_EVENT } from "@/lib/cart-event";
import AvatarMenu from "@/app/_componets/AvatarMenu";
import NotificationBell from "@/app/_componets/Notification";
import Link from "next/link";

type CartItem = { quantity: number };
type CartResponse = {
  data?: { items?: CartItem[] } | any;
  items?: CartItem[];
};

export default function Actions() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [cartCount, setCartCount] = useState(0);

  const displayName = user?.userName || user?.name || user?.email || "User";

  const fetchCartCount = async () => {
    try {
      const res: CartResponse = await getMyCart();
      const items: CartItem[] =
        res?.data?.items || res?.items || res?.data?.data?.items || [];
      setCartCount(items.length);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    if (loading) return;
    fetchCartCount();
    const handler = () => fetchCartCount();
    window.addEventListener(CART_UPDATED_EVENT, handler);
    return () => window.removeEventListener(CART_UPDATED_EVENT, handler);
  }, [loading]);

  return (
    <div className="flex items-center gap-5">
      {/* Favorites */}
      <Link
        href="/user/favorites"
        className="text-gray-600 hover:text-black transition"
        aria-label="Favorites"
      >
        <Heart size={20} />
      </Link>

      {/* Notifications */}
      <div className="flex justify-center xl:justify-end">
        {user?._id && (
          <NotificationBell userId={user._id} role={user.role} />
        )}
      </div>

      {/* Cart — navigates to cart page */}
      <button
        type="button"
        onClick={() => router.push("/user/cart")}
        className="relative text-gray-600 hover:text-black transition cursor-pointer"
        aria-label="Cart"
      >
        <ShoppingCart size={20} />

        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#7F1D1D] text-white text-xs min-w-5 h-5 px-1 flex items-center justify-center rounded-full">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </button>

      {/* User menu */}
      <AvatarMenu
        displayName={displayName}
        roleLabel=""
        image={user?.image}
        profileHref="/user/profile"
      />
    </div>
  );
}