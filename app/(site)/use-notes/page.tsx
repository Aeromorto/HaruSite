import { Metadata } from "next";
import LegalTitle from "../../_components/legal/legalTitle/legalTitle";

export const metadata: Metadata = {
  title: "HARU — Notas de uso",
};

export default function UseNotes() {
  return (
    <main>
      <section className="flex flex-col gap-5 text-text p-10 max-w-xl">
        <LegalTitle subtitle="O USO" title="Notas de uso" />
        <p className="font-light">
          Cabo de bambu, cerdas de crina. Sem cola de plástico. Poucos cuidados
          bastam.
        </p>
        <div className="join join-vertical">
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input type="radio" name="my-accordion-4" defaultChecked />
            <div className="collapse-title font-semibold font-[Cormorant_Garamond_Variable] text-2xl">
              De que é feita?
            </div>
            <div className="collapse-content text-sm">
              Cabo de bambu, sem verniz plástico. Cerdas de crina de cavalo —
              queratina, a mesma proteína do cabelo — esterilizadas a vapor. Sem
              nylon.
            </div>
          </div>
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input type="radio" name="my-accordion-4" />
            <div className="collapse-title font-semibold font-[Cormorant_Garamond_Variable] text-2xl">
              Como secar?
            </div>
            <div className="collapse-content text-sm">
              Enxágue, sacuda e deixe secar em pé, cerdas para cima. Não deixe de
              molho nem fechada num copo úmido. O suporte de pedra ajuda a secar.
            </div>
          </div>
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input type="radio" name="my-accordion-4" />
            <div className="collapse-title font-semibold font-[Cormorant_Garamond_Variable] text-2xl">
              As cerdas se soltam?
            </div>
            <div className="collapse-content text-sm">
              É normal. Não usamos cola sintética: o fio é preso no bambu por
              pressão. Alguns fios podem sair na escovação. Se cair muita de uma
              vez, a escova provavelmente ficou tempo demais na água.
            </div>
          </div>
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input type="radio" name="my-accordion-4" />
            <div className="collapse-title font-semibold font-[Cormorant_Garamond_Variable] text-2xl">
              Pode molhar o bambu?
            </div>
            <div className="collapse-content text-sm">
              Sim, todo dia. Só não deixe de molho. Não ferva, não ponha na
              máquina e não deixe no sol forte por horas.
            </div>
          </div>
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input type="radio" name="my-accordion-4" />
            <div className="collapse-title font-semibold font-[Cormorant_Garamond_Variable] text-2xl">
              Onde guardar?
            </div>
            <div className="collapse-content text-sm">
              Em pé, cerdas para cima, no ar. O suporte de pedra é o melhor lugar.
            </div>
          </div>
          <div className="collapse collapse-arrow join-item border-base-300 border">
            <input type="radio" name="my-accordion-4" />
            <div className="collapse-title font-semibold font-[Cormorant_Garamond_Variable] text-2xl">
              Quando trocar?
            </div>
            <div className="collapse-content text-sm">
              Quando as cerdas já não limpam bem — em geral alguns meses. Depois
              pode ir para o composto: bambu e crina não são plástico.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
