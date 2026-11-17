# Dar Africa store web (`african_store_web`): one-session implementation plan (W-00)

**Goal:** build the Dar Africa (جمعية الدعوة والتعليم باللغات الأفريقية) donation store in **`lotfi029/african_store_web`**.
It uses **the same architecture and the same Angular version as `ta3lom_store_web`**, and talks to **the same `ta3lom_store_api` endpoints** (`/v1`, same OpenAPI contract). That API is the backend for both store web apps.
It follows **every rule of `ta3lom_store_web`**, and its storefront matches the approved prototype (`darafrica-store-prototype.html`).

**How this session runs:** one session, one branch, one PR, with no stops.
Every phase ends with its gates and a commit. When something blocks, take the fallback written here, log it in `DECISIONS.md` (`REVIEW` if it touches money, auth or personal data) and carry on.
Stop only when §10 (Definition of done) is complete.

---

## 0. Decisions this plan makes (change them before the session starts, not during it)

| # | Decision | Value | Why |
|---|---|---|---|
| A-1 | Starting point | **Copy `ta3lom_store_web` at `main`** (code, scripts, CI, deploy, tests, **`package.json` + `package-lock.json` unchanged**). Do not use `ng new` | "Same rules" means the same gates, scripts and architecture. The ta3lom app is already donations-only (R5) and talks to this API. A copy keeps 19 non-negotiables, 300+ unit tests, e2e, a11y, CSP and budgets working from minute one |
| A-2 | Keep internal names | Selector prefix `ta-`, i18n ids `@@store.*`, file names, `core/` and `shared/` APIs unchanged | Fixes in ta3lom can be cherry-picked across. Renaming adds no value for donors |
| A-3 | Repo / branch / PR | **`lotfi029/african_store_web`** (exists; `main` = one "Initial commit" with a README). Branch `feat/w-00-african-store` from `main`, PR "W-00 — Dar Africa store web" into `main` | ta3lom working method: one session = one branch = one PR |
| A-4 | Angular | **Exactly the versions locked in `ta3lom_store_web`**: the lockfile is copied, so `@angular/core` 22.2.6, CLI and build 22.2.7, TypeScript ~6.0.3 at ta3lom `8f35a74`. **No `ng update` in this session.** Later bumps follow ta3lom's Dependabot PRs, one for one | Owner rule: same architecture and same Angular as ta3lom. Identical locks also keep cherry-picks clean |
| A-5 | Domains | Store `https://store.darafrica.org`, API `https://store-api.darafrica.org/v1` (option b in §11; for option a it is `https://store-api.ta3lom.sa/v1`), main site `https://darafrica.org`; staging `store-staging.` / `store-api-staging.` | They live in one table (`scripts/lib/envs.mjs` + `src/environments/*`). Change them there if they differ |
| A-6 | Backend | **`ta3lom_store_api` is the backend.** This app calls the **same `/v1` endpoints** with the same request and response shapes. `docs/openapi/store-api.v1.json` is the same snapshot (refreshed only with `npm run api:openapi` from that repo), and types are generated from it. **No endpoint is added, changed or worked around, and there are no API code changes in this session.** The base URL is one value per environment (`environment.*.ts` + `scripts/lib/envs.mjs`) | Owner rule. Where that URL points (ta3lom's running API or a second deployment of the same image) is an owner step, §11. The API is single-tenant, so one deployment means one shared catalogue, cart and order list for both stores |
| A-7 | Payments | `showcase: true` in staging and production (read-only donate boxes, «التبرع الإلكتروني قريبًا») until the association has a Moyasar account | Same switch ta3lom uses. Turning it off is an owner step (§11) |
| A-8 | Admin | Keep the whole staff admin (`/admin`), rebranded by tokens and logo only | The separate API instance needs its own admin. It is already built and tested |
| A-9 | Hosting | Docker image `ghcr.io/lotfi029/african-store-web` (Caddy, static output) on the association's Hostinger VPS, behind the edge proxy, same as ta3lom's deploy | Same `Dockerfile`, `deploy/`, workflows |
| A-10 | Prototype features the API lacks | **Not built** (goal progress, gifting to a person, impact numbers, project gallery, execution updates, "closest to target" sort). Listed in §9 with the API change each one needs | ta3lom rules 15 + "never invent": types only from the generated OpenAPI, no fake data in production UI. Option C made the same call for progress bars |

---

## 1. Inputs (read in this order, nothing else)

1. `ta3lom_store_web/CLAUDE.md` (stack, commands, DoD order, **non-negotiables 1–19**, conventions, working method)
2. `ta3lom_store_web/DECISIONS.md` (rows R5, HC, P1–P5, F*: what was decided and why)
3. `ta3lom_store_web/docs/r5/home-option-c-spec.md` (home layout this plan restyles) + `docs/r5/15-api-contract-r5-core.md`
4. `docs/openapi/store-api.v1.json` (the API contract; refresh with `npm run api:openapi`)
5. `darafrica-store-prototype.html` (the target look: open it in a browser at 1440 px and 390 px, light and dark)
6. `ta3lom_store_api/CLAUDE.md` (only to run it locally: `compose.dev.yaml`, `dotnet run`)

**Preconditions:**
- The session has `lotfi029/african_store_web` (push to `feat/*`), `lotfi029/ta3lom_store_web` (read), `lotfi029/ta3lom_store_api` (read) and, for the logo, `lotfi029/african_web` (read).
- Node ≥ 24.15, Docker for PostgreSQL 18, .NET 10 SDK for the API.
- If the repo can't be pushed: work and commit locally, then `git bundle create african_store_web.bundle --all` at the end (DECISIONS row).

---

## 2. Rules (inherited, unchanged)

All 19 non-negotiables of `ta3lom_store_web/CLAUDE.md` apply word for word. The ones this work touches most:

- **Logical CSS only** (`*-inline-*`, `inset-inline-*`).
- **Arabic first and RTL first.** Arabic line-height 1.85, English 1.55, Western digits everywhere.
- English falls back to Arabic through `pick()`, never an empty string.
- `SeoService.set()` on every route, exactly one `<h1>` per route, the landmarks `<main>`, `<nav>`, `<footer>`.
- `alt` text comes from the API's `MediaAsset` and is never hard-coded. Tap targets ≥ 44 × 44 px.
- `prefers-reduced-motion` stops every animation.
- Access tokens live in signals, never in storage.
- Budgets: 150 KB initial JS, 400 KB initial transfer. Never raise them; fix the cause.
- Never `bypassSecurityTrust*`. The CSP is hash-only and generated per build.
- Categories are API data.
- **Semantic tokens only (`--c-*`)**, and no colour literal outside `src/styles/tokens.css`.
- Types only from `core/api/store-api.types.ts`.
- Money is a decimal string: integer halalas for arithmetic, `<ta-money>` to display.
- **No `course|book|shipping|stock|enrol|giving` anywhere in `src/`** (`check-no-commerce`). English copy says "translations" and "printing", never "books".
- Payments only through hosted-page redirects to `environment.paymentHosts`. The order page polls the API.
- Idempotency-Key handling stays as it is.

Conventions are also unchanged: TS strict, no `any`, standalone + `OnPush`, `*.page.ts` / `*.data.ts`, component-scoped styles.

---

## 3. Target look: brand tokens

### 3.1 Palette (`src/styles/tokens.css`, palette layer; replaces the ta3lom blue and gold)

| Palette token | Light | Notes |
|---|---|---|
| `--ink` | `#1B2E2E` | headings, dark surfaces |
| `--brand` / `--brand-700` / `--brand-900` | `#304F50` / `#24403F` / `#1B2E2E` | teal: primary fills, links |
| `--brand-2` | `#3D6161` | secondary teal |
| `--gold` / `--gold-700` / `--gold-200` / `--gold-tint` | `#BAA87E` / `#7E6C43` / `#D6C59B` / `#FAF7EF` | sand |
| `--gold-line` | `#E9DFC6` | gift and band borders |
| `--bg` / `--gray` / `--gray-2` / `--line` | `#FAF9F6` / `#FFFFFF` / `#EFEFE8` / `#E4E4DC` | cream page, white cards |
| `--tint` / `--tint-2` | `#EAF0EE` / `#DCE7E4` | selected chips, cart pill |
| `--text` / `--ink-2` / `--muted` | `#1E2A29` / `#44514F` / `#606A67` | |
| `--danger` | `#9A3B35` | |
| `--footer-text` / `--footer-muted` | `#D9E2E1` / `#BCC8C5` | on `--ink` |

### 3.2 Semantic layer (keep every existing `--c-*` name; re-point the values)

| Semantic | Light → | Dark → | Measured contrast |
|---|---|---|---|
| `--c-bg` | `--bg` #FAF9F6 | #0F1919 | — |
| `--c-surface` / `--c-surface-2` | #FFFFFF / #FAF9F6 | #162323 / #1B2A2A | — |
| `--c-text` | #1E2A29 | #E6ECEA | 14.06 / 14.96 |
| `--c-text-2` | #44514F | #C3CFCC | 7.87 on cream |
| `--c-muted` | #606A67 | #9EACA9 | 5.31 cream · 5.59 white · 4.85 on tint · dark 6.87 |
| `--c-link` | #304F50 | #9CC3BE | 8.90 white · dark 8.44 |
| `--c-accent` (large text, icons, rules) | #3D6161 | #9CC3BE | 6.47 |
| `--c-focus` | #304F50 | #BAA87E | **never gold in light** (gold on cream is 2.22, which fails 3:1) · dark 7.66 |
| `--c-brand`, `--c-brand-strong` + `--c-on-brand` #fff | #304F50, #24403F | same (fills) | 8.90 |
| `--c-gold` + `--c-on-gold` (#1B2E2E) | #BAA87E | same | 6.09 |
| `--c-gold-text` (**new**: category pill text) on `--c-gold-tint` | #7E6C43 on #FAF7EF | #D6C59B on #2A2A20 | 4.77 / 8.49 |
| `--c-highlight` (**new**: decorative only: tab underline, banner dots, timeline dot; never the only state cue) | #BAA87E | #BAA87E | n/a (decor) |
| `--c-surface-dark` / `--c-on-dark` / `--c-on-dark-muted` | #1B2E2E / #D9E2E1 / #BCC8C5 | #0B1414 / same | 10.78 / 8.27 |
| `--c-gold-on-dark` | #BAA87E | same | 6.09 |
| `--c-tint` | #EAF0EE | #22393A | link on it 7.71 / dark 6.39 |
| `--c-danger` | #9A3B35 | #E08A84 | 6.88 |

- Add each new pair to `scripts/contrast-check.mjs` so `npm run lint` keeps them ≥ 4.5:1 (text) or ≥ 3:1 (focus, large).
- Hero glow and scrim one-offs are re-derived from `--ink` and `--gold`.
- Radii: cards 18 px, panels 22 px, buttons 14 px, fields 12 px (`--rc`, `--rp` … in tokens).

### 3.3 Fonts

- Replace Readex Pro with **IBM Plex Sans Arabic** (SIL OFL 1.1), self-hosted woff2.
- Copy in the files from the Fontsource build (`@fontsource/ibm-plex-sans-arabic`, as assets; the package is not a dependency). Ship weights **400, 600, 700** only, Arabic + Latin-basic subsets, each subset trimmed with `pyftsubset` like F6.4.
- `fonts.css` gets one `@font-face` per weight and subset, with `unicode-range`.
- `scripts/postbuild.mjs` preloads `ibm-plex-sans-arabic-arabic-400` (+ latin-400 on `/ar`).
- Add `fonts/OFL-ibm-plex-sans-arabic.txt`. Keep Plex Mono for numbers.
- Budget check: font transfer stays ≤ the Readex numbers in DECISIONS F6.4 + 25 % (log the measured kB).

### 3.4 Logo

- Official Dar Africa mark as SVG in `public/logo.svg` + `favicon.svg` + `favicon.ico`.
- Source: the association's site repo `lotfi029/african_web` (attach with read access, look under `src/assets`/`public`).
- **Fallback:** the prototype's placeholder mark (teal tile, sand stroke), with a DECISIONS `REVIEW` row "replace with the official SVG".

---

## 4. Screen map: prototype → existing code

| Prototype section | Existing component (ta3lom) | Change |
|---|---|---|
| Utility bar (licence line, main-site link, language) | `layout/header` utility row | Brand copy. The licence number shows **only** when `receipt_licence_no` reaches the web (today: hidden, as Q-11) |
| Header (logo lockup "دار أفريقيا / متجر التبرعات", pill search, دخول, cart total pill, theme toggle) | `layout/header`, `account-menu`, `theme-toggle`, `lang-switch` | Restyle; the logo links to `environment.mainSiteUrl` (same rule as ta3lom W-02) |
| Category tabs with sand underline | `features/store/home/category-tabs` | Underline = `--c-highlight`. The active tab is also bold + `aria-current` |
| Campaign banner (dark ink, ring art, sand pill, sand CTA, dots) | `home-banner` | Restyle. Ring art = inline decorative SVG in the template (`aria-hidden`). **No progress bar** (A-10) |
| Quick donate card (target select, presets 2×2, other amount, CTA, «أهدِ تبرعك» link) | `quick-donate` inline variant + `amount-input` | Restyle. Presets come from `amountPresets`. **Drop the gift link** (A-10) |
| Filter bar + sort | `home.page` | Restyle; sorts stay `featured / newest / title` |
| Project card (cover, badge, share icon, category pill, title, summary, option chips, تبرع + إضافة) | `project-card`, `donate-box`, `option-picker`, `share-sheet` | Restyle to the prototype's card. Badge «عاجل» = gold fill, «جديد» = white. **No progress block** |
| Pager | `listing.ts` pager | Active page = ink fill |
| Gift band, «أثرنا بالأرقام» | — | **Not built** (A-10, §9) |
| Trust row (licensed · instant receipt · secure payment · execution reports) | `trust-row` | Restyle; keep the M-3 flags (`trust.showUpdates` stays false) |
| Footer (dark: quote band + «تبرع للصندوق العام», 4 columns, payment marks, copyright) | `layout/footer` | New structure. The band button opens the quick-donate modal (existing service). The marks are text pills, no third-party images |
| Phone bottom bar (الرئيسية · الأقسام · البحث · السلة · حسابي) | — | **New** `layout/bottom-nav` (≤ 760 px). Showcase mode hides السلة and حسابي |
| Project page (cover, title, body, donate aside, share) | `features/store/project` | Restyle to the prototype's two columns with a sticky aside. **One cover** (no gallery), no stats minis, no gift box, no updates timeline (A-10) |
| Checkout (steps, cart lines, donor details, payment choice, summary) | `cart`, `checkout`, `shared/ui/steps` | Restyle only. Payment stays the hosted-page redirect, with no card form on our page |
| Thank-you + receipt | `features/store/order` (polls status, receipt download) | Restyle: ink hero with the check mark, receipt card. Every state (paid / pending / retry / expired / review / refunded) keeps its existing copy |
| Account, login, 404, admin | `features/account`, `login`, `not-found`, `features/admin` | Tokens + logo only |

---

## 5. Phases (in order; every phase ends with **gates** and a **commit**)

Gate shorthand:
- **G-fast** = `npm run typecheck && npm run lint && npm test`
- **G-full** = the ta3lom DoD order: `api:up → api:seed → types:check → typecheck → lint → test → build → e2e → a11y`

### Phase 0: Bootstrap the repo (≈ 20 min)

1. Clone `african_store_web` and create branch `feat/w-00-african-store` from `main`. Clone `ta3lom_store_web` (`main`, note the sha) into a scratch dir.
2. Copy everything from ta3lom **except** `.git`, `node_modules`, `dist`, `docs/screens`, `docs/screenshots`, `docs/admin-redesign/mockups` into `african_store_web/`. ta3lom's README replaces the one-line README; rewrite it in step 7.
3. Move the ta3lom-specific docs (`docs/r5`, `docs/adr`, `docs/admin-redesign`, `docs/design/ta3lom-*.html`, `docs/store-*.md`, `docs/W-report*.md`) to **`docs/reference/ta3lom/`**. They remain the rules' source.
4. Make the first commit on the branch: **"W-00.0 — import ta3lom store web @ <sha>"**. The import is the baseline diff, so every later change is reviewable.
5. Put `darafrica-store-prototype.html` in `docs/design/`, and this plan in `docs/plan/w-00-plan.md`.
6. Reset the logs:
   - `DECISIONS.md`: keep the header and column format, then a first row "Fork of ta3lom_store_web @ sha (A-1)", then A-1 … A-10 as rows.
   - `PROGRESS.md`: a phase table for this plan.
7. Rewrite `CLAUDE.md`: same sections and rules, with the Dar Africa names and domains, and a "Forked from" line naming the source sha. Keep the non-negotiables word for word.
8. `npm ci` → **G-fast** (must be green before any change; if not, fix only what the copy broke and log it).

**Commit:** "W-00.1 — bootstrap: docs, logs, CLAUDE.md"

### Phase 1: Same stack and same API contract, verified (≈ 15 min)

1. `diff` `package.json` and `package-lock.json` against ta3lom: they must be identical. Then `npm ci`.
2. `npx ng version` and `npm ls @angular/core @angular/cli typescript`: record the versions in PROGRESS (expected 22.2.6 / 22.2.7 / 6.0.x). **Do not run `ng update`** (A-4).
3. Architecture check (unchanged from ta3lom):
   - `features → shared → core` and `layout → shared, core` (ESLint boundaries);
   - standalone, zoneless, `OnPush`, signals, `httpResource()` in `*.data.ts`;
   - static SSR output: `/` and `/p/:slug` prerendered;
   - `@angular/localize` with `/ar` (source) and `/en`.
   Nothing is restructured.
4. API contract:
   - `diff` `docs/openapi/store-api.v1.json` against ta3lom's copy: it must be identical;
   - `npm run types:check` (generated types match the snapshot);
   - `grep -rn "/v1/" src/app` lists only paths that exist in the snapshot. Write the list of endpoints the app calls into `docs/api-endpoints.md` (path, method, caller `*.data.ts`) as the record that this app uses the same API surface as ta3lom.
5. **G-fast** + `npm run build:ci`.

**Commit:** "W-00.2 — same stack and API contract as ta3lom"

### Phase 2: Identity and configuration (≈ 45 min)

1. **Environments:** update `src/environments/environment*.ts` and `scripts/lib/envs.mjs` together (A-5). `paymentHosts` stays `['checkout.moyasar.com']`; `showcase: true` for staging and production (A-7).
2. **SEO:** in `core/seo/seo.service.ts` and `project-seo.ts`:
   - site name «متجر التبرعات — دار أفريقيا» / "Dar Africa donation store";
   - JSON-LD `NGO` name «جمعية الدعوة والتعليم باللغات الأفريقية», `url` = main site;
   - OG image = a new `public/og.png` 1200×630 (logo on ink, generated once, committed);
   - canonical and hreflang use the env `site`.
3. **`src/index.html`:** `<title>`, theme-colour `#1B2E2E` (both schemes), and the comment references.
4. Replace every `ta3lom` / «التعلم الإلكتروني» string found by `grep -rIi "ta3lom\|التعلم الإلكتروني" --exclude-dir=docs` in `src/`, `scripts/`, `e2e/`, `deploy/`, `.github/`, `Dockerfile`, `README.md`. Code comments may keep a "(from ta3lom …)" reference. Specifically:
   - `scripts/api-up.sh` and `dev-env.sh`: path `../ta3lom_store_api` stays (the same API repo); the API repo, compose file and local DB are ta3lom's (same backend); only the web's names change;
   - `deploy/`: image name, container name, Caddy site `store.darafrica.org`, edge block;
   - delete `deploy/well-known/apple-developer-merchantid-domain-association` (that domain association belongs to ta3lom; the owner adds Dar Africa's later, §11);
   - `.github/workflows/*`: image `ghcr.io/lotfi029/african-store-web`, environments `staging` / `production`; secret *names* stay, values are owner steps.
5. **i18n:**
   - Arabic source strings in templates: brand copy (store name, association name, footer about text from the prototype, trust texts).
   - English in `src/locales/en.json`, avoiding banned words.
   - `npm run i18n:extract` → `i18n-merge --check` passes.
6. **Unit specs** that assert ta3lom strings or domains are updated to the new values. Never delete a test to make a change pass.
7. **G-fast** + `npm run build:ci`.

**Commit:** "W-00.3 — identity: names, domains, SEO, deploy names"

### Phase 3: Tokens, fonts, logo (≈ 45 min)

1. `tokens.css`: the palette (§3.1) + the semantic layer re-pointed (§3.2), for light **and** the dark block. Add `--c-gold-text` and `--c-highlight`.
2. Remove palette names nothing uses. `contrast-check.mjs` gains every pair in §3.2.
3. Fonts (§3.3): files, `fonts.css`, `postbuild.mjs` preload regexes, `base.css` `font-family` stack `'IBM Plex Sans Arabic', 'Segoe UI', Tahoma, sans-serif`.
4. Logo and favicons (§3.4). The admin shell and login logo come from `public/logo.svg`.
5. **G-fast** + `build:ci` + `npm run a11y` on the stub (light and dark).

**Commit:** "W-00.4 — brand tokens, IBM Plex Sans Arabic, logo"

### Phase 4: Layout: header, tabs, footer, bottom nav (≈ 1 h)

1. `layout/header`: utility row (ink), logo lockup, pill search (2 px brand border, submit button inside), دخول / account menu, cart pill «السلة · total» (hidden at `lineCount = 0`, as today), theme toggle. Sticky header with a `--c-border` bottom line.
2. `category-tabs`: the prototype's tab style (horizontal scroll on phones, the only element allowed to scroll sideways at 320 px).
3. `layout/footer`:
   - quote band «مَن دلّ على خير فله مثلُ أجر فاعله» + gold button «تبرع للصندوق العام» (opens the quick-donate modal; hidden in showcase);
   - 4 columns: about + licence when available / الجمعية links to the main site / المتجر links / تواصل with the e-mail from config, or omitted when unknown;
   - payment marks as text pills (hidden in showcase);
   - copyright.
   - No placeholder legal numbers are ever published (ta3lom W-02 rule).
4. **New `layout/bottom-nav`:**
   - 5 links with `aria-current`, `nav aria-label="التنقل السفلي"`, shown ≤ 760 px.
   - Body padding-bottom when visible; `env(safe-area-inset-bottom)`.
   - «الأقسام» scrolls to and focuses the tab bar; «البحث» focuses the header search.
   - Showcase hides السلة / حسابي.
   - Unit spec + e2e at 390 px.
5. **G-fast**, then e2e `layout.spec.ts` (update its selectors and texts), a11y.

**Commit:** "W-00.5 — layout: header, tabs, footer, bottom nav"

### Phase 5: Home (≈ 1 h 15 min)

1. `home-banner`: ink panel, decorative ring SVG, sand «عاجل»/campaign pill, h1, summary, «تبرع الآن» gold CTA → `/p/{slug}`, «التفاصيل» ghost link, dots (buttons, `aria-pressed`, no auto-rotate).
2. Quick donate inline card: the prototype's layout (icon tile, title, subline «يُصرف حيث الحاجة أشد», target select only when there are several `acceptsGeneralGifts`, 2×2 presets, other amount with `ر.س` suffix, full-width brand CTA showing the selected amount through `<ta-money>`).
3. Filter bar: h2 with category name + «{n} مشروعًا», sort select.
4. `project-card`: the prototype's card (3:2 cover via `ta-image`, badge, share icon button top-end of the body row, gold-tint category pill, title link, 2-line summary, option chips (`option-picker`), stepper / amount, «تبرع» (brand) + «إضافة» (outline with cart icon)). Hover lift is disabled under reduced motion. Cards without a cover keep the tinted tile (ta3lom W-03).
5. Pager and empty states restyled.
6. `trust-row` restyled (icon tiles on `--c-tint`).
7. JSON-LD and the SEO h1 rules stay as they are.
8. **G-fast**, e2e `home-c.spec.ts` + `listing.spec.ts` (texts and selectors), a11y, LHCI on the container (§6).

**Commit:** "W-00.6 — home: banner, quick donate, cards, trust"

### Phase 6: Project, cart, checkout, order, account (≈ 1 h 15 min)

1. **Project page:**
   - breadcrumb;
   - main column: 16:9 cover (from `coverUrl`), category pill, h1, summary, «عن المشروع» panel with the body as plain-text paragraphs (unchanged rule);
   - sticky aside: «تبرّع لهذا المشروع», options as full-width rows (`option-picker` vertical variant: label start, amount end), stepper or open amount with «الحد الأدنى» from `minAmount`/config, dashed total row, «تبرع الآن» + cart icon button, «دفع آمن · إيصال رسمي فوري» line;
   - share panel «شارك الأجر» (existing `share-sheet`).
   - Below 760 px the aside flows under the content, and the existing sticky donate bar shows.
2. **Cart + checkout:** steps (`shared/ui/steps`) styled as the prototype; line rows (thumb, title, detail, amount, delete icon button with an accessible name); donor panel (existing fields, the existing OTP sign-in link); payment panel showing the gateway's methods as **information** (mada · Apple Pay · VISA/Mastercard) with the hosted-page notice; summary aside with total and the pay CTA. **No card inputs on our page** (rule 18).
3. **Order page (thank-you + receipt):** ink hero with the animated check (stopped under reduced motion), receipt card (reference, status pill, lines table with `<caption>`, total, «تحميل الإيصال PDF» when `receiptAvailable`, «تبرعاتي وإيصالاتي», «العودة للمتجر»). Each status keeps its message and actions.
4. **Account, login, 404:** restyled through the tokens. Check them at 320 / 390 / 1440 px.
5. **Admin:** tokens + logo; the admin keeps its own layout. Check `contrast-check` pairs for the admin badges (re-derive the teal ones).
6. **G-fast**, e2e `project`, `checkout`, `payments`, `account`, `sign-in`, `showcase` specs, a11y.

**Commit:** "W-00.7 — project, checkout, order, account, admin skin"

### Phase 7: Local data, stub, screenshots (≈ 40 min)

1. `scripts/seed-catalogue.mjs` (admin API) is used **only for local, e2e and screenshots**:
   - Categories: كفالة الدعاة, الترجمة والطباعة, التعليم بلغات أفريقيا, الإنتاج الصوتي والمرئي, سقيا الماء, المساجد, الصندوق العام (`acceptsGeneralGifts`), plus one empty category.
   - About 16 projects with options and open amounts, two `urgent` and two `new`, English titles free of banned words.
   - Covers: generated solid-colour webp placeholders uploaded through the media API, each with an alt text.
   - The existing ta3lom seed is replaced, not mixed in.
2. `npm run stub-capture` → re-record `scripts/stub-data` from the seeded API, so CI's stub has Dar Africa data.
3. `npm run screenshots` → `docs/screens/w-00/` covering home, project, cart, checkout, order (paid), 404, admin dashboard, in ar and en × light and dark × 1440 and 390 px.
4. Compare side by side with `docs/design/darafrica-store-prototype.html`. Log every intended difference (the A-10 items) in DECISIONS.

**Commit:** "W-00.8 — seed, stub, screenshots"

### Phase 8: Full DoD, container, LHCI (≈ 45 min)

1. **G-full** on the real API (`npm run api:up` runs `../ta3lom_store_api` exactly as ta3lom's DoD does).
2. `npm run build:prod` (production env; prerender against staging is skipped if staging isn't up; use `ALLOW_EMPTY_CATALOGUE` locally only).
3. `docker build --build-arg CONFIG=ci -t store-web:ci . && node scripts/check-container.mjs store-web:ci --env ci --keep`
4. `npm run lhci`: floors at least ta3lom's current floors (perf ≥ 0.82, LCP ≤ 2800 ms, TBT ≤ 450 ms, a11y 100, SEO 100). Log the measured numbers; a miss is a `REVIEW` row, not a stop.
5. Manual pass, written as a checklist in PROGRESS:
   - 320 px with no horizontal page scroll;
   - keyboard only through home → project → cart → checkout;
   - one `h1` per route;
   - `/en` falls back correctly;
   - dark mode follows the OS by default (DECISIONS row: matches the Dar Africa site rule).

**Commit:** "W-00.9 — DoD green, container, LHCI"

### Phase 9: Report, push, PR (≈ 20 min)

1. Write `docs/W-00-report.md`: what changed vs ta3lom, the gates with numbers (unit, e2e, a11y routes, LHCI), the screenshots, the A-10 list, the owner steps (§11).
2. Bring `PROGRESS.md` and `DECISIONS.md` up to date.
3. Push the branch. Open the PR "W-00 — Dar Africa store web" with the report as its body (end the body with the attribution lines from the session's reminder). Poll CI; don't block on it.
4. If CI fails on something the local gates passed (environment differences), fix it on the same branch.

**Commit:** "W-00.10 — report"

---

## 6. Quality bars (same numbers as ta3lom)

| Bar | Target |
|---|---|
| Initial JS / initial transfer (gzip) | ≤ 150 KB / ≤ 400 KB (`check-bundle-budget`) |
| a11y (axe) | 0 violations on every route in `a11y-client-routes.txt` + prerendered pages, ar + en, light + dark |
| Lighthouse mobile | a11y 100, SEO 100, BP ≥ 96; perf/LCP/TBT not below the ta3lom floors |
| Contrast | every `--c-*` text pair ≥ 4.5:1, focus ≥ 3:1 (`contrast-check`) |
| CSP | generated, hash-only; `check-csp` green |
| No commerce words | `check-no-commerce` green |

---

## 7. Blockers and fallbacks (never stop)

| Blocker | Fallback |
|---|---|
| Can't push or no repo | Commit locally; `git bundle` at the end; PR text saved in `docs/W-00-report.md` |
| API won't start (Docker / .NET missing) | Run every gate on the **stub** (`build:ci`, `e2e @smoke`, a11y); mark the real-API e2e as "owner to run" in PROGRESS (`REVIEW`) |
| `african_web` logo not reachable | Placeholder mark (§3.4), `REVIEW` |
| `npm ci` or a gate fails on the unchanged lockfile | Fix the environment (Node ≥ 24.15, Playwright browsers per ta3lom DECISIONS W-00), never the versions |
| An e2e fails because of copy or layout | Fix the selector or text. A test that asserted a rule (money, auth, payment state) is never weakened |
| LHCI below floors | Ship with a `REVIEW` row and the numbers. Never raise budgets |
| Font size over the limit | Drop weight 600 (use 700), log it |

---

## 8. Files touched (checklist)

- **Config:**
  - `src/environments/*`, `scripts/lib/envs.mjs`, `angular.json` (no changes expected besides font assets)
  - `src/index.html`, `public/*`
  - `deploy/*`, `Dockerfile`, `.github/workflows/*`, `README.md`, `CLAUDE.md`, `DECISIONS.md`, `PROGRESS.md`
- **Styles:** `src/styles/tokens.css`, `fonts.css`, `fonts/*`, `base.css`, `store.css`
- **Scripts:** `postbuild.mjs`, `contrast-check.mjs`, `seed-catalogue.mjs`, `e2e-seed.mjs`, `stub-data/*`
- **Layout:** `header/*`, `footer/*`, `bottom-nav/*` (new), `public-layout/*`
- **Store features:** `home/*`, `quick-donate/*`, `project/*`, `cart/*`, `checkout/*`, `order/*`
- **Shared UI (style only):** `option-picker`, `qty-stepper`, `amount-input`, `steps`, `button`, `chip`, `money`
- **Locales:** `src/locales/*`
- **Specs:** `e2e/*.spec.ts`, affected `*.spec.ts`

---

## 9. Not built in W-00: needs the API first (one API session, then a web session W-01)

| Prototype feature | API change needed (proposal for `ta3lom_store_api`, behind config so ta3lom is unaffected) |
|---|---|
| Goal progress bar, «المتبقي», donor count, "closest to target" sort | `Project.goalAmount?` (Money), read model `raisedAmount` (paid, net of refunds), `donorCount` on `ProjectCard`/`ProjectDetail`; sort `progress` |
| Gift to a person (name, recipient, mobile, card design, message) + gift card SMS | `CartLine`/`OrderLine.dedication { fromName, toName, toMobile, design, message }`, validation, outbox template `gift_card` (SMS), receipt mention. **Business rule needed (D-15) before coding** |
| «أثرنا بالأرقام» impact numbers | settings `impact_stats` (array of `{labelAr, labelEn, value}`) exposed in `GET /v1/catalog/config` |
| Project gallery | `ProjectDetail.media[]` (`MediaAsset` with alt) |
| Execution updates timeline | `ProjectUpdate` entity + admin CRUD + `ProjectDetail.updates[]` |
| Licence number in the utility bar and footer | expose `receipt_licence_no` (+ org name) in `GET /v1/catalog/config` |
| Order reference prefix `T3-` on Dar Africa receipts | make the prefix a setting (`order_ref_prefix`, e.g. `DA`) |

---

## 10. Definition of done (the session ends only when every box is ticked)

- [ ] Phases 0–9 committed in order on `feat/w-00-african-store`.
- [ ] G-full green on the real API (or the stub fallback logged `REVIEW`).
- [ ] `build:prod` + container check green.
- [ ] LHCI numbers logged.
- [ ] Screenshots in `docs/screens/w-00/`; prototype differences listed.
- [ ] No `ta3lom` brand string left in `src/`, `public/` or `deploy/` (grep in the report).
- [ ] `DECISIONS.md`, `PROGRESS.md` and `docs/W-00-report.md` written.
- [ ] PR open (or bundle saved).

---

## 11. Owner steps after the session (not done by the session)

1. **Point the app at the API.** Set `apiUrl` per environment in `scripts/lib/envs.mjs` and `environment.*.ts`. Pick one:
   - **(a) ta3lom's running API** (`https://store-api.ta3lom.sa/v1`): add `https://store.darafrica.org` to `Store:Cors:Origins` in the API's production config. The two stores then share **one** catalogue, cart, orders, receipts (`T3-` references, ta3lom's receipt name and licence), SMS sender and admin.
   - **(b) A second deployment of the same `ta3lom_store_api` image** (recommended): same endpoints and code, its own database, JWT keys and secrets, `Store:Cors:Origins=["https://store.darafrica.org"]`, `Store:WebBaseUrl`, `Store:PublicBaseUrl`, `Store:Files:PublicBaseUrl`, SMS / e-mail sender, and settings `site_name_ar|en`, `receipt_org_name_ar|en`, `receipt_licence_no`, `support_mobile`, `amount_presets`.
2. **DNS:** `store.darafrica.org`, `store-api.darafrica.org` (+ staging) to the VPS. Add the edge Caddy blocks (`deploy/edge/`).
3. **GitHub:** `staging` and `production` environments, the VPS deploy secrets, the GHCR read token on the VPS.
4. **Catalogue:** create the categories and projects in `/admin` (the seed is local only). First deploy with `ALLOW_EMPTY_CATALOGUE=true`, then remove it.
5. **Payments:** Moyasar account → API gateway env → `showcase: false` in `envs.mjs` + `environment.production.ts` → Apple Pay domain file in `deploy/well-known/`.
6. Decide the §9 items and the business rule for gifting (D-15).
