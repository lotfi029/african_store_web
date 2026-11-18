# W-00 — Dar Africa store web

Storefront, donor account and staff admin for **جمعية الدعوة والتعليم باللغات الأفريقية (Dar Africa)**. It is a fork of
`lotfi029/ta3lom_store_web` @ `16e0ecf` with the same architecture, the same Angular lockfile and the same rules. It
talks to the same `ta3lom_store_api` `/v1` endpoints, and is restyled to `docs/design/darafrica-store-prototype.html`.

- Plan: [docs/plan/w-00-plan.md](plan/w-00-plan.md).
- Logs: [DECISIONS.md](../DECISIONS.md) and [PROGRESS.md](../PROGRESS.md).
- Branch: `feat/w-00-african-store`, one commit per phase (`W-00.0` … `W-00.10`).
- `W-00.0` is the untouched import of ta3lom, so every later commit can be reviewed against it.

## What changed from ta3lom (by area)

| Area | Change |
|---|---|
| Import | `W-00.0` is a pure copy of ta3lom @ `16e0ecf`. ta3lom's own docs and logs moved to `docs/reference/ta3lom/` (with `git mv`). `docs/openapi/` was not moved |
| Stack | No change. `package.json`, `package-lock.json`, the OpenAPI snapshot and the generated types are byte-identical to ta3lom |
| Identity | Domains (A-5) live in `scripts/lib/envs.mjs` and `src/environments/*`: store `store.darafrica.org`, API `store-api.darafrica.org/v1`, main site `darafrica.org`, plus staging. Showcase is on in staging and production (it already was) |
| Identity (names) | Arabic and English names; SEO site name; JSON-LD `NGO` name and `mainSiteUrl`; `og.png`; `index.html` title and theme colour |
| Deploy | Image `ghcr.io/lotfi029/african-store-web`, label `org.darafrica.store-web.config`, Caddy and edge blocks for the Dar Africa hosts. Every deploy job is gated by `vars.DEPLOY_ENABLED` |
| Tokens | Dar Africa palette (ink, teal, sand, cream). Every `--c-*` name is kept and re-pointed for light and dark. New tokens: `--c-gold-text`, `--c-highlight`, `--c-gold-line`, `--rb`, `--shadow-card`. `contrast-check` has 168 checks, all passing |
| Fonts | IBM Plex Sans Arabic 400 and 700 (OFL), Arabic + Latin-basic subsets, preloaded by `postbuild`. IBM Plex Mono is kept |
| Logo | The official mark from `african_web`, as `public/logo.svg#logo-src`. Fill is inherited, because the CSP blocks a `<style>` inside the SVG. Also `favicon.svg`, `favicon.ico` and `og.png` |
| Layout | Header: ink-tile lockup, pill search, tinted cart pill. Category tabs: sand underline, bold active tab. New footer: quote band, 4 columns, payment pills. New phone **bottom nav** at ≤ 760 px, rendered on idle (client only, W-00.11) |
| Home | Ink banner with ring art, sand pill, sand CTA, «التفاصيل» link and `aria-pressed` dots. Quick-donate card with 2 × 2 presets and the amount on the CTA. New filter heading. Restyled cards. Trust panel |
| Project | 16:9 cover, category pill, «عن المشروع» and «شارك الأجر» panels. Aside: option rows, a dashed total and the secure-payment line |
| Checkout | «طريقة الدفع» panel. It is information only: the hosted-page redirect is unchanged (rule 18) |
| Order | Ink hero. The paid check animates, and the animation stops under reduced motion |
| Account, login, 404, admin | Tokens and logo only |
| Copy | Two placeholders that ta3lom shipped are gone: «ترخيص رقم [رقم الترخيص]» in the utility row and the trust row. Tests now assert that no `[` placeholder appears |
| Seed, stub, e2e | The API's development seed is retired through the admin API. The Dar Africa catalogue is 8 categories and 22 projects. The stub was re-recorded from it. e2e slugs now point at the new catalogue. A new bottom-nav e2e and a footer e2e were added |
| Screenshots | `scripts/screenshots-w00.spec.ts` writes to `docs/screens/w-00/`. ta3lom's prototype-comparison spec was removed |

## Stack and API

- `ng version`: Angular CLI 22.2.7, Angular 22.2.6 (core, common, compiler, forms, localize, platform-*, router), `@angular/build` 22.2.7, `@angular/ssr` 22.2.7, TypeScript 6.0.3, RxJS 7.8.2, Vitest 5.1.0.
- Run with Node 24.22.3 and npm 11.19.1. No `ng update` was run and no dependency changed.
- [docs/api-endpoints.md](api-endpoints.md) lists **68 `/v1` paths** called by the web. All 68 exist in the snapshot (0 unmatched). The only snapshot path the web does not call is the gateway webhook.
- The snapshot is identical to ta3lom's, and `types:check` is green.
- The API used locally is `ta3lom_store_api` @ `27ec8eb`, unedited.

## Gates (DoD order, real local API)

