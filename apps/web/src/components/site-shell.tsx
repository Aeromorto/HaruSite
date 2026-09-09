"use client";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useStore } from "./store-provider";
import { CartDrawer } from "./cart-drawer";
/** Cabeçalho/rodapé compartilhados preservam a identidade visual em todas as rotas. */
export function SiteShell({ children }: { children: ReactNode }) {
  const {
    lang,
    t,
    theme,
    toggleTheme,
    toggleLang,
    cart,
    cartOpen,
    setCartOpen,
  } = useStore();
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setMenu(false);
  }, [pathname]);
  useEffect(() => {
    document.documentElement.classList.toggle("nav-open", menu);
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        document.getElementById("navMenu")?.focus();
      }
    };
    if (menu) document.addEventListener("keydown", close);
    return () => {
      document.documentElement.classList.remove("nav-open");
      document.removeEventListener("keydown", close);
    };
  }, [menu]);
  return (
    <>
      <a className="skip" href="#conteudo">
        {t("skip")}
      </a>
      <div
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setMenu(false);
        }}
      >
        <header className="nav" id="topo">
          <Link className="nav__mark" href="/">
            {"HARU"}
          </Link>

          <div className="nav__right">
            <div className="nav__tools">
              <button
                className="theme-toggle"
                type="button"
                id="themeToggle"
                onClick={toggleTheme}
                aria-pressed={theme === "kraft"}
                aria-label={t(
                  theme === "kraft" ? "theme.toClara" : "theme.toKraft",
                )}
              >
                <svg
                  className="theme-toggle__moon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M16.5 12.5A6.5 6.5 0 0 1 11 5.1 7 7 0 1 0 18.9 13a6.5 6.5 0 0 1-2.4-.5Z"></path>
                </svg>

                <svg
                  className="theme-toggle__sun"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="4"></circle>

                  <path d="M12 3v1.6M12 19.4V21M4.9 4.9l1.1 1.1M18 18l1.1 1.1M3 12h1.6M19.4 12H21M4.9 19.1 6 18M18 6l1.1-1.1"></path>
                </svg>
              </button>

              <button
                className="cart-toggle"
                type="button"
                id="cartToggle"
                onClick={() => setCartOpen(true)}
                aria-expanded={cartOpen}
                aria-controls="cartDrawer"
                aria-label={t("cart.open")}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.15 8.85V7.1A3.85 3.85 0 0 1 12 3.35 3.85 3.85 0 0 1 15.85 7.1v1.75"></path>

                  <path d="M6.1 8.85h11.8l.9 12.3H5.2L6.1 8.85Z"></path>

                  <path d="M6.65 12.1h10.7"></path>
                </svg>

                <span className="cart-toggle__count" hidden={!cart?.quantity}>
                  {cart?.quantity || 0}
                </span>
              </button>
            </div>

            <button
              className="nav__menu"
              type="button"
              id="navMenu"
              onClick={() => setMenu(!menu)}
              aria-expanded={menu}
              aria-controls="navLinks"
              aria-label={t(menu ? "nav.close" : "nav.menu")}
            >
              <span className="nav__menu-bar" aria-hidden="true"></span>

              <span className="nav__menu-bar" aria-hidden="true"></span>
            </button>

            <ul className="nav__links" id="navLinks">
              <li>
                <Link href="/#loja">{t("nav.shop")}</Link>
              </li>

              <li>
                <Link href="/#marca">{t("nav.brand")}</Link>
              </li>

              <li>
                <Link href="/microplasticos">{t("nav.matter")}</Link>
              </li>

              <li>
                <Link href="/uso">{t("nav.use")}</Link>
              </li>

              <li>
                <Link href="/#contato">{t("nav.contact")}</Link>
              </li>
            </ul>
          </div>
        </header>
      </div>
      {children}
      <footer className="footer">
        <Link className="footer__brand" href="/">
          <span className="footer__mark" aria-hidden="true">
            <img src="/images/logo-olive.png" alt="" width="52" height="62" />
          </span>
          {" HARU "}
        </Link>

        <nav aria-label={t("footer.nav")}>
          <Link href="/#loja">{t("nav.shop")}</Link>

          <Link href="/#marca">{t("nav.brand")}</Link>

          <Link href="/microplasticos">{t("nav.matter")}</Link>

          <Link href="/uso">{t("nav.use")}</Link>

          <Link href="/#contato">{t("nav.contact")}</Link>
        </nav>

        <div className="footer__end">
          <button
            className="lang-toggle"
            type="button"
            id="langToggle"
            onClick={toggleLang}
            aria-label={t(lang === "pt" ? "lang.toEn" : "lang.toPt")}
          >
            <svg
              className="lang-toggle__mark"
              viewBox="0 0 64 64"
              aria-hidden="true"
            >
              <rect
                x="25.4"
                y="15.2"
                width="28.6"
                height="35.2"
                rx="5.2"
                fill="var(--white)"
              ></rect>

              <text
                x="37.4"
                y="45.6"
                fill="var(--olive-deep)"
                fontFamily="Noto Sans JP, Yu Gothic, Hiragino Sans, sans-serif"
                fontSize="18.5"
                fontWeight="500"
              >
                {"ほ"}
              </text>

              <path
                fill="var(--olive)"
                d="M16.5 8.9h20.4c3.5 0 6.3 2.8 6.3 6.3L28.1 52.2H16.5c-3.5 0-6.3-2.8-6.3-6.3V15.2c0-3.5 2.8-6.3 6.3-6.3z"
              ></path>

              <path
                fill="var(--forest)"
                d="M32.1 43.2 28.1 52.2 38.6 56.4 41.4 47.1z"
              ></path>

              <path
                fill="var(--ivory)"
                d="M16.9 21.5h4.1v7.5h7.3v-7.5h4.1V41.2h-4.1v-8.1h-7.3v8.1h-4.1z"
              ></path>
            </svg>
          </button>

          <span className="footer__rule" aria-hidden="true"></span>

          <p>{t("footer.copy")}</p>
        </div>

        <p className="legal">
          <span>{t("legal.copy")}</span>

          <span className="legal__sep" aria-hidden="true">
            {"·"}
          </span>

          <Link href="/privacidade">{t("legal.privacy")}</Link>

          <span className="legal__sep" aria-hidden="true">
            {"·"}
          </span>

          <Link href="/termos">{t("legal.terms")}</Link>

          <span className="legal__sep" aria-hidden="true">
            {"·"}
          </span>

          <Link href="/migracao">{"Migração / Migration"}</Link>
        </p>
      </footer>
      <CartDrawer />
    </>
  );
}
