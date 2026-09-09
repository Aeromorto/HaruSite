import type { Metadata } from "next";
import Content from "@/content/escova";
export const metadata: Metadata = {
  title: "HARU — Escova de bambu",
  description:
    "Escova de bambu HARU com cerdas de crina de cavalo. Sem nylon. Sem plástico.",
};
export default function Page() {
  return <Content />;
}
