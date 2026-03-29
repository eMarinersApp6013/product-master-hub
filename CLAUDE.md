# CLAUDE.md — WhatsApp AI Sales Platform + 11 Catalog Features
# Project: NavyStore WhatsApp Platform
# GitHub: eMarinersApp6013/whatsapp-platform
# Last updated: March 29, 2026

---

## STOP AND READ THIS FIRST

You are working on an **existing live platform** at whatsapp.nodesurge.tech.
The backend is LIVE at port 4100. The admin panel is served from the same app.
PostgreSQL is on port 5433. Redis is on port 6380.

**DO NOT recreate the project from scratch.** 
**DO NOT delete or overwrite existing working files.**
**DO audit what exists, fix what's broken, and ADD new features.**

---

## PROJECT OVERVIEW

This is a WhatsApp AI Sales Platform for ecommerce businesses. It connects directly to Meta WhatsApp Cloud API (NO Chatwoot dependency). An AI agent handles customer conversations automatically — product recommendations, cart building, payment collection, courier booking, order tracking — all inside WhatsApp.

The platform has TWO interfaces:
1. **WhatsApp** — customer-facing. AI + human agents respond to customers.
2. **Admin Panel** — business-facing. Web dashboard to manage everything.

---

## LIVE SERVER DETAILS

| Item | Value |
|---|---|
| VPS | Hostinger KVM 2 — Mumbai, India |
| IP | 147.93.97.186 |
| SSH | ssh root@147.93.97.186 |
| Backend URL | https://whatsapp.nodesurge.tech |
| Backend Port | 4100 |
| Backend Folder | /var/www/wa-chat/ |
| PM2 Name | wa-chat |
| GitHub | eMarinersApp6013/whatsapp-platform |
| PostgreSQL | Port 5433 (native) — NOT 5432 |
| Redis | Port 6380 (native) — NOT 6379 |
| Node.js | v20.x |
| DB Name | navystore_agent |

### CRITICAL RULES
- PostgreSQL port is 5433 — never use 5432
- Redis port is 6380 — never use 6379
- Connect PostgreSQL via Unix socket at /var/run/postgresql
- DB password env var is DB_PASS — not DB_PASSWORD
- Never touch Chatwoot (port 3000), courier app (port 4000), n8n (port 5678)
- Always explain WHY you are doing something — Rajesh is learning while building
- Run pm2 save after any PM2 changes

---

## TASK 1: AUDIT EXISTING CODE

Before adding any new feature, audit the entire codebase. Check every file, every route, every DB table.

### Backend files to check (in /var/www/wa-chat/):
```
index.js, config/db.js, config/redis.js
routes/    → webhook, orders, products, clients, auth, settings, analytics
controllers/ → meta, ai, payment, shipping, invoice
services/  → meta, openai, cashfree, shiprocket, zoho, email
middleware/ → auth, tenant
models/    → tenant, client, order, product, conversation
cron/      → tracking
utils/     → pincode, image
```

### Admin panel pages to check:
```
Login, Dashboard, Conversations, Orders, Invoices, Products, Analytics, Broadcast, Settings
```

### DB tables to verify (psql -U postgres -p 5433 -d navystore_agent -c "\dt"):
```
tenants, clients, products, orders, conversations, courier_slips,
shipping_rates, staff_numbers, support_tickets, broadcasts
```

### Create AUDIT_REPORT.md with:
- ✅ Working (confirmed with test)
- ⚠️ Partial (code exists, not functional)
- ❌ Missing (not coded yet)
- 🐛 Bugs found

---

## TASK 2: FIX ALL BROKEN/INCOMPLETE FEATURES

Priority order:
1. DB connection to PostgreSQL 5433
2. Meta webhook — receive + process WhatsApp messages
3. Meta service — send text/image/template/buttons/list messages
4. Admin panel loads with login
5. Products CRUD from admin panel
6. Orders flow — create, update status, approve invoice/courier
7. Conversations inbox — show WhatsApp messages with Socket.io real-time
8. Analytics dashboard with real DB data

---

## TASK 3: CREATE NEW DATABASE TABLES

