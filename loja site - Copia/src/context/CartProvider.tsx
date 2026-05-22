"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine } from "@/types/product";

const STORAGE_KEY = "street-tees-cart";

type ToastState = { message: string; id: number } | null;

type CartContextValue = {
  lines: CartLine[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  toast: ToastState;
  addToCart: (line: Omit<CartLine, "quantity">) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeLine: (productId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotalCents: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(lines: CartLine[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    setLines(loadLines());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persist(lines);
  }, [lines, hydrated]);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToast({ message, id });
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, []);

  const addToCart = useCallback(
    (line: Omit<CartLine, "quantity">) => {
      setLines((prev) => {
        const idx = prev.findIndex((l) => l.productId === line.productId);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = {
            ...next[idx],
            quantity: next[idx].quantity + 1,
          };
          return next;
        }
        return [...prev, { ...line, quantity: 1 }];
      });
      showToast(`${line.name} · adicionado ao carrinho`);
    },
    [showToast],
  );

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
      setLines((prev) => prev.filter((l) => l.productId !== productId));
      return;
    }
    setLines((prev) =>
      prev.map((l) =>
        l.productId === productId ? { ...l, quantity } : l,
      ),
    );
  }, []);

  const removeLine = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const itemCount = useMemo(
    () => lines.reduce((s, l) => s + l.quantity, 0),
    [lines],
  );

  const subtotalCents = useMemo(
    () => lines.reduce((s, l) => s + l.priceCents * l.quantity, 0),
    [lines],
  );

  const value = useMemo(
    () => ({
      lines,
      cartOpen,
      setCartOpen,
      toast,
      addToCart,
      updateQuantity,
      removeLine,
      clearCart,
      itemCount,
      subtotalCents,
    }),
    [
      lines,
      cartOpen,
      toast,
      addToCart,
      updateQuantity,
      removeLine,
      clearCart,
      itemCount,
      subtotalCents,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
