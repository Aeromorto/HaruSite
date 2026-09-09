import Link from "next/link";
export default function NotFound() {
  return (
    <main id="conteudo" className="page-message">
      <h1>Página não encontrada.</h1>
      <p>Page not found.</p>
      <Link href="/">Voltar à HARU / Back to HARU</Link>
    </main>
  );
}
