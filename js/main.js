(() => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hero = document.querySelector(".hero");
  const imgA = document.querySelector(".hero__img--a");
  const imgB = document.querySelector(".hero__img--b");
  const brand = document.querySelector(".hero__brand");
  const hint = document.querySelector(".hero__hint");

  gsap.registerPlugin(ScrollTrigger);

  if (!reduce && typeof Lenis !== "undefined") {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      anchors: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
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
        scrub: 0.6,
        anticipatePin: 1,
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
    mm.add("(min-width: 768px)", () => buildHero(2.05, 1.16, 1.2));
    mm.add("(max-width: 767px)", () => buildHero(1.45, 1.1, 0.85));

    gsap.utils.toArray(".reveal").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 86%",
        },
      });
    });
  }
})();
