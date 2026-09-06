# Repository review and implementation notes

Reviewed 2026-09-06 against original commit `80591dc`. Scope: maintained root
website, shared JavaScript/CSS, eight public pages, assets, prototype directories
and publication setup. The historical prototypes remain archived source; they
are not separate maintained storefronts.

## Findings resolved

| Priority | Original failure or edge case | Implemented behavior |
| --- | --- | --- |
| High | Any six digits passed simulated authentication. A stored `verified` flag skipped verification. | Remove the simulated checkout from the public flow. Auth methods return `NOT_CONNECTED`; no local flag grants authentication. |
| High | Payment errors opened a completion screen; a generic successful adapter response cleared the bag before handling a redirect or confirming payment. | No payment or order completion is claimed. Checkout displays an unavailable notice and retains the bag. |
| High | Checkout details, addresses and draft orders persisted in localStorage and, for checkout, cookies. | Stop collecting these details; remove legacy drafts and expire legacy cookies when the browser permits access. |
| High | Cart lookup accepted inherited properties such as `constructor`; fractional/nonfinite quantities and duplicate rows corrupted counts/totals. | Own-property ID checks, finite integer quantities, a nine-unit limit and duplicate merging on every load/update. |
| Medium | Public `getItems()` exposed mutable row objects. | Return independent row copies. |
| Medium | Storage failures could silently erase a bag on reopening or navigation. | Preserve current-tab state, display a persistence warning and avoid claiming that unsaved state survives navigation. |
| Medium | A root-scoped cookie and unscoped cart key could leak state into other Pages paths or restore stale cart contents. | Path-scoped localStorage key, one-time valid legacy migration, no cart cookie writes. |
| Medium | Cart behaved as a modal without dialog semantics, a focus trap, background isolation or return focus. Re-rendering rows lost keyboard focus. | Accessible modal semantics, `inert` background, Tab/Shift+Tab containment, Escape/close return focus and stable focus across row updates/removal. Stop/resume Lenis while open. |
| Medium | Late CEP responses overwrote newer searches. Editing a CEP left old rates visible; fetch could wait indefinitely. | Abort superseded work, ignore stale completions, clear old results on edit, abort after eight seconds and restore loading state on all outcomes. |
| Medium | A not-found/network result retried through an executable third-party JSONP script; unknown states silently selected southeast rates. | Fetch JSON only, preserve not-found errors, validate state/city and show recoverable network errors. |
| Medium | Newsletter reported success even when localStorage failed; “Subscribe” implied an actual subscription. | Explicit device-only saving before submission, honest write errors and translatable live feedback. |
| Medium | Repository-root publication exposed old working prototypes and development files. | The new workflow publishes allowlisted output with historical redirects. An owner must disable the competing legacy publisher as described below. |
| Low | New cart links did not preserve explicit language/theme under restricted storage. Quantity buttons had only symbol labels. | Include current choices in generated links and provide localized action/product labels. |
| Low | Mobile menu lacked Escape/outside-close behavior; generic Instagram and missing WhatsApp destinations were visible. | Add closing behavior and remove unconfigured destinations. Existing email contact remains. |
| Low | No automated validation, setup documentation or change record. | Add DOM regression tests, static asset/page/fragment checks, repeatable build/preview scripts, CI deployment and this documentation. |

## Validation

`npm test` runs 14 regression tests using the actual page HTML and application
scripts in jsdom. Tests cover malformed and duplicate carts, inherited IDs,
quantity limits, defensive copies, migration/privacy cleanup, blocked/full
storage, keyboard interactions, payment unavailability, tab synchronization,
translations, newsletter failure, CEP response ordering, invalid responses,
network failures and timeout recovery. Every maintained page initializes in both
languages. Requests are mocked; no email, payment or customer order is sent.
Forms stay disabled until their JavaScript handlers are installed, preventing
native GET submissions from leaking email/postal data into URLs when scripts fail.

`npm run build` checks duplicate HTML IDs and every static local `href`/`src`,
including cross-page fragments, then produces only public files and historical
page redirects. CI repeats the tests and build on Linux before publication.
The local preview is checked over HTTP. Browser rendering, real-device touch,
screen-reader and real-carrier/payment integration testing are not covered by
these automated tests.

## Remaining limitations and follow-up work

1. **Commerce requires a server.** Before restoring checkout, implement email
   delivery and one-time-code expiry/rate limits; secure server sessions; an
   authoritative catalogue and inventory; shipping quotes; server-validated
   coupons; idempotent order/payment creation; gateway redirects or SDK handling;
   webhook signature verification; and an order-status page. Never trust browser
   prices, discounts, a local `verified` flag, or a payment-creation response as
   evidence of payment. Credentials must not be shipped in public JavaScript.
2. **Newsletter is device-only.** It does not enroll anyone, deliver email or
   sync between devices. Connect a subscription service with an explicit user
   enrollment flow before using subscription-success wording.
3. **Shipping numbers are placeholders.** They remain useful only as explicitly
   illustrative simulations. ViaCEP validates an address location, not shipping
   cost, stock availability or delivery serviceability.
4. **Business/content evidence is absent.** The repository states “Aprovado pela
   ANVISA” and includes specific health, material, sterilization, sourcing and
   environmental claims, but contains no supporting product registration or
   certification dossier. Those claims were not independently verified in this
   engineering review. Obtain the relevant product evidence and review the
   scientific references and existing legal copy before commercial launch.
5. **Contact destinations need confirmation.** The supplied email address was
   preserved; deliverability was not tested. Add real social profiles/numbers
   once available. No messages were sent.
6. **Local bags are not transactional.** Ordinary cross-tab changes synchronize,
   but exactly simultaneous writes can still race because localStorage has no
   atomic compare-and-swap. Storage denial/quota fallback survives only within
   the current tab. A server is needed for durable or cross-device carts.
7. **Legacy migration limits.** Valid legacy localStorage bags migrate, but old
   cookie-only bags are discarded rather than trusting ambiguous origin-wide
   cookies. Browser-blocked storage cannot be cleaned until access is permitted.
8. **Visual/performance follow-up.** Validate both themes at 200% zoom, keyboard
   and screen-reader flows, mobile safe areas and touch scrolling on real devices.
   The original large JPEG hero images and vendor animation libraries are kept;
   responsive image formats and further motion tuning can be evaluated against
   measured performance and visual quality.

## Deployment notes

The repository is still configured to publish from `main` at `/` using legacy
Pages. The new workflow successfully published `dist/` after tests and build
passed, and HTTP checks verified the updated cart, historical redirects and
absence of `package.json`. However, the current credentials could not update
the administrative Pages configuration (GitHub returned 404 for the update),
so both publishers currently run. A later legacy deployment can replace the
filtered output, and the legacy publisher is not gated by the new tests.

**Owner action:** Settings → Pages → Build and deployment → Source →
**GitHub Actions**. Retain HTTPS. No additional application code or payment
credentials are needed for this switch. Deployment follows the [official custom
workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

The static site intentionally has no paid service integration and no additional
hosting provider. Prices, catalogue assets, content language options and the
existing GitHub Pages URL remain under this repository's control.
