import type { Metadata } from "next";
import Content from "@/content/privacidade";
export const metadata: Metadata = {
  title: "HARU — Política de privacidade",
  description:
    "Como a HARU trata e-mail, CEP, carrinho e os dados deste aparelho.",
};
export default function Page() {
  return <Content />;
}
