import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductPage from "@/app/_components/productPage/productPage";
import { getProduct, PRODUCTS } from "@/app/_data/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.docTitle,
    description: product.docDescription,
  };
}

export default async function ProductPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return <ProductPage product={product} collection={PRODUCTS} />;
}