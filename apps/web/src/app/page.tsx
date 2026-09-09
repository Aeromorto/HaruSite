import type { Metadata } from "next";
import Content from "@/content/index";
export const metadata: Metadata = {
  title: "HARU — Higiene feita de matéria, não de plástico",
  description:
    "HARU. Higiene feita de matéria, não de plástico — bambu e crina de cavalo.",
};
export default function Page() {
  return <Content />;
}
