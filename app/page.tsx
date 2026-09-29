import Image from "next/image";
import Header from "./_components/header/header";
import Link from "next/link";
import Hero from "./_components/hero/hero";
import Footer from "./_components/footer/footer";
import ProductsGallery from "./_components/productsGallery/productsGallery";
import { asset } from "./_lib/assets";

export default function Home() {
  return (
    <>
        <Hero />
        <Header />
      <main>
        <ProductsGallery />
        <section className="flex flex-col text-text items-center text-center h-fit py-30 gap-10 min-w-auto max-w-4xl mx-auto" id="brand">
          <h3 className="font-light text-xs tracking-widest">A MARCA</h3>
          <h2 className="font-[Cormorant_Garamond_Variable] text-7xl font-medium">
            HARU é matéria <br />
            natural.
          </h2>
          <p className="font-light min-w-auto max-w-xl">
            Materiais que voltam para a terra. Escovas de bambu com cerdas de
            crina de cavalo &#x2010; feitas para o hábito, não para o descarte.
          </p>
          <Image
            alt="Imagem de um cavalo"
            src={asset("/background/marca-crina.jpg")}
            width={1080}
            height={720}
            className="p-2"
          />
        </section>
        <section className="py-30 px-10 bg-olive-deep text-white flex flex-col gap-10">
          <p className="font-extralight tracking-widest text-sm">
            POR QUE HARU
          </p>
          <p className="font-[Cormorant_Garamond_Variable] text-5xl font-medium">
            Natural de verdade.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 mt-10">
            <div className="flex flex-col gap-5 min-w-auto max-w-sm">
              <p className="font-extralight text-sm text-white/70">01</p>
              <p className="font-[Cormorant_Garamond_Variable] text-3xl">
                100% natural
              </p>
              <p className="font-extralight">
                Cabo de bambu e cerdas de crina de cavalo. Sem nylon, sem
                bioplástico disfarçado.
              </p>
            </div>
            <div className="flex flex-col gap-5 min-w-auto max-w-sm">
              <p className="font-extralight text-sm text-white/70">02</p>
              <p className="font-[Cormorant_Garamond_Variable] text-3xl">
                Sem plástico
              </p>
              <p className="font-extralight">
                Pensado para desaparecer da forma certa — do objeto à embalagem.
              </p>
            </div>
            <div className="flex flex-col gap-5 min-w-auto max-w-sm">
              <p className="font-extralight text-sm text-white/70">03</p>
              <p className="font-[Cormorant_Garamond_Variable] text-3xl">
                Presença na pia
              </p>
              <p className="font-extralight">
                Bonito o suficiente para ficar à vista.
              </p>
            </div>
          </div>
        </section>
        <section className="flex flex-col place-items-center min-w-auto max-w-md mx-auto text-center text-text gap-10 py-40 px-2">
          <p className="uppercase font-light tracking-widest text-sm">
            O hábito
          </p>
          <p className="font-[Cormorant_Garamond_Variable] text-5xl font-medium">
            Entenda como os microplásticos fazem mal à saúde.
          </p>
          <p className="font-light">
            Escovas de plástico contaminam o seu corpo. Contaminam a terra. Um
            objeto íntimo não deveria deixar rastro por séculos.
          </p>
          <Link
            href={"/microplastic"}
            className="btn btn-md text-sm p-5 w-fit font-extralight uppercase bg-transparent border tracking-widest border-black"
          >
            Saber Mais
          </Link>
        </section>
        <section className="relative text-center py-60 text-white" id="contact">
          <div className="absolute inset-0 z-1 bg-forest/50" />
          <div className="z-1 flex flex-col gap-10 mx-auto relative min-w-auto max-w-lg">
            <p className="font-[Cormorant_Garamond_Variable] text-6xl font-medium">
              Fale com a HARU
            </p>
            <p className="font-light">
              A loja ainda está nascendo. Se quiser a coleção, uma parceria ou
              só conversar sobre o hábito &#x2010; escreva.
            </p>
          </div>
          <Image
            alt="Imagem de fundo com cavalos felizes"
            src={asset("/background/contact-horses.jpg")}
            width={1920}
            height={1200}
            className="absolute inset-0 z-0 object-cover w-full h-full"
          />
          <div>
            <span></span>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
