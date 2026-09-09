import type { Metadata } from "next";
import { StoreProvider } from "@/components/store-provider";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";
export const metadata: Metadata = {
  title: "HARU",
  description: "Higiene feita de matéria, não de plástico.",
  icons: { icon: "/images/logo-olive.png" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" data-theme="clara" suppressHydrationWarning>
      <body>
        <StoreProvider>
          <SiteShell>{children}</SiteShell>
        </StoreProvider>
      </body>
    </html>
  );
}
