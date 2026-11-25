#!/usr/bin/env bash
# First-time install of the africadawah store API (production) on the shared VPS, next to ta3lom's. Run ONCE, as the
# `deploy` user, in a real terminal (it asks for three values that must never pass through a chat or a log):
#   ssh -t africa-vps 'bash /tmp/africadawah-setup/setup-production.sh'
# The folder holding this script must also hold `.env.production` (from .env.production.example) and
# `compose.africadawah.yaml`. The API's own files (compose.yaml, backup.sh, restore-test.sh) are copied from ta3lom's
# folder and checked against ta3lom_store_api v1.0.0, so nothing of ta3lom's is changed. What it does:
#   1. creates /srv/africadawah-store/deploy and /srv/africadawah-store-web (sudo, once);
#   2. generates the database password and the five keys (secrets.md of the API), asks for the SMTP password and the
#      GitHub token, and gives the files the owners the containers need;
#   3. pulls the images, starts db → migrate → api as compose project `africadawah-store`, and checks /health/ready over
#      the edge network on the alias africadawah-store-api.
# Showcase (PAYMENTS_PROVIDER=none, CUSTOMER_SIGNIN=false): no Moyasar and no SMS files. Runbook: README.md here.
set -euo pipefail

PROJECT=africadawah-store
ROOT=/srv/africadawah-store
DIR=$ROOT/deploy
WEB_DIR=/srv/africadawah-store-web
TA3LOM_DIR=/srv/ta3lom-store/deploy
SECRETS=$DIR/secrets/production
HERE=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

# sha256 of ta3lom_store_api v1.0.0 deploy/<file> (git show v1.0.0:deploy/<file> | sha256sum).
declare -A SUMS=(
  [compose.yaml]=35278548824f1aee430cf6a0024ac1e84e22cf2d0e586c62fddfc1f97d46b7de
  [backup.sh]=64ab340e2639466b468dc041d4c05db1efa262ab2401da64e39c99ff02898ead
  [restore-test.sh]=cc111b3a3ebcde2fd6e10e3ac359f2b9b9a8179d97df0c0f26a31f7b5b3fe08e
)

say() { printf '\n== %s\n' "$*"; }
die() { printf '\nSTOP: %s\n' "$*" >&2; exit 1; }

[ "$(id -un)" = deploy ] || die "run this as the deploy user (ssh africa-vps), not $(id -un)"
[ -t 0 ] || die "run it in a terminal: ssh -t africa-vps 'bash $HERE/setup-production.sh'"
[ ! -e "$SECRETS" ] || die "$SECRETS already exists: the API is already installed (use the runbook commands instead)"
for f in .env.production compose.africadawah.yaml; do [ -f "$HERE/$f" ] || die "$HERE/$f is missing"; done
for f in "${!SUMS[@]}"; do
  [ -f "$TA3LOM_DIR/$f" ] || die "$TA3LOM_DIR/$f not found"
  got=$(sha256sum "$TA3LOM_DIR/$f" | cut -d' ' -f1)
  [ "$got" = "${SUMS[$f]}" ] || die "$TA3LOM_DIR/$f is not the v1.0.0 file (sha256 $got); ask before going on"
done

edge_subnet=$(docker network inspect edge -f '{{range .IPAM.Config}}{{.Subnet}} {{end}}' | tr ' ' '\n' | grep -F . | head -1)
env_subnet=$(sed -n 's/^EDGE_SUBNET=\([^ #]*\).*/\1/p' "$HERE/.env.production")
[ -n "$edge_subnet" ] && [ "$edge_subnet" = "$env_subnet" ] || die "EDGE_SUBNET ($env_subnet) is not the edge network's ($edge_subnet)"
grep -q '^COMPOSE_PROJECT_NAME=africadawah-store$' "$HERE/.env.production" || die ".env.production is not africadawah-store's"

say "1/4 Folders (sudo asks for the deploy user's password once)"
sudo install -d -o deploy -g deploy -m 755 "$ROOT" "$WEB_DIR"
install -d -m 755 "$DIR"
for f in "${!SUMS[@]}"; do install -m "$(stat -c %a "$TA3LOM_DIR/$f")" "$TA3LOM_DIR/$f" "$DIR/$f"; done
install -m 644 "$HERE/.env.production" "$HERE/compose.africadawah.yaml" "$DIR/"

say "2/4 Secrets (generated here; nothing is printed)"
(
  umask 077
  mkdir -p "$SECRETS/api"
  openssl rand -base64 32 | tr -d '/+=\n' > "$SECRETS/db_password"
  printf 'Host=db;Database=ta3lom_store;Username=store;Password=%s;Search Path=store,public' "$(cat "$SECRETS/db_password")" \
    > "$SECRETS/api/ConnectionStrings__Store"
  for k in Jwt__CustomerSigningKeyBase64 Jwt__StaffSigningKeyBase64 Otp__PepperBase64 Tokens__StatusKeyBase64 Hashing__KeyBase64; do
    openssl rand -base64 48 | tr -d '\n' > "$SECRETS/api/Store__$k"
  done
  smtp_user=$(sed -n 's/^SMTP_USER=\([^ #]*\).*/\1/p' "$DIR/.env.production")
  while :; do
    read -rsp "Password of the mailbox $smtp_user (hidden): " v; echo
    [ -n "$v" ] && break
  done
  printf '%s' "$v" > "$SECRETS/api/Store__Email__Password"; unset v
  while :; do
    read -rsp "GitHub fine-grained token, Contents read/write on lotfi029/african_store_web (hidden): " v; echo
    case $v in github_pat_*|ghp_*) break ;; *) echo "That does not look like a GitHub token; try again." ;; esac
  done
  printf '%s' "$v" > "$SECRETS/api/Store__SiteRebuild__Token"; unset v
)
sudo chown 999:999 "$SECRETS/db_password" && sudo chmod 0400 "$SECRETS/db_password"
sudo chown -R 1654:1654 "$SECRETS/api"
sudo find "$SECRETS/api" -type f -exec chmod 0400 {} +
sudo chmod 0500 "$SECRETS/api"

say "3/4 Images and start (db → migrate → api)"
cd "$DIR"
dc() { docker compose --env-file .env.production -p "$PROJECT" -f compose.yaml -f compose.africadawah.yaml "$@"; }
dc config --quiet
dc pull db migrate api
dc up -d --wait api || { dc logs --tail 80 migrate api; die "the API did not become healthy (logs above)"; }

say "4/4 Health over the edge network"
docker run --rm --network edge busybox:1.37 wget -qO- http://africadawah-store-api:8080/health/ready; echo
dc ps

cat <<EOF

Done. The API runs as compose project $PROJECT in $DIR.
Next, create your staff account (it prints a one-time password and the TOTP setup):
  cd $DIR && docker compose --env-file .env.production -p $PROJECT -f compose.yaml -f compose.africadawah.yaml \\
    run --rm api create-admin --email <your e-mail> --name "<your name>"
EOF
