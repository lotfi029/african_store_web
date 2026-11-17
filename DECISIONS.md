# Store web decisions

Every choice the run made where the docs were silent, conflicting, or the environment forced it. `REVIEW` = touches
money, auth or personal data, or was decided by the session without the owner — the owner should read it.

**Precedence:** `docs/plan/w-00-plan.md` > `CLAUDE.md` (non-negotiables inherited word for word from ta3lom) >
ta3lom's decision log (kept as history in [docs/reference/ta3lom/DECISIONS.md](docs/reference/ta3lom/DECISIONS.md);
its rows still explain *why* the inherited code is the way it is) > the prototype
(`docs/design/darafrica-store-prototype.html`).

| Date | Session | Topic | Docs | Choice | Reason | REVIEW? |
|---|---|---|---|---|---|---|
| 2026-11-17 | W-00 | Fork | plan A-1 | Fork of `lotfi029/ta3lom_store_web` @ `16e0ecf` (code, scripts, CI, deploy, tests, `package.json` + `package-lock.json` unchanged). Commit `W-00.0` is the pure copy; every later commit is the reviewable diff | Same gates, scripts and architecture from minute one | |
| 2026-11-17 | W-00 | Import sha | plan A-4 | The plan names ta3lom `8f35a74`; `main` is now `16e0ecf`, whose only change since is an audit allow-list row (ta3lom #57). Same lockfile and Angular versions, so `16e0ecf` is the import sha | Newest identical stack | |
| 2026-11-17 | W-00 | A-1 Starting point | plan A-1 | Copy of ta3lom `main`, no `ng new` | "Same rules" means the same gates, scripts and architecture | |
| 2026-11-17 | W-00 | A-2 Internal names | plan A-2 | Selector prefix `ta-`, i18n ids `@@store.*`, file names, `core/` and `shared/` APIs unchanged | Fixes in ta3lom can be cherry-picked across | |
| 2026-11-17 | W-00 | A-3 Repo / branch / PR | plan A-3 | `lotfi029/african_store_web`, branch `feat/w-00-african-store` from `main`, PR "W-00 — Dar Africa store web" | ta3lom working method | |
| 2026-11-17 | W-00 | A-4 Angular | plan A-4 | Exactly ta3lom's locked versions (`@angular/core` 22.2.6, CLI/build 22.2.7, TypeScript ~6.0.3 at ta3lom `16e0ecf`). No `ng update`. Later bumps follow ta3lom's Dependabot PRs one for one | Owner rule; identical locks keep cherry-picks clean | |
| 2026-11-17 | W-00 | A-5 Domains | plan A-5 | Store `https://store.darafrica.org`, API `https://store-api.darafrica.org/v1` (§11 option b), main site `https://darafrica.org`; staging `store-staging.` / `store-api-staging.`. One table: `scripts/lib/envs.mjs` + `src/environments/*` | Change them there if they differ | |
| 2026-11-17 | W-00 | A-6 Backend | plan A-6 | `ta3lom_store_api` `/v1` is the backend. `docs/openapi/store-api.v1.json` is ta3lom's snapshot byte for byte (generated at API `0eb4059`; API commits up to `27ec8eb` are CI-only). `npm run api:openapi` is **not** run in this session. No endpoint added, changed or worked around | Owner rule | |
| 2026-11-17 | W-00 | A-7 Payments | plan A-7 | `showcase: true` in staging and production until the association has a Moyasar account | Same switch ta3lom uses; turning it off is an owner step (§11) | REVIEW |
| 2026-11-17 | W-00 | A-8 Admin | plan A-8 | Whole staff admin kept, rebranded by tokens and logo only | Already built and tested | |
| 2026-11-17 | W-00 | A-9 Hosting | plan A-9 | Image `ghcr.io/lotfi029/african-store-web` (Caddy, static output) on the association's VPS behind the edge proxy | Same `Dockerfile`, `deploy/`, workflows | |
| 2026-11-17 | W-00 | A-10 Not built | plan A-10, §9 | Goal progress, gifting to a person, impact numbers, project gallery, execution updates, "closest to target" sort are **not built** | The API does not back them; no fake data in production UI | |
| 2026-11-17 | W-00 | Archived logs | plan §5 Ph 0 | ta3lom's `DECISIONS.md` and `PROGRESS.md` moved (git mv) to `docs/reference/ta3lom/` with the other ta3lom docs (`r5`, `adr`, `admin-redesign`, design prototypes, `store-*.md`, `W-report*.md`). `docs/openapi/` stays in place | They remain the rules' source; this log starts clean | |
| 2026-11-17 | W-00 | Node / .NET in the session | plan §7 | Container Node 22.23.5 → Node 24.22.3 installed with `n` and linked at `/opt/node24` (which `dev-env.sh` already prefers); .NET SDK 10.0.100 (the API's `global.json`) installed with `dotnet-install.sh` into `~/.dotnet`; the API clone is linked at `../ta3lom_store_api` | Environment fix, never a version change | |
