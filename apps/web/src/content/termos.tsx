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
export default function TermosContent() {
  const { t } = useStore();
  return (
    <>
      <main id="conteudo">
        <header className="page-head">
          <p className="kicker reveal">{t("terms.kicker")}</p>

          <h1 className="page-head__title reveal">{t("terms.h1")}</h1>

          <p className="page-head__lead reveal">{t("terms.lead")}</p>
        </header>

        <article className="legal-doc">
          <h2>{t("terms.h2a")}</h2>

          <p>{t("terms.p1")}</p>

          <h2>{t("terms.h2b")}</h2>

          <p>{t("terms.p2")}</p>

          <h2>{t("terms.h2c")}</h2>

          <p>{t("terms.p3")}</p>

          <h2>{t("terms.h2d")}</h2>

          <p>{t("terms.p4")}</p>

          <h2>{t("terms.h2e")}</h2>

          <p>{t("terms.p5")}</p>
        </article>
      </main>
    </>
  );
}
