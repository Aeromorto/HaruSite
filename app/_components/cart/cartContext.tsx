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
import type { ProductShape } from "@/app/_data/products";

export interface CartLine {
  slug: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

interface CartContextValue {
  items: CartLine[];
  count: number;
  total: number;
  add: (product: ProductShape) => void;
  remove: (slug: string) => void;
  increase: (slug: string) => void;
  decrease: (slug: string) => void;
}

const KEY = "haru-cart";

const CartContext = createContext<CartContextValue>({
  items: [],
  count: 0,
  total: 0,
  add: () => {},
  remove: () => {},
  increase: () => {},
  decrease: () => {},
});

function load(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as CartLine[];
  } catch {
    /* ignore */
  }
  return [];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loads persisted cart after hydration
    setItems(load());
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const add = useCallback((product: ProductShape) => {
    setItems((prev) => {
      const line = prev.find((l) => l.slug === product.slug);
      if (line) {
        return prev.map((l) =>
          l.slug === product.slug ? { ...l, qty: l.qty + 1 } : l,
        );
      }
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.gallery[0],
          qty: 1,
        },
      ];
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const increase = useCallback((slug: string) => {
    setItems((prev) =>
      prev.map((l) => (l.slug === slug ? { ...l, qty: l.qty + 1 } : l)),
    );
  }, []);

  const decrease = useCallback((slug: string) => {
    setItems((prev) =>
      prev
        .map((l) => (l.slug === slug ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const { count, total } = useMemo(
    () => ({
      count: items.reduce((sum, l) => sum + l.qty, 0),
      total: items.reduce((sum, l) => sum + l.qty * l.price, 0),
    }),
    [items],
  );

  const value = useMemo(
    () => ({ items, count, total, add, remove, increase, decrease }),
    [items, count, total, add, remove, increase, decrease],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
