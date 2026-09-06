(() => {
  const KEY_CART = "haru-cart";
  const KEY_CHECK = "haru-checkout";

  const CATALOG = {
    p1: {
      id: "p1",
      href: "escova.html",
      price: 48,
      image: "images/product-escova.jpg",
      nameKey: "p1.name",
    },
    p2: {
      id: "p2",
      href: "kit.html",
      price: 86,
      image: "images/product-kit.jpg",
      nameKey: "p2.name",
    },
    p3: {
      id: "p3",
      href: "suporte.html",
      price: 62,
      image: "images/product-suporte.jpg",
      nameKey: "p3.name",
    },
  };

  const t = (key) =>
    typeof window.haruT === "function" ? window.haruT(key) : key;

  const money = (value) => {
    const n = Math.round(Number(value) * 100) / 100;
    const parts = n.toFixed(2).split(".");
    return "R$ " + parts[0] + "," + parts[1];
  };

  const readCookie = (key) => {
    try {
      const parts = String(document.cookie || "").split(";");
      const prefix = key + "=";
      for (let i = 0; i < parts.length; i += 1) {
        const part = parts[i].replace(/^\s+/, "");
        if (part.indexOf(prefix) === 0) {
          return decodeURIComponent(part.slice(prefix.length));
        }
      }
    } catch (_) {
      /* ignore */
    }
    return null;
  };

  const writeCookie = (key, raw) => {
    try {
      document.cookie =
        key +
        "=" +
        encodeURIComponent(raw) +
        "; path=/; max-age=2592000; SameSite=Lax";
      return true;
    } catch (_) {
      return false;
    }
  };

  const readJson = (key, fallback) => {
    let raw = null;
    try {
      raw = localStorage.getItem(key);
    } catch (_) {
      raw = null;
    }
    if (!raw) raw = readCookie(key);
    if (!raw) return fallback;
    try {
      const parsed = JSON.parse(raw);
      return parsed == null ? fallback : parsed;
    } catch (_) {
      return fallback;
    }
  };

  const writeJson = (key, value) => {
    const raw = JSON.stringify(value);
    let ok = false;
    try {
      localStorage.setItem(key, raw);
      ok = true;
    } catch (_) {
      /* file:// isolado ou modo privado */
    }
    if (writeCookie(key, raw)) ok = true;
    return ok;
  };

  const normalizeCart = (rawCart) => {
    if (!Array.isArray(rawCart)) return [];
    return rawCart
      .filter((row) => row && CATALOG[row.id] && Number(row.qty) > 0)
      .map((row) => ({
        id: row.id,
        qty: Math.min(9, Math.max(1, Number(row.qty) || 1)),
      }));
  };

  let cart = normalizeCart(readJson(KEY_CART, []));
  let check = readJson(KEY_CHECK, {}) || {};
  if (typeof check !== "object") check = {};

  const loadCart = () => {
    cart = normalizeCart(readJson(KEY_CART, []));
    const next = readJson(KEY_CHECK, {}) || {};
    if (typeof next === "object") check = next;
  };

  const persistCart = () => writeJson(KEY_CART, cart);
  const persistCheck = () => writeJson(KEY_CHECK, check);

  const count = () =>
    cart.reduce((sum, row) => sum + (Number(row.qty) || 0), 0);

  const total = () =>
    cart.reduce((sum, row) => {
      const item = CATALOG[row.id];
      return sum + (item ? item.price * row.qty : 0);
    }, 0);

  const pricing = () => {
    const sub = total();
    const coupon = check.coupon && check.coupon.ok ? check.coupon : null;
    const discount = coupon ? Number(coupon.amount) || 0 : 0;
    return {
      sub: sub,
      discount: discount,
      pay: Math.max(0, Math.round((sub - discount) * 100) / 100),
      coupon: coupon,
    };
  };

  const renderPayTotals = () => {
    const box = qs("checkTotals");
    const subEl = qs("checkSub");
    const discRow = qs("checkDiscRow");
    const discEl = qs("checkDisc");
    const payEl = qs("checkTotal");
    const couponInput = qs("checkCoupon");
    if (couponInput && check.couponCode) couponInput.value = check.couponCode;
    if (
      check.coupon &&
      check.coupon.ok &&
      check.coupon.type === "percent"
    ) {
      check.coupon.amount =
        Math.round(total() * (Number(check.coupon.value) / 100) * 100) / 100;
    }
    const p = pricing();
    if (subEl) subEl.textContent = money(p.sub);
    if (payEl) payEl.textContent = money(p.pay);
    if (discRow) discRow.hidden = !(p.discount > 0);
    if (discEl) discEl.textContent = "− " + money(p.discount);
    if (box) box.hidden = false;
  };

  const addItem = (id, qty) => {
    const item = CATALOG[id];
    if (!item) return;
    const add = Math.min(9, Math.max(1, Number(qty) || 1));
    let found = false;
    for (let i = 0; i < cart.length; i += 1) {
      if (cart[i].id === id) {
        cart[i].qty = Math.min(9, cart[i].qty + add);
        found = true;
        break;
      }
    }
    if (!found) cart.push({ id, qty: add });
    persistCart();
    refresh();
  };

  const setQty = (id, qty) => {
    const next = Math.max(0, Math.min(9, Number(qty) || 0));
    if (next === 0) {
      cart = cart.filter((row) => row.id !== id);
    } else {
      for (let i = 0; i < cart.length; i += 1) {
        if (cart[i].id === id) cart[i].qty = next;
      }
    }
    persistCart();
    refresh();
  };

  const digitsCep = (value) => String(value || "").replace(/\D/g, "").slice(0, 8);

  const maskCep = (value) => {
    const d = digitsCep(value);
    return d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d;
  };

  const lookupCep = (cep) =>
    fetch("https://viacep.com.br/ws/" + cep + "/json/")
      .then((res) => {
        if (!res.ok) throw new Error("network");
        return res.json();
      })
      .then((data) => {
        if (!data || data.erro) throw new Error("miss");
        return data;
      });

  const emailOk = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

  const qs = (id) => document.getElementById(id);

  const setOpen = (open) => {
    const drawer = qs("cartDrawer");
    const overlay = qs("cartOverlay");
    const toggle = qs("cartToggle");
    const root = document.documentElement;
    if (!drawer) return;
    root.classList.toggle("cart-open", open);
    drawer.hidden = !open;
    if (overlay) overlay.hidden = !open;
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      drawer.focus();
    }
  };

  const showView = (name) => {
    const cartView = qs("shopCartView");
    const checkView = qs("shopCheckView");
    if (cartView) cartView.hidden = name !== "cart";
    if (checkView) checkView.hidden = name !== "check";
  };

  const showStep = (name) => {
    check.step = name;
    persistCheck();
    ["email", "code", "address", "pay", "done"].forEach((step) => {
      const el = qs("checkStep-" + step);
      if (el) el.hidden = step !== name;
    });
    if (name === "pay") renderPayTotals();
    const note = qs("checkNote");
    if (note && name !== "done") {
      note.hidden = true;
      note.textContent = "";
    }
  };

  const setNote = (key) => {
    const note = qs("checkNote");
    if (!note) return;
    note.hidden = false;
    note.textContent = t(key);
  };

  const renderCount = () => {
    const badge = qs("cartCount");
    const toggle = qs("cartToggle");
    const n = count();
    if (badge) {
      badge.hidden = n < 1;
      badge.textContent = String(n);
    }
    if (toggle) {
      toggle.setAttribute("data-count", String(n));
      toggle.setAttribute("aria-label", t("cart.open"));
    }
  };

  const renderLines = () => {
    const list = qs("cartList");
    const vacant = qs("cartVacant");
    const foot = qs("cartFoot");
    const sum = qs("cartSum");
    if (!list) return;
    list.innerHTML = "";
    if (!cart.length) {
      if (vacant) vacant.hidden = false;
      list.hidden = true;
      if (foot) foot.hidden = true;
      return;
    }
    if (vacant) vacant.hidden = true;
    list.hidden = false;
    if (foot) foot.hidden = false;
    if (sum) sum.textContent = money(total());

    cart.forEach((row) => {
      const item = CATALOG[row.id];
      if (!item) return;
      const li = document.createElement("li");
      li.className = "cart-line";
      li.innerHTML =
        '<a class="cart-line__img" href="' +
        item.href +
        '"><img src="' +
        item.image +
        '" alt=""></a>' +
        '<div class="cart-line__body">' +
        '<p class="cart-line__name">' +
        t(item.nameKey) +
        "</p>" +
        '<p class="cart-line__price">' +
        money(item.price) +
        "</p>" +
        '<div class="cart-line__qty">' +
        '<button type="button" data-qty="' +
        row.id +
        '" data-delta="-1" aria-label="−">−</button>' +
        "<span>" +
        row.qty +
        "</span>" +
        '<button type="button" data-qty="' +
        row.id +
        '" data-delta="1" aria-label="+">+</button>' +
        "</div>" +
        "</div>" +
        '<button type="button" class="cart-line__remove" data-remove="' +
        row.id +
        '">' +
        t("cart.remove") +
        "</button>";
      list.appendChild(li);
    });
  };

  const fillCheckFields = () => {
    const email = qs("checkEmail");
    const code = qs("checkCode");
    const name = qs("checkName");
    const cep = qs("checkCep");
    const number = qs("checkNumber");
    const complement = qs("checkComplement");
    const street = qs("checkStreet");
    const district = qs("checkDistrict");
    const city = qs("checkCity");
    const uf = qs("checkUf");
    if (email) email.value = check.email || "";
    if (code) code.value = "";
    if (name) name.value = check.name || "";
    if (cep) cep.value = maskCep(check.cep || "");
    if (number) number.value = check.number || "";
    if (complement) complement.value = check.complement || "";
    if (street) street.value = check.street || "";
    if (district) district.value = check.district || "";
    if (city) city.value = check.city || "";
    if (uf) uf.value = check.uf || "";
    const coupon = qs("checkCoupon");
    if (coupon) coupon.value = check.couponCode || "";
  };

  const applyI18n = (rootEl) => {
    if (!rootEl) return;
    rootEl.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = t(key);
      if (value) el.textContent = value;
    });
    rootEl.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const value = t(key);
      if (value) el.setAttribute("placeholder", value);
    });
    rootEl.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      const value = t(key);
      if (value) el.setAttribute("aria-label", value);
    });
  };

  const refresh = () => {
    renderCount();
    renderLines();
    applyI18n(qs("cartDrawer"));
    const toggle = qs("cartToggle");
    if (toggle) toggle.setAttribute("aria-label", t("cart.open"));
  };

  const injectDrawer = () => {
    if (qs("cartDrawer")) return;
    const wrap = document.createElement("div");
    wrap.innerHTML =
      '<div class="cart-overlay" id="cartOverlay" hidden></div>' +
      '<aside class="cart-drawer" id="cartDrawer" hidden tabindex="-1" aria-labelledby="cartTitle">' +
      '<header class="cart-drawer__head">' +
      '<h2 id="cartTitle" data-i18n="cart.title">Sacola</h2>' +
      '<button type="button" class="cart-drawer__close" id="cartClose" data-i18n-aria="cart.close" aria-label="Fechar a sacola">×</button>' +
      "</header>" +
      '<div id="shopCartView">' +
      '<div class="cart-vacant" id="cartVacant">' +
      '<p class="cart-empty" id="cartEmpty" data-i18n="cart.empty">Ainda vazia.</p>' +
      '<p class="cart-vacant__lead" data-i18n="cart.emptyLead">O essencial cabe em pouco. A coleção espera.</p>' +
      '<a class="product__cta" id="cartShop" href="index.html#loja" data-i18n="cart.shop">Ver a coleção</a>' +
      "</div>" +
      '<ul class="cart-list" id="cartList"></ul>' +
      '<div class="cart-foot" id="cartFoot" hidden>' +
      '<p class="cart-foot__sum"><span data-i18n="cart.subtotal">Subtotal</span> <strong id="cartSum"></strong></p>' +
      '<button type="button" class="product__cta" id="cartGoCheck" data-i18n="cart.checkout">Continuar</button>' +
      "</div>" +
      "</div>" +
      '<div id="shopCheckView" hidden>' +
      '<p class="cart-check-lead" data-i18n="check.lead">Sem senha. E-mail, código e o CEP completo.</p>' +
      '<p class="ship__note" id="checkNote" hidden></p>' +
      '<form id="checkForm" novalidate>' +
      '<fieldset class="check-step" id="checkStep-email">' +
      '<label for="checkEmail" data-i18n="check.email">E-mail</label>' +
      '<input id="checkEmail" name="email" type="email" autocomplete="email" required data-i18n-placeholder="check.emailPh" placeholder="seu@email.com" />' +
      '<button type="button" class="product__cta" id="checkSend" data-i18n="check.sendCode">Enviar código</button>' +
      "</fieldset>" +
      '<fieldset class="check-step" id="checkStep-code" hidden>' +
      '<label for="checkCode" data-i18n="check.code">Código do e-mail</label>' +
      '<input id="checkCode" name="code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" data-i18n-placeholder="check.codePh" placeholder="000000" />' +
      '<p class="product__block-lead" data-i18n="check.codeHint">Quando o servidor estiver ligado, o código chega no e-mail. Por agora qualquer 6 dígitos avançam o esqueleto.</p>' +
      '<button type="button" class="product__cta" id="checkVerify" data-i18n="check.verify">Confirmar código</button>' +
      "</fieldset>" +
      '<fieldset class="check-step" id="checkStep-address" hidden>' +
      '<p class="check-step__title" data-i18n="check.address">Entrega</p>' +
      '<label for="checkName" data-i18n="check.name">Nome</label>' +
      '<input id="checkName" name="name" type="text" autocomplete="name" data-i18n-placeholder="check.namePh" placeholder="Seu nome" />' +
      '<label for="checkCep" data-i18n="product.cep">CEP</label>' +
      '<div class="ship__row">' +
      '<input id="checkCep" name="cep" inputmode="numeric" autocomplete="postal-code" maxlength="9" data-i18n-placeholder="product.cepPh" placeholder="00000-000" />' +
      '<button type="button" id="checkCepGo" data-i18n="product.cepGo">Calcular</button>' +
      "</div>" +
      '<label for="checkStreet" data-i18n="check.street">Logradouro</label>' +
      '<input id="checkStreet" name="street" type="text" autocomplete="address-line1" />' +
      '<label for="checkNumber" data-i18n="check.number">Número</label>' +
      '<input id="checkNumber" name="number" type="text" inputmode="numeric" data-i18n-placeholder="check.numberPh" placeholder="123" />' +
      '<label for="checkComplement" data-i18n="check.complement">Complemento</label>' +
      '<input id="checkComplement" name="complement" type="text" autocomplete="address-line2" data-i18n-placeholder="check.complementPh" placeholder="Apto, bloco" />' +
      '<label for="checkDistrict" data-i18n="check.district">Bairro</label>' +
      '<input id="checkDistrict" name="district" type="text" />' +
      '<label for="checkCity" data-i18n="check.city">Cidade</label>' +
      '<input id="checkCity" name="city" type="text" autocomplete="address-level2" />' +
      '<label for="checkUf" data-i18n="check.uf">UF</label>' +
      '<input id="checkUf" name="uf" type="text" maxlength="2" autocomplete="address-level1" />' +
      '<button type="button" class="product__cta" id="checkAddrGo" data-i18n="check.continue">Continuar</button>' +
      "</fieldset>" +
      '<fieldset class="check-step" id="checkStep-pay" hidden>' +
      '<p class="check-step__title" data-i18n="check.pay">Pagar</p>' +
      '<p class="product__block-lead" data-i18n="check.payHint">PIX, cartão ou Apple Pay. O gateway entra neste passo, em js/pay-adapter.js.</p>' +
      '<label for="checkCoupon" data-i18n="check.coupon">Cupom</label>' +
      '<div class="ship__row">' +
      '<input id="checkCoupon" name="coupon" type="text" autocomplete="off" maxlength="24" data-i18n-placeholder="check.couponPh" placeholder="Código" />' +
      '<button type="button" id="checkCouponGo" data-i18n="check.couponGo">Aplicar</button>' +
      "</div>" +
      '<div class="check-totals" id="checkTotals">' +
      '<p><span data-i18n="cart.subtotal">Subtotal</span> <strong id="checkSub"></strong></p>' +
      '<p id="checkDiscRow" hidden><span data-i18n="check.discount">Desconto</span> <strong id="checkDisc"></strong></p>' +
      '<p class="check-totals__pay"><span data-i18n="check.total">Total</span> <strong id="checkTotal"></strong></p>' +
      "</div>" +
      '<ul class="pays" data-i18n-aria="product.pay" aria-label="Pagamento">' +
      "<li>" +
      '<img class="pays__pix" src="images/pix.png" alt="PIX" width="174" height="64" />' +
      "</li>" +
      "<li>" +
      '<svg class="pays__ico pays__ico--card" viewBox="0 0 24 16" aria-hidden="true"><rect x="1.15" y="1.15" width="21.7" height="13.7" rx="1.7" fill="none" stroke="currentColor" stroke-width="1.35"/><path fill="currentColor" d="M1.15 5.1h21.7v2.35H1.15z"/><path fill="currentColor" d="M4.1 10.7h4.6v1.35H4.1z"/></svg>' +
      '<span data-i18n="product.cardPay">Cartão</span>' +
      "</li>" +
      "<li>" +
      '<img class="pays__apple" src="images/apple-pay.png" alt="" width="74" height="44" />' +
      '<span data-i18n="product.applePay">Apple Pay</span>' +
      "</li>" +
      "</ul>" +
      '<button type="button" class="product__cta" id="checkPay" data-i18n="check.pay">Pagar</button>' +
      "</fieldset>" +
      '<fieldset class="check-step" id="checkStep-done" hidden>' +
      '<p class="check-step__title" data-i18n="check.saved">Pedido guardado neste aparelho</p>' +
      '<p class="product__block-lead" data-i18n="check.stub">O gateway ainda não está ligado. O esqueleto do pedido ficou salvo para o programador.</p>' +
      "</fieldset>" +
      '<button type="button" class="cart-back" id="checkBack" data-i18n="check.back">Voltar à sacola</button>' +
      "</form>" +
      "</div>" +
      "</aside>";
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
  };

  const openCart = () => {
    showView("cart");
    refresh();
    setOpen(true);
  };

  const openCheck = () => {
    if (!cart.length) {
      openCart();
      return;
    }
    showView("check");
    fillCheckFields();
    if (check.verified && check.email) showStep("address");
    else if (check.email) showStep("code");
    else showStep("email");
    applyI18n(qs("cartDrawer"));
    setOpen(true);
  };

  const buildOrder = () => {
    const p = pricing();
    return {
    id: "haru-" + Date.now(),
    email: String(check.email || "").trim().toLowerCase(),
    items: cart.map((row) => {
      const item = CATALOG[row.id];
      return {
        id: row.id,
        name: item ? t(item.nameKey) : row.id,
        qty: row.qty,
        price: item ? item.price : 0,
      };
    }),
    subtotal: p.sub,
    discount: p.discount,
    total: p.pay,
    coupon: p.coupon
      ? {
          code: p.coupon.code,
          type: p.coupon.type,
          value: p.coupon.value,
          amount: p.coupon.amount,
        }
      : null,
    address: {
      name: check.name || "",
      cep: digitsCep(check.cep),
      street: check.street || "",
      number: check.number || "",
      complement: check.complement || "",
      district: check.district || "",
      city: check.city || "",
      uf: check.uf || "",
    },
  };
  };

  const bind = () => {
    const toggle = qs("cartToggle");
    const overlay = qs("cartOverlay");
    const close = qs("cartClose");
    if (toggle) {
      toggle.addEventListener("click", () => {
        if (document.documentElement.classList.contains("cart-open")) setOpen(false);
        else openCart();
      });
    }
    if (overlay) overlay.addEventListener("click", () => setOpen(false));
    if (close) close.addEventListener("click", () => setOpen(false));
    const shop = qs("cartShop");
    if (shop) {
      shop.addEventListener("click", () => setOpen(false));
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });

    const list = qs("cartList");
    if (list) {
      list.addEventListener("click", (event) => {
        const btn = event.target.closest("button");
        if (!btn) return;
        const removeId = btn.getAttribute("data-remove");
        if (removeId) {
          setQty(removeId, 0);
          return;
        }
        const id = btn.getAttribute("data-qty");
        const delta = Number(btn.getAttribute("data-delta") || 0);
        if (!id || !delta) return;
        const row = cart.filter((item) => item.id === id)[0];
        setQty(id, (row ? row.qty : 0) + delta);
      });
    }

    const form = qs("checkForm");
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
      });
    }

    const go = qs("cartGoCheck");
    if (go) go.addEventListener("click", openCheck);

    const back = qs("checkBack");
    if (back) {
      back.addEventListener("click", () => {
        const step = check.step;
        if (step === "code") showStep("email");
        else if (step === "address") showStep(check.verified ? "email" : "code");
        else if (step === "pay") showStep("address");
        else if (step === "done") showView("cart");
        else showView("cart");
        refresh();
      });
    }

    const send = qs("checkSend");
    if (send) {
      send.addEventListener("click", () => {
        const email = String((qs("checkEmail") && qs("checkEmail").value) || "")
          .trim()
          .toLowerCase();
        if (!emailOk(email)) {
          setNote("check.emailErr");
          return;
        }
        check.email = email;
        persistCheck();
        const auth = window.HaruAuth;
        if (!auth || typeof auth.requestCode !== "function") {
          setNote("check.stub");
          showStep("code");
          return;
        }
        auth.requestCode(email).then((res) => {
          if (res && res.ok) {
            showStep("code");
            setNote("check.codeHint");
          } else setNote("check.stub");
        });
      });
    }

    const verify = qs("checkVerify");
    if (verify) {
      verify.addEventListener("click", () => {
        const code = String((qs("checkCode") && qs("checkCode").value) || "");
        const auth = window.HaruAuth;
        if (!auth || typeof auth.verifyCode !== "function") {
          setNote("check.stub");
          return;
        }
        auth.verifyCode(check.email, code).then((res) => {
          if (res && res.ok) {
            check.verified = true;
            persistCheck();
            showStep("address");
          } else setNote("check.codeErr");
        });
      });
    }

    const cepInput = qs("checkCep");
    if (cepInput) {
      cepInput.addEventListener("input", () => {
        cepInput.value = maskCep(cepInput.value);
      });
    }

    const cepGo = qs("checkCepGo");
    if (cepGo) {
      cepGo.addEventListener("click", () => {
        const cep = digitsCep(cepInput && cepInput.value);
        if (cep.length !== 8) {
          setNote("product.cepErr");
          return;
        }
        lookupCep(cep)
          .then((data) => {
            check.cep = cep;
            check.street = data.logradouro || "";
            check.district = data.bairro || "";
            check.city = data.localidade || "";
            check.uf = data.uf || "";
            persistCheck();
            fillCheckFields();
            const note = qs("checkNote");
            if (note) note.hidden = true;
          })
          .catch((err) => {
            setNote(
              err && err.message === "miss" ? "product.cepMiss" : "product.cepNet"
            );
          });
      });
    }

    const addrGo = qs("checkAddrGo");
    if (addrGo) {
      addrGo.addEventListener("click", () => {
        check.name = String((qs("checkName") && qs("checkName").value) || "").trim();
        check.cep = digitsCep(qs("checkCep") && qs("checkCep").value);
        check.street = String((qs("checkStreet") && qs("checkStreet").value) || "").trim();
        check.number = String((qs("checkNumber") && qs("checkNumber").value) || "").trim();
        check.complement = String(
          (qs("checkComplement") && qs("checkComplement").value) || ""
        ).trim();
        check.district = String(
          (qs("checkDistrict") && qs("checkDistrict").value) || ""
        ).trim();
        check.city = String((qs("checkCity") && qs("checkCity").value) || "").trim();
        check.uf = String((qs("checkUf") && qs("checkUf").value) || "")
          .trim()
          .toUpperCase();
        persistCheck();
        if (
          !check.name ||
          check.cep.length !== 8 ||
          !check.street ||
          !check.number ||
          !check.city ||
          !check.uf
        ) {
          setNote("check.addrErr");
          return;
        }
        showStep("pay");
      });
    }

    const couponGo = qs("checkCouponGo");
    if (couponGo) {
      couponGo.addEventListener("click", () => {
        const input = qs("checkCoupon");
        const code = String((input && input.value) || "").trim();
        check.couponCode = code;
        if (!code) {
          check.coupon = null;
          persistCheck();
          renderPayTotals();
          const note = qs("checkNote");
          if (note) {
            note.hidden = true;
            note.textContent = "";
          }
          return;
        }
        const gateway = window.HaruPay;
        if (!gateway || typeof gateway.applyCoupon !== "function") {
          setNote("check.couponErr");
          return;
        }
        gateway.applyCoupon(code, total()).then((res) => {
          if (res && res.ok) {
            check.coupon = res;
            persistCheck();
            renderPayTotals();
            setNote("check.couponOk");
          } else {
            check.coupon = null;
            persistCheck();
            renderPayTotals();
            setNote("check.couponErr");
          }
        });
      });
    }

    const pay = qs("checkPay");
    if (pay) {
      pay.addEventListener("click", () => {
        const gateway = window.HaruPay;
        const order = buildOrder();
        if (!gateway || typeof gateway.createPayment !== "function") {
          setNote("check.stub");
          showStep("done");
          return;
        }
        gateway.createPayment(order).then((res) => {
          if (res && res.ok) {
            cart = [];
            persistCart();
            showStep("done");
            refresh();
            return;
          }
          showStep("done");
          setNote("check.stub");
        });
      });
    }

    document.addEventListener("click", (event) => {
      const add = event.target.closest("[data-add-cart]");
      const buy = event.target.closest("[data-buy]");
      if (add) {
        event.preventDefault();
        addItem(add.getAttribute("data-add-cart"), 1);
        openCart();
      } else if (buy) {
        event.preventDefault();
        const id = buy.getAttribute("data-buy");
        const has = cart.filter((row) => row.id === id)[0];
        if (!has) addItem(id, 1);
        else refresh();
        openCheck();
      }
    });
  };

  injectDrawer();
  bind();
  persistCart();
  refresh();

  window.addEventListener("storage", (event) => {
    if (event.key && event.key !== KEY_CART && event.key !== KEY_CHECK) return;
    loadCart();
    refresh();
  });

  window.addEventListener("pageshow", () => {
    loadCart();
    refresh();
  });

  window.haruShopRefresh = refresh;
  window.HaruCart = {
    add: addItem,
    open: openCart,
    checkout: openCheck,
    getItems: function () {
      return cart.slice();
    },
  };
})();
