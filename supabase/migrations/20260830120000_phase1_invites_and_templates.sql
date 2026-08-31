-- Phase 1 schema additions listed in the product spec.
-- Requires 20260830100000_phase0_foundation.sql (companies, members, freelancers, contracts).

create table if not exists public.freelancer_invites (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies (id) on delete cascade,
  email text not null,
  full_name text not null,
  role text,
  hourly_rate numeric(10, 2),
  currency text not null default 'USD',
  note text,
  token_hash text not null unique,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'expired')),
  accepted_at timestamptz,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists freelancer_invites_company_id_idx on public.freelancer_invites (company_id);
create index if not exists freelancer_invites_status_idx on public.freelancer_invites (status);
create unique index if not exists freelancer_invites_pending_email_idx
  on public.freelancer_invites (company_id, lower(email))
  where status = 'pending';

alter table public.freelancer_invites enable row level security;

create policy freelancer_invites_company_isolation
  on public.freelancer_invites
  for all
  using (private.user_is_company_member(company_id))
  with check (private.user_is_company_member(company_id));

create table if not exists public.contract_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null unique,
  body_html text not null,
  variables jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.contract_templates enable row level security;

create policy contract_templates_authenticated_select
  on public.contract_templates
  for select
  to authenticated
  using (true);

alter table public.freelancers
  add column if not exists role text,
  add column if not exists bio text,
  add column if not exists linkedin_url text,
  add column if not exists website text,
  add column if not exists avatar_url text;

alter table public.contracts
  add column if not exists document_hash text,
  add column if not exists viewed_at timestamptz,
  add column if not exists body_sent text,
  add column if not exists signing_token_hash text,
  add column if not exists sent_at timestamptz;

insert into public.contract_templates (name, type, body_html, variables)
values
  (
    'NDA',
    'NDA',
    $nda$This Mutual Non-Disclosure Agreement (“Agreement”) is entered into as of [DATE] by and between [COMPANY_NAME] (“Company”) and [FREELANCER_NAME] (“Freelancer”).

1. PURPOSE
The parties wish to explore a working relationship and may share confidential information.

2. CONFIDENTIALITY
Each party agrees to hold in confidence all non-public information received from the other for [DURATION], and not to disclose it to third parties without prior written consent.

3. EXCEPTIONS
Information is not confidential if it is public, independently developed, or required to be disclosed by law.

4. GOVERNING LAW
This Agreement is governed by the laws of [GOVERNING_LAW].$nda$,
    '["COMPANY_NAME","FREELANCER_NAME","DATE","GOVERNING_LAW","DURATION"]'::jsonb
  ),
  (
    'MSA',
    'MSA',
    $msa$This Master Service Agreement (“Agreement”) is entered into as of [DATE] by and between [COMPANY_NAME] (“Company”) and [FREELANCER_NAME] (“Contractor”).

1. SERVICES
Contractor will provide professional services as described in one or more Statements of Work.

2. PAYMENT
Company will pay Contractor according to [PAYMENT_TERMS] after a valid invoice is received.

3. INDEPENDENT CONTRACTOR
Contractor is an independent contractor and not an employee, partner, or agent of Company.

4. TERMINATION
Either party may terminate this Agreement with [NOTICE_PERIOD] written notice.$msa$,
    '["COMPANY_NAME","FREELANCER_NAME","DATE","PAYMENT_TERMS","NOTICE_PERIOD"]'::jsonb
  ),
  (
    'SOW',
    'SOW',
    $sow$This Statement of Work (“SOW”) is entered into by [COMPANY_NAME] (“Company”) and [FREELANCER_NAME] (“Contractor”) for [PROJECT_NAME].

1. DELIVERABLES
[DELIVERABLES]

2. TIMELINE
Work will be performed according to the following timeline: [TIMELINE].

3. FEES
Company will pay Contractor [AMOUNT] for the services described in this SOW.

4. ACCEPTANCE
Deliverables are accepted unless Company provides written objections within five business days.$sow$,
    '["COMPANY_NAME","FREELANCER_NAME","PROJECT_NAME","DELIVERABLES","TIMELINE","AMOUNT"]'::jsonb
  ),
  (
    'Independent Contractor Agreement',
    'ICA',
    $ica$This Independent Contractor Agreement (“Agreement”) is made as of [DATE] between [COMPANY_NAME] (“Company”) and [FREELANCER_NAME] (“Contractor”).

1. STATUS
Contractor is engaged as an independent contractor, not as an employee, and is responsible for their own taxes and benefits.

2. COMPENSATION
Company will pay Contractor at the rate of [RATE], invoiced according to the applicable Statement of Work.

3. START DATE
Services commence on [START_DATE].

4. INTELLECTUAL PROPERTY
Work product created for Company is assigned to Company upon payment, unless otherwise agreed in writing.$ica$,
    '["COMPANY_NAME","FREELANCER_NAME","DATE","RATE","START_DATE"]'::jsonb
  )
on conflict (type) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('contracts', 'contracts', false, 20971520, array['application/pdf'])
on conflict (id) do nothing;

create policy avatars_insert_own
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy avatars_update_own
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );

create policy avatars_select_own
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = (select auth.uid()::text)
  );