Run these after audit confirms existing tables work:

```sql
-- Wishlists (Feature 4)
CREATE TABLE IF NOT EXISTS wishlists (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER REFERENCES tenants(id),
  client_id INTEGER REFERENCES clients(id),
  product_id INTEGER REFERENCES products(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, client_id, product_id)
);

-- Persistent Carts (Feature 5)
CREATE TABLE IF NOT EXISTS carts (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER REFERENCES tenants(id),
  client_id INTEGER REFERENCES clients(id),
  items JSONB DEFAULT '[]',
  discount_percent DECIMAL(5,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bundles (Feature 6)
CREATE TABLE IF NOT EXISTS bundles (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER REFERENCES tenants(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  product_ids INTEGER[] NOT NULL,
  bundle_price DECIMAL(10,2) NOT NULL,
  savings DECIMAL(10,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Restock Alerts (Feature 7)
CREATE TABLE IF NOT EXISTS restock_alerts (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER REFERENCES tenants(id),
  client_id INTEGER REFERENCES clients(id),
  product_id INTEGER REFERENCES products(id),
  notified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, client_id, product_id)
);

-- Add custom_options column to products (Feature 11)
ALTER TABLE products ADD COLUMN IF NOT EXISTS custom_options JSONB DEFAULT NULL;

-- Add category column if missing
ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(255);
```

---

## TASK 4: SEED 10 DEMO PRODUCTS + 2 BUNDLES

**IMPORTANT:** Check existing product table columns first. Adapt column names if needed.

