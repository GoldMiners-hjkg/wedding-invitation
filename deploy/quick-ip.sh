#!/usr/bin/env bash
# Quick deploy on HK VPS (no domain) — run ON THE SERVER as root after git clone
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v docker >/dev/null 2>&1; then
  apt-get update
  apt-get install -y ca-certificates curl git
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

if [ ! -f .env ]; then
  cp .env.production.example .env
  echo ""
  echo "Edit .env and set ADMIN_PASSWORD, then run this script again:"
  echo "  nano .env"
  exit 1
fi

if grep -q "change-me-to-a-strong-password" .env; then
  echo "Please set ADMIN_PASSWORD in .env first: nano .env"
  exit 1
fi

grep -q '^ADMIN_COOKIE_SECURE=' .env || echo 'ADMIN_COOKIE_SECURE=false' >> .env

mkdir -p data
docker compose build
docker compose up -d

IP=$(curl -s ifconfig.me || hostname -I | awk '{print $1}')
echo ""
echo "=============================================="
echo "  Site:  http://${IP}:3000"
echo "  Admin: http://${IP}:3000/admin"
echo "  Health: curl http://${IP}:3000/api/rsvp/health"
echo ""
echo "  If browser cannot open, add inbound rule"
echo "  TCP 3000 in Alibaba Cloud Security Group."
echo "=============================================="
