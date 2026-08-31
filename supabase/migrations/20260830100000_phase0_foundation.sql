-- Phase 0 foundation schema from the RemoteWise spec.
-- Tables: companies, members, freelancers, contracts, milestones, invoices, standups.

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated, service_role;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users (id),
  name text not null,
  logo_url text,
  plan text not null default 'free' check (plan in ('free', 'growth', 'scale')),
  stripe_customer_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id),
  company_id uuid not null references public.companies (id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique (user_id, company_id)
);

create table if not exists public.freelancers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  user_id uuid references auth.users (id),
  email text not null,
  full_name text not null,
  country text,
  timezone text,
  hourly_rate numeric(10, 2),
  currency text not null default 'USD',
  stripe_account_id text,
  stripe_onboarded boolean not null default false,
  status text not null default 'active' check (status in ('active', 'inactive', 'invited')),
  created_at timestamptz not null default now()
);

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  freelancer_id uuid not null references public.freelancers (id) on delete cascade,
  type text not null check (type in ('NDA', 'MSA', 'SOW', 'ICA', 'Custom')),
  title text not null,
  body_html text not null,
  pdf_url text,
  status text not null default 'draft' check (status in ('draft', 'sent', 'signed', 'expired', 'cancelled')),
  signed_at timestamptz,
  signer_ip text,
  signer_name text,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references public.contracts (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  freelancer_id uuid not null references public.freelancers (id) on delete cascade,
  title text not null,
  description text,
  amount numeric(10, 2) not null,
  currency text not null default 'USD',
  due_date date,
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  freelancer_id uuid not null references public.freelancers (id) on delete cascade,
  milestone_id uuid references public.milestones (id),
  invoice_number text not null unique,
  amount numeric(10, 2) not null,
  currency text not null default 'USD',
  status text not null default 'pending' check (status in ('pending', 'approved', 'paid', 'failed', 'cancelled')),
  stripe_transfer_id text,
  pdf_url text,
  due_date date,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.standups (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  freelancer_id uuid not null references public.freelancers (id) on delete cascade,
  body text not null,
  video_url text,
  created_at timestamptz not null default now()
);

create index if not exists companies_owner_id_idx on public.companies (owner_id);
create index if not exists members_company_id_idx on public.members (company_id);
create index if not exists members_user_id_idx on public.members (user_id);
create index if not exists freelancers_company_id_idx on public.freelancers (company_id);
create index if not exists freelancers_status_idx on public.freelancers (status);
create index if not exists contracts_company_id_idx on public.contracts (company_id);
create index if not exists contracts_freelancer_id_idx on public.contracts (freelancer_id);
create index if not exists contracts_status_idx on public.contracts (status);
create index if not exists milestones_company_id_idx on public.milestones (company_id);
create index if not exists milestones_freelancer_id_idx on public.milestones (freelancer_id);
create index if not exists invoices_company_id_idx on public.invoices (company_id);
create index if not exists invoices_freelancer_id_idx on public.invoices (freelancer_id);
create index if not exists invoices_status_idx on public.invoices (status);
create index if not exists standups_company_id_idx on public.standups (company_id);
create index if not exists standups_freelancer_id_idx on public.standups (freelancer_id);

create or replace function private.user_is_company_member(cid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.members
    where company_id = cid
      and user_id = (select auth.uid())
  );
$$;

revoke all on function private.user_is_company_member(uuid) from public;
grant execute on function private.user_is_company_member(uuid) to authenticated, service_role;

alter table public.companies enable row level security;
alter table public.members enable row level security;
alter table public.freelancers enable row level security;
alter table public.contracts enable row level security;
alter table public.milestones enable row level security;
alter table public.invoices enable row level security;
alter table public.standups enable row level security;

create policy companies_member_select
  on public.companies for select
  using (private.user_is_company_member(id));

create policy companies_owner_insert
  on public.companies for insert
  with check (owner_id = (select auth.uid()));

create policy companies_member_update
  on public.companies for update
  using (private.user_is_company_member(id))
  with check (private.user_is_company_member(id));

create policy members_member_all
  on public.members for all
  using (private.user_is_company_member(company_id) or user_id = (select auth.uid()))
  with check (private.user_is_company_member(company_id) or user_id = (select auth.uid()));

create policy freelancers_company_or_self
  on public.freelancers for all
  using (
    private.user_is_company_member(company_id)
    or user_id = (select auth.uid())
  )
  with check (
    private.user_is_company_member(company_id)
    or user_id = (select auth.uid())
  );

create policy contracts_company_or_freelancer
  on public.contracts for all
  using (
    private.user_is_company_member(company_id)
    or freelancer_id in (
      select id from public.freelancers where user_id = (select auth.uid())
    )
  )
  with check (private.user_is_company_member(company_id));

create policy milestones_company_or_freelancer
  on public.milestones for all
  using (
    private.user_is_company_member(company_id)
    or freelancer_id in (
      select id from public.freelancers where user_id = (select auth.uid())
    )
  )
  with check (private.user_is_company_member(company_id));

create policy invoices_company_or_freelancer
  on public.invoices for all
  using (
    private.user_is_company_member(company_id)
    or freelancer_id in (
      select id from public.freelancers where user_id = (select auth.uid())
    )
  )
  with check (private.user_is_company_member(company_id));

create policy standups_company_or_freelancer
  on public.standups for all
  using (
    private.user_is_company_member(company_id)
    or freelancer_id in (
      select id from public.freelancers where user_id = (select auth.uid())
    )
  )
  with check (
    private.user_is_company_member(company_id)
    or freelancer_id in (
      select id from public.freelancers where user_id = (select auth.uid())
    )
  );
