"use client";
// Conteúdo editorial migrado da v5.5. Interações ficam nos componentes compartilhados.
import { useStore } from "@/components/store-provider";
import {
  Catalog,
  ProductActions,
  ProductPrice,
  Shipping,
  Newsletter,
} from "@/components/commerce";
export default function PrivacidadeContent() {
  const { t } = useStore();
  return (
    <>
      <main id="conteudo">
        <header className="page-head">
          <p className="kicker reveal">{t("privacy.kicker")}</p>

          <h1 className="page-head__title reveal">{t("privacy.h1")}</h1>

          <p className="page-head__lead reveal">{t("privacy.lead")}</p>
        </header>

        <article className="legal-doc">
          <h2>{t("privacy.h2a")}</h2>

          <p>{t("privacy.p1")}</p>

          <h2>{t("privacy.h2b")}</h2>

          <p>{t("privacy.p2")}</p>

          <h2>{t("privacy.h2c")}</h2>

          <p>{t("privacy.p3")}</p>

          <h2>{t("privacy.h2d")}</h2>

          <p>{t("privacy.p4")}</p>

          <h2>{t("privacy.h2e")}</h2>

          <p>{t("privacy.p5")}</p>
        </article>
      </main>
    </>
  );
}
