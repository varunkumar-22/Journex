-- ============================================
-- Journex Database Schema
-- Run this in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Profiles table (linked to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  display_name text,
  avatar_url text,
  has_password boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Journal entries table
create table if not exists public.journal_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text default 'Untitled' not null,
  content text default '' not null,
  content_text text default '' not null,
  tags text[] default '{}' not null,
  word_count integer default 0 not null,
  is_complete boolean default false not null,
  last_edited_section text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 3. Indexes for performance
create index if not exists idx_journal_entries_user_id on public.journal_entries(user_id);
create index if not exists idx_journal_entries_created_at on public.journal_entries(created_at desc);
create index if not exists idx_profiles_username on public.profiles(username);

-- 4. Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_journal_entries_updated_at
  before update on public.journal_entries
  for each row execute function public.handle_updated_at();

-- 5. Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name, avatar_url, has_password)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    case when new.raw_app_meta_data->>'provider' = 'email' then true else false end
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 6. Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.journal_entries enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Journal entries: users can CRUD their own entries
create policy "Users can view own entries"
  on public.journal_entries for select
  using (auth.uid() = user_id);

create policy "Users can create own entries"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own entries"
  on public.journal_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete own entries"
  on public.journal_entries for delete
  using (auth.uid() = user_id);
