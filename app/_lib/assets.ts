// next/image and the metadata icons do not add `basePath` to a src coming from
// public/, so anything under /public has to be prefixed manually when the site
// is served from a sub-path such as https://<user>.github.io/<repo>/.
// NEXT_PUBLIC_* values are inlined at build time, so this also works in client
// components.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

export function asset(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) {
    return path;
  }

  return `${basePath}${path}`;
}
