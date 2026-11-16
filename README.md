# Nagar Mitra

**Your City. Your Voice. A Better Tomorrow.**

A community civic issue reporting and analytics platform for Kalyan, Maharashtra, India.

> ⚠️ **Disclaimer:** This is an independent student-developed prototype. It is NOT officially connected to KDMC or any government department. Submitting a report does not guarantee that the municipal corporation will take action.

---

## Problem Statement

Residents of Kalyan face daily civic problems — broken roads, water leakage, garbage accumulation, faulty streetlights and blocked drains. There is no centralized, easy-to-use digital platform for citizens to report these issues with location data, photographs and tracking capability.

## Objectives

1. Provide a simple platform for citizens to report civic issues with photos and location
2. Enable administrators to review, manage and track reported issues
3. Visualize community issues on an interactive map
4. Identify problem hotspots through clustering analysis
5. Present analytics through charts for data-driven decision-making

---

## Five Issue Categories

| # | Category | Icon | Description |
|---|----------|------|-------------|
| 1 | **Water Problems** | 💧 | Water supply, leakage, low pressure, broken pipelines |
| 2 | **Waste Management** | 🗑️ | Garbage accumulation, overflowing bins, illegal dumping |
| 3 | **Road Problems** | 🚧 | Potholes, damaged roads, broken footpaths |
| 4 | **Electricity Problems** | ⚡ | Streetlights, exposed wires, power supply issues |
| 5 | **Gutter & Drainage** | 🌊 | Blocked gutters, waterlogging, damaged covers |

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + JavaScript |
| Routing | React Router v6 |
| Icons | Lucide React |
| Maps | Leaflet + React-Leaflet + OpenStreetMap |
| Charts | Chart.js + react-chartjs-2 |
| Backend/DB | Supabase (PostgreSQL, Auth, Storage, RLS) |
| Styling | CSS3 Custom Design System |
| Hosting | Vercel (free Hobby plan) |

---

## System Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│  React App  │────▶│  Supabase API    │────▶│  PostgreSQL  │
│  (Vite)     │     │  (Auth/Storage)  │     │  (RLS)       │
└─────────────┘     └──────────────────┘     └──────────────┘
       │                                            │
       ▼                                            ▼
┌─────────────┐                            ┌──────────────┐
│  Leaflet    │                            │  Storage     │
│  Maps       │                            │  (Photos)    │
└─────────────┘                            └──────────────┘
```

---

## Database Structure

### `profiles` — User accounts
- `id` (UUID, PK) — Links to Supabase auth user
- `full_name` (TEXT) — User's display name
- `role` (TEXT) — `citizen` or `admin`
- `created_at` (TIMESTAMP)

### `reports` — Civic issue reports
- `id` (UUID, PK), `reference_id` (TEXT, unique — e.g. NM-2026-0001)
- `citizen_id` (UUID, FK), `category`, `issue_type`, `title`, `description`
- `photo_path` (TEXT), `locality`, `latitude`, `longitude`
- `severity` (normal/high/urgent), `status` (submitted/under_review/in_progress/resolved/rejected)
- `created_at`, `updated_at`

### `report_updates` — Status change history
- `id` (UUID, PK), `report_id` (UUID, FK)
- `old_status`, `new_status`, `admin_note`, `updated_by`, `created_at`

---

## Main Features

### Citizen Features
- ✅ Register and login with email/password
- ✅ Submit civic issue reports with photo, location and description
- ✅ Select location by clicking on an interactive map
- ✅ Track submitted reports and view status timeline
- ✅ Dashboard with report summary and statistics

### Administrator Features
- ✅ Secure admin login with role-based access control
- ✅ Dashboard with report counts by status and category
- ✅ Full report management with filters, search and pagination
- ✅ Update report status with admin notes
- ✅ View report photos, locations and status history

### Map & Analytics
- ✅ Interactive community map centered on Kalyan
- ✅ Category-colored markers with popup details
- ✅ Category and status filters on map
- ✅ Charts: category, status, severity, timeline, top localities
- ✅ Hotspot detection (areas with 3+ reports in ~200m radius)

### Security
- ✅ Row Level Security on all database tables
- ✅ Citizens can only see their own reports
- ✅ Admin role verified at database level, not just frontend
- ✅ No service key exposed in frontend code
- ✅ Public map data served via security-definer function (no PII exposed)
- ✅ Storage policies restrict uploads to user's own folder

---

## Citizen Workflow

1. Register an account → Verify email → Login
2. Click "Report an Issue" → Select category and issue type
3. Enter title, description → Upload a photograph
4. Click on the map to select location → Enter locality name
5. Select severity → Submit report
6. Receive unique reference ID (NM-YYYY-NNNN)
7. Track report status on Dashboard or Track page

## Administrator Workflow

1. Login via Admin Login page → Verified against `profiles.role = 'admin'`
2. View Dashboard → See report counts, category breakdown
3. Open Report Management → Filter and search reports
4. Click a report → View full details, photo, location
5. Update status → Add admin note → Save
6. View Analytics → Charts and hotspot detection

---

## Installation & Local Development

### Prerequisites
- Node.js v18+ and npm
- A free Supabase account ([supabase.com](https://supabase.com))

### Steps

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd nagar-mitra

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# Edit .env and add your Supabase URL and anon key

# 4. Run locally
npm run dev
```

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the migration files in order:
   - `supabase/migrations/001_create_tables.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_storage.sql`
   - `supabase/migrations/004_seed_data.sql` (optional — demo data)
