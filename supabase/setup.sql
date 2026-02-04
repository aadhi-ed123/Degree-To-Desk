-- Supabase DB setup for Degree To Desk

-- 1) enable helper extension
create extension if not exists "pgcrypto";

-- 2) Profiles table (connected to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  role text,
  created_at timestamptz default now()
);

-- 3) Jobs table
create table if not exists public.jobs (
  id uuid default gen_random_uuid() primary key,
  company text not null,
  title text not null,
  type text,
  location text,
  salary text,
  departments text[],
  skills text[],
  description text,
  deadline date,
  created_at timestamptz default now()
);

-- 4) Applications table
create table if not exists public.applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  job_id uuid references public.jobs(id) on delete set null,
  name text,
  email text,
  phone text,
  department text,
  year smallint,
  cgpa numeric,
  backlogs smallint,
  status text default 'pending',
  created_at timestamptz default now()
);

-- 5) Useful indexes
create index if not exists idx_applications_user_id on public.applications(user_id);
create index if not exists idx_applications_job_id on public.applications(job_id);

-- 6) View joining applications + job + profile details
create or replace view public.vw_applications_details as
select
  a.id,
  a.user_id,
  p.full_name as applicant_name,
  p.role as applicant_role,
  a.job_id,
  j.title as job_title,
  j.company,
  a.status,
  a.created_at
from public.applications a
left join public.jobs j on j.id = a.job_id
left join public.profiles p on p.id = a.user_id;

-- 7) Row Level Security (policies) - enable RLS and add basic policies

-- Profiles: only the authenticated user can insert/select their profile
alter table public.profiles enable row level security;

create policy if not exists profiles_insert_auth on public.profiles
  for insert using (auth.uid() = id) with check (auth.uid() = id);

create policy if not exists profiles_select_owner on public.profiles
  for select using (auth.uid() = id);

-- Applications: users can insert their own applications and select only theirs
alter table public.applications enable row level security;

create policy if not exists applications_insert_auth on public.applications
  for insert with check (auth.uid() = user_id);

create policy if not exists applications_select_owner on public.applications
  for select using (auth.uid() = user_id);

-- Admins: allow users with role='admin' (from profiles) to select all applications
create policy if not exists applications_select_admin on public.applications
  for select using (
    exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Example test data insert (optional)
-- insert into public.jobs (company, title, type, location, salary, departments, skills, description, deadline) values ('ExampleCo', 'Intern', 'internship', 'Remote', '₹50,000/month', '{CSE,IT}', '{JavaScript,React}', 'Test job', '2026-03-01');
