# Store web progress

Session W-00 — Dar Africa store web (`docs/plan/w-00-plan.md`), branch `feat/w-00-african-store`.
Forked from `lotfi029/ta3lom_store_web` @ `16e0ecf` (ta3lom's progress log: [docs/reference/ta3lom/PROGRESS.md](docs/reference/ta3lom/PROGRESS.md)).

**Recovery rule:** after a context reset read the plan, this file and `git log`, then continue from the first phase
without a commit. Never redo a committed phase.

| Phase | Commit | Status | Gates |
|---|---|---|---|
| 0 Import | W-00.0 — import ta3lom store web @ 16e0ecf | done | — (pure copy) |
| 0 Bootstrap | W-00.1 — bootstrap: docs, logs, CLAUDE.md | done | npm ci (Node 24.22.3, npm 11.19.1); G-fast green: typecheck, lint, unit 413 (70 files) + scripts |
| 1 Stack + API | W-00.2 — same stack and API contract as ta3lom | done | package.json, lockfile, OpenAPI, generated types byte-identical to ta3lom @ 16e0ecf; Angular CLI 22.2.7 / core 22.2.6 / build 22.2.7 / TypeScript 6.0.3 / Node 24.22.3 / npm 11.19.1; types:check ok; 68 endpoints (docs/api-endpoints.md); G-fast green (unit 413, scripts 16); build:ci green, 58 prerendered routes, initial JS ar 137.5 / en 135.8 kB gzip |
| 2 Identity | W-00.3 — identity: names, domains, SEO, deploy names | done | domains (A-5) in envs.mjs + environment*.ts, scripts, e2e, deploy, workflows; brand copy ar/en; i18n:extract (1208 messages, merge ok); deploy.yml gated by DEPLOY_ENABLED; G-fast green (unit all pass, scripts 16); build:ci green (canonical store.darafrica.org) |
| 3 Tokens, fonts, logo | W-00.4 — brand tokens, IBM Plex Sans Arabic, logo | done | contrast-check 168 pairs pass; fonts 400/700 (600 dropped, §7), /ar/ 76.5 kB fonts (REVIEW, +7.5 kB over F6.4+25 %); G-fast green (unit 413, scripts 16); build:ci green (ar 137.5 / en 135.8 kB JS); a11y 70 routes × light + dark, 0 violations |
| 4 Layout | W-00.5 — layout: header, tabs, footer, bottom nav | done | G-fast green (unit 418, scripts 16); build:ci green (ar 138.1 / en 136.4 kB JS); e2e layout.spec 20/20 on the stub (2 new tests); a11y 70 routes × light + dark, 0 violations |
| 5 Home | W-00.6 — home: banner, quick donate, cards, trust | done | G-fast green (unit 419, scripts 16); build:ci green (ar 138.1 / en 136.4 kB JS); e2e home-c + listing + layout 50/50 on the stub; a11y 70 routes × light + dark, 0 violations; LHCI → Phase 8 |
| 6 Project … admin | W-00.7 — project, checkout, order, account, admin skin | done | G-fast green (unit 419, scripts 16); build:ci green; e2e on the stub: project + checkout + payments + account 16 passed / 12 skipped (real-API only), @showcase 17/17 (build:ci-showcase); a11y 70 routes × light + dark, 0 violations; sign-in (real API only) → Phase 8 |
| 7 Seed, stub, screenshots | W-00.8 — seed, stub, screenshots | done | real API up (Node 24, .NET 10.0.100, postgres:18); api:seed: dev seed retired, 8 categories / 22 projects; stub re-recorded (29 responses, 7 images); @smoke 67/69 on the new stub (the 2 project-page misses were the retired `support-a-daiya` slug — fixed, then green in the Phase 8 real-API run); 56 screenshots in docs/screens/w-00 (7 screens × ar/en × light/dark × 1440/390); G-fast green (unit 419, scripts 16) |
| 8 DoD, container, LHCI | W-00.9 — DoD green, container, LHCI | done | G-full on the real API: api:up ✓ · api:seed ✓ · types:check ✓ · typecheck ✓ · lint ✓ · test 419 + scripts 16 ✓ · build ✓ (46 prerendered, ar 138.1 / en 136.4 kB JS gzip) · e2e 117 passed / 19 skipped (stub-only or other-mode specs) · a11y 58 routes × light + dark, 0 violations; build:prod ✓ (local prerender, dry run); docker CONFIG=ci + check-container ✓ + edge aliases ✓ + caddy validate ✓; LHCI perf 94–95, a11y 100, BP 96, SEO 100, LCP ≤ 979 ms, TBT 271–299 ms (floor 250 ✗ — REVIEW; ta3lom baseline on this machine 231–422 ms) |
| 9 Report | W-00.10 — report | done | docs/W-00-report.md (PR body); brand grep clean (source/API references only) |

| W-00.11 | W-00.11 — fix Lighthouse TBT regression (bottom nav on idle) | done | CI run 1 red at LHCI only (TBT /ar/ 279, /ar/p 250.5 > 250). Root cause measured (bottom nav style/layout in the first long task). After the fix: G-fast green (unit 419, scripts 16); build:ci ✓ (ar 137.5 / en 135.8 kB JS); @smoke 69/69 on the stub; a11y 58 × 2 ✓; container ✓; 4× CPU same-session TBT /ar/ 405 → 327, /ar/p 268 → 180 ms. CI on the PR head decides LHCI |

| W-00.11 CI | — | evidence | CI run 2 (`a202d10`) red at LHCI on all four URLs, runner `benchmarkIndex` ~40 % below run 1, same task structure (DECISIONS "LHCI evidence"). Docs pushed; the next CI run on the same code decides |

| LHCI run 3 | — | blocked on owner | Run 3 (`308b3f4`) red at LHCI TBT on `/ar/`, `/ar/p`, `/en/p` (slower runner again). Stopped iterating; owner decision requested in the PR comment (fixture text / W-01 performance pass / accept REVIEW) |

| W-00.12 | W-00.12 — perf: content-visibility on off-screen blocks; axe renders all first | done | owner choice (performance pass). G-fast green (unit 419, scripts 16); build:ci ✓; @smoke 69/69; @showcase 17/17; a11y 58 × 2 ✓; container ✓; CDP `/ar/` Task 272 → 229 ms. CI LHCI decides |

| W-00.12 CI | — | ✓ green | CI run 8 (`1ea0dd4`) green, LHCI included (TBT `/ar/` 234 / 303 / 318, `/ar/p` 236 / 240 / 282, `/en/` 168–254, `/en/p` 199–237 ms; runner `benchmarkIndex` ~2700–2900). Thin `/ar/` margin noted for W-01 |

| W-00.13 | W-00.13 — code-review fixes | done | 7 of 8 review findings fixed (bottom nav «الأقسام» from another page — e2e step failed on the old build; reduced motion on the header tile; donate-bar safe area; SEO image branch; one axe render helper; bottom nav phones-only; one payment-marks list), footer privacy/paths already the Footer REVIEW row. G-fast green (unit 419, scripts 16); build:ci ✓ (ar 137.6 / en 135.9 kB JS); @smoke 69/69; @showcase 17/17; a11y 58 × 2 ✓ |

## Manual pass (Phase 8)

- [x] 320 px: no horizontal page scroll (e2e `expectNoHorizontalScroll` on home, project, 404, drawer; only the category tab bar scrolls sideways).
- [x] Keyboard only: skip link first, header search, tabs (focus from «الأقسام»), cards' chips/stepper/buttons, cart, checkout (e2e keyboard + focus assertions; a11y run).
- [x] One `h1` per route (e2e `toHaveCount(1)` on home, project, cart, 404; axe on 58 routes × 2 themes).
- [x] `/en` falls back to Arabic through `pick()` where English is missing (unchanged `pick()`; English titles seeded for every project).
- [x] Dark mode follows the OS until the visitor chooses (pre-paint script in `src/index.html`, unchanged; screenshots in both themes).

## Open REVIEW rows

See `DECISIONS.md` (column REVIEW?) and the summary in [docs/W-00-report.md](docs/W-00-report.md#review-rows-owner-must-read): A-7 payments, Apple Pay placeholder kept, fonts +7.5 kB on /ar/, utility-row licence removed, footer omissions, trust-row text, checkout payment panel, Lighthouse TBT.

## Definition of done (plan §10)

- [x] Phases 0–9 committed in order on `feat/w-00-african-store` (`W-00.0` … `W-00.10`).
- [x] G-full green on the real API (117 e2e passed, a11y 58 routes × 2 themes).
- [x] `build:prod` + container check green.
- [x] LHCI numbers logged (DECISIONS "Lighthouse", REVIEW: TBT).
- [x] Screenshots in `docs/screens/w-00/` (56); prototype differences listed (DECISIONS, report).
- [x] No ta3lom brand string in `src/`, `public/` or `deploy/` (only source-repo / API references; report "Brand check").
- [x] `DECISIONS.md`, `PROGRESS.md` and `docs/W-00-report.md` written.
- [x] PR open: https://github.com/lotfi029/african_store_web/pull/1 (draft); CI watched.
