import type { Metadata } from "next";
import Product from "@/app/_components/product/product";
import { PRODUCTS } from "@/app/_data/products";

export const metadata: Metadata = {
  title: "HARU — Coleção",
  description:
    "Escova de bambu, kit de duas e suporte de diatomito. Higiene feita de matéria, não de plástico.",
};

export default function Products() {
  return (
    <main className="flex flex-col gap-12 px-10 py-16">
      <span className="flex flex-col gap-4">
        <p className="tracking-widest text-sm font-light">COLEÇÃO</p>
        <h1 className="font-[Cormorant_Garamond_Variable] text-5xl font-medium">
          O essencial.
        </h1>
        <p className="max-w-md font-light text-muted">
          Três objetos, feitos para durar e para voltar para a terra.
        </p>
      </span>
      <div className="grid place-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {PRODUCTS.map((product) => (
          <Product key={product.slug} product={product} />
        ))}
      </div>
    </main>
  );
}