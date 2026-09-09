import type { Metadata } from "next";
import Content from "@/content/kit";
export const metadata: Metadata = {
  title: "HARU — Kit de duas",
  description:
    "Kit HARU de duas escovas de bambu com cerdas de crina de cavalo.",
};
export default function Page() {
  return <Content />;
}
