# Flexicare Production Dashboard

React 19 + TypeScript + Vite 8 interface for production monitoring and engineering operations.

## Main screens

- Dashboard overview
- Manufacturing Floor
- Assembly Floor
- Supervisor
- Analytics
- Settings

The application uses Firebase SDK, Recharts, Tailwind CSS and related UI libraries. Check `src/` for current integration details and implementation status.

## Local development

```bash
npm install
npm run dev
```

Vite displays the local development URL (typically `http://localhost:5173`).

## Quality checks

```bash
npm run lint
npm run build
```

The build command runs `tsc -b && vite build`. Use `npm run preview` to inspect the generated build.

## Structure

- `src/App.tsx` — navigation and selected screen rendering
- `src/pages/` — page implementations
- `src/components/` — reusable UI
- `public/` — static assets

## Deployment and security

- Set Firebase public client configuration through your chosen Vite environment settings. Firebase API keys on the client are not security boundaries; enforce access using Firebase security rules and server permissions.
- Do not commit Wi-Fi passwords, service account keys, admin private keys or other secrets.
- Verify data paths, account permissions, factory network access and offline behavior before deployment.
- The current repository has an empty tracked `.env`; do not add real values to it.

This README change does not claim that production connectivity or test execution has been verified.
