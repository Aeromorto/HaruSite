import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[65vh] flex-col items-center justify-center gap-8 px-6 py-24 text-center">
      <p className="font-[Cormorant_Garamond_Variable] text-7xl font-medium tracking-[0.25em]">
        404
      </p>
      <p className="max-w-md font-light text-muted">
        Não encontramos esta página. O essencial continua aqui.
      </p>
      <Link href="/" className="btn btn-outline btn-sm uppercase tracking-widest">
        Voltar ao início
      </Link>
    </main>
  );
}