"use client";
import Link from "next/link";
// Conteúdo editorial migrado da v5.5. Interações ficam nos componentes compartilhados.
import { useStore } from "@/components/store-provider";
import {
  Catalog,
  ProductActions,
  ProductPrice,
  Shipping,
  Newsletter,
} from "@/components/commerce";
export default function MicroplasticosContent() {
  const { t } = useStore();
  return (
    <>
      <main id="conteudo">
        <header className="page-head">
          <p className="kicker reveal">{t("essay.kicker")}</p>

          <h1 className="page-head__title reveal">{t("essay.h1")}</h1>

          <p className="page-head__lead reveal">{t("essay.lead")}</p>
        </header>

        <article>
          <section className="essay-block">
            <figure className="essay-block__media reveal">
              <img
                src="/images/essay-corpo.jpg"
                width="1600"
                height="900"
                loading="eager"
                decoding="async"
                alt={t("essay.01.alt")}
              />
            </figure>

            <div className="essay-block__body">
              <p className="kicker reveal">{t("essay.01.kicker")}</p>

              <h2 className="reveal">{t("essay.01.title")}</h2>

              <p className="reveal">{t("essay.01.p1")}</p>

              <p className="reveal">{t("essay.01.p2")}</p>

              <p className="reveal">{t("essay.01.p3")}</p>
            </div>
          </section>

          <section className="essay-block essay-block--alt essay-block--cream">
            <figure className="essay-block__media reveal">
              <img
                src="/images/essay-planeta.jpg"
                width="1600"
                height="900"
                loading="lazy"
                decoding="async"
                alt={t("essay.02.alt")}
              />
            </figure>

            <div className="essay-block__body">
              <p className="kicker reveal">{t("essay.02.kicker")}</p>

              <h2 className="reveal">{t("essay.02.title")}</h2>

              <p className="reveal">{t("essay.02.p1")}</p>

              <p className="reveal">{t("essay.02.p2")}</p>

              <p className="reveal">{t("essay.02.p3")}</p>
            </div>
          </section>

          <section className="essay-block">
            <figure className="essay-block__media reveal">
              <img
                src="/images/essay-crina.jpg"
                width="1600"
                height="900"
                loading="lazy"
                decoding="async"
                alt={t("essay.03.alt")}
              />
            </figure>

            <div className="essay-block__body">
              <p className="kicker reveal">{t("essay.03.kicker")}</p>

              <h2 className="reveal">{t("essay.03.title")}</h2>

              <p className="reveal">{t("essay.03.p1")}</p>

              <p className="reveal">{t("essay.03.p2")}</p>

              <p className="reveal">{t("essay.03.p3")}</p>

              <p className="reveal">{t("essay.03.p4")}</p>
            </div>
          </section>
        </article>

        <aside className="essay-notes">
          <p>{t("essay.notes")}</p>
        </aside>

        <p className="essay-close">
          <Link className="matter__cta reveal" href="/#loja">
            {t("essay.cta")}
          </Link>
        </p>
      </main>
    </>
  );
}