3. Go to **Settings → API** and copy:
   - Project URL → `VITE_SUPABASE_URL`
   - Anon/Public key → `VITE_SUPABASE_ANON_KEY`
4. Go to **Authentication → Settings** and enable email auth

### Creating an Admin Account

1. Register a normal account through the app
2. Go to Supabase → SQL Editor and run:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = 'YOUR_USER_UUID';
   ```
3. Find your user UUID in **Authentication → Users**

### Loading Demo Data

1. Register a test citizen account
2. Find the UUID in Supabase Auth → Users
3. Edit `004_seed_data.sql` — replace `REPLACE_WITH_CITIZEN_UUID` with the UUID
4. Run the script in SQL Editor

---

## Deployment (Vercel)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project from GitHub
3. Set environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy — Vercel will auto-detect Vite and build
5. The `vercel.json` handles SPA routing (React Router)

---

## Security Measures

| Measure | Implementation |
|---------|---------------|
| Authentication | Supabase Auth (email/password, no custom storage) |
| Authorization | Row Level Security on all tables |
| Admin Protection | `profiles.role` checked via DB function `is_admin()` |
| API Key Security | Only anon/public key in frontend; no service key |
| Data Privacy | Public map function returns limited fields only |
| File Upload | Type and size validation; uploads scoped to user folder |
| Input Validation | Client-side + database CHECK constraints |

---

## Testing Checklist

| # | Test | Status |
|---|------|--------|
| 1 | Citizen registration | ⬜ Not tested |
| 2 | Citizen login | ⬜ Not tested |
| 3 | Citizen logout | ⬜ Not tested |
| 4 | Invalid login attempt | ⬜ Not tested |
| 5 | Report submission (all fields) | ⬜ Not tested |
| 6 | Missing required fields validation | ⬜ Not tested |
| 7 | Invalid image type rejection | ⬜ Not tested |
| 8 | Oversized image rejection | ⬜ Not tested |
| 9 | Map location selection | ⬜ Not tested |
| 10 | Report saved to database | ⬜ Not tested |
| 11 | Reference ID generation | ⬜ Not tested |
| 12 | Citizen report tracking | ⬜ Not tested |
| 13 | Citizen can only see own reports | ⬜ Not tested |
| 14 | Admin login | ⬜ Not tested |
| 15 | Unauthorized admin access blocked | ⬜ Not tested |
| 16 | Admin status update | ⬜ Not tested |
| 17 | Status history displayed | ⬜ Not tested |
| 18 | Map markers displayed | ⬜ Not tested |
| 19 | Map category filters | ⬜ Not tested |
| 20 | Analytics charts render | ⬜ Not tested |
| 21 | Hotspot detection | ⬜ Not tested |
| 22 | Mobile responsiveness | ⬜ Not tested |
| 23 | Network failure handling | ⬜ Not tested |
| 24 | Production build success | ✅ Passed |

> Tests should be marked Passed only after actual testing with a connected Supabase instance.

---

## Limitations

1. This is a student prototype, not a production municipal system
2. No email notifications for status changes (could be added with Supabase Edge Functions)
3. No real-time updates (requires Supabase Realtime subscription)
4. Hotspot detection uses simple grid clustering, not advanced spatial analysis
5. No offline mode for areas with poor connectivity
6. Single admin role; no multi-tier admin hierarchy

## Future Improvements

1. Email/SMS notifications on status changes
2. Real-time report updates using Supabase Realtime
3. Multi-language support (Marathi, Hindi, English)
4. Progressive Web App (PWA) for offline access
5. Advanced hotspot analytics with heatmaps
6. PDF report generation for administrators
7. Public API for third-party integrations
8. Citizen feedback and satisfaction ratings

---

## Project Information

- **Project:** Class 12 Computer Science Exhibition
- **Category:** Community Civic Issue Reporting & Analytics
- **Location Focus:** Kalyan, Maharashtra, India
- **Built With:** React, Supabase, Leaflet, Chart.js

---

*Nagar Mitra — Your City. Your Voice. A Better Tomorrow.*
