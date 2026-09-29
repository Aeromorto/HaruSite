import { Metadata } from "next";
import LegalNotes from "../../_components/legal/legalNotes/legalNotes";
import LegalTitle from "../../_components/legal/legalTitle/legalTitle";

export const metadata: Metadata = {
  title: "HARU — Política de privacidade",
};

export default function Privacy() {
  return (
    <main>
      <section className="flex flex-col gap-10 text-text p-10 max-w-xl">
        <LegalTitle title="Privacidade" />
        <div className="flex flex-col gap-10">
          <LegalNotes
            title="Quem somos"
            description="HARU é uma marca de higiene em matéria natural — bambu e crina de
                cavalo. O contato é contato@haru.natural."
          />
          <LegalNotes
            title="O que guardamos"
            description="Para um pedido: e-mail, nome e o endereço completo do CEP. Não
                pedimos senha. O código de seis dígitos serve só para confirmar o
                e-mail."
          />
          <LegalNotes
            title="Neste aparelho"
            description="O navegador pode guardar o carrinho, o idioma, o tema e um rascunho do pedido neste aparelho. Isso fica no seu dispositivo, não num servidor nosso — até o checkout estar ligado de fato."
          />
          <LegalNotes
            title="Com quem falamos"
            description="O CEP é consultado em serviço público de endereço (ViaCEP). Não vendemos lista de e-mails. Quando o pagamento existir, o gateway verá o necessário para cobrar."
          />
          <LegalNotes
            title="Seus direitos"
            description="Você pode pedir para ver, corrigir ou apagar o que tiver sido enviado. Escreva para contato@haru.natural. Para limpar o que está só neste aparelho, basta limpar os dados do site no navegador."
          />
        </div>
      </section>
    </main>
  );
}
