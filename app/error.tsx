"use client";

export default function Error({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="flex min-h-[65vh] flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <p className="font-[Cormorant_Garamond_Variable] text-5xl font-medium tracking-[0.15em]">
        Algo deu errado
      </p>
      <p className="max-w-md font-light text-muted">
        Não foi possível mostrar esta página agora. Tente novamente — se o
        problema persistir, escreva para a HARU.
      </p>
      <button
        type="button"
        onClick={retry}
        className="btn btn-outline btn-sm uppercase tracking-widest"
      >
        Tentar novamente
      </button>
    </main>
  );
}