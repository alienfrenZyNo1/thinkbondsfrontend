# Manual Testing & Demo Guide

This guide helps you manually verify the app end‑to‑end using the built‑in mock data and role simulation. It’s designed for demos and for validating all major workflows without external services.

## Prerequisites

- Node.js 18+ and npm (or pnpm)
- Clone the repo and install dependencies: `npm install`

## Environment Setup

Create `.env.local` in the project root with:

```
NEXTAUTH_SECRET=devsecret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_E2E=true
USE_MOCK=true
```

Notes:
- `USE_MOCK=true` makes the Next.js API routes return deterministic mock data.
- `NEXT_PUBLIC_E2E=true` enables a lightweight role simulation for demos (see Role Simulation).
- Keep `NEXTAUTH_*` values as shown for local demos (no external IdP required).

## Run the App (Production‑like)

- Build: `npm run build`
- Start: `npm run start`
- App will be available at `http://localhost:3000`

Alternatively (for quicker iteration): `npm run dev` (Turbopack dev server).

## Role Simulation (No Real Login Needed)

With `NEXT_PUBLIC_E2E=true`, protected pages treat an `e2e-role` cookie as authenticated. Set it from the browser console on any page:

```
// Set role (choose one): admin, broker, agent, policyholder, wholesale
document.cookie = 'e2e-role=admin; path=/'; location.reload();

// Clear role
document.cookie = 'e2e-role=; Max-Age=0; path=/'; location.reload();
```

Tip: You can keep multiple bookmarks in your browser with these commands for fast switching during a demo.

## High‑Level Workflows

The app comes with mock data and complete screens for Brokers, Policyholders, Proposals, Offers, Bonds, soft‑delete bins, and history pages. Below are demo scripts by user role.

### 1) Public/Unauthenticated

- Access Request: `http://localhost:3000/access/request`
  - Fill the email/country form and submit; observe success messaging.
- Broker Registration: `http://localhost:3000/broker/register`
  - Walk through access code request → PIN verify → registration form; mock responses drive success states.
- Offer Acceptance (Public Link): `http://localhost:3000/accept/demo-token`
  - Enter OTP code `123456` (happy path).
  - The flow validates OTP via `/api/bonds/accept/validate-otp` and shows offer/policyholder/beneficiary details.
  - Try an invalid OTP to see error state, then correct it to proceed.

### 2) Admin

Set role: `e2e-role=admin`

- Dashboard: `http://localhost:3000/dashboard`
  - Shows role‑aware content and links.
- Brokers
  - List: `http://localhost:3000/brokers`
  - Detail: `http://localhost:3000/brokers/1`
  - History: `http://localhost:3000/brokers/1/history`
  - Bin: `http://localhost:3000/brokers/bin` (restore actions available)
- Policyholders
  - List: `http://localhost:3000/policyholders`
  - Detail: `http://localhost:3000/policyholders/1`
  - History: `http://localhost:3000/policyholders/1/history`
  - Bin: `http://localhost:3000/policyholders/bin`
- Proposals
  - List: `http://localhost:3000/proposals`
  - Detail: `http://localhost:3000/proposals/1`
  - History: `http://localhost:3000/proposals/1/history`
  - Bin: `http://localhost:3000/proposals/bin`
- Offers
  - Detail: `http://localhost:3000/offers/1`
  - History: `http://localhost:3000/offers/1/history`
  - Bin: `http://localhost:3000/offers/bin`
- Bonds
  - Detail: `http://localhost:3000/bonds/1`
  - History: `http://localhost:3000/bonds/1/history`
  - Bin: `http://localhost:3000/bonds/bin`
- Wholesaler Settings: `http://localhost:3000/settings/wholesaler`

Admin can access all pages. Use bin pages to demo soft‑delete and restore flows; history pages show edit events.

### 3) Broker

Set role: `e2e-role=broker`

- Proposals
  - List, open a proposal, review sections: `http://localhost:3000/proposals` → open any item.
  - New proposal wizard: `http://localhost:3000/proposals/new`
    - Walk through steps; form validation and draft persistence are in place.
    - Note: Full submission may be partially mocked; treat as a UI demo for now.
- Policyholders
  - List and detail pages available with mock Creditsafe data.

### 4) Wholesaler

Set role: `e2e-role=wholesale`

- Wholesaler Settings: `http://localhost:3000/settings/wholesaler`
  - Review due diligence, underwriting, bond limits, automation settings.
- Issue Offer for a Proposal
  - Navigate to a proposal detail: `http://localhost:3000/proposals/1`
  - Create Offer: `http://localhost:3000/proposals/1/offer`
  - Fill amount/premium/terms and submit; success message indicates email/OTP would be sent.
- Acceptance Demo (Public)
  - Share `http://localhost:3000/accept/demo-token` and OTP `123456` to show the acceptance flow without authentication.

### 5) Agent

Set role: `e2e-role=agent`

- Read‑only access to core entities (e.g., Proposals, Policyholders) where permitted.
- Attempt to navigate to wholesaler/admin pages to see access restrictions.

### 6) Policyholder

Set role: `e2e-role=policyholder`

- Limited access to related entities; attempt navigating to Brokers/Wholesaler pages to demo RBAC restrictions.
- Use the public acceptance link to showcase actioning an offer with the OTP code.

## Soft‑Delete & Restore

- Open any bin page (e.g., `.../policyholders/bin`, `.../proposals/bin`, `.../offers/bin`).
- Use the Restore action; a success toast should appear and the item returns to the main list.

## Edit History

- For supported entities (Policyholders, Proposals, Offers, Brokers, Bonds), open the corresponding `.../history` page.
- Review timestamped actions (e.g., Created, Updated, Accepted, Soft deleted).

## Acceptance Flow Details

- Public URL: `/accept/[token]` — any token string works with mocks (e.g., `/accept/demo-token`).
- OTP: enter `123456` to pass validation.
- On success, the flow shows offer details and parties involved.
- Invalid OTP shows an error; correct it to continue.

## Common Troubleshooting

- If protected pages show “Authentication Required”, ensure:
  - `NEXT_PUBLIC_E2E=true` in `.env.local` and the server restarted.
  - The `e2e-role` cookie is set (see Role Simulation).
- If lists appear empty, confirm `USE_MOCK=true` is set and the server restarted after changing env vars.
- Dev overlay intercepts: In this repo, pointer events for the overlay are disabled; use production mode (`npm run build && npm start`) for demos to avoid dev quirks.

## Quick Demo Script (10–12 minutes)

1) Public Access Request and Registration (1–2 min)
   - `/access/request`, `/broker/register`
2) Role Switch: Admin (1 min)
   - `e2e-role=admin`, open Dashboard, Brokers/Policyholders/Proposals lists
3) Soft‑Delete Bin + Restore (1 min)
   - Open a bin page; restore an item
4) Edit History (1 min)
   - Open a history page and show entries
5) Role Switch: Wholesaler (2–3 min)
   - Settings page; create an offer for a proposal
6) Public Acceptance (2–3 min)
   - `/accept/demo-token`, OTP `123456`, success view
7) Role Switch: Broker/Agent/Policyholder (2–3 min)
   - Show RBAC restrictions and allowed views

