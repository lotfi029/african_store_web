# Claude Code prompt: W-00, Dar Africa store web

> Before you start:
> - Add the two files to `lotfi029/african_store_web` on `main`: `docs/plan/w-00-plan.md` (the plan) and `docs/design/darafrica-store-prototype.html` (the prototype). Or attach them to the session.
> - Attach these repos to the session: `lotfi029/african_store_web` (push), `lotfi029/ta3lom_store_web`, `lotfi029/ta3lom_store_api`, `lotfi029/african_web` (read).
> - Then paste everything below the line.

---

You are implementing **W-00 — Dar Africa store web** in `lotfi029/african_store_web`, a new Angular storefront and admin for the Dar Africa association (جمعية الدعوة والتعليم باللغات الأفريقية).
It is a copy of `lotfi029/ta3lom_store_web` with the **same architecture, the same Angular version (from ta3lom's lockfile) and the same rules**.
It talks to **the same backend endpoints of `lotfi029/ta3lom_store_api`**, which is the backend for both store web apps.

## Your source of truth, in this order

1. `docs/plan/w-00-plan.md` in `african_store_web` (if it is missing there, it is attached to this message: copy it to that path first). **Execute it exactly, phase by phase.**
2. `ta3lom_store_web/CLAUDE.md`: its 19 non-negotiables, conventions, DoD order and working method apply word for word.
3. `ta3lom_store_web/DECISIONS.md` and `docs/r5/*`: why things are the way they are.
4. `docs/design/darafrica-store-prototype.html`: the target look (open it at 1440 px and 390 px, light and dark).
5. `ta3lom_store_api/CLAUDE.md`: only to run the API locally.

## How to run this session

- **Run every phase in order (0 → 9) in this one session without stopping or asking me questions.** I'm not watching.
  - Where the plan is silent, choose what ta3lom would do, write it as a row in `DECISIONS.md` (`REVIEW` when it touches money, auth or personal data) and continue.
  - When something blocks, use the fallback in plan §7 and continue.
  - Finish only when every box in plan §10 is ticked.
- Start by creating a task list with one item per phase (0–9) plus "final check". Tick each item as its gates pass.
- **Branch:** `feat/w-00-african-store` from `main`.
  - One commit per phase, using the commit message in the plan.
  - Push after each phase with `git push -u origin feat/w-00-african-store`.
  - Never push to `main`.
  - At the end, open the PR "W-00 — Dar Africa store web" into `main` with `docs/W-00-report.md` as its body.
  - Poll CI; don't wait on it. If CI fails, fix it on the same branch.
- **Gates are not optional.** Run them in ta3lom's DoD order:
  `api:up → api:seed → types:check → typecheck → lint → test → build → e2e → a11y`, then `build:prod`, the container check and `lhci`.
  - A failing gate is fixed, never skipped.
  - Never weaken or delete a test that checks a rule (money, auth, payment states, a11y, CSP, budgets) to make it pass.
  - Never raise a budget.

## Hard rules for this repo (also in the plan)

- **Same stack as ta3lom.**
  - Copy `package.json` and `package-lock.json` unchanged: Angular 22.2.6 core, CLI and build 22.2.7, TypeScript ~6.0.3.
  - **Do not run `ng update`** or change any dependency version.
  - Keep the architecture unchanged: `features → shared → core`, standalone, zoneless, `OnPush`, signals, `httpResource()` in `*.data.ts`, static SSR output, `@angular/localize` with `/ar` (source) and `/en`.
  - Keep the `ta-` selector prefix and the `@@store.*` i18n ids.
- **Same API, no changes to it.**
  - `docs/openapi/store-api.v1.json` stays identical to ta3lom's, and types come only from the generated `store-api.types.ts`.
  - Call only endpoints that exist in that snapshot. Never add, rename or work around an endpoint, never hand-write a DTO, never edit `ta3lom_store_api`.
  - The API base URL is a per-environment value (plan A-5 / §11).
- **Brand, not behaviour.** Change identity, tokens, fonts, logo, copy and layout to match the prototype. Keep ta3lom's behaviour: cart, checkout, hosted-page payments, order polling, receipts, OTP sign-in, account, admin, showcase mode.
- **Don't build what the API can't back** (plan A-10 / §9): goal progress bars, gifting to a person, impact numbers, gallery, execution updates, "closest to target" sort. No fake numbers or placeholder legal text in the shipped UI.
- **Showcase stays on** in staging and production (no Moyasar account yet).
- Never commit secrets, and never print tokens or personal data in logs.

## When you finish

1. `docs/W-00-report.md` covers:
   - what changed from ta3lom (by area);
   - the stack versions (`ng version`) and the endpoint list (`docs/api-endpoints.md`);
   - the gate numbers (unit, e2e, a11y routes × themes, LHCI, bundle sizes);
   - links to the screenshots in `docs/screens/w-00/`;
   - every intended difference from the prototype;
   - all `REVIEW` rows;
   - the owner steps (plan §11).
2. `PROGRESS.md` and `DECISIONS.md` are up to date. `grep -rIi "ta3lom\|التعلم الإلكتروني" src public deploy` shows only references to the source repo and API, no brand text.
3. Your last message has:
   - the PR link;
   - one line per phase (done / fallback used);
   - the gate numbers;
   - the `REVIEW` rows I must read.
