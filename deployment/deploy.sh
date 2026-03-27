#!/bin/bash
# ============================================================
# NavyStore + ProductVault Deployment Script
# Run on VPS as root: bash deployment/deploy.sh
# ============================================================
set -e

echo "==> Starting deployment..."

# ── 1. ProductVault (Next.js) ───────────────────────────────
PROD_DIR="/home/user/product-master-hub"
cd "$PROD_DIR"

echo "==> Installing ProductVault dependencies..."
npm install

echo "==> Building ProductVault (Next.js)..."
npm run build

echo "==> Building ProductVault admin panel..."
cd admin-panel && npm install && npm run build && cd ..

echo "==> Starting/restarting ProductVault with PM2..."
pm2 describe product-master-hub > /dev/null 2>&1 && \
  pm2 restart product-master-hub --update-env || \
  pm2 start npm --name product-master-hub -- start -- -p 4006

# ── 2. NavyStore wa-chat ───────────────────────────────────
WA_DIR="/var/www/wa-chat"
cd "$WA_DIR"

echo "==> Installing wa-chat dependencies..."
npm install

echo "==> Building wa-chat admin panel..."
cd admin-panel && npm install && REACT_APP_API_URL=https://whatsapp.nodesurge.tech CI=false npm run build && cd ..

echo "==> Starting/restarting wa-chat with PM2..."
pm2 describe wa-chat > /dev/null 2>&1 && \
  pm2 restart wa-chat --update-env || \
  pm2 start index.js --name wa-chat

# ── 3. Copy nginx configs ───────────────────────────────────
echo "==> Updating nginx configs..."
cp "$PROD_DIR/deployment/nginx-admin-nodesurge.conf" /etc/nginx/sites-available/admin.nodesurge.tech
cp "$PROD_DIR/deployment/nginx-whatsapp-nodesurge.conf" /etc/nginx/sites-available/whatsapp.nodesurge.tech

ln -sf /etc/nginx/sites-available/admin.nodesurge.tech /etc/nginx/sites-enabled/ 2>/dev/null || true
ln -sf /etc/nginx/sites-available/whatsapp.nodesurge.tech /etc/nginx/sites-enabled/ 2>/dev/null || true

nginx -t && nginx -s reload

echo ""
echo "============================================================"
echo "  Deployment complete!"
echo "  ProductVault: https://admin.nodesurge.tech"
echo "  NavyStore WA: https://whatsapp.nodesurge.tech"
echo "============================================================"
pm2 list
