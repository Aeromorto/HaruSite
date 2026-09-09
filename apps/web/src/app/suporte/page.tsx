import type { Metadata } from "next";
import Content from "@/content/suporte";
export const metadata: Metadata = {
  title: "HARU — Suporte de pedra",
  description:
    "Suporte de diatomito HARU. Seca a escova ao ar, sem plástico na pia.",
};
export default function Page() {
  return <Content />;
}
