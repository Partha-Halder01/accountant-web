# Deploying easyacct.us

This repo auto-deploys to **IONOS Web Hosting Essential** on every push to `main`.
Frontend (React/Vite) and backend (Laravel) are built in GitHub Actions and uploaded
via SFTP. The IONOS account is SFTP-only (no shell), so migrations run via a
token-guarded HTTPS endpoint after each deploy.

## Server layout

```
/                     ← document root for easyacct.us
├── index.html, services/, about/, contact/   ← prerendered React
├── assets/, service-images/, logo.*, robots.txt, sitemap.xml
├── .htaccess                                  ← SPA fallback + cache headers
├── api/
│   ├── index.php                              ← bootstraps ../_laravel
│   └── .htaccess                              ← Laravel rewrite to index.php
└── _laravel/                                  ← Laravel app (denied from web)
    ├── app/ bootstrap/ config/ database/ routes/ storage/ vendor/
    ├── .env                                   ← uploaded once by hand
    └── artisan
```

## One-time setup

### 1. GitHub repo secrets

In **Settings → Secrets and variables → Actions**, add:

| Name | Value |
|---|---|
| `IONOS_SFTP_HOST` | `access1013336150.webspace-data.io` |
| `IONOS_SFTP_USER` | `acc1489983863` |
| `IONOS_SFTP_PASSWORD` | (your IONOS SFTP password) |
| `ADMIN_API_TOKEN` | a strong random hex string (must equal what you put in `_laravel/.env`) |

Generate the admin token locally:
```bash
php -r "echo bin2hex(random_bytes(32)) . PHP_EOL;"
```

### 2. Upload `_laravel/.env` once via SFTP

GitHub Actions never uploads `.env` — you control it directly. Connect with
**FileZilla** or **WinSCP** to `access1013336150.webspace-data.io` (SFTP, port
22), username `acc1489983863`, and place this file at `/_laravel/.env`:

```env
APP_NAME="EasyAcct Backend"
APP_ENV=production
APP_KEY=                                # see step 3
APP_DEBUG=false
APP_URL=https://easyacct.us

LOG_CHANNEL=single
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=db5020311998.hosting-data.io
DB_PORT=3306
DB_DATABASE=dbs15603482
DB_USERNAME=dbu4617534
DB_PASSWORD=yV8fbv3irTTF@s2

CACHE_STORE=file
SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=true
SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax
QUEUE_CONNECTION=sync
FILESYSTEM_DISK=local
BROADCAST_CONNECTION=log

MAIL_MAILER=smtp
MAIL_HOST=smtp.ionos.com
MAIL_PORT=587
MAIL_SCHEME=tls
MAIL_USERNAME=admin@easyacct.us
MAIL_PASSWORD=                          # IONOS mailbox password
MAIL_FROM_ADDRESS="admin@easyacct.us"
MAIL_FROM_NAME="EasyAcct"

FRONTEND_URLS=https://easyacct.us,https://www.easyacct.us

ADMIN_NAME="EasyAcct Admin"
ADMIN_EMAIL=admin@easyacct.us
ADMIN_PASSWORD=                         # set a strong password
ADMIN_API_TOKEN=                        # same value as the GitHub secret
```

### 3. Generate `APP_KEY`

Locally:
```bash
cd backend
php artisan key:generate --show
```
Copy the `base64:...` string into `APP_KEY=` in the server `.env`.

### 4. First deploy

Push to `main` (or run the workflow manually under Actions → "Deploy to IONOS"
→ Run workflow). The workflow:

1. Builds and uploads the frontend → `/` on the server.
2. Builds and uploads Laravel → `/_laravel` and `/api` on the server.
3. `curl`s `https://easyacct.us/api/_admin/migrate?token=<ADMIN_API_TOKEN>` to
   run migrations and warm the framework caches.

### 5. Smoke test

```bash
curl -I https://easyacct.us/                           # 200, HTML
curl -I https://easyacct.us/services                   # 200, prerendered
curl    https://easyacct.us/api/settings/public        # 200, JSON
curl -I https://easyacct.us/_laravel/.env              # 403
curl -I http://easyacct.us/                            # 301 → https
```

Visit `https://easyacct.us/admin` to log in.

## Day-to-day

- Edit code locally, `git push origin main` → live in ~3–5 min.
- `_laravel/.env` is **only** on the server. To change it, SFTP it again and
  re-run the workflow (or hit `/api/_admin/migrate?token=…` directly to flush
  caches).
- New migration? Just push — the workflow runs them.
- Rotate `ADMIN_API_TOKEN`: change it in `_laravel/.env` (SFTP) **and** in the
  GitHub secret. They must match.

## Local development

Unchanged:

```bash
# Terminal 1
cd backend && php artisan serve            # http://127.0.0.1:8000

# Terminal 2
cd frontend && npm run dev                 # http://localhost:5173
```

`backend/.env` stays on SQLite and is never touched by deploys.
