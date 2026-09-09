"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="conteudo" className="page-message">
      <h1>Não foi possível abrir esta página.</h1>
      <p>Unable to load this page.</p>
      <button className="ui-btn" onClick={reset}>
        Tentar novamente / Retry
      </button>
    </main>
  );
}
