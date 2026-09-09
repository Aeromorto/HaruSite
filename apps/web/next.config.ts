import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  // Mantém links antigos utilizáveis sem duplicar as páginas HTML no aplicativo novo.
  async redirects() {
    return [
      "index",
      "escova",
      "kit",
      "suporte",
      "uso",
      "microplasticos",
      "privacidade",
      "termos",
    ]
      .flatMap((name) => [
        {
          source: `/${name}.html`,
          destination: name === "index" ? "/" : `/${name}`,
          permanent: true,
        },
        {
          source: `/v5.5/${name}.html`,
          destination: name === "index" ? "/" : `/${name}`,
          permanent: true,
        },
      ])
      .concat([{ source: "/v5.5", destination: "/", permanent: true }]);
  },
};
export default config;
