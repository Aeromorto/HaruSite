# Changelog

- **v5:** Original commit `80591dc`, restored at `/HaruSite/`.
- **v5.5:** Reviewed version, hosted separately at `/HaruSite/v5.5/`.
- [Human-readable issue list](https://aeromorto.github.io/HaruSite/v5.5/changes/)

## 5.5.0 — 2026-09-06

- Replace simulated email verification/payment completion with an explicit
  unavailable-checkout notice; keep the visitor's bag intact.
- Stop collecting checkout/address/order drafts in v5.5. Preserve v5 data and
  cookies now that the original version is hosted alongside v5.5.
- Validate cart IDs and finite integer quantities, merge duplicate rows, cap
  quantities at nine and return defensive copies from the public cart API.
- Scope cart and device-only email storage to the version path, without reading
  or deleting the original v5 data.
- Keep the bag usable in memory when browser storage is blocked or full, with
  an explicit persistence warning. Synchronize ordinary edits across tabs.
- Add dialog semantics, background isolation, focus trapping/restoration,
  keyboard-focus preservation on cart edits and live status announcements.
- Preserve language/theme in dynamically generated product links, translate
  quantity controls and close mobile navigation with Escape or an outside click.
- Cancel stale CEP lookups, enforce an eight-second timeout, validate responses
  and remove the third-party JSONP execution fallback.
- Clear obsolete shipping results when input changes; label rates as illustrative.
- Make the newsletter's device-only behavior explicit and report storage errors
  instead of falsely reporting a successful save.
- Keep forms disabled until their local JavaScript handlers are ready, preventing
  accidental GET submissions with visitor data when JavaScript is unavailable.
- Align privacy/order descriptions with actual data handling, remove unconfigured
  social links, add no-JavaScript guidance and strengthen hidden/focus/motion CSS.
- Add repeatable tests, asset/page/fragment validation, a clean static build,
  local preview server, GitHub Pages workflow and redirects for old public URLs.
