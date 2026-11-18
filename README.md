# african_store_web

Storefront, customer account and staff admin of the **Dar Africa donation store** (جمعية الدعوة والتعليم باللغات
الأفريقية) — Angular 22, static output, served at https://store.darafrica.org. Start with [CLAUDE.md](CLAUDE.md) and
[docs/plan/w-00-plan.md](docs/plan/w-00-plan.md).

Forked from `lotfi029/ta3lom_store_web` (same architecture, Angular version and rules) and talking to the same
`ta3lom_store_api` `/v1` endpoints. **Showcase mode is on** in staging and production: projects are browsable and the
donate boxes are read-only («التبرع الإلكتروني قريبًا») until the association has a Moyasar account. When it does,
checkout leaves for Moyasar's hosted page and the order page polls the API (owner steps:
[docs/W-00-report.md](docs/W-00-report.md), runbook [deploy/README.md](deploy/README.md)).
