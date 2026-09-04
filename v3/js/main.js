(() => {
  const I18N = {
    pt: {
      skip: "Ir para o conteúdo",
      "nav.shop": "Loja",
      "nav.brand": "A Marca",
      "nav.contact": "Contato",
      "hero.aria": "Apresentação da marca",
      "hero.imgA":
        "Floresta de bambu vista de baixo, troncos subindo em direção ao céu",
      "hero.imgB": "Troncos de bambu mais próximos, com luz filtrando pela copa",
      "hero.logo": "Símbolo HARU: cavalo e bambu",
      "hero.tag": "Higiene feita de matéria, não de plástico.",
      "hero.hint": "Desça",
      "shop.kicker": "Coleção",
      "shop.title": "O essencial.",
      "p1.name": "Escova de bambu",
      "p1.meta": "Cerdas de crina selecionada. Esterilizadas a vapor.",
      "p1.alt": "Escova de dentes de bambu com cerdas naturais",
      "p2.name": "Kit de duas",
      "p2.meta": "O mesmo cuidado para dividir o hábito.",
      "p2.alt": "Duas escovas de bambu lado a lado",
      "p3.name": "Suporte de pedra",
      "p3.meta": "Diatomito. Seca ao ar.",
      "p3.alt": "Suporte cúbico de pedra para escovas",
      "product.view": "Ver produto",
      "brand.kicker": "A marca",
      "brand.quote": "HARU é matéria natural.",
      "brand.lead":
        "Materiais que voltam para a terra. Escovas de bambu com cerdas de crina de cavalo — feitas para o hábito, não para o descarte.",
      "brand.alt": "Crina de cavalo sendo trançada, matéria-prima das cerdas",
      "why.kicker": "Por que HARU",
      "why.title": "Natural de verdade.",
      "why1.name": "100% natural",
      "why1.text":
        "Cabo de bambu e cerdas de crina de cavalo. Sem nylon, sem bioplástico disfarçado.",
      "why2.name": "Sem plástico",
      "why2.text":
        "Pensado para desaparecer da forma certa — do objeto à embalagem.",
      "why3.name": "Presença na pia",
      "why3.text": "Bonito o suficiente para ficar à vista.",
      "contact.title": "Fale com a HARU",
      "contact.text":
        "A loja ainda está nascendo. Se quiser a coleção, uma parceria ou só conversar sobre o hábito — escreva.",
      "footer.nav": "Rodapé",
      "footer.copy": "HARU. Higiene feita de matéria.",
      "lang.toEn": "Ver o site em inglês",
      "lang.toPt": "Ver o site em português",
      "theme.toKraft": "Ativar modo anti-luz azul",
      "theme.toClara": "Voltar para a versão clara",
      docTitle: "HARU — Higiene feita de matéria, não de plástico",
      docDesc:
        "HARU. Higiene feita de matéria, não de plástico — bambu e crina de cavalo.",
    },
    en: {
      skip: "Skip to content",
      "nav.shop": "Shop",
      "nav.brand": "The Brand",
      "nav.contact": "Contact",
      "hero.aria": "Brand introduction",
      "hero.imgA":
        "Bamboo forest seen from below, trunks rising toward the sky",
      "hero.imgB":
        "Closer bamboo trunks, with light filtering through the canopy",
      "hero.logo": "HARU mark: horse and bamboo",
      "hero.tag": "Hygiene made from matter, not plastic.",
      "hero.hint": "Scroll",
      "shop.kicker": "Collection",
      "shop.title": "The essential.",
      "p1.name": "Bamboo brush",
      "p1.meta": "Selected horsehair. Steam-sterilized.",
      "p1.alt": "Bamboo toothbrush with natural bristles",
      "p2.name": "Set of two",
      "p2.meta": "The same care, meant to be shared.",
      "p2.alt": "Two bamboo toothbrushes side by side",
      "p3.name": "Stone stand",
      "p3.meta": "Diatomite. Air-dries.",
      "p3.alt": "Cubic stone stand for brushes",
      "product.view": "View product",
      "brand.kicker": "The brand",
      "brand.quote": "HARU is made from natural materials.",
      "brand.lead":
        "Materials that return to the earth. Bamboo brushes with horsehair bristles — made to be used, not thrown away.",
      "brand.alt": "Horsehair being braided, the material of the bristles",
      "why.kicker": "Why HARU",
      "why.title": "Truly natural.",
      "why1.name": "100% natural",
      "why1.text":
        "Bamboo handle and horsehair bristles. No nylon. No disguised bioplastic.",
      "why2.name": "Plastic-free",
      "why2.text":
        "Designed to break down the right way — from product to packaging.",
      "why3.name": "Made for the sink",
      "why3.text": "Beautiful enough to be left in full display.",
      "contact.title": "Write to HARU",
      "contact.text":
        "The shop is just beginning. For the collection, a partnership, or a conversation — write.",
      "footer.nav": "Footer",
      "footer.copy": "HARU. Hygiene made from matter.",
      "lang.toEn": "Switch to English",
      "lang.toPt": "Switch to Portuguese",
      "theme.toKraft": "Switch to kraft mode",
      "theme.toClara": "Switch to the light version",
      docTitle: "HARU — Hygiene made from matter, not plastic",
      docDesc:
        "HARU. Hygiene made from matter, not plastic — bamboo and horsehair.",
    },
  };

  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  let manualTheme = false;

  const langFromBrowser = () => {
    const list = [
      ...(navigator.languages || []),
      navigator.language,
      navigator.userLanguage,
    ].filter(Boolean);

    for (const item of list) {
      const code = String(item).toLowerCase();
      if (code === "pt" || code.startsWith("pt-")) return "pt";
      if (code === "en" || code.startsWith("en-")) return "en";
    }
    return "pt";
  };

  const resolveLang = () => {
    try {
      const saved = localStorage.getItem("haru-lang");
      if (saved === "en" || saved === "pt") return saved;
    } catch (_) {
      /* ignore */
    }
    const preset = root.getAttribute("data-lang");
    if (preset === "en" || preset === "pt") return preset;
    return langFromBrowser();
  };

  let lang = resolveLang();

  const packOf = () => I18N[lang] || I18N.pt;

  const applyLang = () => {
    const pack = packOf();
    root.lang = lang === "en" ? "en" : "pt-BR";
    root.setAttribute("data-lang", lang);
    document.title = pack.docTitle;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", pack.docDesc);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (pack[key] != null) el.textContent = pack[key];
    });

    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      if (pack[key] != null) el.setAttribute("alt", pack[key]);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      let value = pack[key];
      if (key === "lang.toEn" || key === "lang.toPt") {
        value = lang === "en" ? pack["lang.toPt"] : pack["lang.toEn"];
      }
      if (value != null) el.setAttribute("aria-label", value);
    });

    document.querySelectorAll(".lang-toggle").forEach((btn) => {
      btn.setAttribute(
        "aria-label",
        lang === "en" ? pack["lang.toPt"] : pack["lang.toEn"]
      );
    });

    syncThemeLabel();
  };

  const themeFromDevice = () => (darkQuery.matches ? "kraft" : "clara");

  const syncThemeLabel = () => {
    if (!themeToggle) return;
    const pack = packOf();
    const kraft = root.getAttribute("data-theme") === "kraft";
    themeToggle.setAttribute("aria-pressed", kraft ? "true" : "false");
    themeToggle.setAttribute(
      "aria-label",
      kraft ? pack["theme.toClara"] : pack["theme.toKraft"]
    );
  };

  const setTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    syncThemeLabel();
  };

  setTheme(themeFromDevice());
  applyLang();

  document.querySelectorAll(".lang-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      lang = lang === "pt" ? "en" : "pt";
      try {
        localStorage.setItem("haru-lang", lang);
      } catch (_) {
        /* ignore */
      }
      applyLang();
    });
  });

  themeToggle?.addEventListener("click", () => {
    manualTheme = true;
    setTheme(root.getAttribute("data-theme") === "kraft" ? "clara" : "kraft");
  });

  const onSchemeChange = (event) => {
    if (manualTheme) return;
    setTheme(event.matches ? "kraft" : "clara");
  };

  if (darkQuery.addEventListener) {
    darkQuery.addEventListener("change", onSchemeChange);
  } else if (darkQuery.addListener) {
    darkQuery.addListener(onSchemeChange);
  }

  let motionStarted = false;
  const startMotion = () => {
    if (motionStarted) return;
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
      return;
    }
    motionStarted = true;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = document.querySelector(".hero");
  const imgA = document.querySelector(".hero__img--a");
  const imgB = document.querySelector(".hero__img--b");
  const brand = document.querySelector(".hero__brand");
  const hint = document.querySelector(".hero__hint");

  const isTouch =
    "ontouchend" in window ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);
  const isIOS =
    /iP(hone|ad|od)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(navigator.userAgent);

  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ force3D: true });
  gsap.ticker.lagSmoothing(0);
  gsap.ticker.fps(0);

  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });

  if (isIOS && !reduce) {
    ScrollTrigger.normalizeScroll(true);
  }

  if (!reduce && !isTouch && typeof Lenis !== "undefined") {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      anchors: true,
      wheelMultiplier: 1,
      overscroll: false,
      autoRaf: false,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
  }

  gsap.set([imgA, imgB, brand], { force3D: true });

  const mm = gsap.matchMedia();

  const buildHero = (scaleA, scaleB, distance) => {
    gsap.set(imgA, { opacity: 1, scale: 1, force3D: true });
    gsap.set(imgB, { opacity: 0, scale: 1, force3D: true });

    const tl = gsap.timeline({
      defaults: { ease: "none", force3D: true },
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * distance)}`,
        pin: true,
        pinType: isIOS || isAndroid || isTouch ? "transform" : "fixed",
        scrub: true,
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(
      imgA,
      { scale: 1, opacity: 1 },
      { scale: scaleA, opacity: 1, duration: 0.58 },
      0
    )
      .to(brand, { opacity: 0, y: -40, duration: 0.22 }, 0.1)
      .to(hint, { opacity: 0, duration: 0.12 }, 0.06)
      .fromTo(
        imgB,
        { opacity: 0, scale: 1 },
        { opacity: 1, scale: scaleB, duration: 0.3 },
        0.55
      )
      .to(imgA, { opacity: 0, duration: 0.3 }, 0.55);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set([imgA, imgB, brand, hint], { clearProps: "all" });
    };
  };

  const waitDecode = (img) => {
    if (!img) return Promise.resolve();
    if (typeof img.decode === "function") {
      return img.decode().catch(() => {});
    }
    if (img.complete) return Promise.resolve();
    return new Promise((resolve) => {
      img.addEventListener("load", resolve, { once: true });
      img.addEventListener("error", resolve, { once: true });
    });
  };

  const runMotion = () => {
    if (reduce) return;

    mm.add("(min-width: 768px)", () => buildHero(2.05, 1.16, 0.8));
    mm.add("(max-width: 767px)", () => buildHero(1.45, 1.1, 0.57));

    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: isTouch ? 0.55 : 0.8,
        ease: "power2.out",
        force3D: true,
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
        },
      });
    });

    ScrollTrigger.refresh();
  };

  Promise.all([waitDecode(imgA), waitDecode(imgB)]).then(runMotion);
  };

  window.haruStartMotion = startMotion;
  startMotion();
})();
