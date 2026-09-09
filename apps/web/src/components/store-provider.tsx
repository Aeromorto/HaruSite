"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { Cart, Product } from "@haru/contracts";
import translations from "@/content/translations.json";
import { api } from "@/lib/api";

type Language = "pt" | "en";
type Theme = "clara" | "kraft";
const dictionary: Record<Language, Record<string, string>> = translations;
interface Store {
  lang: Language;
  theme: Theme;
  t: (key: string) => string;
  toggleLang: () => void;
  toggleTheme: () => void;
  products: Product[];
  cart: Cart | null;
  loading: boolean;
  busy: boolean;
  error: boolean;
  refresh: () => Promise<void>;
  change: (sku: string, quantity: number) => Promise<void>;
  cartOpen: boolean;
  setCartOpen: (value: boolean) => void;
}
const Context = createContext<Store | null>(null);
export function useStore() {
  const value = useContext(Context);
  if (!value) throw new Error("StoreProvider ausente");
  return value;
}
export function StoreProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [lang, setLang] = useState<Language>("pt");
  const [theme, setTheme] = useState<Theme>("clara");
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  // Ref fecha a janela entre o clique e o próximo render, impedindo mutações simultâneas.
  const mutation = useRef(false);
  const refreshing = useRef(false);
  const revision = useRef(0);
  const refresh = useCallback(async () => {
    if (mutation.current || refreshing.current) return;
    refreshing.current = true;
    const version = revision.current;
    setLoading(true);
    try {
      const [p, c] = await Promise.all([
        api<Product[]>("products"),
        api<Cart>("cart"),
      ]);
      if (version !== revision.current) return;
      setProducts(p);
      setCart(c);
      setError(false);
    } catch {
      if (version === revision.current) setError(true);
    } finally {
      refreshing.current = false;
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    let savedLang: string | null = null,
      savedTheme: string | null = null;
    try {
      savedLang = localStorage.getItem("haru-migration-lang");
      savedTheme = localStorage.getItem("haru-migration-theme");
    } catch {
      /* Preferências continuam funcionando em memória quando o armazenamento é bloqueado. */
    }
    const l = query.get("lang") || savedLang,
      th = query.get("theme") || savedTheme;
    setLang(l === "en" ? "en" : "pt");
    setTheme(
      th === "kraft" ||
        (!th && matchMedia("(prefers-color-scheme: dark)").matches)
        ? "kraft"
        : "clara",
    );
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.lang = lang;
  }, [lang, theme]);
  useEffect(() => {
    const titles: Record<string, string> = {
      "/": "docTitle",
      "/escova": "p1.docTitle",
      "/kit": "p2.docTitle",
      "/suporte": "p3.docTitle",
      "/uso": "useDocTitle",
      "/microplasticos": "essayDocTitle",
      "/privacidade": "privacyDocTitle",
      "/termos": "termsDocTitle",
    };
    if (titles[pathname]) document.title = dictionary[lang][titles[pathname]];
    setCartOpen(false);
  }, [pathname, lang]);
  useEffect(() => {
    // Revalida ao voltar de outra aba; nenhuma cópia da sacola vive em localStorage.
    const onFocus = () => {
      void refresh();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refresh]);
  const savePreference = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* Preferência só nesta aba. */
    }
  };
  async function change(sku: string, quantity: number) {
    if (mutation.current) return;
    mutation.current = true;
    revision.current += 1; // Descarta leituras iniciadas antes desta alteração.
    setBusy(true);
    try {
      setCart(
        await api<Cart>("cart/items", {
          method: "PUT",
          body: JSON.stringify({ sku, quantity }),
        }),
      );
      setError(false);
    } catch {
      setError(true);
    } finally {
      mutation.current = false;
      setBusy(false);
    }
  }
  const t = useCallback(
    (key: string) => dictionary[lang][key] || dictionary.pt[key] || key,
    [lang],
  );
  const value: Store = {
    lang,
    theme,
    t,
    products,
    cart,
    loading,
    busy,
    error,
    refresh,
    change,
    cartOpen,
    setCartOpen,
    toggleLang: () => {
      const next = lang === "pt" ? "en" : "pt";
      setLang(next);
      savePreference("haru-migration-lang", next);
    },
    toggleTheme: () => {
      const next = theme === "clara" ? "kraft" : "clara";
      setTheme(next);
      savePreference("haru-migration-theme", next);
    },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
