-- ==============================================================================
-- SpendPulse: Supabase Database Schema & Row-Level Security (RLS) Setup
-- ==============================================================================
-- Instructions:
-- 1. Go to https://supabase.com and create a free project.
-- 2. In your Supabase dashboard, click "SQL Editor" in the left navigation.
-- 3. Click "New query", paste this entire script, and click "Run".
-- 4. In "Project Settings" -> "API", copy your "Project URL" and "anon public" key.
-- 5. Paste them into your .env file or Vercel Environment Variables:
--    VITE_SUPABASE_URL=https://your-project-id.supabase.co
--    VITE_SUPABASE_ANON_KEY=your-anon-public-key
-- ==============================================================================

-- 1. Categories Table
create table if not exists public.categories (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  type text not null default 'expense' check (type in ('expense', 'savings')),
  color text not null default '#10b981',
  icon text not null default 'Tag',
  budget_limit numeric default 0,
  created_at timestamptz default now()
);

-- 2. Income Sources Table
create table if not exists public.income_sources (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  expected_monthly numeric default 0,
  color text not null default '#10b981',
  icon text not null default 'Wallet',
  created_at timestamptz default now()
);

-- 3. Expenses Table
create table if not exists public.expenses (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  amount numeric not null check (amount > 0),
  category_id text references public.categories(id) on delete set null,
  date date not null,
  payment_mode text not null check (payment_mode in ('Cash', 'Online')),
  online_subtype text check (online_subtype in ('UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Bank Transfer', null)),
  is_unplanned boolean default false,
  notes text,
  created_at timestamptz default now()
);

-- 4. Incomes Table
create table if not exists public.incomes (
  id text primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  source_id text references public.income_sources(id) on delete set null,
  amount numeric not null check (amount > 0),
  date date not null,
  notes text,
  created_at timestamptz default now()
);

-- ==============================================================================
-- 5. Enable Row-Level Security (RLS) on all tables
-- This ensures users can ONLY see, edit, and delete their OWN rows.
-- ==============================================================================
alter table public.categories enable row level security;
alter table public.income_sources enable row level security;
alter table public.expenses enable row level security;
alter table public.incomes enable row level security;

-- Categories RLS Policies
create policy "Users can view own categories"
  on public.categories for select
  using (auth.uid() = user_id);

create policy "Users can insert own categories"
  on public.categories for insert
  with check (auth.uid() = user_id);

create policy "Users can update own categories"
  on public.categories for update
  using (auth.uid() = user_id);

create policy "Users can delete own categories"
  on public.categories for delete
  using (auth.uid() = user_id);

-- Income Sources RLS Policies
create policy "Users can view own income sources"
  on public.income_sources for select
  using (auth.uid() = user_id);

create policy "Users can insert own income sources"
  on public.income_sources for insert
  with check (auth.uid() = user_id);

create policy "Users can update own income sources"
  on public.income_sources for update
  using (auth.uid() = user_id);

create policy "Users can delete own income sources"
  on public.income_sources for delete
  using (auth.uid() = user_id);

-- Expenses RLS Policies
create policy "Users can view own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);

create policy "Users can delete own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

-- Incomes RLS Policies
create policy "Users can view own incomes"
  on public.incomes for select
  using (auth.uid() = user_id);

create policy "Users can insert own incomes"
  on public.incomes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own incomes"
  on public.incomes for update
  using (auth.uid() = user_id);

create policy "Users can delete own incomes"
  on public.incomes for delete
  using (auth.uid() = user_id);
