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
export default function EscovaContent() {
  const { t } = useStore();
  return (
    <>
      <main id="conteudo">
        <article className="product">
          <div className="product__gallery">
            <figure className="product__shot">
              <img src="/images/product-escova.jpg" alt={t("p1.alt")} />
            </figure>

            <figure className="product__shot">
              <img src="/images/product-escova-2.jpg" alt="" />
            </figure>

            <figure className="product__shot">
              <img src="/images/product-escova-3.jpg" alt="" />
            </figure>

            <figure className="product__shot">
              <img src="/images/product-escova-4.jpg" alt="" />
            </figure>
          </div>

          <div className="product__info">
            <Link className="product__back" href="/#loja">
              {t("product.back")}
            </Link>

            <p className="kicker">{t("product.kicker")}</p>

            <h1 className="product__name">{t("p1.name")}</h1>

            <ProductPrice id="p1" />

            <p className="product__lead">{t("p1.desc")}</p>

            <ProductActions id="p1" />

            <dl className="product__specs">
              <div className="product__spec">
                <dt>{t("spec.handle")}</dt>

                <dd>{t("p1.handle")}</dd>
              </div>

              <div className="product__spec">
                <dt>{t("spec.bristle")}</dt>

                <dd>{t("p1.bristle")}</dd>
              </div>

              <div className="product__spec">
                <dt>{t("spec.care")}</dt>

                <dd>{t("p1.care")}</dd>
              </div>
            </dl>

            <p className="product__fine">{t("trust.anvisa")}</p>

            <section className="product__block" aria-labelledby="shipTitle">
              <h2 className="product__block-title" id="shipTitle">
                {t("product.ship")}
              </h2>

              <Shipping />
            </section>

            <section className="product__block" aria-labelledby="payTitle">
              <h2 className="product__block-title" id="payTitle">
                {t("product.pay")}
              </h2>

              <ul className="pays" aria-label={t("product.pay")}>
                <li>
                  <img
                    className="pays__pix"
                    src="/images/pix.png"
                    alt="PIX"
                    width="174"
                    height="64"
                  />
                </li>

                <li>
                  <svg
                    className="pays__ico pays__ico--card"
                    viewBox="0 0 24 16"
                    aria-hidden="true"
                  >
                    <rect
                      x="1.15"
                      y="1.15"
                      width="21.7"
                      height="13.7"
                      rx="1.7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.35"
                    ></rect>

                    <path
                      fill="currentColor"
                      d="M1.15 5.1h21.7v2.35H1.15z"
                    ></path>

                    <path
                      fill="currentColor"
                      d="M4.1 10.7h4.6v1.35H4.1z"
                    ></path>
                  </svg>

                  <span>{t("product.cardPay")}</span>
                </li>

                <li>
                  <img
                    className="pays__apple"
                    src="/images/apple-pay.png"
                    alt=""
                    width="74"
                    height="44"
                  />

                  <span>{t("product.applePay")}</span>
                </li>
              </ul>
            </section>
          </div>
        </article>

        <section className="also" aria-labelledby="alsoTitle">
          <h2 className="also__title" id="alsoTitle">
            {t("product.also")}
          </h2>

          <div className="also__grid">
            <Link className="also__item" href="/kit">
              <img
                src="/images/product-kit.jpg"
                alt={t("p2.alt")}
                width="480"
                height="480"
              />

              <span>{t("p2.name")}</span>
            </Link>

            <Link className="also__item" href="/suporte">
              <img
                src="/images/product-suporte.jpg"
                alt={t("p3.alt")}
                width="480"
                height="480"
              />

              <span>{t("p3.name")}</span>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
