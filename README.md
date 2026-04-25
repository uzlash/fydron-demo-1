# Fydron demo UI

Front-end demo of a Fydron-style compliance platform: dashboard, matrix (audit portfolio), client portfolio, billing, export center, partner assets, and settings. **There is no real backend.** Authentication and all business data are **client-side mocks** for presentation and navigation demos.

**Visual polish (colors, tokens, Tailwind, safe boundaries):** see [README-CSS-FINETUNE.md](./README-CSS-FINETUNE.md).

---

## Prerequisites

- **Node.js 20 LTS** (recommended; aligns with `@types/node` in this repo).
- **npm** (this repo includes `package-lock.json`; use `npm install` / `npm run …`).

---

## Local development

1. Clone the repository and open the project root.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000). The home route redirects to `/auth/login`.

### Demo login

Valid accounts are defined in [`src/features/auth/demo-accounts.ts`](src/features/auth/demo-accounts.ts):

| Login (case-insensitive) | Password |
|--------------------------|----------|
| `Michael` or `michael@fydron.com` | `demo` |
| `Bram` or `bram@fydron.com` | `demo` |

The first field accepts a **short name or** the demo email; there is no HTML email validation on the login form (see [`demo-accounts.ts`](src/features/auth/demo-accounts.ts)).

After a successful sign-in, the app stores a small user object in **`localStorage`** under the key `fydron-demo-user` and navigates to `/dashboard`.

### Session gate (important for new developers)

[`src/components/demo-session-gate.tsx`](src/components/demo-session-gate.tsx) wraps the app (via [`src/components/providers.tsx`](src/components/providers.tsx)):

- Routes under **`/auth/*`** (and `/`, which redirects to login) are reachable without a session.
- **All other routes** require a demo user in `localStorage`. If missing, you are redirected to `/auth/login`.
- There is a short **loading** state while the session is read from storage; see comments in the gate for the race between navigation and React state after sign-in.

### Scripts

| Command        | Description                |
|----------------|----------------------------|
| `npm run dev`  | Next.js development server |
| `npm run build`| Production build           |
| `npm run start`| Run production build locally |
| `npm run lint` | ESLint                     |

### Static assets

Sample files for document previews live under [`public/`](public/), including `sample-pdf.pdf` and `sample-docx.docx`. Paths and PDF vs DOCX behavior are wired through [`src/lib/sample-documents.ts`](src/lib/sample-documents.ts) and the preview components under [`src/components/`](src/components/).

---

## Deployment

This is a standard **Next.js** application (not a static export by default).

1. **Build:** `npm run build`
2. **Run:** `npm run start` (serves on port 3000 unless `PORT` is set)

**Hosting (e.g. Vercel):** use the Next.js preset; install command `npm install`, build `npm run build`, output handled by the platform. [`next.config.ts`](next.config.ts) is minimal.

**Environment variables:** the codebase does not use `process.env` for runtime configuration today. If you add env vars later, document them here.

**Static export:** not configured. Adding `output: 'export'` would require an explicit migration and is out of scope for the current demo.

---

## Tech stack

| Layer        | Technology |
|-------------|------------|
| Framework   | Next.js 16 (App Router), React 19 |
| Language    | TypeScript |
| Styling     | Tailwind CSS v4 ([`src/app/globals.css`](src/app/globals.css)) |
| UI library  | Fluent UI React v9 (`@fluentui/react-components`, `@fluentui/react-theme`) |
| Icons       | `@fluentui/react-icons` |
| Data client | `@tanstack/react-query` (e.g. simulated mutations on some auth flows) |
| DOCX preview| `mammoth` (HTML conversion in the browser) |

---

## Folder structure

| Path | Role |
|------|------|
| [`src/app/`](src/app/) | App Router: `page.tsx`, `layout.tsx`, route segments only. Pages stay thin and import feature screens. |
| [`src/features/`](src/features/) | Domain UI and logic: `auth`, `dashboard`, `matrix`, `client-portfolio`, `billing`, `partner-assets`, `export`, `settings`. |
| [`src/components/`](src/components/) | Shared UI: providers, session gate, app shell, drawers, document previews. |
| [`src/i18n/`](src/i18n/) | [`translations.ts`](src/i18n/translations.ts) (strings) and [`locale-context.tsx`](src/i18n/locale-context.tsx) (locale + `useLocale()`). |
| [`src/lib/`](src/lib/) | Small demo helpers shared across features (e.g. demo hrefs, attachment kinds). |
| [`public/`](public/) | Static files served as-is. |

