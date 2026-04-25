# Accountant Web Monorepo

This project is now split into two apps:

- `frontend/` for the React + Vite website
- `backend/` for the Laravel API and admin panel

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Use `frontend/.env.example` as the starting point for `frontend/.env` when you need a custom API URL.

## Backend

```bash
cd backend
php artisan migrate --seed
php artisan serve
```

Admin panel URL:

- `http://127.0.0.1:8000/admin/login`

Default seeded admin credentials:

- Email: `admin@easyacct.us`
- Password: `ChangeMe123!`

Change those credentials in `backend/.env` before production use.
