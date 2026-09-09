"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useStore } from "./store-provider";
import { money } from "@/lib/api";

export function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    change,
    busy,
    error,
    refresh,
    loading,
    t,
    lang,
  } = useStore();
  const dialog = useRef<HTMLDialogElement>(null);
  const [notice, setNotice] = useState(false);
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (cartOpen && !el.open) {
      el.showModal();
      setNotice(false);
    } else if (!cartOpen && el.open) el.close();
    // Dialog nativo mantém foco dentro da sacola e bloqueia o conteúdo de fundo.
    document.documentElement.classList.toggle("cart-open", cartOpen);
    return () => document.documentElement.classList.remove("cart-open");
  }, [cartOpen]);
  return (
    <dialog
      id="cartDrawer"
      ref={dialog}
      className="haru-dialog"
      aria-labelledby="cart-title"
      onCancel={() => setCartOpen(false)}
      onClose={() => setCartOpen(false)}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            setCartOpen(false);
        }
      }}
    >
      <header className="flex items-center justify-between gap-4">
        <h2 id="cart-title">{t("cart.title")}</h2>
        <button
          className="ui-btn ui-btn-circle ui-btn-ghost"
          aria-label={t("cart.close")}
          onClick={() => setCartOpen(false)}
        >
          ×
        </button>
      </header>
      {loading && !cart && (
        <p role="status">
          {lang === "pt" ? "Carregando sacola…" : "Loading bag…"}
        </p>
      )}
      {error && (
        <div className="service-note" role="alert">
          <p>
            {lang === "pt"
              ? "Não foi possível atualizar a sacola. Confira a conexão e tente novamente."
              : "Unable to update your bag. Check your connection and try again."}
          </p>
          <button
            className="ui-btn ui-btn-sm"
            disabled={busy}
            onClick={() => void refresh()}
          >
            {lang === "pt" ? "Tentar novamente" : "Retry"}
          </button>
        </div>
      )}
      {cart?.items.length === 0 && (
        <div className="cart-vacant">
          <p>{t("cart.empty")}</p>
          <p>{t("cart.emptyLead")}</p>
          <Link
            className="product__cta"
            href="/#loja"
            onClick={() => setCartOpen(false)}
          >
            {t("cart.shop")}
          </Link>
        </div>
      )}
      <ul className="cart-list">
        {cart?.items.map((item) => (
          <li className="cart-line" key={item.sku}>
            <Link
              href={`/${item.slug}`}
              className="cart-line__img"
              onClick={() => setCartOpen(false)}
            >
              <img
                src={item.image}
                alt={t(`${item.id}.name`)}
                width="100"
                height="120"
              />
            </Link>
            <div className="cart-line__body">
              <p className="cart-line__name">{t(`${item.id}.name`)}</p>
              <p>{money(item.priceCents)}</p>
              <div className="cart-line__qty">
                <button
                  aria-label={`${t("cart.decrease")}: ${t(`${item.id}.name`)}`}
                  disabled={busy}
                  onClick={() => void change(item.sku, item.quantity - 1)}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  aria-label={`${t("cart.increase")}: ${t(`${item.id}.name`)}`}
                  disabled={busy || item.quantity >= item.maxQuantity}
                  onClick={() => void change(item.sku, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              {item.quantity > item.maxQuantity && (
                <p role="status">
                  {lang === "pt"
                    ? "O limite disponível mudou. Reduza a quantidade."
                    : "Availability changed. Reduce the quantity."}
                </p>
              )}
            </div>
            <button
              className="cart-line__remove"
              disabled={busy}
              aria-label={`${t("cart.remove")}: ${t(`${item.id}.name`)}`}
              onClick={() => void change(item.sku, 0)}
            >
              {t("cart.remove")}
            </button>
          </li>
        ))}
      </ul>
      {!!cart?.items.length && (
        <div className="cart-foot">
          <p className="cart-foot__sum">
            <span>{t("cart.subtotal")}</span>
            <strong>{money(cart.subtotalCents)}</strong>
          </p>
          <button className="product__cta" onClick={() => setNotice(true)}>
            {t("cart.checkout")}
          </button>
          <p className="service-note" role="status">
            {notice ? t("check.unavailable") : ""}
          </p>
        </div>
      )}
      <p className="visually-hidden" role="status" aria-live="polite">
        {cart
          ? `${cart.quantity} — ${t("cart.subtotal")}: ${money(cart.subtotalCents)}`
          : ""}
      </p>
    </dialog>
  );
}
