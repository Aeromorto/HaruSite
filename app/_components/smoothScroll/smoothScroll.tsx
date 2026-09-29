"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

/** Compensa a altura do cabeçalho fixo ao rolar até uma âncora. */
const HEADER_OFFSET = -72;

function resolveAnchor(hash: string): HTMLElement | null {
  if (!hash) return null;
  try {
    return document.querySelector(hash);
  } catch {
    return null;
  }
}

function scrollToHash(lenis: Lenis | null, hash: string) {
  const target = resolveAnchor(hash);
  if (!target) return;
  if (lenis) {
    lenis.scrollTo(target, { offset: HEADER_OFFSET });
  } else {
    target.scrollIntoView({ block: "start" });
  }
}

/** Rola com suavidade via Lenis e cuida das âncoras (#loja, #marca, …). */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      wheelMultiplier: 1,
    });
    lenisRef.current = lenis;
    // Expõe a instância para integração com GSAP/ScrollTrigger (como no site antigo).
    (window as unknown as { haruLenis?: Lenis }).haruLenis = lenis;
    window.dispatchEvent(new CustomEvent("haru:lenis-ready", { detail: lenis }));

    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        "a[href]",
      );
      if (!anchor || !anchor.hash || anchor.origin !== window.location.origin) {
        return;
      }
      // Âncora na própria página: rola suave sem o salto nativo do navegador.
      if (anchor.pathname === window.location.pathname) {
        event.preventDefault();
        scrollToHash(lenis, anchor.hash);
        window.history.replaceState(null, "", anchor.hash);
      }
      // Âncora de outra rota (ex.: /#loja saindo de /products): o Link do
      // Next navega e o efeito abaixo rola até o elemento na nova página.
    };

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      delete (window as unknown as { haruLenis?: Lenis }).haruLenis;
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!window.location.hash) return;
    // Espera a nova rota pintar antes de rolar (duplo rAF).
    requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        scrollToHash(lenisRef.current, window.location.hash),
      ),
    );
  }, [pathname]);

  return <>{children}</>;
}