/**
 * HARU — adaptador de e-mail e pagamento
 * --------------------------------------
 * Este arquivo é o único ponto que o programador deve trocar
 * quando o servidor e o gateway existirem.
 *
 * O restante do site (carrinho, CEP, tela de checkout) já fala
 * só com as funções abaixo. Não ligue Stripe / Mercado Pago /
 * Apple Pay direto no HTML.
 *
 * Contrato
 * --------
 * HaruAuth.requestCode(email)
 *   Envia o código de 6 dígitos para o e-mail.
 *   return Promise<{ ok: boolean, error?: string }>
 *
 * HaruAuth.verifyCode(email, code)
 *   Confirma o código. Sem senha.
 *   return Promise<{ ok: boolean, error?: string }>
 *
 * HaruPay.applyCoupon(code, subtotal)
 *   Valida o cupom no fechamento do pedido.
 *   return Promise<{
 *     ok: boolean,
 *     code?: string,
 *     type?: "percent" | "fixed",
 *     value?: number,
 *     amount?: number,
 *     error?: string
 *   }>
 *
 * HaruPay.createPayment(order)
 *   Cria a cobrança no gateway.
 *   order = {
 *     id: string,
 *     email: string,
 *     items: [{ id, name, qty, price }],
 *     subtotal: number,
 *     discount: number,
 *     total: number,
 *     coupon?: { code, type, value, amount },
 *     address: {
 *       name, cep, street, number, complement, district, city, uf
 *     }
 *   }
 *   return Promise<{
 *     ok: boolean,
 *     provider?: "applepay" | "stripe" | "mercadopago" | string,
 *     clientSecret?: string,
 *     redirectUrl?: string,
 *     error?: string
 *   }>
 *
 * Hoje as três funções são um esqueleto: não enviam e-mail
 * de verdade e não cobram. Troque o miolo; mantenha a assinatura.
 */
(function (global) {
  var DEMO = true;

  global.HaruAuth = {
    requestCode: function (email) {
      /* TODO: POST /auth/email/code  { email } */
      return Promise.resolve({
        ok: true,
        demo: DEMO,
        email: email,
      });
    },

    verifyCode: function (email, code) {
      /* TODO: POST /auth/email/verify  { email, code } */
      var digits = String(code || "").replace(/\D/g, "");
      if (digits.length !== 6) {
        return Promise.resolve({ ok: false, error: "code" });
      }
      if (DEMO) {
        return Promise.resolve({ ok: true, demo: true, email: email });
      }
      return Promise.resolve({ ok: false, error: "not_connected" });
    },
  };

  global.HaruPay = {
    applyCoupon: function (code, subtotal) {
      /* TODO: POST /pay/coupon  { code, subtotal } */
      var clean = String(code || "")
        .replace(/\s+/g, "")
        .toUpperCase();
      var sum = Number(subtotal) || 0;
      if (!clean) {
        return Promise.resolve({ ok: false, error: "empty" });
      }
      if (DEMO && clean === "HARU10") {
        var amount = Math.round(sum * 0.1 * 100) / 100;
        return Promise.resolve({
          ok: true,
          demo: DEMO,
          code: clean,
          type: "percent",
          value: 10,
          amount: amount,
        });
      }
      return Promise.resolve({ ok: false, error: "invalid" });
    },

    createPayment: function (order) {
      /* TODO: POST /pay/create  order
         Exemplos de resposta real:
         - Apple Pay / Stripe: { ok: true, provider: "stripe", clientSecret: "..." }
         - Mercado Pago: { ok: true, provider: "mercadopago", redirectUrl: "..." }
      */
      try {
        global.localStorage.setItem(
          "haru-order-draft",
          JSON.stringify({
            at: Date.now(),
            order: order,
          })
        );
      } catch (_) {
        /* modo privado / file:// */
      }

      return Promise.resolve({
        ok: false,
        demo: DEMO,
        error: "GATEWAY_NOT_CONNECTED",
        orderId: order && order.id,
      });
    },
  };
})(window);