```sql
INSERT INTO products (tenant_id, sku, name, description, price, stock_qty, category, image_urls, weight_kg, rank_tags, is_active, custom_options) VALUES

-- UNIFORMS (3)
(1, 'UNI-001', 'Navy Officer Uniform Set',
 'Complete officer uniform: shirt, trousers, tie. Premium polyester-viscose. Wrinkle-resistant.',
 2499, 12, 'Uniforms',
 ARRAY['https://placehold.co/400x400/1a365d/ffffff?text=Officer+Uniform'],
 0.8, ARRAY['officer','captain','2nd_officer'], true, NULL),

(1, 'UNI-002', 'Boiler Suit Coverall',
 'Engine room coverall. Fire-retardant. Reflective strips. Tool pockets.',
 1800, 20, 'Uniforms',
 ARRAY['https://placehold.co/400x400/c53030/ffffff?text=Boiler+Suit'],
 0.6, ARRAY['engineer','rating'], true, NULL),

(1, 'UNI-003', 'Tropical White Uniform',
 'Lightweight cotton for warm ports. Gold buttons. Shirt and shorts included.',
 1950, 8, 'Uniforms',
 ARRAY['https://placehold.co/400x400/f7fafc/1a365d?text=Tropical+White'],
 0.5, ARRAY['officer','captain'], true, NULL),

-- SAFETY (2)
(1, 'SAF-001', 'Safety Helmet White SOLAS',
 'SOLAS approved. Adjustable headband. Chin strap. UV resistant.',
 1200, 15, 'Safety',
 ARRAY['https://placehold.co/400x400/f6e05e/1a365d?text=Safety+Helmet'],
 0.4, ARRAY['all'], true, NULL),

(1, 'SAF-002', 'Life Jacket SOLAS Approved',
 'SOLAS life jacket with whistle and light. 150N buoyancy. Auto inflation.',
 2200, 30, 'Safety',
 ARRAY['https://placehold.co/400x400/e53e3e/ffffff?text=Life+Jacket'],
 0.9, ARRAY['all'], true, NULL),

-- ACCESSORIES (3)
(1, 'ACC-001', '2nd Officer Epaulette Pair',
 'Gold bullion wire epaulettes. Hand-embroidered. Clip-on. Sold as pair.',
 450, 25, 'Accessories',
 ARRAY['https://placehold.co/400x400/d69e2e/1a365d?text=Epaulettes'],
 0.1, ARRAY['2nd_officer'], true, NULL),

(1, 'ACC-002', 'Captain Peak Cap Navy',
 'Premium cap with gold badge. Adjustable inner band. Sweat-absorbent.',
 650, 12, 'Accessories',
 ARRAY['https://placehold.co/400x400/1a365d/d69e2e?text=Peak+Cap'],
 0.3, ARRAY['captain','chief_officer'], true, NULL),

(1, 'ACC-003', 'Navigation Divider Set',
 'Brass dividers. 7-inch arm. Velvet-lined wooden box.',
 750, 18, 'Accessories',
 ARRAY['https://placehold.co/400x400/2d3748/d69e2e?text=Divider+Set'],
 0.3, ARRAY['officer','cadet'], true, NULL),

-- CUSTOM (2 — with customizer)
(1, 'CUS-001', 'Brass Nameplate — Custom Engraved',
 'Premium brass with your name, rank, ship. Hand-engraved. Wall mount or desk stand. 3-5 days production.',
 499, 99, 'Custom',
 ARRAY['https://placehold.co/400x400/d69e2e/1a365d?text=Nameplate'],
 0.2, ARRAY['all'], true,
 '{"is_customizable":true,"fields":[{"name":"your_name","label":"Your Name","type":"text","required":true},{"name":"rank","label":"Rank","type":"text","required":true},{"name":"ship_name","label":"Ship Name","type":"text","required":false},{"name":"logo","label":"Logo","type":"select","options":["⚓ Anchor","🔱 Trident","⭐ Star","🦅 Eagle","🛳️ Ship","📤 Upload"]},{"name":"material","label":"Material","type":"select","options":["Gold Brass","Silver","Black"]}],"production_days":"3-5"}'::jsonb),

(1, 'CUS-002', 'Custom Embroidered T-Shirt',
 'Premium cotton tee with custom embroidery. Name, rank, ship logo. Front + back print. Bulk discounts.',
 899, 99, 'Custom',
 ARRAY['https://placehold.co/400x400/2d3748/ffffff?text=Custom+TShirt'],
 0.3, ARRAY['all'], true,
 '{"is_customizable":true,"fields":[{"name":"your_name","label":"Your Name","type":"text","required":true},{"name":"rank","label":"Rank","type":"text","required":false},{"name":"logo","label":"Logo","type":"select","options":["⚓ Anchor","🔱 Trident","⭐ Star","🦅 Eagle","🛳️ Ship","📤 Upload"]},{"name":"color","label":"Color","type":"select","options":["White","Black","Navy","Gray"]},{"name":"placement","label":"Placement","type":"select","options":["Front Center","Back Full","Left Chest","Right Sleeve"]}],"production_days":"5-7"}'::jsonb);

-- BUNDLES (2)
INSERT INTO bundles (tenant_id, name, description, product_ids, bundle_price, savings, is_active) VALUES
(1, '2nd Officer Starter Pack', 'Uniform + Epaulettes + Peak Cap. Save ₹200!', ARRAY[1,6,7], 3399, 200, true),
(1, 'Safety Essentials Kit', 'Helmet + Life Jacket. Mandatory for all crew.', ARRAY[4,5], 3100, 300, true);

-- SHIPPING RATES (5 zones)
INSERT INTO shipping_rates (tenant_id, zone, states, rate_500g, rate_1kg, rate_2kg, per_kg_extra) VALUES
(1, 'North', ARRAY['Delhi','Haryana','Punjab','UP','Rajasthan'], 60, 85, 120, 40),
(1, 'South', ARRAY['Karnataka','Tamil Nadu','Kerala','Telangana','AP'], 70, 99, 140, 45),
(1, 'East', ARRAY['West Bengal','Odisha','Bihar','Jharkhand','Assam'], 75, 105, 150, 50),
(1, 'West', ARRAY['Maharashtra','Gujarat','MP','Chhattisgarh'], 65, 90, 130, 42),
(1, 'Remote', ARRAY['A&N Islands','Lakshadweep','Ladakh','Sikkim'], 120, 160, 220, 70);
```

---

## TASK 5: BUILD 11 CATALOG API ENDPOINTS

Create file: `routes/catalog.routes.js` and `controllers/catalog.controller.js`

