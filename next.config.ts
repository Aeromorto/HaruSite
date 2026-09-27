import type { NextConfig } from "next";

// GitHub Pages serves the site from https://<user>.github.io/<repo>/, so every
// route and asset needs the repository name as a prefix. The deploy workflow
// feeds NEXT_PUBLIC_BASE_PATH from actions/configure-pages; it stays empty for
// local builds. Never add a trailing slash here.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  basePath,
  output: 'export',
  // GitHub Pages only serves directory indexes, so /products/kit has to exist as
  // /products/kit/index.html. Without this the export writes kit.html and every
  // clean URL 404s.
  trailingSlash: true,
  images: {
    unoptimized: true
  },
};

export default nextConfig;
