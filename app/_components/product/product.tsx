import Image from "next/image";
import Link from "next/link";
import type { ProductShape } from "@/app/_data/products";


export default function Product({
  product
}: {product :ProductShape}) {
  return (
    <Link href={`/products/${product.slug}`} className="card max-w-125 min-w-50">
      <figure>
        <Image
          alt={product.alt}
          src={product.gallery[0]}
          width={1024}
          height={1024}
          className="w-full"
        />
      </figure>
      <div className="p-2 card-body">
        <h2 className="text-2xl card-title font-[Cormorant_Garamond_Variable] font-[350]">
          {product.name}
        </h2>
        <p className="text-sm mt-2 font-light">{product.meta}</p>
        <div className="flex justify-between mt-4 card-actions">
          <p className="text-sm">R$ {product.priceLabel}</p>
          <p
            className="underline text-end underline-offset-4 tracking-widest font-thin text-sm text-lime-900"
          >
            VER PRODUTO
          </p>
        </div>
      </div>
    </Link>
  );
}