---

## Route map

| URL | Notes |
|-----|--------|
| `/` | Redirects to `/auth/login`. |
| `/auth` | Internal **auth demo hub** (links to login, MFA, profile variants, etc.); useful for QA, not an end-user screen. |
| `/auth/login` | Demo login. |
| `/auth/forgot-password` | Simulated forgot password. |
| `/auth/mail-sent` | Post–forgot-password state. |
| `/auth/mfa` | MFA demo step. |
| `/auth/create-password` | Create password flow. |
| `/auth/password-success` | Confirmation. |
| `/auth/profile` | Profile form demo. |
| `/dashboard` | Main dashboard (requires session). |
| `/matrix` | Matrix portfolio list. |
| `/matrix/[dossierId]` | Matrix dossier workspace (e.g. reviewer / contributor views by query or data). |
| `/client-portfolio` | Client list. |
| `/client-portfolio/[clientId]` | Client profile. |
| `/client-portfolio/[clientId]/dossier/[dossierId]` | Dossier / turbo dossier demo. |
| `/client-portfolio/[clientId]/dossier/[dossierId]/auditor-turbo-view` | Auditor “turbo” layout. |
| `/billing-subscriptions` | Billing demo. |
| `/export-center` | Export center. |
| `/partner-assets` | Partner org list. |
| `/partner-assets/[orgId]` | Partner client view. |
| `/settings` | Settings (profile, notifications, security). |
| `/settings/support` | Support settings. |

---

## Fluent UI (v9) usage — overview

Integration is centralized in [`src/components/providers.tsx`](src/components/providers.tsx): **`FluentProvider`** wraps the tree with a **`webLightTheme`**-based theme extended for Fydron brand blues (`#0070C0`). Icons come from **`@fluentui/react-icons`**.

For an **exhaustive** list of imports, search the repo:

```bash
rg 'from "@fluentui/react-components"' src
```

**Compat package:** **`@fluentui/react-datepicker-compat`** — `DatePicker` is used in [`src/features/matrix/components/matrix-portfolio-table.tsx`](src/features/matrix/components/matrix-portfolio-table.tsx).

### By feature area (representative primitives)

| Area | Typical Fluent components | Where to look |
|------|---------------------------|---------------|
| **App shell** | `FluentProvider`, `Spinner` | [`providers.tsx`](src/components/providers.tsx), [`demo-session-gate.tsx`](src/components/demo-session-gate.tsx) |
| **Auth** | `Button`, `Field`, `Input`, `Spinner`, `Text` | [`src/app/auth/`](src/app/auth/), [`src/features/auth/components/`](src/features/auth/components/) |
| **Dashboard** | `Text`, `Spinner`, `Button`, `Input`, `Card`, `Checkbox`, `Avatar`, `Popover` + surfaces | [`dashboard-screen.tsx`](src/features/dashboard/dashboard-screen.tsx), [`components/`](src/features/dashboard/components/) |
| **Matrix** | `Checkbox`, `Button`, `Field`, `Input`, `Select`, `Textarea`, `Menu`/`MenuItem`/`MenuTrigger`/`MenuPopover`/`MenuList`, `SplitButton`, `DatePicker` (compat) | [`matrix-dossier-screen.tsx`](src/features/matrix/matrix-dossier-screen.tsx), [`components/`](src/features/matrix/components/) |
| **Client portfolio** | Same families as matrix for tables, drawers, dialogs; `Switch`, `Textarea` in profile tabs | [`src/features/client-portfolio/`](src/features/client-portfolio/) |
| **Billing** | `Spinner`, `Text` | [`billing-screen.tsx`](src/features/billing/billing-screen.tsx) |
| **Partner assets** | `Button`, `Input`, `Text` | [`partner-assets-*-screen.tsx`](src/features/partner-assets/) |
| **Export** | `Button`, `Field`, `Input`, `Spinner` | [`export-center-screen.tsx`](src/features/export/export-center-screen.tsx) |
| **Settings** | `Dialog` (+ body/title/surface/actions), `Avatar`, `Button`, `Switch`, `Field`, `Input`, `Text`, `Card` | [`settings-screen.tsx`](src/features/settings/settings-screen.tsx), [`support-settings-screen.tsx`](src/features/settings/support-settings-screen.tsx) |

