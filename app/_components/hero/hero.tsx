"use client";

import { ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  type CSSProperties,
} from "react";
import type Lenis from "lenis";
import { asset } from "@/app/_lib/assets";

gsap.registerPlugin(ScrollTrigger);

// No SSR o useLayoutEffect não roda; no cliente garante que o cleanup do
// ScrollTrigger aconteça ANTES de o React remover o DOM (evita removeChild
// e refs anulados).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Transição do hero replicada do site antigo (index.html):
 * a seção fica presa (pin) enquanto a imagem A (bambu de baixo) cresce
 * (scale 1 → 2.05) e, a partir de 55% do progresso, a imagem B (troncos
 * próximos) aparece com fade + zoom (scale 1 → 1.16) enquanto a imagem A
 * some. A marca sobe junto (y → -24) e o arro de rolagem se apaga no final.
 *
 * IMPORTANTE: o pin é feito por CSS `position: sticky` (`.hero-track` +
 * `.hero-pin`), NÃO pelo `pin: true` do ScrollTrigger. O pin do ScrollTrigger
 * envolve a <section> num div "pin-spacer", quebrando o DOM que o React
 * gerencia e causando os erros `Node.insertBefore`/`Node.removeChild`
 * (NotFoundError) em re-render, unmount e HMR. O ScrollTrigger aqui só conduz
 * a timeline (transform/opacity) durante o scroll — nenhuma mutação
 * estrutural, então o React nunca disputa o DOM.
 */
