-- ============================================================
-- BAAM System H — Canonical Admin Schema (REB)
-- Single source of truth for REB admin DB setup.
-- This supersedes legacy minimal admin schema variants.
-- ============================================================

create extension if not exists pgcrypto;

-- ============================================================
-- CORE TABLES
-- ============================================================

create table if not exists public.sites (
  id text primary key,
  name text not null,
  domain text,
  default_locale text default 'en',
  supported_locales text[] default '{en}',
  enabled boolean default true,
  settings jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists public.site_domains (
  id uuid default gen_random_uuid() primary key,
  site_id text not null references public.sites(id) on delete cascade,
  domain text not null unique,
  is_primary boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.admin_users (
  id uuid default gen_random_uuid() primary key,
  site_id text references public.sites(id) on delete cascade,
  email text not null unique,
  password_hash text not null,
  name text,
  role text default 'broker_admin',
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.media_assets (
  id uuid default gen_random_uuid() primary key,
  site_id text not null,
  file_name text not null,
  file_path text not null,
  storage_url text not null,
  mime_type text,
  file_size bigint,
  width integer,
  height integer,
  alt_text text,
  uploaded_by uuid,
  created_at timestamptz default now()
);

create table if not exists public.content_entries (
  id uuid default gen_random_uuid() primary key,
  site_id text not null,
  locale text not null default 'en',
  path text not null,
  content jsonb default '{}',
  data jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(site_id, locale, path)
);

create table if not exists public.content_revisions (
  id uuid default gen_random_uuid() primary key,
  site_id text not null,
  locale text not null default 'en',
  path text not null,
  content jsonb not null default '{}',
  created_by uuid,
  created_at timestamptz default now()
);

create table if not exists public.admin_audit_logs (
  id uuid default gen_random_uuid() primary key,
  site_id text,
  user_id uuid,
  action text not null,
  resource_type text,
  resource_id text,
  details jsonb default '{}',
  ip_address text,
  created_at timestamptz default now()
);

-- ============================================================
-- LEAD / FORM TABLES
-- ============================================================

create table if not exists public.consultation_requests (
  id uuid default gen_random_uuid() primary key,
  site_id text not null,
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  phone text,
  message text,
  preferred_time text,
  status text default 'new'
);

create table if not exists public.valuation_requests (
  id uuid default gen_random_uuid() primary key,
  site_id text not null,
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  phone text,
  address text,
  city text,
  beds text,
  baths text,
  sqft text,
  year_built text,
  condition text,
  timeline text,
  message text,
  status text default 'new'
);

create table if not exists public.property_inquiries (
  id uuid default gen_random_uuid() primary key,
  site_id text not null,
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  phone text,
  property_slug text,
  agent_slug text,
  message text,
  inquiry_type text,
  status text default 'new'
);

create table if not exists public.showing_requests (
  id uuid default gen_random_uuid() primary key,
  site_id text not null,
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  phone text,
  property_address text,
  agent_slug text,
  preferred_date text,
  preferred_time text,
  message text,
  status text default 'new'
);

create table if not exists public.newsletter_subscribers (
  id uuid default gen_random_uuid() primary key,
  site_id text not null,
  created_at timestamptz default now(),
  email text not null,
  first_name text,
  source text default 'newsletter',
  is_active boolean default true,
  unique(site_id, email)
);

-- ============================================================
-- REB-SPECIFIC TABLES
-- ============================================================

create table if not exists public.agents (
  id uuid default gen_random_uuid() primary key,
  site_id text not null,
  slug text not null,
  data jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(site_id, slug)
);

create table if not exists public.agent_users (
  agent_id uuid references public.agents(id) on delete cascade,
  user_id uuid references public.admin_users(id) on delete cascade,
  primary key (agent_id, user_id)
);

create table if not exists public.new_construction (
  id uuid default gen_random_uuid() primary key,
  site_id text not null,
  slug text not null,
  data jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(site_id, slug)
);

create table if not exists public.events (
  id uuid default gen_random_uuid() primary key,
  site_id text not null,
  slug text not null,
  data jsonb not null default '{}',
  event_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(site_id, slug)
);

create table if not exists public.join_requests (
  id uuid default gen_random_uuid() primary key,
  site_id text not null,
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  phone text,
  current_situation text,
  years_experience text,
  current_volume text,
  best_time_to_chat text,
  message text,
  status text default 'new'
);

create table if not exists public.investor_inquiries (
  id uuid default gen_random_uuid() primary key,
  site_id text not null,
  created_at timestamptz default now(),
  name text not null,
  email text not null,
  phone text,
  investment_type text,
  budget_range text,
  timeline text,
  message text,
  status text default 'new'
);

create table if not exists public.gated_downloads (
  id uuid default gen_random_uuid() primary key,
  site_id text not null,
  created_at timestamptz default now(),
  email text not null,
  first_name text,
  guide_slug text not null,
  download_sent boolean default false
);

-- ============================================================
-- AI CHAT TABLES
-- ============================================================

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  site_id text not null,
  locale text not null default 'en',
  conversation_id text not null,
  role text not null check (role in ('user', 'assistant', 'tool')),
  content text not null,
  tool_name text,
  created_at timestamptz not null default now()
);

create index if not exists chat_messages_lookup_idx
  on public.chat_messages (site_id, locale, conversation_id, created_at asc);

create table if not exists public.ai_chat_preferences (
  id uuid primary key default gen_random_uuid(),
  site_id text not null,
  locale text not null default 'en',
  preference_key text not null,
  preference_value jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, locale, preference_key)
);

create index if not exists ai_chat_preferences_lookup_idx
  on public.ai_chat_preferences (site_id, locale, preference_key);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.sites enable row level security;
alter table public.site_domains enable row level security;
alter table public.admin_users enable row level security;
alter table public.media_assets enable row level security;
alter table public.content_entries enable row level security;
alter table public.content_revisions enable row level security;
alter table public.admin_audit_logs enable row level security;
alter table public.consultation_requests enable row level security;
alter table public.valuation_requests enable row level security;
alter table public.property_inquiries enable row level security;
alter table public.showing_requests enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.agents enable row level security;
alter table public.agent_users enable row level security;
alter table public.new_construction enable row level security;
alter table public.events enable row level security;
alter table public.join_requests enable row level security;
alter table public.investor_inquiries enable row level security;
alter table public.gated_downloads enable row level security;
alter table public.chat_messages enable row level security;
alter table public.ai_chat_preferences enable row level security;

drop policy if exists "Public read content_entries" on public.content_entries;
create policy "Public read content_entries" on public.content_entries for select using (true);

drop policy if exists "Public read agents" on public.agents;
create policy "Public read agents" on public.agents for select using (true);

drop policy if exists "Public read new_construction" on public.new_construction;
create policy "Public read new_construction" on public.new_construction for select using (true);

drop policy if exists "Public read events" on public.events;
create policy "Public read events" on public.events for select using (true);

drop policy if exists "Public read sites" on public.sites;
create policy "Public read sites" on public.sites for select using (true);

drop policy if exists "Public read site_domains" on public.site_domains;
create policy "Public read site_domains" on public.site_domains for select using (true);

do $$
declare
  t text;
begin
  foreach t in array array[
    'sites','site_domains','admin_users','media_assets','content_entries','content_revisions',
    'admin_audit_logs','consultation_requests','valuation_requests','property_inquiries',
    'showing_requests','newsletter_subscribers','agents','agent_users','new_construction',
    'events','join_requests','investor_inquiries','gated_downloads','chat_messages',
    'ai_chat_preferences'
  ] loop
    execute format('drop policy if exists "Service role full access %s" on public.%s;', t, t);
    execute format(
      'create policy "Service role full access %s" on public.%s using (auth.role() = ''service_role'');',
      t, t
    );
  end loop;
end $$;

-- ============================================================
-- SEED DATA
-- ============================================================

insert into public.sites (id, name, domain, default_locale, supported_locales, enabled)
values ('jinpanghomes', 'Jin Pang', 'jinpanghomes.com', 'en', '{en,zh}', true)
on conflict (id) do nothing;

-- password: admin123
insert into public.admin_users (site_id, email, password_hash, name, role, is_active)
values (
  'jinpanghomes',
  'admin@jinpanghomes.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'Jin Pang Admin',
  'broker_admin',
  true
)
on conflict (email) do nothing;
