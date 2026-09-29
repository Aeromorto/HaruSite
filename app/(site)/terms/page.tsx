import { Metadata } from "next";
import LegalNotes from "../../_components/legal/legalNotes/legalNotes";
import LegalTitle from "../../_components/legal/legalTitle/legalTitle";

export const metadata: Metadata = {
  title: "HARU — Termos de uso",
};

export default function TermsOfUse() {
  return (
    <main>
      <section className="flex flex-col gap-10 text-text p-10 max-w-xl">
        <LegalTitle title="Termos de uso" />
        <div className="flex flex-col gap-10">
          <LegalNotes
            title="O site"
            description="Ao usar o site da HARU, você concorda com estes termos. O conteúdo — textos, fotos, marca — pertence à HARU. Não copie para vender como se fosse seu."
          />
          <LegalNotes
            title="A coleção"
            description="As escovas são de bambu selecionado e crina de cavalos bem tratados, esterilizadas a vapor. Preços em reais. Fotos e textos podem mudar enquanto a loja se forma."
          />
          <LegalNotes
            title="Pedidos"
            description="O pedido se faz sem senha: e-mail, código e CEP completo. O pagamento ainda não está ligado; o esqueleto do pedido pode ficar salvo neste aparelho até o gateway existir."
          />
          <LegalNotes
            title="Envio e troca"
            description="O frete calculado no site é estimativa. Prazos e valores finais entram com o contrato dos Correios. Trocas e arrependimento seguem a lei brasileira de defesa do consumidor."
          />
          <LegalNotes
            title="Contato"
            description="Dúvidas: contato@haru.natural. Instagram e WhatsApp estão na área de contato da página principal."
          />
        </div>
      </section>
    </main>
  );
}