// Hero não recebe props: com memo() o React pula a re-renderização da seção
// pinada quando o layout re-renderiza (ex.: estado do carrinho), mantendo
// intactos os estilos inline (transform/opacity) aplicados pelo GSAP.
function Hero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLElement>(null);
  const imgARef = useRef<HTMLDivElement>(null);
  const imgBRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useIsomorphicLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    // O CSS também desativa o pin (position: static) nesses casos, então o
    // hero rola normalmente — aqui apenas não criamos a timeline.
    if (reduce || !finePointer) return;

    // Captura os elementos uma única vez. Nas fases de cleanup o React pode
    // já ter anulado os refs, então nunca dependemos deles depois daqui.
    const track = trackRef.current;
    const imgA = imgARef.current;
    const imgB = imgBRef.current;
    const brand = brandRef.current;
    const hint = hintRef.current;
    if (!track || !imgA || !imgB || !brand || !hint) return;

    let lenis: Lenis | null = (window as unknown as { haruLenis?: Lenis })
      .haruLenis ?? null;
    const scrollTriggerUpdate = () => ScrollTrigger.update();
    const syncLenis = () => {
      if (lenis) lenis.on("scroll", scrollTriggerUpdate);
    };
    const unsyncLenis = () => {
      if (lenis) lenis.off("scroll", scrollTriggerUpdate);
    };
    syncLenis();
    const onLenisReady = (event: Event) => {
      lenis = (event as CustomEvent<Lenis>).detail;
      syncLenis();
    };
    window.addEventListener("haru:lenis-ready", onLenisReady);

    const mm = gsap.matchMedia();

    const buildHero = (scaleA: number, scaleB: number) => {
      // Sem `pin`: a seção fica presa via CSS `position: sticky`. O
      // ScrollTrigger apenas conduz a timeline durante o pin — nenhum
      // pin-spacer é criado, então o React nunca reconcilia DOM mutado.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: track,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      tl.fromTo(
        imgA,
        { scale: 1, opacity: 1 },
        { scale: scaleA, opacity: 1, duration: 0.58, ease: "none" },
        0,
      )
        // Marca e arro permanecem até o final do pin: o fade só começa no
        // último trecho (0.6s de uma timeline de 0.85s) e termina junto
        // com o fim do crossfade das imagens.
        .to(brand, { opacity: 0, y: -24, duration: 0.25, ease: "none" }, 0.6)
        .to(hint, { opacity: 0, duration: 0.25, ease: "none" }, 0.6)
        .fromTo(
          imgB,
          { opacity: 0, scale: 1 },
          { opacity: 1, scale: scaleB, duration: 0.3, ease: "none" },
          0.55,
        )
        .to(imgA, { opacity: 0, duration: 0.3, ease: "none" }, 0.55);

      return () => {
        if (tl.scrollTrigger) tl.scrollTrigger.kill();
        tl.kill();
        gsap.set([imgA, imgB, brand, hint], { clearProps: "all" });
      };
    };

    mm.add("(min-width: 768px)", () => buildHero(2.05, 1.16));
    mm.add("(max-width: 767px)", () => buildHero(1.45, 1.1));

    // Sem pin-spacer o refresh é inofensivo: o rAF + load apenas garantem
    // medições corretas após a carga de fontes/imagens.
    let rafId = 0;
    const refresh = () => ScrollTrigger.refresh();
    rafId = requestAnimationFrame(refresh);
    window.addEventListener("load", refresh, { once: true });

    return () => {
      try {
        unsyncLenis();
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener("haru:lenis-ready", onLenisReady);
        // mm.revert() encerra timelines/ScrollTriggers; sem pin não há DOM
        // estrutural a restaurar.
        mm.revert();
        window.removeEventListener("load", refresh);
        ScrollTrigger.refresh();
      } catch {
        /* limpeza em estado parcial: nada a fazer */
      }
    };
  }, []);

  return (
    <div ref={trackRef} className="hero-track relative">
      <section
        ref={rootRef}
        className="hero-pin sticky top-0 w-full h-screen overflow-hidden"
        id="top"
      >
        <Link
          href="/#header"
          className="absolute w-full h-screen z-[4]"
          aria-label="Voltar para o topo"
        />

        {/* Imagem A — base (bambu visto de baixo) */}
        <div
          ref={imgARef}
          className="absolute inset-0"
          style={{ transformOrigin: "50% 38%" } as CSSProperties}
        >
          <Image
            src={asset("/background/hero-bamboo.jpg")}
            alt="Floresta de bambu vista de baixo, troncos subindo em direção ao céu"
            width={1920}
            height={1280}
            loading="eager"
            priority
            className="w-full h-screen absolute inset-0 object-cover hero-enter-bg"
          />
        </div>

        {/* Imagem B — crossfade (troncos próximos) */}
        <div
          ref={imgBRef}
          className="absolute inset-0 opacity-0"
          style={{ transformOrigin: "50% 38%" } as CSSProperties}
        >
          <Image
            src={asset("/background/hero-2.jpg")}
            alt="Troncos de bambu mais próximos, com luz filtrando pela copa"
            width={1920}
            height={1280}
            loading="eager"
            className="w-full h-screen absolute inset-0 object-cover"
          />
        </div>

        <div className="absolute inset-0 z-[2] bg-forest/30 hero-enter-fade" />

        {/* Marca */}
        <div
          ref={brandRef}
          className="absolute inset-0 z-[3] flex flex-col justify-center items-center text-center"
        >
          <div
            className="hero-enter"
            style={{ "--d": "150ms" } as CSSProperties}
          >
            <Image
              src={asset("/logos/logo-light.png")}
              alt="Logo da Haru, sendo um desenho minimalista de uma silhueta de um cavalo"
              width={587}
              height={695}
              loading="eager"
              className="w-auto h-48 drop-shadow-lg"
            />
          </div>
          <h1
            className="font-[Cormorant_Garamond_Variable] text-ivory text-center text-6xl tracking-[0.25em] font-medium sm:text-9xl drop-shadow-lg hero-enter"
            style={{ "--d": "300ms" } as CSSProperties}
          >
            HARU
          </h1>
        </div>

        {/* Arro de rolagem */}
        <p
          ref={hintRef}
          className="absolute bottom-16 w-full z-[2] flex flex-col items-center gap-1 text-white/90 drop-shadow-lg"
        >
          <span
            className="text-xs uppercase tracking-[0.3em] hero-enter-fade"
            style={{ animationDelay: "700ms" }}
          >
            Rolar para baixo
          </span>
          <ArrowDown className="h-5 w-5 animate-bounce hero-enter-fade" />
        </p>
      </section>
    </div>
  );
}

export default memo(Hero);