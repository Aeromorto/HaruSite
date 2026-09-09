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
export default function UsoContent() {
  const { t } = useStore();
  return (
    <>
      <main id="conteudo">
        <header className="page-head">
          <p className="kicker reveal">{t("use.kicker")}</p>

          <h1 className="page-head__title reveal">{t("use.h1")}</h1>

          <p className="page-head__lead reveal">{t("use.lead")}</p>
        </header>

        <div className="notes">
          <details className="note reveal">
            <summary>{t("use.q1")}</summary>

            <div className="note__body">
              <p>{t("use.a1p1")}</p>
            </div>
          </details>

          <details className="note reveal">
            <summary>{t("use.q2")}</summary>

            <div className="note__body">
              <p>{t("use.a2p1")}</p>
            </div>
          </details>

          <details className="note reveal">
            <summary>{t("use.q3")}</summary>

            <div className="note__body">
              <p>{t("use.a3p1")}</p>
            </div>
          </details>

          <details className="note reveal">
            <summary>{t("use.q4")}</summary>

            <div className="note__body">
              <p>{t("use.a4p1")}</p>
            </div>
          </details>

          <details className="note reveal">
            <summary>{t("use.q5")}</summary>

            <div className="note__body">
              <p>{t("use.a5p1")}</p>
            </div>
          </details>

          <details className="note reveal">
            <summary>{t("use.q6")}</summary>

            <div className="note__body">
              <p>{t("use.a6p1")}</p>
            </div>
          </details>
        </div>
      </main>
    </>
  );
}
