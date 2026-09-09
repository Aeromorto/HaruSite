"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { PostalAddress } from "@haru/contracts";
import { useStore } from "./store-provider";
import { api, money } from "@/lib/api";

export function Catalog() {
  const { products, loading, error, refresh, t, lang } = useStore();
  const [max, setMax] = useState(""),
    [sort, setSort] = useState("collection");
  const filtered = products
    .filter((p) => max === "" || p.priceCents <= Number(max) * 100)
    .slice()
    .sort((a, b) =>
      sort === "asc"
        ? a.priceCents - b.priceCents
        : sort === "desc"
          ? b.priceCents - a.priceCents
          : a.id.localeCompare(b.id),
    );
  return (
    <>
      <div className="catalog-tools flex flex-wrap gap-4 items-end">
        <label className="form-control">
          <span>
            {lang === "pt" ? "Preço máximo (R$)" : "Maximum price (R$)"}
          </span>
          <input
            className="ui-input ui-input-bordered"
            type="number"
            min="0"
            step="1"
            value={max}
            onChange={(e) => setMax(e.target.value)}
          />
        </label>
        <label className="form-control">
          <span>{lang === "pt" ? "Ordenar por" : "Sort by"}</span>
          <select
            className="ui-select ui-select-bordered"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="collection">
              {lang === "pt" ? "Coleção" : "Collection"}
            </option>
            <option value="asc">
              {lang === "pt" ? "Menor preço" : "Price: low to high"}
            </option>
            <option value="desc">
              {lang === "pt" ? "Maior preço" : "Price: high to low"}
            </option>
          </select>
        </label>
        {max && (
          <button className="ui-btn ui-btn-ghost" onClick={() => setMax("")}>
            {lang === "pt" ? "Limpar filtro" : "Clear filter"}
          </button>
        )}
      </div>
      {loading && !products.length ? (
        <p role="status">
          {lang === "pt" ? "Carregando coleção…" : "Loading collection…"}
        </p>
      ) : null}
      {error && (
        <p className="service-note" role="status">
          {lang === "pt"
            ? "Não foi possível atualizar a loja."
            : "Unable to refresh the shop."}{" "}
          <button className="ui-btn ui-btn-sm" onClick={() => void refresh()}>
            {lang === "pt" ? "Tentar novamente" : "Retry"}
          </button>
        </p>
      )}
      <div className="products__grid">
        {filtered.map((p) => (
          <article className="card" key={p.sku}>
            <Link className="card__media" href={`/${p.slug}`}>
              <img
                src={p.image}
                alt={t(`${p.id}.alt`)}
                loading="lazy"
                width="800"
                height="1000"
              />
            </Link>
            <div className="card__body">
              <h3 className="card__name">
                <Link href={`/${p.slug}`}>{t(`${p.id}.name`)}</Link>
              </h3>
              <p className="card__meta">{t(`${p.id}.meta`)}</p>
              <div className="card__row">
                <span className="card__price">{money(p.priceCents)}</span>
                <Link className="card__link" href={`/${p.slug}`}>
                  {t("product.view")}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!loading && !error && filtered.length === 0 && (
        <p role="status">
          {lang === "pt"
            ? "Nenhum produto nesta faixa de preço."
            : "No products in this price range."}
        </p>
      )}
    </>
  );
}
export function ProductPrice({ id }: { id: string }) {
  const { products, lang } = useStore();
  const product = products.find((p) => p.id === id);
  return (
    <p className="product__price">
      {product
        ? money(product.priceCents)
        : lang === "pt"
          ? "Consultando preço…"
          : "Loading price…"}
    </p>
  );
}
export function ProductActions({ id }: { id: string }) {
  const { products, cart, change, setCartOpen, busy, t, lang } = useStore();
  const p = products.find((p) => p.id === id);
  const qty = cart?.items.find((i) => i.sku === p?.sku)?.quantity || 0;
  return (
    <>
      <div className="product__actions">
        <button
          className="product__cta product__cta--ghost"
          disabled={!p || !cart || busy || qty >= p.maxQuantity}
          onClick={async () => {
            if (p) {
              await change(p.sku, qty + 1);
              setCartOpen(true);
            }
          }}
        >
          {t("cart.add")}
        </button>
        <button className="product__cta" onClick={() => setCartOpen(true)}>
          {t("product.order")}
        </button>
      </div>
      {p?.stock === 0 && (
        <p role="status">
          {lang === "pt" ? "Produto indisponível." : "Product unavailable."}
        </p>
      )}
      <p className="service-note">
        {lang === "pt"
          ? "Compras online em preparação. A sacola não reserva estoque."
          : "Online purchases are being prepared. Your bag does not reserve stock."}
      </p>
    </>
  );
}
export function Shipping() {
  const { lang, t } = useStore();
  const [cep, setCep] = useState(""),
    [result, setResult] = useState<PostalAddress | null>(null),
    [status, setStatus] = useState("");
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  async function submit(e: FormEvent) {
    e.preventDefault();
    request.current?.abort();
    setResult(null);
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      setStatus("invalid");
      return;
    }
    const controller = new AbortController();
    request.current = controller;
    setStatus("loading");
    // Uma resposta antiga nunca substitui o CEP que o usuário acabou de editar.
    const timeout = setTimeout(() => controller.abort("timeout"), 10000);
    try {
      const data = await api<PostalAddress>(`postal/${digits}`, {
        signal: controller.signal,
      });
      if (request.current === controller) {
        setResult(data);
        setStatus("done");
      }
    } catch {
      if (request.current === controller) setStatus("error");
    } finally {
      clearTimeout(timeout);
    }
  }
  return (
    <form className="ship" onSubmit={submit} aria-busy={status === "loading"}>
      <label htmlFor="postal-input">{t("product.cep")}</label>
      <div className="ship__row">
        <input
          id="postal-input"
          className="ui-input ui-input-bordered"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={9}
          value={cep}
          placeholder="00000-000"
          onChange={(e) => {
            request.current?.abort();
            request.current = null;
            setResult(null);
            setStatus("");
            const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
            setCep(digits.replace(/(\d{5})(\d)/, "$1-$2"));
          }}
        />
        <button className="ui-btn" disabled={status === "loading"}>
          {t("product.cepGo")}
        </button>
      </div>
      <p role="status" className="ship__note">
        {status === "loading"
          ? t("product.cepLoading")
          : status === "invalid"
            ? t("product.cepErr")
            : status === "error"
              ? t("product.cepNet")
              : result
                ? `${result.city} / ${result.state}`
                : ""}
      </p>
      <p className="ship__note">
        {lang === "pt"
          ? "Consulta de endereço via ViaCEP. O preço e o prazo de entrega serão disponibilizados com a integração dos Correios."
          : "Address lookup via ViaCEP. Shipping prices and delivery dates will be available after the Correios integration."}
      </p>
    </form>
  );
}
export function Newsletter() {
  const { t, lang } = useStore();
  const [email, setEmail] = useState(""),
    [note, setNote] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    try {
      const value = email.trim().toLowerCase();
      // Preserva a função local da v5.5; não simula inscrição sem provedor de e-mail.
      localStorage.setItem("haru-migration-letter", value);
      setNote("letter.ok");
    } catch {
      setNote("letter.storageErr");
    }
  }
  return (
    <>
      <form className="letter__form" onSubmit={submit}>
        <label className="visually-hidden" htmlFor="letter-email">
          {t("letter.label")}
        </label>
        <input
          className="ui-input"
          id="letter-email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("letter.placeholder")}
        />
        <button className="ui-btn" type="submit">
          {t("letter.submit")}
        </button>
      </form>
      <button
        type="button"
        className="ui-btn ui-btn-ghost ui-btn-sm mt-4"
        onClick={() => {
          try {
            localStorage.removeItem("haru-migration-letter");
            setEmail("");
            setNote("removed");
          } catch {
            setNote("letter.storageErr");
          }
        }}
      >
        {lang === "pt"
          ? "Apagar e-mail deste aparelho"
          : "Delete email from this device"}
      </button>
      <p className="letter__note" role="status">
        {note === "removed"
          ? lang === "pt"
            ? "E-mail local apagado."
            : "Local email deleted."
          : note
            ? t(note)
            : ""}
      </p>
    </>
  );
}
