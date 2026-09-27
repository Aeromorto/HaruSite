"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Apple, ChevronLeft, CreditCard, QrCode } from "lucide-react";
import { useCart } from "../cart/cartContext";
import type { ProductShape } from "@/app/_data/products";

interface ProductPageProps {
  product: ProductShape;
  collection: ProductShape[];
}

export default function ProductPage({ product, collection }: ProductPageProps) {
  const [active, setActive] = useState(0);
  const { add } = useCart();
  const others = collection.filter((p) => p.slug !== product.slug);

  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 py-10 md:grid-cols-2">
      <section className="flex flex-col gap-3">
        <figure className="overflow-hidden rounded">
          <Image
            src={product.gallery[active]}
            alt={product.alt}
            width={1024}
            height={1024}
            className="w-full object-cover"
          />
        </figure>
        <div className="grid grid-cols-4 gap-2">
          {product.gallery.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Ver imagem ${i + 1} de ${product.name}`}
              className={
                i === active
                  ? "opacity-100 ring-1 ring-olive ring-offset-1"
                  : "opacity-60 hover:opacity-100"
              }
            >
              <Image
                src={src}
                alt=""
                width={256}
                height={256}
                className="w-full rounded object-cover"
              />
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 text-olive-deep">
        <span className="flex items-center gap-1">
          <ChevronLeft strokeWidth={1} size={18} />
          <Link
            href="/#loja"
            className="font-light text-xs uppercase"
          >
            Voltar à coleção
          </Link>
        </span>
        <p className="text-muted text-xs font-extralight uppercase tracking-widest">
          Coleção
        </p>
        <h1 className="font-[Cormorant_Garamond_Variable] text-3xl font-medium">
          {product.name}
        </h1>
        <p className="text-sm">{product.priceLabel}</p>
        <p className="font-light">{product.description}</p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => add(product)}
            className="btn btn-outline bg-transparent font-light text-sm uppercase tracking-widest"
          >
            Adicionar à cesta
          </button>
          <button
            type="button"
            className="btn bg-olive-deep font-light text-sm uppercase tracking-widest text-white"
          >
            Finalizar a compra
          </button>
        </div>

        <dl className="grid gap-4 py-4">
          {product.specs.map((spec) => (
            <div key={spec.label} className="flex flex-col">
              <dt className="font-extralight">{spec.label}</dt>
              <dd className="font-light">{spec.value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-2 border-t pt-4">
          <p className="text-sm font-light">FRETE</p>
          <span className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              className="input focus:outline-0"
              placeholder="00000-000"
            />
            <button
              type="button"
              className="btn bg-olive-deep font-light text-sm uppercase tracking-widest text-white"
            >
              Calcular
            </button>
          </span>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4">
          <p className="text-sm font-light">PAGAMENTO</p>
          <ul className="flex items-center gap-5">
            <li className="flex items-center gap-1 text-sm">
              <QrCode size={18} />
              <span>PIX</span>
            </li>
            <li className="flex items-center gap-1 text-sm">
              <CreditCard size={18} />
              <span>Cartão</span>
            </li>
            <li className="flex items-center gap-1 text-sm">
              <Apple size={18} />
              <span>Apple Pay</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="md:col-span-2" aria-labelledby="also-title">
        <h2
          id="also-title"
          className="font-[Cormorant_Garamond_Variable] mb-6 text-2xl font-medium"
        >
          Na coleção
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {others.map((item) => (
            <Link
              key={item.slug}
              href={`/products/${item.slug}`}
              className="group flex items-center gap-4"
            >
              <Image
                src={item.gallery[0]}
                alt={item.alt}
                width={160}
                height={160}
                className="h-28 w-28 rounded object-cover"
              />
              <span className="flex flex-col gap-1">
                <span className="font-[Cormorant_Garamond_Variable] text-2xl font-medium text-olive-deep">
                  {item.name}
                </span>
                <span className="text-sm text-muted">{item.priceLabel}</span>
                <span className="text-sm font-light underline underline-offset-4">
                  Ver produto
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}