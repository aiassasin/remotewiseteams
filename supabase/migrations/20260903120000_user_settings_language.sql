-- Persist UI language alongside theme so the choice survives login.

alter table public.user_settings
  add column if not exists language text not null default 'en';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_settings_language_check'
  ) then
    alter table public.user_settings
      add constraint user_settings_language_check
      check (language in ('en', 'fi', 'de', 'fr', 'es'));
  end if;
end $$;
