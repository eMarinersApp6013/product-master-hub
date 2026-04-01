'use strict';
// PM2 ecosystem config for production deployment on Hostinger VPS
// Deploy to: /home/productvault/app/
// Usage: pm2 start ecosystem.config.js --env production

module.exports = {
  apps: [
    {
      name: 'product-master-hub',
      cwd: '/home/productvault/app',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env_production: {
        NODE_ENV: 'production',
        PORT: '3000',
        // PostgreSQL — update password to match your DB
        DATABASE_URL: 'postgresql://productvault_user:PVault2026x@127.0.0.1:5432/db_productvault',
        PGHOST: '127.0.0.1',
        PGPORT: '5432',
        PGDATABASE: 'db_productvault',
        PGUSER: 'productvault_user',
        PGPASSWORD: 'PVault2026x',
        DATABASE_SSL: 'false',
        // Clerk auth — replace with your real keys
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: 'pk_test_REPLACE_ME',
        CLERK_SECRET_KEY: 'sk_test_REPLACE_ME',
        NEXT_PUBLIC_CLERK_SIGN_IN_URL: '/sign-in',
        NEXT_PUBLIC_CLERK_SIGN_UP_URL: '/sign-up',
        NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: '/dashboard',
        NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: '/dashboard',
      },
    },
  ],
};
