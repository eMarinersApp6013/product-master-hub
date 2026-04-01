-- ProductVault initial schema
-- Run: psql -U productvault_user -d db_productvault -f scripts/001_init_schema.sql

-- Users
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  clerk_id   VARCHAR(255) UNIQUE NOT NULL,
  email      VARCHAR(255) NOT NULL,
  store_name VARCHAR(500),
  plan       VARCHAR(50)  NOT NULL DEFAULT 'free',
  ai_count   INTEGER      NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- User profiles (extended settings)
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id    VARCHAR(255) PRIMARY KEY,
  store_name VARCHAR(500),
  gst_number VARCHAR(50),
  email      VARCHAR(255),
  phone      VARCHAR(50),
  address    TEXT,
  plan       VARCHAR(50)  NOT NULL DEFAULT 'free',
  ai_credits INTEGER      NOT NULL DEFAULT 100,
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  user_id     VARCHAR(255) NOT NULL,
  name        VARCHAR(255) NOT NULL,
  slug        VARCHAR(255) NOT NULL,
  color       VARCHAR(20)  NOT NULL DEFAULT '#6366F1',
  icon        VARCHAR(50),
  description TEXT,
  parent_id   INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, slug)
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id              SERIAL PRIMARY KEY,
  user_id         VARCHAR(255) NOT NULL,
  name            VARCHAR(500) NOT NULL,
  description     TEXT,
  sku             VARCHAR(255),
  category        VARCHAR(255),
  sub_category    VARCHAR(255),
  mrp             NUMERIC(12,2),
  selling_price   NUMERIC(12,2),
  purchase_price  NUMERIC(12,2),
  wholesale_price NUMERIC(12,2),
  weight          VARCHAR(255),
  dimensions      VARCHAR(255),
  seo_keywords    TEXT,
  hsn_code        VARCHAR(50),
  stock           INTEGER     NOT NULL DEFAULT 0,
  amazon_link     VARCHAR(1000),
  flipkart_link   VARCHAR(1000),
  etsy_link       VARCHAR(1000),
  meesho_link     VARCHAR(1000),
  ai_data         JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_user_id   ON products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category  ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_sku       ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_created   ON products(created_at DESC);

-- Product platforms (multi-platform listings)
CREATE TABLE IF NOT EXISTS product_platforms (
  id            SERIAL PRIMARY KEY,
  product_id    INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  platform_name VARCHAR(255) NOT NULL,
  UNIQUE (product_id, platform_name)
);

CREATE INDEX IF NOT EXISTS idx_platforms_product_id ON product_platforms(product_id);

-- Product images
CREATE TABLE IF NOT EXISTS product_images (
  id         SERIAL PRIMARY KEY,
  user_id    VARCHAR(255) NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  filename   VARCHAR(500) NOT NULL,
  url        VARCHAR(1000) NOT NULL,
  size_bytes INTEGER,
  width      INTEGER,
  height     INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_images_user_id    ON product_images(user_id);
CREATE INDEX IF NOT EXISTS idx_images_product_id ON product_images(product_id);

-- Product combos
CREATE TABLE IF NOT EXISTS product_combos (
  id           SERIAL PRIMARY KEY,
  user_id      VARCHAR(255) NOT NULL,
  name         VARCHAR(500) NOT NULL,
  description  TEXT,
  discount_pct NUMERIC(5,2) DEFAULT 0,
  items        JSONB        NOT NULL DEFAULT '[]',
  total_mrp    NUMERIC(12,2) DEFAULT 0,
  combo_price  NUMERIC(12,2) DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_combos_user_id ON product_combos(user_id);

-- Store pages
CREATE TABLE IF NOT EXISTS store_pages (
  id         SERIAL PRIMARY KEY,
  user_id    VARCHAR(255) NOT NULL,
  title      VARCHAR(500) NOT NULL,
  slug       VARCHAR(255) NOT NULL,
  template   VARCHAR(50)  NOT NULL DEFAULT 'catalog',
  published  BOOLEAN      NOT NULL DEFAULT true,
  visits     INTEGER      NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_store_pages_user_id ON store_pages(user_id);
