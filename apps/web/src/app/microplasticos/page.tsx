import type { Metadata } from "next";
import Content from "@/content/microplasticos";
export const metadata: Metadata = {
  title: "HARU — O que a escova de nylon deixa no corpo",
  description:
    "Como as escovas de nylon soltam microplásticos no corpo e no planeta — e por que a crina de cavalo é matéria, não polímero.",
};
export default function Page() {
  return <Content />;
}
