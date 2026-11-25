# Dar Africa store API — deployment kit

The store web calls `ta3lom_store_api` unchanged (plan A-6). Production and staging run **their own deployment** of that
API image (own database, keys and secrets) with the files here. The API's runbook (`deploy/README.md`, `secrets.md`
in that repo) applies word for word, with these differences:

| File | Copy to (next to the API's `deploy/compose.yaml`) | Why |
|---|---|---|
| `.env.production.example` | `.env.production` | Dar Africa domains, `SITE_REBUILD_REPOSITORY=lotfi029/african_store_web`, showcase switches |
| `.env.staging.example` | `.env.staging` | the same for staging |
| `compose.darafrica.yaml` | `compose.darafrica.yaml` | badge CORS and e-mail sender, which no env-file line reaches |

- Use the compose project names `darafrica-store` / `darafrica-store-staging` and add `-f compose.darafrica.yaml` to
  every `docker compose` command of the API runbook (`up`, `run --rm api create-admin`, `logs`, backups).
- Secrets: the API's `secrets.md` list, generated fresh for this deployment. `Store__SiteRebuild__Token` is a GitHub
  fine-grained token with **Contents: read and write on `lotfi029/african_store_web`** (the API refuses to start in
  Production without it). In showcase, Moyasar and `Store__Sms__AppSid` are not needed.
- After the first start, in `/admin` → settings: `site_name_ar` / `site_name_en`, `receipt_org_name_ar` /
  `receipt_org_name_en` (the receipt falls back to ta3lom's association name), `receipt_licence_no`, `support_mobile`.
