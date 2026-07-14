"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type CartContextType = {
  cartCount: number;
  setCartCount: (n: number) => void;
  incrementCart: (by?: number) => void;
  decrementCart: (by?: number) => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

  const incrementCart = useCallback((by: number = 1) => {
    setCartCount((c) => c + by);
  }, []);

  const decrementCart = useCallback((by: number = 1) => {
    setCartCount((c) => Math.max(0, c - by));
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, incrementCart, decrementCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}