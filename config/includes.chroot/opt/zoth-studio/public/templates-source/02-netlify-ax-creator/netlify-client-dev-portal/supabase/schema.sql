-- Profiles table to store portal roles and names
create table if not exists public.profiles (
  id uuid references auth.users(id) primary key,
  full_name text,
  role text not null check (role in ('client', 'developer')),
  created_at timestamptz default timezone('utc', now())
);

-- RLS keeps each user limited to their own profile
alter table public.profiles enable row level security;

create policy "Users can view their profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Index for quick lookups when loading a profile for navigation
create index if not exists profiles_role_idx on public.profiles (role);
