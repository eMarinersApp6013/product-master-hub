#!/bin/bash
# ProductVault Full Deployment Script
# Run this on your production server as root

set -e
echo "=== ProductVault Deploy ==="

# 1. Install Node.js 22 if not present
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

# 2. Install PM2 globally
npm install -g pm2

# 3. Install nginx and certbot
apt-get update && apt-get install -y nginx python3-certbot-nginx

# 4. Install PostgreSQL if not present
if ! command -v psql &>/dev/null; then
  apt-get install -y postgresql postgresql-contrib
  systemctl start postgresql
  systemctl enable postgresql
fi

# 5. Set up ProductVault database
sudo -u postgres psql << 'SQL'
CREATE USER productvault_user WITH PASSWORD '0eZKe3w429lEgqqiKlv3xfEZdCR8JlKq';
CREATE DATABASE db_productvault OWNER productvault_user;
GRANT ALL PRIVILEGES ON DATABASE db_productvault TO productvault_user;
SQL

# 6. Clone/update the code
if [ ! -d /home/user/product-master-hub ]; then
  mkdir -p /home/user
  cd /home/user
  # Replace with your actual git repo URL:
  git clone YOUR_GIT_REPO_URL product-master-hub
else
  cd /home/user/product-master-hub
  git pull
fi

# 7. Install dependencies and build
cd /home/user/product-master-hub
npm install
npm run build

# 8. Set up wa-chat
cd /var/www/wa-chat
npm install

# 9. Configure nginx
cat > /etc/nginx/sites-available/admin.nodesurge.tech << 'EOF'
server {
    listen 80;
    server_name admin.nodesurge.tech;
    location / {
        proxy_pass http://127.0.0.1:4006;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
}
EOF

cat > /etc/nginx/sites-available/whatsapp.nodesurge.tech << 'EOF'
server {
    listen 80;
    server_name whatsapp.nodesurge.tech;
    location /socket.io/ {
        proxy_pass http://127.0.0.1:4100;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    location ~ ^/(api|webhook|health) {
        proxy_pass http://127.0.0.1:4100;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
    root /var/www/wa-chat/admin-panel/build;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}
EOF

ln -sf /etc/nginx/sites-available/admin.nodesurge.tech /etc/nginx/sites-enabled/
ln -sf /etc/nginx/sites-available/whatsapp.nodesurge.tech /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx && systemctl enable nginx

# 10. Get SSL certs
certbot --nginx -d admin.nodesurge.tech -d whatsapp.nodesurge.tech --non-interactive --agree-tos --email admin@nodesurge.tech

# 11. Start apps with PM2
pm2 delete all 2>/dev/null || true
cd /home/user/product-master-hub
pm2 start npm --name product-master-hub -- start -- -p 4006
pm2 start /var/www/wa-chat/index.js --name wa-chat
pm2 save
pm2 startup | bash 2>/dev/null || true

echo ""
echo "=== DONE ==="
echo "ProductVault: https://admin.nodesurge.tech"
echo "WhatsApp Admin: https://whatsapp.nodesurge.tech"
