-- Covering indexes for remaining foreign keys.

create index if not exists freelancers_user_id_idx on public.freelancers (user_id);
create index if not exists invoices_milestone_id_idx on public.invoices (milestone_id);
create index if not exists milestones_contract_id_idx on public.milestones (contract_id);
