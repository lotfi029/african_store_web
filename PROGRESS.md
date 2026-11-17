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
| 6 Project … admin | W-00.7 | | |
| 7 Seed, stub, screenshots | W-00.8 | | |
| 8 DoD, container, LHCI | W-00.9 | | |
| 9 Report | W-00.10 | | |

## Open REVIEW rows

See `DECISIONS.md` (column REVIEW?).
