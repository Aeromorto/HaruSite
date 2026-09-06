# HARU

Static, bilingual (Portuguese/English) HARU storefront. The maintained website is
at the repository root. The original design, product photographs, three-product
catalogue, themes and scroll animations are retained.

**Live website:** https://aeromorto.github.io/HaruSite/

Online checkout is unavailable: this repository has no authentication, order,
inventory, newsletter delivery or payment backend. The bag is a local product
selection. Postal prices and delivery times are illustrative, not carrier quotes.

## Develop and validate

Requires Node.js 22 or newer.

```sh
npm ci --ignore-scripts
npm test
npm run build
npm start
```

Open http://127.0.0.1:8765/. The server binds only to the local computer and serves
the built `dist/` directory. Rebuild after changing source. No runtime npm
dependencies or API keys are required by the website. `jsdom` is used only by
the regression tests and build validation.

## Publish

GitHub Pages uses the `Validate and deploy HARU` Actions workflow. Pushes to
`main` run locked dependency installation, regression tests and the static build
before deploying `dist/`. Pull requests run validation without deploying.
The repository's Pages publishing source must be **GitHub Actions**.

Only HTML, CSS, JavaScript, images and fonts are published. Development files,
tests and historical prototypes stay in Git. Public `v2/`, `v3/` and `v4/` page
URLs redirect to the maintained equivalents, preserving query strings and
fragments. The original prototype source remains available in those Git folders.

## Review and change history

- [Detailed review, fixes, limitations and integration requirements](docs/REVIEW.md)
- [Changelog](CHANGELOG.md)

For rollback, revert the relevant commit on `main`; the workflow validates and
redeploys that source. Avoid restoring the old simulated checkout as a live store.
