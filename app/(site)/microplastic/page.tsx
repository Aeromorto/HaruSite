import Image from "next/image";
import type { Metadata } from "next";
import { asset } from "@/app/_lib/assets";

export const metadata: Metadata = {
  title: "HARU — O que a escova de nylon deixa no corpo",
  description:
    "Microplásticos na escovação, no sangue e na Terra. Por que a HARU usa crina, e não nylon.",
};

export default function Microplastic() {
  return (
    <main className="p-10 text-olive-deep flex flex-col gap-40 font-[Newsreader_Variable]">
      <section className="max-w-xl flex flex-col gap-10">
        <h1 className="font-light uppercase tracking-widest text-sm">
          Matéria
        </h1>
        <h2 className="font-[Cormorant_Garamond_Variable] text-7xl font-medium">
          O que a escova de nylon deixa no corpo.
        </h2>
        <p>
          Duas vezes ao dia, um polímero entra na boca. A HARU existe para que o
          hábito não precise disso.
        </p>
      </section>
      <section className="grid sm:grid-cols-2 items-center grid-cols-1 gap-10">
        <Image
          alt="imagem de uma escova de dentes de plástico"
          src={asset("/background/essay-corpo.jpg")}
          width={1280}
          height={720}
          className="min-w-auto"
        />
        <div className="flex flex-col max-w-2xl gap-5 text-lg">
          <p className="tracking-widest uppercase">01 — O corpo</p>
          <h3 className="font-[Cormorant_Garamond_Variable] text-5xl font-medium">
            Microplásticos. O hábito invisível.
          </h3>
          <p>
            A cerda de uma escova comum não é fibra natural. É nylon —
            poliamida, um plástico derivado de petróleo — ou um primo sintético
            como o PBT. Duas vezes ao dia, esse filamento é atritado contra o
            esmalte, a gengiva e o creme. O desgaste não é só da boca: é da
            própria cerda.
          </p>
          <p>
            Estudos de escovação simulada, com espectroscopia Raman, encontraram
            microplásticos soltos em todas as marcas testadas. Em um trabalho de
            2025, a média chegou a cerca de 39 partículas por dia, entre 8 e
            1995 micrômetros — fragmentos, fibras, filmes. Outra leitura, de
            2023, estimou milhares de detritos plásticos no uso cotidiano. A
            boca é mucosa. Partículas pequenas não precisam ser engolidas para
            entrar.
          </p>
          <p>
            Micro e nanoplásticos já foram medidos no sangue e, em 2024, no New
            England Journal of Medicine, dentro de placas de artéria carótida —
            associados a mais infarto, AVC e morte no acompanhamento. A escova
            não é a única fonte. É, porém, uma via oral, repetida, por décadas.
            Nylon também retém químicos do creme, como o triclosan, e os devolve
            depois. O hábito que deveria limpar deixa matéria que o corpo não
            pede.
          </p>
        </div>
      </section>
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 items-center">
        <div className="flex flex-col max-w-2xl gap-5 text-lg sm:order-1 order-2">
          <p className="tracking-widest uppercase">02 — A Terra</p>
          <h3 className="font-[Cormorant_Garamond_Variable] text-5xl font-medium">Depois do corpo, o planeta.</h3>
          <p>
            Quando a escova sai da pia, o problema não acaba. Nylon e
            polipropileno não voltam para o solo. Fragmentam. Uma escova de
            plástico leva da ordem de 500 anos para se partir em pedaços menores
            — e esses pedaços continuam sendo plástico. Não há desaparecimento.
            Há redução de escala.
          </p>
          <p>
            A recomendação odontológica é trocar o objeto a cada três ou quatro
            meses. Só nos Estados Unidos, isso passa de um bilhão de escovas por
            ano. No mundo, se o mesmo ritmo valesse para todos, seriam cerca de
            23 bilhões. Uma vida inteira deixa algumas centenas de unidades.
            Quase nenhuma se recicla de verdade: cabo, borracha e cerda são
            plásticos misturados, difíceis de separar.
          </p>
          <p>
            O que não vai para o aterro vai para o rio, o mar, o peixe, o sal. O
            mesmo tipo de partícula que se solta na boca é o que permanece na
            Terra. O hábito pessoal e o rastro planetário são o mesmo material.
          </p>
        </div>
        <Image
          alt="imagem de uma escova de dentes de plástico"
          src={asset("/background/essay-planeta.jpg")}
          width={1280}
          height={720}
          className="min-w-auto order-1 sm:order-2"
        />
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 items-center gap-10">
        <Image
          alt="imagem de uma escova de dentes de plástico"
          src={asset("/background/essay-crina.jpg")}
          width={1280}
          height={720}
          className="min-w-auto"
        />
        <div className="flex flex-col max-w-2xl gap-5 text-lg">
          <p className="tracking-widest uppercase">03 — A crina</p>
          <h3 className="font-[Cormorant_Garamond_Variable] text-5xl font-medium">
            Por que crina, e não plástico.
          </h3>
          <p>
            A cerda HARU é crina de cavalo: cabelo de crina e cauda,
            selecionado. A composição é queratina — a mesma proteína fibrosa do
            cabelo e das unhas humanas, um polímero natural de aminoácidos, não
            de petróleo. O diâmetro típico fica entre 50 e 80 micrômetros, mais
            fino que as cerdas de javali, macio o bastante para a gengiva.
          </p>
          <p>
            Antes de entrar no cabo de bambu, a crina é esterilizada a vapor.
            Não há nylon, PBT, “nylon de planta” nem bioplástico disfarçado.
            Quando o fio se desgasta, o que se solta é proteína orgânica — não
            um microplástico. O corpo já convive com queratina. O solo também: a
            crina se decompõe; o cabo de bambu, em meses, se o destino for o
            composto certo.
          </p>
          <p>
            Nylon foi a substituição industrial das cerdas naturais, a partir do
            fim dos anos 1930, porque era barato, uniforme e eterno. Eterno é
            exatamente o problema. A crina não promete durar séculos. Promete
            cumprir o hábito e desaparecer da forma certa.
          </p>
          <p>
            Trocar plástico por crina não é nostalgia. É recusar uma via
            cotidiana de polímero na mucosa — e um objeto que, depois de usado,
            continua no planeta. Matéria no lugar de resina. Esse é o essencial.
          </p>
        </div>
      </section>
      <section>
        <p className="min-w-auto max-w-lg text-xs">
          Notas. Escovação simulada e Raman (2023-2025) mediram soltura de
          microplásticos em escovas comerciais, inclusive nylon e PBT.
          Microplásticos no sangue (Leslie et al., 2022) e em placa carotídea
          (Marfella et al., NEJM, 2024) documentam a presença no corpo; a escova
          é uma via oral cotidiana, não a única. Uma escova de plástico
          fragmenta em séculos, não se biodegrada. A crina é queratina; o cabo
          HARU é bambu.
        </p>
      </section>
    </main>
  );
}
