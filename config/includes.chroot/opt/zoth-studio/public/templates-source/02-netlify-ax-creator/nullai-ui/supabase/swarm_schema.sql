-- NullAI Swarm — collaborative agent mesh (Phase 1)
-- Apply in Supabase SQL editor for the nullai project.

-- Projects people collaborate on
create table if not exists public.swarm_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  owner_id uuid references auth.users(id) on delete set null,
  policy jsonb not null default '{"share_secrets": false, "require_human_approval": true}'::jsonb,
  tags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.swarm_members (
  project_id uuid not null references public.swarm_projects(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'builder'
    check (role in ('owner', 'builder', 'agent_operator', 'observer')),
  created_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

-- Agents registered by users (local Zoth / Null operators)
create table if not exists public.agent_nodes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.swarm_projects(id) on delete set null,
  display_name text not null,
  public_key text,
  capabilities text[] not null default '{}',
  status text not null default 'offline'
    check (status in ('online', 'busy', 'offline')),
  meta jsonb not null default '{}'::jsonb,
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.help_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.swarm_projects(id) on delete cascade,
  target_project_id uuid references public.swarm_projects(id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  from_agent_id uuid references public.agent_nodes(id) on delete set null,
  summary text not null,
  details text default '',
  capabilities_needed text[] not null default '{}',
  status text not null default 'open'
    check (status in ('open', 'matched', 'in_progress', 'done', 'cancelled')),
  envelope jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.help_offers (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.help_requests(id) on delete cascade,
  agent_id uuid not null references public.agent_nodes(id) on delete cascade,
  note text default '',
  status text not null default 'pending_approval'
    check (status in ('pending_approval', 'accepted', 'rejected', 'completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.task_results (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.help_requests(id) on delete set null,
  agent_id uuid references public.agent_nodes(id) on delete set null,
  summary text not null,
  artifact_uri text,
  envelope jsonb,
  created_at timestamptz not null default now()
);

-- RLS (tighten further before prod)
alter table public.swarm_projects enable row level security;
alter table public.swarm_members enable row level security;
alter table public.agent_nodes enable row level security;
alter table public.help_requests enable row level security;
alter table public.help_offers enable row level security;
alter table public.task_results enable row level security;

-- Members can read projects they belong to; authenticated can create
create policy "swarm_projects_select_member"
  on public.swarm_projects for select to authenticated
  using (
    owner_id = auth.uid()
    or exists (
      select 1 from public.swarm_members m
      where m.project_id = id and m.user_id = auth.uid()
    )
  );

create policy "swarm_projects_insert_auth"
  on public.swarm_projects for insert to authenticated
  with check (owner_id = auth.uid());

create policy "swarm_members_select_self_project"
  on public.swarm_members for select to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.swarm_members m
      where m.project_id = project_id and m.user_id = auth.uid()
    )
  );

create policy "agent_nodes_select_auth"
  on public.agent_nodes for select to authenticated using (true);

create policy "agent_nodes_insert_own"
  on public.agent_nodes for insert to authenticated
  with check (owner_id = auth.uid());

create policy "help_requests_select_auth"
  on public.help_requests for select to authenticated using (true);

create policy "help_requests_insert_auth"
  on public.help_requests for insert to authenticated
  with check (created_by = auth.uid());

create policy "help_offers_select_auth"
  on public.help_offers for select to authenticated using (true);

create policy "help_offers_insert_auth"
  on public.help_offers for insert to authenticated
  with check (true);

create policy "task_results_select_auth"
  on public.task_results for select to authenticated using (true);

create policy "task_results_insert_auth"
  on public.task_results for insert to authenticated
  with check (true);

-- Realtime (enable in dashboard or)
-- alter publication supabase_realtime add table help_requests, help_offers, agent_nodes;