### All endpoints:

```
# Feature 1 — Smart Home
GET  /api/catalog/home?clientPhone=X
  → returns { top_sellers[], new_arrivals[], recommended[], bundles[] }

# Feature 2 — AI Fuzzy Search
POST /api/catalog/search
  body: { query, clientPhone }
  → GPT-4o corrects spelling → search products
  → returns { corrected_query, products[], total }

# Feature 3 — Voice Search
POST /api/catalog/voice-search
  body: { audioUrl }  (or handle in meta.controller when audio msg received)
  → Whisper transcribe → run search → return products

# Feature 4 — Wishlist
POST   /api/catalog/wishlist          { clientPhone, productId }
DELETE /api/catalog/wishlist/:id
GET    /api/catalog/wishlist/:clientPhone

# Feature 5 — Persistent Cart
POST   /api/catalog/cart/add          { clientPhone, productId, qty, variant }
PATCH  /api/catalog/cart/update       { clientPhone, productId, qty }
DELETE /api/catalog/cart/item         { clientPhone, productId }
GET    /api/catalog/cart/:clientPhone
DELETE /api/catalog/cart/clear/:clientPhone

# Feature 6 — Bundles
GET    /api/catalog/bundles
GET    /api/catalog/bundles/suggest/:productId
POST   /api/catalog/bundles           (admin: create bundle)
PUT    /api/catalog/bundles/:id       (admin: edit)
DELETE /api/catalog/bundles/:id       (admin: delete)

# Feature 7 — Restock Alerts
POST   /api/catalog/restock-alert     { clientPhone, productId }
GET    /api/catalog/restock-alerts    (admin: list all pending)
POST   /api/catalog/restock-notify/:productId  (admin: send notifications)

# Feature 8 — Photo Search (handled in meta.controller for image messages)
POST   /api/catalog/image-search      { imageUrl }
  → GPT-4o Vision describes image → search products → return matches

# Feature 9 — Smart Sort
GET    /api/catalog/search?sort=best_for_me&clientPhone=X
  → score products by: order history match (+3), wishlist (+2), rating (+1)

# Feature 10 — Shipping Calculator
POST   /api/catalog/shipping-calc
  body: { pincode, weight_kg, cart_total }
  → returns { couriers[], cheapest, fastest, prepaid_savings }

# Feature 11 — Customizer (data comes from product's custom_options JSONB)
GET    /api/catalog/product/:id/custom-options
POST   /api/catalog/cart/add-custom   { clientPhone, productId, customSpec }
```

---

## TASK 6: ADD ADMIN PANEL PAGES

Add to existing sidebar navigation:

### New sidebar items:
```
Products → Products (existing)
Products → Bundles (NEW)
Products → Restock Alerts (NEW)
Analytics → Catalog Analytics (NEW — wishlist stats, search analytics)
Settings → Shipping Zones (NEW)
Settings → Catalog Config (NEW — toggle 11 features)
```

### Bundles page:
- Table: Name, Products (count), Bundle Price, Savings, Active toggle
- Create/Edit modal: pick products, set price
- Delete with confirmation

### Restock Alerts page:
- Table: Product Name, Waiting Customers (count), Out of Stock Since
- "Notify All" button per product
- Notification history

### Shipping Zones page:
- Table: Zone, States, Rates (500g / 1kg / 2kg / per extra kg)
- Edit inline or modal
- Test calculator at bottom

### Catalog Config page:
- Toggle switches for each feature (AI Search, Voice, Wishlist, Cart, Bundles, etc.)
- Save to tenant settings

---

## TASK 7: WHATSAPP AI MESSAGE FLOW

Update meta.controller.js to handle all 11 features:

