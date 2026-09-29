import { asset } from "@/app/_lib/assets";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductShape {
  slug: string;
  name: string;
  price: number;
  priceLabel: string;
  meta: string;
  description: string;
  specs: ProductSpec[];
  gallery: string[];
  alt: string;
  docTitle: string;
  docDescription: string;
}

export const PRODUCTS: ProductShape[] = [
  {
    slug: "escova",
    name: "Escova de bambu",
    price: 48,
    priceLabel: "R$ 48",
    meta: "Cerdas de crina selecionada, esterilizadas a vapor.",
    description:
      "Cabo de bambu selecionado, sem verniz plástico. Cerdas de crina de cavalo, esterilizadas a vapor, de animais selecionados e tratados com o devido cuidado.",
    specs: [
      { label: "Matéria", value: "Bambu selecionado, sem verniz plástico" },
      { label: "Cerdas", value: "Crina de cavalo, esterilizada a vapor" },
      { label: "Uso", value: "Secar em pé, cerdas para cima. Não deixar de molho." },
    ],
    gallery: [
      asset("/background/product-escova.jpg"),
      asset("/background/product-escova-2.jpg"),
      asset("/background/product-escova-3.jpg"),
      asset("/background/product-escova-4.jpg"),
    ],
    alt: "Escova de dentes de bambu com cerdas naturais",
    docTitle: "HARU — Escova de bambu",
    docDescription:
      "Escova de bambu HARU com cerdas de crina de cavalo. Sem nylon. Sem plástico.",
  },
  {
    slug: "kit",
    name: "Kit de duas",
    price: 86,
    priceLabel: "R$ 86",
    meta: "O mesmo cuidado para dividir o hábito.",
    description:
      "Duas escovas iguais: cabo de bambu selecionado, sem verniz plástico, e cerdas de crina de cavalo esterilizadas a vapor, de animais selecionados e tratados com o devido cuidado. O kit sai um pouco abaixo de comprar duas avulsas.",
    specs: [
      { label: "Matéria", value: "Duas unidades, bambu selecionado" },
      { label: "Cerdas", value: "Crina de cavalo, esterilizada a vapor" },
      { label: "Uso", value: "Secar em pé, cada uma no ar. Não deixar de molho." },
    ],
    gallery: [
      asset("/background/product-kit.jpg"),
      asset("/background/product-kit-2.jpg"),
      asset("/background/product-kit-3.jpg"),
      asset("/background/product-kit-4.jpg"),
    ],
    alt: "Duas escovas de bambu lado a lado",
    docTitle: "HARU — Kit de duas",
    docDescription:
      "Kit HARU de duas escovas de bambu com cerdas de crina de cavalo. Sem plástico.",
  },
  {
    slug: "suporte",
    name: "Suporte de pedra",
    price: 62,
    priceLabel: "R$ 62",
    meta: "Diatomito. Seca ao ar.",
    description:
      "Cubo de diatomito — pedra porosa que absorve a água e deixa a escova secar no ar, cerdas para cima. Sem plástico na pia.",
    specs: [
      { label: "Matéria", value: "Diatomito, bloco único" },
      { label: "Apoio", value: "Cabe uma escova em pé" },
      { label: "Uso", value: "Deixe secar ao ar. Não lave na máquina. Evite sabão em excesso." },
    ],
    gallery: [
      asset("/background/product-suporte.jpg"),
      asset("/background/product-suporte-2.jpg"),
      asset("/background/product-suporte-3.jpg"),
    ],
    alt: "Suporte cúbico de pedra para escovas",
    docTitle: "HARU — Suporte de pedra",
    docDescription:
      "Suporte de diatomito HARU. Seca a escova ao ar, sem plástico na pia.",
  },
];

export function getProduct(slug: string): ProductShape | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}