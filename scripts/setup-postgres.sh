#!/bin/bash
# =============================================================
# ProductVault — PostgreSQL Setup Script
# Run as root on the VPS: bash scripts/setup-postgres.sh
# Server: 147.93.97.186
# =============================================================

set -e

DB_NAME="db_productvault"
DB_USER="productvault_user"
DB_PASS="0eZKe3w429lEgqqiKlv3xfEZdCR8JlKq"
APP_DIR="/var/www/product-master-hub"

echo "==> Installing PostgreSQL..."
apt-get update -qq
apt-get install -y postgresql postgresql-contrib

echo "==> Starting PostgreSQL service..."
systemctl enable postgresql
systemctl start postgresql

echo "==> Creating database and user..."
sudo -u postgres psql <<EOF
-- Create user
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';
  END IF;
END
\$\$;

-- Create database
SELECT 'CREATE DATABASE ${DB_NAME} OWNER ${DB_USER}'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '${DB_NAME}')\gexec

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
EOF

echo "==> Creating tables..."
sudo -u postgres psql -d "${DB_NAME}" <<'SQLEOF'

-- Extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------
-- users
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  clerk_id      VARCHAR(255) UNIQUE NOT NULL,
  store_name    VARCHAR(255),
  email         VARCHAR(255) NOT NULL,
  plan          VARCHAR(50)  NOT NULL DEFAULT 'free',
  ai_count      INTEGER      NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- ----------------------------------------------------------------
-- products
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS products (
  id              SERIAL PRIMARY KEY,
  user_id         VARCHAR(255) NOT NULL REFERENCES users(clerk_id) ON DELETE CASCADE,
  name            VARCHAR(500) NOT NULL,
  description     TEXT,
  sku             VARCHAR(255),
  category        VARCHAR(255),
  sub_category    VARCHAR(255),
  mrp             NUMERIC(12,2),
  selling_price   NUMERIC(12,2),
  purchase_price  NUMERIC(12,2),
  wholesale_price NUMERIC(12,2),
  weight          NUMERIC(10,3),
  dimensions      VARCHAR(100),
  seo_keywords    TEXT,
  hsn_code        VARCHAR(50),
  stock           INTEGER DEFAULT 0,
  amazon_link     TEXT,
  flipkart_link   TEXT,
  etsy_link       TEXT,
  meesho_link     TEXT,
  ai_data         JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_sku     ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_name    ON products USING gin(to_tsvector('english', name));

-- ----------------------------------------------------------------
-- product_images
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_images (
  id          SERIAL PRIMARY KEY,
  product_id  INTEGER      NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     VARCHAR(255) NOT NULL,
  filename    VARCHAR(500) NOT NULL,
  width       INTEGER,
  height      INTEGER,
  size_kb     INTEGER,
  dpi         INTEGER,
  file_url    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- ----------------------------------------------------------------
-- product_platforms
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS product_platforms (
  id            SERIAL PRIMARY KEY,
  product_id    INTEGER      NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  platform_name VARCHAR(100) NOT NULL,
  UNIQUE(product_id, platform_name)
);

-- ----------------------------------------------------------------
-- store_policies
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS store_policies (
  id          SERIAL PRIMARY KEY,
  user_id     VARCHAR(255) NOT NULL,
  policy_type VARCHAR(100) NOT NULL,
  content     TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, policy_type)
);

-- ----------------------------------------------------------------
-- social_links
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS social_links (
  id        SERIAL PRIMARY KEY,
  user_id   VARCHAR(255) NOT NULL,
  platform  VARCHAR(100) NOT NULL,
  url       TEXT,
  UNIQUE(user_id, platform)
);

-- Grant table-level permissions to app user
GRANT ALL PRIVILEGES ON ALL TABLES    IN SCHEMA public TO productvault_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO productvault_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON TABLES    TO productvault_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT ALL PRIVILEGES ON SEQUENCES TO productvault_user;

SQLEOF

echo "==> Configuring PostgreSQL to allow remote connections..."
PG_VERSION=$(psql --version | awk '{print $3}' | cut -d. -f1)
PG_CONF="/etc/postgresql/${PG_VERSION}/main/postgresql.conf"
PG_HBA="/etc/postgresql/${PG_VERSION}/main/pg_hba.conf"

# Allow listen on all interfaces
sed -i "s/#listen_addresses = 'localhost'/listen_addresses = 'localhost'/" "$PG_CONF"

# Allow app user from localhost only (Next.js runs on same server)
if ! grep -q "productvault_user" "$PG_HBA"; then
  echo "host  db_productvault  productvault_user  127.0.0.1/32  scram-sha-256" >> "$PG_HBA"
fi

systemctl restart postgresql

echo ""
echo "============================================================"
echo "  PostgreSQL setup complete!"
echo "  Database : ${DB_NAME}"
echo "  User     : ${DB_USER}"
echo "  Password : ${DB_PASS}"
echo "  Host     : 127.0.0.1 (localhost — app is on same server)"
echo ""
echo "  DATABASE_URL to put in /var/www/product-master-hub/.env.local:"
echo "  postgresql://${DB_USER}:${DB_PASS}@127.0.0.1:5432/${DB_NAME}"
echo "============================================================"
echo ""
echo "==> Verifying connection..."
PGPASSWORD="${DB_PASS}" psql -h 127.0.0.1 -U "${DB_USER}" -d "${DB_NAME}" -c "\dt"
echo "All tables listed above — setup successful!"
