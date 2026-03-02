-- Jin Pang Homes — RLS policies
-- All tables are service-role only (accessed via server-side API routes only)

-- Sites
alter table public.sites enable row level security;
drop policy if exists "deny_public" on public.sites;
create policy "deny_public" on public.sites for all
  to anon, authenticated using (false) with check (false);

-- Site domains
alter table public.site_domains enable row level security;
drop policy if exists "deny_public" on public.site_domains;
create policy "deny_public" on public.site_domains for all
  to anon, authenticated using (false) with check (false);

-- Admin users
alter table public.admin_users enable row level security;
drop policy if exists "deny_public" on public.admin_users;
create policy "deny_public" on public.admin_users for all
  to anon, authenticated using (false) with check (false);

-- Media assets
alter table public.media_assets enable row level security;
drop policy if exists "deny_public" on public.media_assets;
create policy "deny_public" on public.media_assets for all
  to anon, authenticated using (false) with check (false);

-- Content entries
alter table public.content_entries enable row level security;
drop policy if exists "deny_public" on public.content_entries;
create policy "deny_public" on public.content_entries for all
  to anon, authenticated using (false) with check (false);

-- Content revisions
alter table public.content_revisions enable row level security;
drop policy if exists "deny_public" on public.content_revisions;
create policy "deny_public" on public.content_revisions for all
  to anon, authenticated using (false) with check (false);

-- Consultation requests
alter table public.consultation_requests enable row level security;
drop policy if exists "deny_public" on public.consultation_requests;
create policy "deny_public" on public.consultation_requests for all
  to anon, authenticated using (false) with check (false);

-- Admin audit logs
alter table public.admin_audit_logs enable row level security;
drop policy if exists "deny_public" on public.admin_audit_logs;
create policy "deny_public" on public.admin_audit_logs for all
  to anon, authenticated using (false) with check (false);
