import Product from "../product/product";
import { PRODUCTS } from "@/app/_data/products";

export default function ProductsGallery() {
  return (
    <section className="md:mt-10 p-10" id="store">
      <span className="flex flex-col gap-10 py-15">
        <p className="tracking-widest text-sm font-light">COLEÇÃO</p>
        <p className="font-[Cormorant_Garamond_Variable] text-5xl font-medium">
          O essencial.
        </p>
      </span>
      <span className="grid place-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4  gap-10">
        {PRODUCTS.map((product) => (
          <Product key={product.slug} product={product} />
        ))}
      </span>
    </section>
  );
}
