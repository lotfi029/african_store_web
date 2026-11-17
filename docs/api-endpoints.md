# API endpoints this app calls

Record that `african_store_web` uses the **same API surface as `ta3lom_store_web`** (plan Phase 1, A-6). Every path below exists in `docs/openapi/store-api.v1.json` (byte-identical to ta3lom @ `16e0ecf`). Base URL = `environment.apiUrl` (per environment, `scripts/lib/envs.mjs`). Methods are those the snapshot defines for the path; the caller is the `*.data.ts` / core service that builds the URL.

Generated in W-00 by scanning `src/app` (non-spec) for `${api}/…` URLs and matching each against the snapshot: **68 paths called, 0 unmatched**, 69 paths in the snapshot.

| Path | Methods (snapshot) | Caller |
|---|---|---|
| `/v1/admin/audit` | GET | `features/admin/platform.data.ts` |
| `/v1/admin/auth/login` | POST | `core/auth/staff-auth.ts` |
| `/v1/admin/auth/logout` | POST | `core/auth/staff-auth.ts` |
| `/v1/admin/auth/password` | POST | `core/auth/staff-auth.ts` |
| `/v1/admin/auth/refresh` | POST | `core/auth/staff-auth.ts` |
| `/v1/admin/auth/totp/enrol` | POST | `core/auth/staff-auth.ts` |
| `/v1/admin/auth/totp/verify` | POST | `core/auth/staff-auth.ts` |
| `/v1/admin/categories/order` | PUT | `features/admin/catalog/catalog-admin.data.ts` |
| `/v1/admin/categories/{id}` | PUT | `features/admin/catalog/catalog-admin.data.ts` |
| `/v1/admin/categories` | GET, POST | `features/admin/catalog/catalog-admin.data.ts` |
| `/v1/admin/customers/{id}/block` | POST | `features/admin/ops/ops.data.ts` |
| `/v1/admin/customers/{id}/unblock` | POST | `features/admin/ops/ops.data.ts` |
| `/v1/admin/customers/{id}` | GET | `features/admin/ops/ops.data.ts` |
| `/v1/admin/customers` | GET | `features/admin/ops/ops.data.ts` |
| `/v1/admin/dashboard` | GET | `features/admin/ops/ops.data.ts` |
| `/v1/admin/me` | GET | `core/auth/staff-auth.ts` |
| `/v1/admin/media/{id}` | PATCH | `features/admin/catalog/catalog-admin.data.ts` |
| `/v1/admin/media` | GET, POST | `features/admin/catalog/catalog-admin.data.ts` |
| `/v1/admin/orders/{reference}/cancel` | POST | `features/admin/ops/ops.data.ts` |
| `/v1/admin/orders/{reference}/receipt/resend` | POST | `features/admin/ops/ops.data.ts` |
| `/v1/admin/orders/{reference}/refunds` | POST | `features/admin/ops/ops.data.ts` |
| `/v1/admin/orders/{reference}/review/accept` | POST | `features/admin/ops/ops.data.ts` |
| `/v1/admin/orders/{reference}/review/refund` | POST | `features/admin/ops/ops.data.ts` |
| `/v1/admin/orders/{reference}` | GET | `features/admin/ops/ops.data.ts` |
| `/v1/admin/orders` | GET | `features/admin/ops/ops.data.ts` |
| `/v1/admin/payments/orphans/{id}/resolve` | POST | `features/admin/ops/ops.data.ts` |
| `/v1/admin/payments/orphans` | GET | `features/admin/ops/ops.data.ts` |
| `/v1/admin/projects/{id}/archive` | POST | `features/admin/catalog/catalog-admin.data.ts` |
| `/v1/admin/projects/{id}/options` | PUT | `features/admin/catalog/catalog-admin.data.ts` |
| `/v1/admin/projects/{id}/preview` | GET | `features/admin/catalog/catalog-admin.data.ts` |
| `/v1/admin/projects/{id}/publish` | POST | `features/admin/catalog/catalog-admin.data.ts` |
| `/v1/admin/projects/{id}` | GET, PUT | `features/admin/catalog/catalog-admin.data.ts` |
| `/v1/admin/projects` | GET, POST | `features/admin/catalog/catalog-admin.data.ts`<br>`features/admin/shell/admin-shell.data.ts` |
| `/v1/admin/reports/donations.csv` | GET | `features/admin/ops/ops.data.ts` |
| `/v1/admin/settings/{key}` | PUT | `features/admin/platform.data.ts` |
| `/v1/admin/settings` | GET | `features/admin/platform.data.ts` |
| `/v1/admin/staff/{id}/reset-password` | POST | `features/admin/platform.data.ts` |
| `/v1/admin/staff/{id}/reset-totp` | POST | `features/admin/platform.data.ts` |
| `/v1/admin/staff/{id}/unlock` | POST | `features/admin/platform.data.ts` |
| `/v1/admin/staff/{id}` | PUT | `features/admin/platform.data.ts` |
| `/v1/admin/staff` | GET, POST | `features/admin/platform.data.ts` |
| `/v1/admin/templates/test` | POST | `features/admin/platform.data.ts` |
| `/v1/admin/templates/{key}/{channel}/{locale}` | PUT | `features/admin/platform.data.ts` |
| `/v1/admin/templates` | GET | `features/admin/platform.data.ts` |
| `/v1/auth/logout-all` | POST | `core/auth/store-auth.ts` |
| `/v1/auth/logout` | POST | `core/auth/store-auth.ts` |
| `/v1/auth/otp/request` | POST | `core/auth/store-auth.ts` |
| `/v1/auth/otp/verify` | POST | `core/auth/store-auth.ts` |
| `/v1/auth/refresh` | POST | `core/auth/store-auth.ts` |
| `/v1/cart/lines/{id}` | DELETE, PATCH | `core/cart/cart-store.ts` |
| `/v1/cart/lines` | POST | `core/cart/cart-store.ts` |
| `/v1/cart/summary` | GET | `core/cart/cart-summary.ts` |
| `/v1/cart` | DELETE, GET | `core/cart/cart-store.ts` |
| `/v1/catalog/categories` | GET | `core/ui/gift-categories.data.ts`<br>`features/store/home/home.data.ts`<br>`features/store/quick-donate/quick-donate.data.ts` |
| `/v1/catalog/config` | GET | `core/api/store-config.ts` |
| `/v1/catalog/home` | GET | `features/store/home/home.data.ts` |
| `/v1/catalog/projects/{slug}` | GET | `features/store/donate/project.data.ts` |
| `/v1/catalog/projects` | GET | `features/store/home/home.data.ts` |
| `/v1/checkout/quote` | POST | `features/store/checkout/checkout.data.ts` |
| `/v1/checkout` | POST | `features/store/checkout/checkout.data.ts` |
| `/v1/me/donations/{reference}/receipt` | GET | `features/store/order/order.data.ts` |
| `/v1/me/donations/{reference}` | GET | `features/account/account.data.ts` |
| `/v1/me/donations` | GET | `features/account/account.data.ts`<br>`features/store/checkout/checkout.data.ts` |
| `/v1/me/export` | GET | `features/account/account.data.ts` |
| `/v1/me` | DELETE, GET, PATCH | `core/auth/store-auth.ts`<br>`features/account/account.data.ts` |
| `/v1/orders/{reference}/pay` | POST | `features/store/order/order.data.ts` |
| `/v1/orders/{reference}/receipt` | GET | `features/store/order/order.data.ts` |
| `/v1/orders/{reference}/status` | GET | `features/store/order/order.data.ts` |

## In the snapshot, not called by the web

- `/v1/payments/webhooks/{provider}` (gateway → API, server to server)

Same surface as ta3lom: the web code that builds these URLs is unchanged from the import.
