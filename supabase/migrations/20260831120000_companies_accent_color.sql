-- Workspace accent chosen during signup wizard.

alter table public.companies
  add column if not exists accent_color text not null default '#4F46E5';
