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
export default function IndexContent() {
  const { t } = useStore();
  return (
    <>
      <section className="hero" aria-label={t("hero.aria")}>
        <div className="hero__media">
          <img
            className="hero__img hero__img--a"
            src="/images/hero-bamboo.jpg"
            fetchPriority="high"
            decoding="sync"
            alt={t("hero.imgA")}
          />

          <img
            className="hero__img hero__img--b"
            src="/images/hero-2.jpg"
            fetchPriority="high"
            decoding="async"
            alt={t("hero.imgB")}
          />

          <div className="hero__veil" aria-hidden="true"></div>
        </div>

        <div className="hero__brand">
          <div className="hero__logo-wrap">
            <img
              className="hero__logo hero__logo--clara"
              src="/images/logo-light.png"
              alt=""
            />

            <img
              className="hero__logo hero__logo--kraft"
              src="/images/logo-light.png"
              alt={t("hero.logo")}
            />
          </div>

          <h1 className="hero__title">{"HARU"}</h1>

          <p className="hero__tag">{t("hero.tag")}</p>
        </div>

        <p className="hero__hint" aria-hidden="true">
          <span>{t("hero.hint")}</span>

          <svg
            className="hero__hint-arrow"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6"></path>
          </svg>
        </p>

        <div className="hero__ledge" aria-hidden="true"></div>
      </section>
      <main id="conteudo">
        <section className="section products" id="loja">
          <div className="products__head">
            <div>
              <p className="kicker reveal">{t("shop.kicker")}</p>

              <h2 className="products__title reveal">{t("shop.title")}</h2>
            </div>
          </div>

          <Catalog />
        </section>

        <section className="section manifesto" id="marca">
          <p className="kicker reveal">{t("brand.kicker")}</p>

          <h2 className="manifesto__quote reveal">{t("brand.quote")}</h2>

          <p className="manifesto__lead reveal">{t("brand.lead")}</p>

          <figure className="manifesto__photo reveal">
            <img
              src="/images/marca-crina.jpg"
              loading="lazy"
              decoding="async"
              alt={t("brand.alt")}
            />
          </figure>
        </section>

        <section className="section values" id="porque">
          <p className="kicker reveal">{t("why.kicker")}</p>

          <h2 className="values__title reveal">{t("why.title")}</h2>

          <div className="values__grid">
            <article className="value reveal">
              <p className="value__index">{"01"}</p>

              <h3 className="value__name">{t("why1.name")}</h3>

              <p className="value__text">{t("why1.text")}</p>
            </article>

            <article className="value reveal">
              <p className="value__index">{"02"}</p>

              <h3 className="value__name">{t("why2.name")}</h3>

              <p className="value__text">{t("why2.text")}</p>
            </article>

            <article className="value reveal">
              <p className="value__index">{"03"}</p>

              <h3 className="value__name">{t("why3.name")}</h3>

              <p className="value__text">{t("why3.text")}</p>
            </article>
          </div>
        </section>

        <section className="section matter" id="materia">
          <p className="kicker reveal">{t("matter.kicker")}</p>

          <h2 className="matter__title reveal">{t("matter.title")}</h2>

          <p className="matter__lead reveal">{t("matter.lead")}</p>

          <Link className="matter__cta reveal" href="/microplasticos">
            {t("matter.cta")}
          </Link>
        </section>

        <section className="section letter" id="cartas">
          <p className="kicker reveal">{t("letter.kicker")}</p>

          <h2 className="letter__title reveal">{t("letter.title")}</h2>

          <p className="letter__text reveal">{t("letter.text")}</p>

          <Newsletter />
        </section>

        <section className="section section--tight contact" id="contato">
          <div className="contact__media" aria-hidden="true">
            <img src="/images/contact-horses.jpg" alt="" />

            <div className="contact__veil"></div>
          </div>

          <h2 className="contact__title reveal">{t("contact.title")}</h2>

          <p className="contact__text reveal">{t("contact.text")}</p>

          <nav className="contact__ways reveal" aria-label={t("contact.ways")}>
            <a className="contact__cta" href="mailto:contato@haru.natural">
              {"contato@haru.natural"}
            </a>
          </nav>
        </section>
      </main>
    </>
  );
}