| Gate | Result |
|---|---|
| `api:up` → `api:seed` | ✓ Development seed retired (6 projects archived, 3 categories deactivated). Seeded 22 published projects in 8 active categories, plus 4 staff roles |
| `types:check` · `typecheck` · `lint` | ✓ Lint covers ESLint, Stylelint, contrast (168), no-commerce and i18n |
| `test` | ✓ **419** unit tests (71 files) + **16** script tests |
| `build` | ✓ 46 prerendered routes. Initial JS gzip: **ar 137.5 kB**, **en 135.8 kB** (budget 150; after W-00.11). Initial transfer: **144.5 / 142.8 kB** (budget 400). Generated CSP, hash-only |
| `e2e` (full, real API) | ✓ **117 passed**, 19 skipped (stub-only cases and the `@showcase` set, which runs on its own build) |
| `e2e @smoke` (stub, as in CI) | ✓ 67/69. The 2 misses were the retired slug; they were fixed and then passed in the real-API run |
| `e2e @showcase` (`build:ci-showcase`) | ✓ 17/17 |
| `a11y` (axe) | ✓ **58 routes × light + dark**, 0 violations (real-API build). On the stub build: 70 routes × 2, 0 violations |
| `build:prod` | ✓ Production configuration, with the prerender reading the local API (a dry run, never published). CSP and budgets green |
| Container | ✓ `docker build CONFIG=ci`. `check-container` checks headers, CSP, fallbacks, 404s, cache, healthz, non-root and the label. Edge aliases ✓. `caddy validate` ✓ |
| LHCI (mobile, median of 3) | ✗ **TBT over the 250 floor; every other category passes** (perf 93–95, a11y 100, BP 96, SEO 100, LCP < 1 s, CLS ≤ 0.012). CI TBT medians: run 1 `/ar/` 279, `/ar/p` 250.5 (`/en/*` ✓); run 2 (W-00.11, slow runner) 378.5 / 334 / 354 / 338; run 3 (same code, slow runner) `/ar/` 312, `/en/` ✓, `/ar/p` 276.5, `/en/p` 298.5. Budget not raised; owner decision requested (REVIEW 8) |
| Fonts | /ar/ downloads 76.5 kB of fonts and /en/ 58.9 kB. The budget is 69.0 kB, so /ar/ is 7.5 kB over (REVIEW) |

## Screenshots

[`docs/screens/w-00/`](screens/w-00/) holds 56 JPEGs: `{ar,en}-{light,dark}-{1-home,2-project,3-cart,4-checkout,5-order-paid,6-admin,7-404}-{1440,390}.jpg`.

| | |
|---|---|
| Home | [ar light 1440](screens/w-00/ar-light-1-home-1440.jpg) · [ar light 390](screens/w-00/ar-light-1-home-390.jpg) · [ar dark 1440](screens/w-00/ar-dark-1-home-1440.jpg) · [en light 1440](screens/w-00/en-light-1-home-1440.jpg) |
| Project | [ar light 1440](screens/w-00/ar-light-2-project-1440.jpg) · [ar dark 390](screens/w-00/ar-dark-2-project-390.jpg) |
| Cart · Checkout | [cart](screens/w-00/ar-light-3-cart-1440.jpg) · [checkout](screens/w-00/ar-light-4-checkout-1440.jpg) · [checkout en dark](screens/w-00/en-dark-4-checkout-1440.jpg) |
| Order (paid) | [ar light](screens/w-00/ar-light-5-order-paid-1440.jpg) · [en dark 390](screens/w-00/en-dark-5-order-paid-390.jpg) |
| Admin · 404 | [admin en dark](screens/w-00/en-dark-6-admin-1440.jpg) · [404](screens/w-00/ar-light-7-404-1440.jpg) |

## Intended differences from the prototype

**Not built: the API has no data for these (A-10, §9)**
- Goal progress bars, «المتبقي», donor counts and the "closest to target" sort.
- «أهدِ تبرعك لمن تحب»: the gift link, the gift band and the project page's gift box.
- «أثرنا بالأرقام» impact numbers.
- The project gallery and stats minis. The project shows one cover.
- The execution-updates timeline.
- The licence number, in the utility bar, the footer and the trust row.

**Footer items without a source yet**
- No e-mail or mobile.
- No «الحوكمة والتقارير» link.
- No refund-policy or privacy-policy links.

**Kept from ta3lom (behaviour)**
- The header «تبرع سريع» button.
- The phone burger menu (theme, main site, quick donate).
- The banner's prev/next buttons.
- The floating quick-donate button at ≥ 1320 px.
- Sorts: featured, newest and title.

**Other**
- The banner has no cover image (the prototype has none).
- Order references keep the API's `T3-` prefix (§9).
- Font weight 600 is not shipped.

## REVIEW rows (owner must read)

