import type { Metadata } from "next";
import Content from "@/content/termos";
export const metadata: Metadata = {
  title: "HARU — Termos de uso",
  description: "Uso do site, pedidos, preços e a coleção HARU.",
};
export default function Page() {
  return <Content />;
}
