# KAZI Workforce OS

KAZI is a responsive React and TypeScript workforce marketplace dashboard. The current app is a frontend product shell with typed local sample data so workflows can be explored without a backend.

## Run locally

```bash
npm install
npm run dev
```

Use `VITE_API_URL` to point the typed client in `src/services/api.ts` at a versioned backend. The default is `/api/v1`.

For LNbits, configure the backend proxy with the wallet Invoice key for receiving invoices and the Admin key for sending, settling, or cancelling payments. Do not put either key in `VITE_*` variables or browser code. The frontend calls the proxy endpoints `POST /payments`, `GET /payments/:checking_id`, `GET /payments/paginated`, `GET /payments/history`, and the documented payment stats routes.

## Backend boundary

The frontend client is prepared for these resource groups:

- `dashboard`, `users`, `jobs`, `applications`, and `confirmed-jobs`
- `posts`, `messages`, `notifications`, and `analytics`
- `access/roles`, `access/permissions`, and `payments`

The production backend should own JWT/OAuth sessions, MFA, RBAC enforcement, validation, rate limiting, CSRF protection, file scanning, audit logging, PostgreSQL persistence, Redis-backed queues, object storage, and payment-provider secrets. No payment or authentication secret belongs in this frontend.

## Product surfaces

Dashboard, job moderation, application lifecycle management, confirmed contracts, community posts, users and KYC, payment operations, access control, analytics, settings, role switching, notifications, and secure messaging are available from the sidebar. Local interactions are intentionally explicit and can be replaced by the API client as services are implemented.