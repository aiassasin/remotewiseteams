-- v2.1: settings persistence, invoice cancel/profile fields, activity, support.

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  headline text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  settings_tab text not null default 'profile',
  notify_invoice_paid boolean not null default true,
  notify_contract_signed boolean not null default true,
  notify_payout_sent boolean not null default true,
  notify_weekly_digest boolean not null default false,
  notify_product_updates boolean not null default true,
  deletion_requested_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.companies
  add column if not exists y_tunnus text,
  add column if not exists vat_id text,
  add column if not exists address_line1 text,
  add column if not exists address_line2 text,
  add column if not exists city text,
  add column if not exists postal_code text,
  add column if not exists country text default 'FI';

alter table public.freelancers
  add column if not exists tax_residency text,
  add column if not exists vat_id text,
  add column if not exists address_line1 text,
  add column if not exists address_city text,
  add column if not exists address_postal_code text,
  add column if not exists address_country text,
  add column if not exists bank_iban text,
  add column if not exists bank_name text,
  add column if not exists default_client_name text,
  add column if not exists default_client_email text,
  add column if not exists default_client_address text;

do $$
declare
  conname text;
begin
  select con.conname into conname
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = rel.relnamespace
  where nsp.nspname = 'public'
    and rel.relname = 'invoices'
    and con.contype = 'c'
    and pg_get_constraintdef(con.oid) ilike '%status%';
  if conname is not null then
    execute format('alter table public.invoices drop constraint %I', conname);
  end if;
end $$;

alter table public.invoices
  add constraint invoices_status_check
  check (status in (
    'draft',
    'sent',
    'pending',
    'approved',
    'paid',
    'payout_processing',
    'paid_out',
    'failed',
    'cancelled'
  ));

alter table public.invoices
  add column if not exists issued_by_user_id uuid references auth.users (id),
  add column if not exists client_name text,
  add column if not exists client_email text,
  add column if not exists client_address text,
  add column if not exists line_items jsonb not null default '[]'::jsonb,
  add column if not exists notes text,
  add column if not exists cancelled_at timestamptz,
  add column if not exists cancelled_by uuid references auth.users (id),
  add column if not exists cancel_reason text,
  add column if not exists fx_rate numeric(18, 8),
  add column if not exists fx_base text default 'EUR',
  add column if not exists service_fee numeric(12, 2),
  add column if not exists shield_fee numeric(12, 2),
  add column if not exists you_keep numeric(12, 2),
  add column if not exists sender_snapshot jsonb not null default '{}'::jsonb;

alter table public.invoices alter column status set default 'draft';

create table if not exists public.invoice_events (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  company_id uuid not null references public.companies (id) on delete cascade,
  actor_id uuid,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  actor_id uuid,
  event_type text not null,
  title text not null,
  body text,
  href text,
  created_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies (id) on delete set null,
  user_id uuid references auth.users (id) on delete set null,
  name text not null,
  email text not null,
  topic text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists invoice_events_invoice_id_idx on public.invoice_events (invoice_id);
create index if not exists activity_events_company_id_idx on public.activity_events (company_id, created_at desc);
create index if not exists support_tickets_user_id_idx on public.support_tickets (user_id);

alter table public.user_profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.invoice_events enable row level security;
alter table public.activity_events enable row level security;
alter table public.support_tickets enable row level security;

create policy user_profiles_self
  on public.user_profiles for all
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy user_settings_self
  on public.user_settings for all
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy invoice_events_company_or_freelancer
  on public.invoice_events for select
  using (
    private.user_is_company_member(company_id)
    or invoice_id in (
      select id from public.invoices
      where freelancer_id in (select id from public.freelancers where user_id = (select auth.uid()))
    )
  );

create policy invoice_events_insert_members
  on public.invoice_events for insert
  with check (
    private.user_is_company_member(company_id)
    or invoice_id in (
      select id from public.invoices
      where freelancer_id in (select id from public.freelancers where user_id = (select auth.uid()))
    )
  );

create policy activity_events_company_select
  on public.activity_events for select
  using (private.user_is_company_member(company_id));

create policy activity_events_company_insert
  on public.activity_events for insert
  with check (private.user_is_company_member(company_id));

create policy support_tickets_self
  on public.support_tickets for all
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Freelancers may insert their own invoices (light-entrepreneur billing).
drop policy if exists invoices_company_or_freelancer on public.invoices;

create policy invoices_select
  on public.invoices for select
  using (
    private.user_is_company_member(company_id)
    or freelancer_id in (select id from public.freelancers where user_id = (select auth.uid()))
  );

create policy invoices_insert
  on public.invoices for insert
  with check (
    private.user_is_company_member(company_id)
    or freelancer_id in (select id from public.freelancers where user_id = (select auth.uid()))
  );

create policy invoices_update
  on public.invoices for update
  using (
    private.user_is_company_member(company_id)
    or freelancer_id in (select id from public.freelancers where user_id = (select auth.uid()))
  )
  with check (
    private.user_is_company_member(company_id)
    or freelancer_id in (select id from public.freelancers where user_id = (select auth.uid()))
  );
