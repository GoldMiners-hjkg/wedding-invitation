#!/usr/bin/env bash
# Usage: sudo bash deploy/setup-ssl.sh your-domain.com

set -euo pipefail

DOMAIN="${1:-}"
if [ -z "$DOMAIN" ]; then
  echo "Usage: sudo bash deploy/setup-ssl.sh your-domain.com"
  exit 1
fi

APP_DIR="${APP_DIR:-/var/www/wedding-invitation}"
NGINX_SITE="/etc/nginx/sites-available/wedding"

apt-get update
apt-get install -y nginx certbot python3-certbot-nginx

sed "s/YOUR_DOMAIN/$DOMAIN/g" "$APP_DIR/deploy/nginx.conf.example" > "$NGINX_SITE"
ln -sf "$NGINX_SITE" /etc/nginx/sites-enabled/wedding
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m "admin@$DOMAIN" || \
  certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN"

echo "==> HTTPS ready: https://$DOMAIN"
echo "    Health: curl https://$DOMAIN/api/rsvp/health"
