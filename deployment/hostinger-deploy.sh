#!/bin/bash
# ProductVault + NavyStore WhatsApp - Full Hostinger VPS Deployment
# Run this on your Hostinger VPS (147.93.97.186) as root user
# Usage: bash hostinger-deploy.sh
set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
log() { echo -e "${GREEN}[DEPLOY]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
err() { echo -e "${RED}[ERROR]${NC} $1"; }

echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║     ProductVault Full Deployment - Hostinger      ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""

# ─── CONFIG ───────────────────────────────────────────────────────────────────
GITHUB_REPO="https://github.com/eMarinersApp6013/product-master-hub.git"
GITHUB_TOKEN="${GITHUB_TOKEN:-}"   # Optional: set if repo is private
APP_DIR="/home/productvault/app"
WA_DIR="/home/productvault/wa-chat"
DB_NAME="db_productvault"
DB_USER="productvault_user"
DB_PASS="0eZKe3w429lEgqqiKlv3xfEZdCR8JlKq"
APP_PORT=4006
WA_PORT=4100

# ─── STEP 1: System update ─────────────────────────────────────────────────────
log "Step 1/10: Updating system..."
apt-get update -qq
apt-get install -y -qq git curl wget nginx postgresql postgresql-contrib python3-certbot-nginx 2>/dev/null

# ─── STEP 2: Node.js 22 ────────────────────────────────────────────────────────
log "Step 2/10: Installing Node.js 22..."
if ! node --version 2>/dev/null | grep -q "v22"; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash - 2>/dev/null
  apt-get install -y nodejs 2>/dev/null
fi
log "Node: $(node --version), npm: $(npm --version)"

# ─── STEP 3: PM2 ───────────────────────────────────────────────────────────────
log "Step 3/10: Installing PM2..."
npm install -g pm2 --silent

# ─── STEP 4: PostgreSQL ────────────────────────────────────────────────────────
log "Step 4/10: Setting up PostgreSQL..."
systemctl start postgresql 2>/dev/null || pg_ctlcluster 16 main start 2>/dev/null || true
systemctl enable postgresql 2>/dev/null || true

sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" 2>/dev/null || true
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null || true
log "Database ready: $DB_NAME"

# ─── STEP 5: Clone/update code ─────────────────────────────────────────────────
log "Step 5/10: Getting ProductVault code..."
mkdir -p /home/productvault
if [ -n "$GITHUB_TOKEN" ]; then
  CLONE_URL="https://${GITHUB_TOKEN}@github.com/eMarinersApp6013/product-master-hub.git"
else
  CLONE_URL="$GITHUB_REPO"
fi

if [ -d "$APP_DIR/.git" ]; then
  log "Updating existing code..."
  cd "$APP_DIR"
  git fetch origin main 2>&1 | tail -3
  git reset --hard origin/main
else
  log "Cloning from GitHub..."
  git clone "$CLONE_URL" "$APP_DIR" 2>&1 | tail -5
fi
cd "$APP_DIR"
log "Code ready at $APP_DIR"

# ─── STEP 6: Environment file ──────────────────────────────────────────────────
log "Step 6/10: Creating environment file..."
cat > "$APP_DIR/.env.local" << 'ENVEOF'
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y2VudHJhbC1nZWxkaW5nLTM4LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_aGSGMlgBU8XlvLgJC5pP3S3M0hn6vmAZ8pqFk1nhm0
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
DATABASE_URL=postgresql://productvault_user:0eZKe3w429lEgqqiKlv3xfEZdCR8JlKq@127.0.0.1:5432/db_productvault
NEXT_PUBLIC_APP_URL=https://admin.nodesurge.tech
ENVEOF
log "Environment file created"

# ─── STEP 7: Build the app ─────────────────────────────────────────────────────
log "Step 7/10: Installing dependencies and building..."
cd "$APP_DIR"
npm install --legacy-peer-deps 2>&1 | tail -5
npm run build 2>&1 | tail -20
log "Build complete!"

# ─── STEP 8: Upload directory for images ──────────────────────────────────────
log "Step 8/10: Setting up directories..."
mkdir -p "$APP_DIR/public/uploads/products"
chmod 755 "$APP_DIR/public/uploads/products"

# ─── STEP 9: Nginx configuration ───────────────────────────────────────────────
log "Step 9/10: Configuring nginx..."
cat > /etc/nginx/sites-available/admin.nodesurge.tech << 'EOF'
server {
    listen 80;
    server_name admin.nodesurge.tech;
    client_max_body_size 50M;

    location /_next/static {
        proxy_pass http://127.0.0.1:4006;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    location / {
        proxy_pass http://127.0.0.1:4006;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 120s;
        proxy_connect_timeout 30s;
    }
}
EOF

cat > /etc/nginx/sites-available/whatsapp.nodesurge.tech << 'EOF'
server {
    listen 80;
    server_name whatsapp.nodesurge.tech;
    client_max_body_size 50M;

    location /socket.io/ {
        proxy_pass http://127.0.0.1:4100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
    location ~ ^/(api|webhook|health|auth) {
        proxy_pass http://127.0.0.1:4100;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 120s;
    }
    location / {
        proxy_pass http://127.0.0.1:4100;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
EOF

ln -sf /etc/nginx/sites-available/admin.nodesurge.tech /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/whatsapp.nodesurge.tech /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx && systemctl enable nginx
log "Nginx configured and running"

# ─── STEP 10: Start PM2 ────────────────────────────────────────────────────────
log "Step 10/10: Starting apps with PM2..."
pm2 delete product-master-hub 2>/dev/null || true
cd "$APP_DIR"
pm2 start npm --name product-master-hub -- start -- -p $APP_PORT
pm2 save
pm2 startup systemd 2>/dev/null | tail -1 | bash 2>/dev/null || true
log "ProductVault started on port $APP_PORT"

# ─── SSL Certificates ──────────────────────────────────────────────────────────
echo ""
log "Getting SSL certificates with Let's Encrypt..."
certbot --nginx -d admin.nodesurge.tech --non-interactive --agree-tos --email admin@nodesurge.tech 2>&1 | tail -5 || \
  warn "SSL cert failed. Try manually: certbot --nginx -d admin.nodesurge.tech"

# ─── Health Check ──────────────────────────────────────────────────────────────
echo ""
echo "╔═══════════════════════════════════════════════════╗"
echo "║                DEPLOYMENT COMPLETE                 ║"
echo "╚═══════════════════════════════════════════════════╝"
echo ""
sleep 3
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:$APP_PORT/ 2>/dev/null)
if [ "$STATUS" = "200" ] || [ "$STATUS" = "307" ] || [ "$STATUS" = "301" ]; then
  log "✓ App is running! HTTP status: $STATUS"
else
  warn "App returned status $STATUS - check: pm2 logs product-master-hub"
fi
echo ""
echo "ProductVault: https://admin.nodesurge.tech"
echo ""
echo "Useful commands:"
echo "  pm2 logs product-master-hub   # View app logs"
echo "  pm2 restart product-master-hub # Restart app"
echo "  nginx -t && systemctl reload nginx # Reload nginx"
echo "  certbot renew --dry-run        # Test SSL renewal"
