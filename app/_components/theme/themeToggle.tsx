"use client";

import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  function flip() {
    const root = document.documentElement;
    const next =
      root.getAttribute("data-theme") === "kraft" ? "clara" : "kraft";
    root.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("haru-theme", next);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      className="btn bg-transparent hover:bg-transparent border-0"
      onClick={flip}
      aria-label="Alternar tema claro e modo anti-luz azul"
    >
      <Moon className="theme-toggle__moon" size={15} />
      <Sun className="theme-toggle__sun" size={15} />
    </button>
  );
}