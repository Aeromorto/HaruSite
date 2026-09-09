import type { Metadata } from "next";
import Content from "@/content/uso";
export const metadata: Metadata = {
  title: "HARU — Notas de uso",
  description:
    "Composição, secagem e o soltar natural das cerdas — a escova HARU sem cola sintética.",
};
export default function Page() {
  return <Content />;
}
