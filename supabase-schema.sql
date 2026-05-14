create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.vitale_users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null default 'staff' check (role in ('owner', 'admin', 'manager', 'staff')),
  is_active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vitale_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.vitale_users(id) on delete cascade,
  session_token text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.vitale_appointments (
  id uuid primary key default gen_random_uuid(),
  patient_name text not null,
  appointment_date date not null,
  appointment_time time not null,
  duration_minutes integer not null check (duration_minutes > 0),
  category text not null,
  procedure_name text not null,
  notes text,
  status text not null default 'scheduled' check (status in ('scheduled', 'confirmed', 'cancelled', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vitale_patients (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  status text not null default 'ativo' check (status in ('ativo', 'inativo')),
  type text not null default 'particular',
  last_visit date,
  appointments_count integer not null default 0 check (appointments_count >= 0),
  total_spent numeric(12,2) not null default 0,
  source text not null default 'Site',
  avatar_url text,
  notes text,
  attachments jsonb not null default '[]'::jsonb,
  procedure_photos jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vitale_users_email_idx
  on public.vitale_users (lower(email));

create index if not exists vitale_sessions_token_idx
  on public.vitale_sessions (session_token);

create index if not exists vitale_sessions_user_id_idx
  on public.vitale_sessions (user_id);

create index if not exists vitale_appointments_date_time_idx
  on public.vitale_appointments (appointment_date, appointment_time);

create index if not exists vitale_patients_owner_id_idx
  on public.vitale_patients (owner_id);

create unique index if not exists vitale_patients_owner_email_idx
  on public.vitale_patients (owner_id, lower(email));

drop trigger if exists vitale_appointments_set_updated_at on public.vitale_appointments;
create trigger vitale_appointments_set_updated_at
before update on public.vitale_appointments
for each row
execute function public.set_updated_at();

drop trigger if exists vitale_patients_set_updated_at on public.vitale_patients;
create trigger vitale_patients_set_updated_at
before update on public.vitale_patients
for each row
execute function public.set_updated_at();

drop trigger if exists vitale_users_set_updated_at on public.vitale_users;
create trigger vitale_users_set_updated_at
before update on public.vitale_users
for each row
execute function public.set_updated_at();

alter table public.vitale_users enable row level security;
alter table public.vitale_sessions enable row level security;

drop policy if exists "service role manages users" on public.vitale_users;
create policy "service role manages users"
on public.vitale_users
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "service role manages sessions" on public.vitale_sessions;
create policy "service role manages sessions"
on public.vitale_sessions
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

alter table public.vitale_appointments enable row level security;
alter table public.vitale_patients enable row level security;

drop policy if exists "service role manages appointments" on public.vitale_appointments;
create policy "service role manages appointments"
on public.vitale_appointments
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

drop policy if exists "users can manage own patients" on public.vitale_patients;
create policy "users can manage own patients"
on public.vitale_patients
for all
using (owner_id = auth.uid())
with check (owner_id = auth.uid());