Some “modal” or “drawer” UIs use **custom layout** (fixed panels, Tailwind) rather than Fluent `Dialog`; Fluent is still used for buttons and fields inside them.

---

## Hardcoded and mock data

| What | File | Update when |
|------|------|-------------|
| Dashboard dossiers, stats, notifications, sidebar bits | [`src/features/dashboard/mock-data.ts`](src/features/dashboard/mock-data.ts) | Changing home dashboard content |
| Matrix / portfolio / dossier demo rows | [`src/features/matrix/mock-data.ts`](src/features/matrix/mock-data.ts) | Matrix tables and dossier state |
| Client portfolio rows, profiles, dossiers | [`src/features/client-portfolio/mock-data.ts`](src/features/client-portfolio/mock-data.ts) | Client list and profile data |
| Turbo dossier evidence / file list constants | [`src/features/client-portfolio/turbo-dossier-constants.ts`](src/features/client-portfolio/turbo-dossier-constants.ts) | Auditor turbo right column filenames |
| Billing rows | [`src/features/billing/mock-data.ts`](src/features/billing/mock-data.ts) | Invoice table |
| Partner org list | [`src/features/partner-assets/mock-data.ts`](src/features/partner-assets/mock-data.ts) | Partner assets walkthrough |
| Role-based **navigation targets** from dossier/matrix rows | [`src/lib/dossier-demo-hrefs.ts`](src/lib/dossier-demo-hrefs.ts) | Where “Auditor” vs other roles navigate |
| Evidence id → PDF vs DOCX | [`src/lib/sample-documents.ts`](src/lib/sample-documents.ts) | Attachment type demo |
| **All user-visible copy** (EN) | [`src/i18n/translations.ts`](src/i18n/translations.ts) | Headings, labels, toasts, page text |

**Copy vs data:** Prefer **`translations.ts`** for strings that are purely presentation. Use **`mock-data.ts`** (and related types under each feature) for entities shown in tables and drawers.

---

## Deviations from Figma (documented)

These are intentional or structural differences called out in code or architecture:

| Topic | Reason |
|-------|--------|
| **Brand color** | Fluent theme tokens overridden for Fydron `#0070C0` in [`providers.tsx`](src/components/providers.tsx). |
| **Typography** | [`src/app/layout.tsx`](src/app/layout.tsx) loads **Geist** via `next/font/google`; Figma may reference Segoe UI—align fonts if pixel-perfect match is required. |
| **Role chips (dashboard)** | Comment in [`dossiers-table.tsx`](src/features/dashboard/components/dossiers-table.tsx) describes Fydron V2 role colors. |
| **Matrix portfolio chips** | Comment in [`matrix-portfolio-table.tsx`](src/features/matrix/components/matrix-portfolio-table.tsx). |
| **Matrix reviewer** | Inspection and “under review” share one compact assessment drawer pattern; see [`matrix-reviewer-panel.tsx`](src/features/matrix/components/matrix-reviewer-panel.tsx). |
| **Auditor turbo center** | Layout notes in [`auditor-turbo-view-screen.tsx`](src/features/client-portfolio/auditor-turbo-view-screen.tsx). |
| **Billing mock** | Simplified invoice id column pattern; see comment in [`billing/mock-data.ts`](src/features/billing/mock-data.ts). |
| **Document previews** | PDF via **blob URL** + `iframe`; DOCX via **mammoth** → HTML—not a production document viewer. |

---

## Known demo shortcuts (transparent)

- **No API:** All data is in-memory or from the mock modules above.
- **Session:** `localStorage` key `fydron-demo-user`; not secure and not multi-tab–aware beyond storage events implicit in normal use.
- **Login:** Password check is client-side only (`demo` + allowed login ids in [`demo-accounts.ts`](src/features/auth/demo-accounts.ts)).
- **PDF:** Fetched and shown via blob URL to avoid some browsers treating raw URLs as downloads.
- **DOCX:** HTML conversion will not match Word pixel-perfect.

Non-obvious client logic is commented in places such as [`demo-session-gate.tsx`](src/components/demo-session-gate.tsx) (hydration / redirect timing). UI copy and code comments are in **English**.

---

## Contributing / transfer

Keep new demo data and strings in the locations above. Prefer extending **`translations.ts`** and feature **`mock-data.ts`** files rather than hardcoding long strings inside components. For styling-only work, follow [README-CSS-FINETUNE.md](./README-CSS-FINETUNE.md).
