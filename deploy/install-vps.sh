#!/usr/bin/env bash
# Run on a fresh Ubuntu 22.04/24.04 Hong Kong VPS as root:
#   curl -fsSL https://raw.githubusercontent.com/YOUR_USER/wedding-invitation/main/deploy/install-vps.sh | bash
# Or after cloning:
#   sudo bash deploy/install-vps.sh

set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/wedding-invitation}"
REPO_URL="${REPO_URL:-}"

echo "==> Installing Docker..."
if ! command -v docker >/dev/null 2>&1; then
  apt-get update
  apt-get install -y ca-certificates curl git nginx
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc
  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
fi

mkdir -p "$APP_DIR"

if [ -n "$REPO_URL" ] && [ ! -d "$APP_DIR/.git" ]; then
  echo "==> Cloning $REPO_URL ..."
  git clone "$REPO_URL" "$APP_DIR"
fi

cd "$APP_DIR"

if [ ! -f .env ]; then
  echo "==> Creating .env from template..."
  cp .env.production.example .env
  ADMIN_PASS="$(openssl rand -base64 18 | tr -d '/+=' | head -c 20)"
  sed -i "s/change-me-to-a-strong-password/$ADMIN_PASS/" .env
  echo ""
  echo "=============================================="
  echo "  SAVE THIS ADMIN PASSWORD:"
  echo "  $ADMIN_PASS"
  echo "  Login at: https://YOUR_DOMAIN/admin"
  echo "=============================================="
  echo ""
fi

mkdir -p data

echo "==> Building and starting containers..."
docker compose build --no-cache
docker compose up -d

echo "==> Done. App listening on http://127.0.0.1:3000"
echo "    Next: point your domain DNS to this server, then run:"
echo "    sudo bash deploy/setup-ssl.sh YOUR_DOMAIN"
