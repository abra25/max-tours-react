-- STEP 1: Run in Supabase SQL Editor after creating the Admin user in
-- Authentication > Users (use an email + a NEW strong password).
-- Does not alter packages, bookings, or Storage policies.
-- Run this first, then replace the placeholder UUID in the FINAL statement.

begin;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Nobody should query or write this membership table from the browser.
revoke all on public.admin_users from PUBLIC, anon, authenticated;

-- Supabase dashboard SQL editor normally creates this function as postgres.
-- It reads ONLY the membership for the current authenticated user.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users a
    where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from PUBLIC, anon, authenticated;
grant execute on function public.is_admin() to authenticated;

commit;

-- Run this separately after replacing the UUID with the admin Auth User ID:
-- insert into public.admin_users(user_id)
-- values ('REPLACE_WITH_ADMIN_AUTH_USER_UUID'::uuid)
-- on conflict (user_id) do nothing;
--
-- Verification (must return true only when called with that user's JWT,
-- e.g. after logging in from the frontend): public.is_admin().
