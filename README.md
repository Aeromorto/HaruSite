# HARU — v5 and v5.5

Both versions are hosted on GitHub Pages at separate URLs:

| Version | Website | Source |
| --- | --- | --- |
| **v5 — original** | https://aeromorto.github.io/HaruSite/ | Root HTML, `css/`, `js/`, `images/`, `fonts/`; restored from commit `80591dc` |
| **v5.5 — reviewed** | https://aeromorto.github.io/HaruSite/v5.5/ | `v5.5/` |
| **v5.5 issues and fixes** | https://aeromorto.github.io/HaruSite/v5.5/changes/ | `v5.5/changes/index.html` |

v5 is preserved with its original behavior. v5.5 fixes cart validation, storage
errors, keyboard accessibility, postal lookup races/timeouts, misleading checkout
and newsletter feedback, and form privacy. It keeps the original design,
photography, catalogue, languages and themes.

v5.5 clearly disables online checkout because no authentication/order/payment
backend exists. Its bag and device-only email list are separate from v5; visiting
it does not remove or migrate v5 cart/checkout data. Themes/languages keep their
existing shared preferences. Shipping numbers remain illustrative.

## Develop and validate

Requires Node.js 22 or newer:

```sh
npm ci --ignore-scripts
npm test
npm run build
npm start
```

Preview v5 at http://127.0.0.1:8765/ and v5.5 at
http://127.0.0.1:8765/v5.5/. The server binds only to this computer and serves
`dist/`. Rebuild after editing. No runtime npm dependencies or API keys are needed.

The regression tests target **v5.5**. The build validates the pages and links of
both versions and copies each version's own assets. Do not edit the root when
making a v5.5-only change.

## Publish

The `Validate and deploy HARU` workflow runs tests and builds both versions on
pushes to `main`, then deploys `dist/`. Pull requests validate without deploying.
Both legacy branch publishing and the new workflow preserve the version URLs.

**Recommended owner setting:** Settings → Pages → Build and deployment → Source
→ **GitHub Actions**. The existing credentials can push/deploy but could not
change this administrative setting. Until the owner changes it, the legacy
publisher also runs and is not gated by the regression tests. The workflow
excludes development files from its public artifact; legacy publishing does not.

## Documentation

- [Issues found and fixed in v5.5](https://aeromorto.github.io/HaruSite/v5.5/changes/)
- [Detailed review and remaining limitations](docs/REVIEW.md)
- [Changelog](CHANGELOG.md)
