# ⚡ SpendPulse — Smart Salary & Budget PWA Tracker

A mobile-first, privacy-first Progressive Web Application (PWA) designed to solve the common youngster dilemma: *"Salary arrives, and after two days it completely vanishes."*

SpendPulse tracks every rupee, distinguishes between Online (UPI, Cards, Net Banking) and Cash outflows, flags impulsive/unplanned salary leaks, and syncs across all devices with enterprise-grade Row-Level Security (RLS).

---

## ✨ Features

- **📱 Mobile PWA Ready**: Installable directly on iOS (Safari Add to Home Screen) and Android (Chrome Install App) with offline caching and standalone app mode.
- **🛡️ Row-Level Security (RLS) & Private Cloud Vault**: Powered by Supabase PostgreSQL. Every record is cryptographically isolated (`auth.uid() = user_id`). Even database administrators or other users cannot view or tamper with your finances.
- **👀 Guest Preview Mode**: Visitors can explore the dashboard, interactive charts, and month navigation in read-only mode. Any attempt to add/edit data prompts Email Authentication to secure their personal vault.
- **🔄 Multi-Month Timeline**: Seamlessly browse your budget history starting from your join month (October 2026) to future planning cycles (November, December 2026).
- **💳 Payment Channel Breakdown**: Granular categorization between **Cash** and **Online** payments (UPI, Debit Card, Credit Card, Net Banking).
- **🚨 Unplanned Impulse Guilt-Meter**: Tag spontaneous expenditures to visualize real-time salary leakage before your pay runs dry.
- **🎨 Pitch-Black OLED Dark Mode & Crisp Light Theme**: Tailored contrast with no muddy green/blue washes.
- **💾 Full Data Ownership**: 1-click JSON backup export/import and CSV spreadsheet download.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Start Vite local server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🗄️ Setting Up Production Cloud Storage (Supabase)

In production, your data lives in a free, hosted PostgreSQL database with Supabase.

1. Create a free account at [supabase.com](https://supabase.com).
2. Create a new project (e.g. `spendpulse`).
3. In the left navigation, go to **SQL Editor** -> **New Query**.
4. Copy and paste the contents of [`supabase_schema.sql`](./supabase_schema.sql) and click **Run**.
   - This creates the `categories`, `income_sources`, `expenses`, and `incomes` tables.
   - It automatically enables **Row-Level Security (RLS)** so each email user only ever accesses their own data.
5. In Supabase, go to **Project Settings** -> **API**:
   - Copy **Project URL**
   - Copy **anon public key**
6. Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
7. Restart your dev server (`npm run dev`). Your app is now syncing live with the cloud!

---

## 🐙 Pushing to GitHub

To push this codebase to your GitHub account:

1. Go to [github.com/new](https://github.com/new) and create a new repository named `budget-tracker` (keep it Public or Private, do **not** check "Initialize with README").
2. Run the following commands in your terminal:

```bash
# Stage all files
git add .

# Create the initial commit
git commit -m "Initial commit: SpendPulse PWA budget tracker"

# Link your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/<YOUR_USERNAME>/budget-tracker.git

# Push code to GitHub
git branch -M main
git push -u origin main
```

---

## 🌐 Deploying Online (Free on Vercel)

1. Sign up / Log in to [vercel.com](https://vercel.com) using your GitHub account.
2. Click **Add New Project** and select your `budget-tracker` GitHub repository.
3. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = (Your Supabase URL)
   - `VITE_SUPABASE_ANON_KEY` = (Your Supabase Anon Key)
4. Click **Deploy**. In under 60 seconds, your app is live on a global HTTPS URL!

---

## 🔒 Security Architecture (Row-Level Security)

```
[User Browser / Mobile Device]
              │
              ▼ (HTTPS + JWT Bearer Token)
     [Supabase Auth Engine]
              │
              ▼ (PostgreSQL Kernel)
  ┌──────────────────────────────────────────────┐
  │  RLS Policy: auth.uid() = user_id            │
  │  ──────────────────────────────────────────  │
  │  User A can ONLY read/write User A's rows    │
  │  User B can ONLY read/write User B's rows    │
  │  Unauthenticated requests are denied write   │
  └──────────────────────────────────────────────┘
```
