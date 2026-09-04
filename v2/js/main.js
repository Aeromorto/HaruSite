(() => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

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

  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ force3D: true });
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.config({
    ignoreMobileResize: true,
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });

  if (isIOS && !reduce) {
    ScrollTrigger.normalizeScroll(true);
  }

  if (!reduce && !isTouch && typeof Lenis !== "undefined") {
    const lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
      anchors: true,
      wheelMultiplier: 0.92,
      overscroll: false,
      autoRaf: false,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
  }

  const mm = gsap.matchMedia();

  const buildHero = (scaleA, scaleB, distance) => {
    gsap.set(imgB, { opacity: 0, scale: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * distance)}`,
        pin: true,
        pinType: isIOS ? "transform" : "fixed",
        scrub: isTouch ? true : 0.3,
        anticipatePin: 1,
        fastScrollEnd: true,
        invalidateOnRefresh: true,
      },
    });

    tl.fromTo(
      imgA,
      { scale: 1, opacity: 1 },
      { scale: scaleA, opacity: 1, duration: 0.58, ease: "none" },
      0
    )
      .to(brand, { opacity: 0, y: -40, duration: 0.22, ease: "none" }, 0.1)
      .to(hint, { opacity: 0, duration: 0.12, ease: "none" }, 0.06)
      .fromTo(
        imgB,
        { opacity: 0, scale: 1 },
        { opacity: 1, scale: scaleB, duration: 0.3, ease: "none" },
        0.55
      )
      .to(imgA, { opacity: 0, duration: 0.3, ease: "none" }, 0.55);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set([imgA, imgB, brand, hint], { clearProps: "all" });
    };
  };

  if (!reduce) {
    mm.add("(min-width: 768px)", () => buildHero(2.05, 1.16, 0.8));
    mm.add("(max-width: 767px)", () => buildHero(1.45, 1.1, 0.57));

    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: isTouch ? 0.55 : 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
        },
      });
    });
  }

  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  let manualTheme = false;

  const themeFromDevice = () => (darkQuery.matches ? "kraft" : "clara");

  const setTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    const kraft = theme === "kraft";
    if (toggle) {
      toggle.setAttribute("aria-pressed", kraft ? "true" : "false");
      toggle.setAttribute(
        "aria-label",
        kraft ? "Voltar para a versão clara" : "Ativar modo anti-luz azul"
      );
    }
  };

  setTheme(themeFromDevice());

  toggle?.addEventListener("click", () => {
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
})();