```
Customer sends message → meta.controller.js

1. Parse message type (text / audio / image / button_reply / flow_response)

2. Special text commands:
   "my cart"     → GET /api/catalog/cart/:phone → send cart summary
   "my wishlist" → GET /api/catalog/wishlist/:phone → send wishlist
   "my orders"   → GET /api/orders?clientPhone= → send order list
   "help"        → send help menu with buttons

3. Audio message → Whisper transcribe → treat as text search (Feature 3)

4. Image message → GPT-4o Vision → image search (Feature 8)

5. Regular text → send to GPT-4o with:
   - System prompt (sales agent persona)
   - Full product catalog from DB
   - Client's cart contents
   - Client's wishlist
   - Last 10 messages
   
   GPT-4o returns JSON:
   {
     "intent": "browse|search|add_to_cart|checkout|question|greeting",
     "reply": "text to send to customer",
     "action": "none|send_products|add_cart|send_payment|send_catalog",
     "products": [product_ids to show],
     "cart_update": {"product_id": X, "qty": Y, "variant": "Z"}
   }

6. Execute action:
   - send_products → fetch products → send as WhatsApp image cards
   - add_cart → update cart in DB → confirm to customer
   - send_payment → create Cashfree link → send to customer
   - send_catalog → send WhatsApp Flow or catalog link button

7. Save conversation to DB
8. Emit Socket.io event for admin panel real-time update
```

---

## ENVIRONMENT VARIABLES (.env)

```
PORT=4100
NODE_ENV=production
DB_HOST=/var/run/postgresql
DB_PORT=5433
DB_NAME=navystore_agent
DB_USER=postgres
DB_PASS=NavyStore2025secure
REDIS_URL=redis://localhost:6380
JWT_SECRET=NavyStore_JWT_Secret_2025_xK9mP3qR
META_VERIFY_TOKEN=<set-random-string>
META_APP_SECRET=<from-meta-dashboard>
OPENAI_API_KEY=<your-key>
CASHFREE_APP_ID=<your-id>
CASHFREE_SECRET_KEY=<your-secret>
CASHFREE_ENV=TEST
SHIPROCKET_EMAIL=<email>
SHIPROCKET_PASSWORD=<password>
SMTP_USER=<gmail>
SMTP_PASS=<app-password>
```

---

## EXECUTION ORDER

1. **AUDIT** → Read all files, check DB, create AUDIT_REPORT.md
2. **FIX** → Fix broken connections/routes/pages
3. **SCHEMA** → Create 4 new tables + alter products table
4. **SEED** → Insert 10 demo products + 2 bundles + shipping rates
5. **CATALOG API** → Build all 11 feature endpoints
6. **ADMIN PAGES** → Add Bundles, Restock, Shipping, Catalog Config pages
7. **AI FLOW** → Update meta.controller.js for all 11 features in WhatsApp
8. **TEST** → Test each feature: WhatsApp msg → AI → admin panel
9. **COMMIT** → Push all changes to GitHub main branch

---

## PROTECTED — NEVER TOUCH

| Service | Port | Rule |
|---|---|---|
| Chatwoot | 3000 | Do not modify |
| PostgreSQL Docker | 5432 | Chatwoot only |
| Redis Docker | 6379 | Chatwoot only |
| n8n | 5678 | Do not modify |
| Courier App | 4000 | Separate project |

---

## SUCCESS CHECKLIST

- [ ] AUDIT_REPORT.md created
- [ ] Admin panel loads with login at whatsapp.nodesurge.tech
- [ ] Dashboard shows real stats
- [ ] 10 demo products visible in Products page (4 categories)
- [ ] 2 bundles visible in new Bundles page
- [ ] POST /api/catalog/search corrects "unifrom" → "uniform"
- [ ] POST /api/catalog/voice-search transcribes and searches
- [ ] Wishlist add/remove/list works via API
- [ ] Cart add/update/remove/clear works via API
- [ ] GET /api/catalog/home returns top sellers + new arrivals + recommended
- [ ] POST /api/catalog/shipping-calc returns 3 courier options
- [ ] GET /api/catalog/bundles/suggest/:id returns matching bundles
- [ ] Custom products show customizer fields in API response
- [ ] Restock alerts table works
- [ ] Shipping zones editable in admin
- [ ] WhatsApp webhook receives and AI responds
- [ ] Conversations page shows messages in real-time
- [ ] "my cart" and "my wishlist" commands work in WhatsApp
