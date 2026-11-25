# Store web — production go-live checklist

Runbook: [deploy/README.md](../deploy/README.md). Decisions: [DECISIONS.md](../DECISIONS.md) (session HC). Tick each box
with the date and who checked it. **[done]** = delivered by the PR "Store web — Option C home + production readiness";
everything else is for the owner (or a later session).

## Blockers

- [x] **Showcase mode (deploy without payments).** Staging and production are built with `showcase: true` and the API
      runs with `PAYMENTS_PROVIDER=none`, `CUSTOMER_SIGNIN=false`: donors see categories and projects only; staff admin
      works (deploy/README.md "Showcase mode") — **[done, PR "Showcase mode (deploy without payments)"]**.
- [ ] **After Moyasar — switch payments on:** `showcase: false` (staging + production), the Apple Pay file, the API env
      (deploy/README.md "Switch payments on"). The payment flows themselves are done (R5-Payments, F5a) and tested in CI.
- [ ] **After Moyasar — Moyasar dashboard (owner):** live publishable/secret keys and the webhook secret into the API's secret files
      (`ta3lom_store_api` `deploy/secrets.md`, never the repo); webhook URL
      `https://store-api.africadawad.org/v1/payments/webhooks/moyasar` (staging: `store-api-staging…`, test keys); payment
      methods mada, credit card, Apple Pay (domain verification for `store.africadawad.org`); run the API's sandbox tests once
      with a test key (`MoyasarSandboxTests`, skipped without one).
- [ ] **Staging API hosted** at `https://store-api-staging.africadawad.org` (the staging deploy is skipped until it answers, H-1).
- [ ] **africadawad API deployment** from the kit in [`deploy/api/`](../deploy/api/README.md): copy
      `.env.production.example` / `.env.staging.example` and `compose.africadawad.yaml` next to the API's
      `compose.yaml`; add `-f compose.africadawad.yaml` to every compose command. It covers what the API still defaults
      to ta3lom for:
      - `SITE_REBUILD_REPOSITORY=lotfi029/african_store_web`, plus the `Store__SiteRebuild__Token` secret (Contents
        read/write on this repo). Without them, publishing rebuilds ta3lom's site, and new pages here wait for the
        nightly build. The API sends `store-catalog-changed`, which `deploy.yml` listens to.
      - badge CORS (`africadawad.org`, `www`); `appsettings.Production.json` lists `ta3lom.sa`, and no env-file line reaches it.
      - the e-mail sender and staff alerts (`SMTP_USER`; the defaults are `store@` / `store-alerts@ta3lom.sa`).
      CORS for the site itself comes from `WEB_DOMAIN`.
- [ ] **API settings in `/admin`** after the first start: `site_name_*`, `receipt_org_name_*` (the receipt falls back to
      ta3lom's association name), `receipt_licence_no`, `support_mobile`.
- [ ] **Edge proxy:** copy `deploy/edge/store.caddy` into ta3lom-deploy and import it (`deploy/edge/README.md`);
      the `edge` network has a fixed IPv4 subnet = the API's `EDGE_SUBNET`. This container publishes no port (F7).

## Content (owner)

- [ ] Licence number and trust texts (C-2 / Q-11): replace `[رقم الترخيص]` / `[licence number]` in
      `@@store.layout.utility-licence` and `@@store.home.trust-licensed-text` (Arabic in the templates, English in
      `src/locales/en.json`), confirm "إيصال فوري" wording.
- [ ] Real categories (one marked "accepts general gifts" for the quick donate — the first by `sort` is used, C-3),
      projects, cover images; every image with Arabic **and** English alt text.
- [ ] At least one `urgent` (or featured) project for the home banner.
- [ ] Privacy and refund pages written and linked from the footer (Q-07).
- [ ] SMS sender ID registered (Q-12).
- [ ] Main site: `/donate` redirects to `https://store.africadawad.org/ar/` and the main navigation links the store (Q-09).
- [x] Zakat and delivery updates stay hidden (`environment.trust.showZakat/showUpdates = false`) until they exist (M-3). **[done: default off, spec-checked]**

## Infrastructure (owner)

- [ ] DNS for `store.africadawad.org`, `store-api.africadawad.org` and the two staging names; the edge terminates TLS and sends
      HSTS on the production names (`deploy/edge/store.caddy`).
- [ ] VPS folders, `.env` (`EDGE_ALIAS`), deploy user, GHCR `read:packages` token logged in on the VPS (H-4).
- [ ] GitHub environments `staging` / `production` (required reviewer, tags only), SSH secrets and known_hosts.
- [ ] First staging deploy green (workflow smoke check), then `node scripts/smoke-deploy.mjs` by hand.
- [ ] Backups of the API database (API runbook) — scheduled and a restore tested. **[scripts done: API `deploy/backup.sh` + `deploy/restore-test.sh` (verified on a real dump); schedule = owner]**
- [ ] Uptime monitor on `/healthz` and `/ar/` (deploy/README.md §8), alerting the owner.
- [ ] Error reporting: decide on an endpoint and set `errorReportUrl` (off by default; PII-free payload), or leave it off.

## Quality (before go-live, on the production URLs)

- [x] Lighthouse (mobile) on `/ar/`, `/en/`, a project page: accessibility 100, best practices ≥ 95, SEO ≥ 95,
      CLS ≤ 0.05 — **[done in CI on the container]**; performance ≥ 90, LCP ≤ 2.5 s, TBT ≤ 200 ms — **partly met in CI**
      after the F6 pass and the hydration fix (perf 92–95, LCP 2.45–2.66 s, TBT 64–135 ms; floors 0.89 / 2800 ms / 250 ms). **[done in CI, final session: a11y 100, BP 96, SEO 100, CLS 0.000 — perf 85–90, see DECISIONS F6]**
- [ ] **Lighthouse mobile ≥ 90 on the production URL** (`https://store.africadawad.org/ar/`, `/en/`, a project page) — go-live
      item (review 06 §4): the F6 pass is done (DECISIONS F6); the remaining options (responsive images from the API, grid
      hydration) are listed there.
- [ ] **After Moyasar:** trust row SMS wording ("برسالة نصية بعد الدفع") assumes **payments are on** (review 06 L-14) —
      check it when payments are switched on (in showcase no order and no SMS exist).
- [x] axe clean ar/en × light/dark on production — **[done in CI on every route]**.
- [ ] Google Search Console: property for `store.africadawad.org`, sitemap `https://store.africadawad.org/sitemap.xml` submitted.
- [x] Staging is not indexed (X-Robots-Tag, robots.txt `Disallow: /`) — **[done, checked by the build and container]**.

## Delivered in this PR

- [x] Option C home and header (catalogue first), tests and screenshots (`docs/screens/home-c/`).
- [x] Environments `development`, `ci`, `staging`, `production`; per-environment build checks.
- [x] Container image (non-root, read-only, healthcheck), Caddyfile (generated CSP, fallbacks, 404s, cache), compose.
- [x] CI (pinned actions, audit gate, container check, LHCI) and the deploy workflow (staging, production, rollback).
- [x] Retry for transient GET failures, kept prerendered data on API failure, PII-free error reporter (off).
- [x] Runbook and this checklist.