1. **A-7 Payments.** Showcase stays on in staging and production until a Moyasar account exists.
2. **Apple Pay file.** ta3lom's file is a *placeholder*, not real domain data. It is kept (re-texted for `store.darafrica.org`) because deleting it breaks three gates, and it is the safety that fails a payments-on production build until Moyasar's real file is in place. The plan asked for deletion.
3. **Fonts.** /ar/ is 7.5 kB over the F6.4 + 25 % budget (76.5 vs 69.0 kB). Weight 600 was already dropped (§7). The remaining options are a variable Arabic font or a single weight.
4. **Utility-row licence.** ta3lom's placeholder licence number was removed. It returns when the API exposes `receipt_licence_no`.
5. **Footer.** No e-mail, mobile, licence, governance or policy links until they exist.
6. **Cards, filter bar, trust.** The trust-row placeholder was replaced by «تحت إشراف الجهات الرسمية المختصة». A «دفع آمن» item was added and is hidden in showcase.
7. **Checkout payment panel.** It shows the gateway's methods as information only. Payment stays a hosted-page redirect.
8. **Lighthouse TBT.** Run 1 was over the 250 floor on the Arabic pages (279 / 250.5 ms); W-00.11 renders the bottom nav on idle. Run 2 was red on all four pages, but its runner was ~40 % slower (`benchmarkIndex` ~2000–2600 vs ~3800–4250) with the same task structure; normalised, `/ar/` ≈ 234 ms. Run 3 (same code, `benchmarkIndex` 2199–2927) was red on `/ar/` 312, `/ar/p` 276.5 and `/en/p` 298.5 ms. The margin is thin and depends on the runner. Budgets were not raised. The owner chose the performance pass: **W-00.12** puts `content-visibility: auto` on off-screen cards, the trust row and the project panels (`/ar/` main-thread work 272 → 229 ms), and the axe helpers render everything before scanning so the a11y gate keeps checking every element's real colours. It stays REVIEW until CI's LHCI is green.

## Owner decisions pending

- **API (§11 step 1)**:
  - (a) Use ta3lom's running API. This means one shared catalogue, orders, `T3-` receipts and admin.
  - (b) Run a second deployment of the same `ta3lom_store_api` image (recommended), with its own database, keys, CORS origin, URLs, SMS/e-mail sender and settings.
  - Then set `apiUrl` in `scripts/lib/envs.mjs` and `environment.*.ts`.
- **Deploys**: set the repository variable `DEPLOY_ENABLED=true` only together with these:
  - the `staging` and `production` environments;
  - the VPS SSH secrets;
  - the GHCR read token on the VPS;
  - DNS for `store(.staging).darafrica.org` and `store-api(-staging).darafrica.org`;
  - the edge blocks in `deploy/edge/`.
- **First deploy**: create the catalogue in `/admin`, because the seed is local only. Use `ALLOW_EMPTY_CATALOGUE=true` once, then delete it.
- **Payments**:
  1. Open the Moyasar account and set up the API gateway environment.
  2. Set `showcase: false` in `envs.mjs` and `environment.production.ts`.
  3. Put Moyasar's Apple Pay file in `deploy/well-known/`.
- **§9 API items**, behind config so ta3lom is unaffected: goal and raised amounts, gifting (business rule D-15 first), `impact_stats`, project media, project updates, the licence number in `/catalog/config`, and the order-reference prefix.

## Owner steps (plan §11)

1. **Point the app at the API.** Set `apiUrl` per environment in `scripts/lib/envs.mjs` and `environment.*.ts`. Choose one:
   - (a) `https://store-api.ta3lom.sa/v1`, and add `https://store.darafrica.org` to `Store:Cors:Origins`; or
   - (b) a second deployment of the same image (recommended), with its own database, JWT keys and secrets, plus:
     - `Store:Cors:Origins`, `Store:WebBaseUrl`, `Store:PublicBaseUrl` and `Store:Files:PublicBaseUrl`;
     - the SMS and e-mail sender;
     - the settings `site_name_*`, `receipt_org_name_*`, `receipt_licence_no`, `support_mobile` and `amount_presets`.
2. **DNS.** Point `store.darafrica.org`, `store-api.darafrica.org` and the staging hosts at the VPS, and add the edge Caddy blocks (`deploy/edge/`).
3. **GitHub.** Create the `staging` and `production` environments and the VPS deploy secrets, put the GHCR read token on the VPS, then set `DEPLOY_ENABLED=true`.
4. **Catalogue.** Create the categories and projects in `/admin`. Deploy the first time with `ALLOW_EMPTY_CATALOGUE=true`, then remove it.
5. **Payments.** Moyasar → API gateway environment → `showcase: false` → the Apple Pay domain file in `deploy/well-known/`.
6. **Decisions.** Decide the §9 items and the gifting rule (D-15).

## Brand check

```
grep -rIi "ta3lom\|التعلم الإلكتروني" src public deploy
```

The command returns only source references:
- code comments that cite the source repo (`ta3lom_store_web`, `ta3lom-web` ADR, ta3lom's prototype file names);
- the API (`ta3lom_store_api`, its compose names);
- the generated `store-api.types.ts`.

No ta3lom brand text reaches a page.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

https://claude.ai/code/session_013C8Mq7mjS67aTJu1dxYC2X
