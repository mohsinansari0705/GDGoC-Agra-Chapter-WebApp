-- Minimal schema for the Admin dashboard
-- Run this in Supabase: SQL Editor → New query

-- Required extension for gen_random_uuid()
create extension if not exists pgcrypto;

-- EVENTS
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  status text,
  description text,
  date text,
  end_date text,
  time text,
  location text,
  participants text,
  image_url text,
  registration_link text,
  color text,
  created_at timestamptz not null default now(),
  created_by uuid not null
);

-- EVENT INNER DATA
-- Timeline/Schedule items (used by event detail page)
create table if not exists public.event_timeline_items (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  title text not null,
  date text,
  time text,
  description text,
  label text,
  order_index int,
  created_at timestamptz not null default now(),
  created_by uuid not null
);

-- Themes / Problem statements
create table if not exists public.event_themes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  theme text not null,
  order_index int,
  created_at timestamptz not null default now(),
  created_by uuid not null
);

-- Prizes & awards
create table if not exists public.event_prizes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  position text not null,
  amount text,
  description text,
  icon text,
  order_index int,
  created_at timestamptz not null default now(),
  created_by uuid not null
);

-- MEMBERS
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  team_name text,
  team_head text,
  team_head_image_url text,
  team_head_linkedin_url text,
  team_head_github_url text,
  team_head_twitter_url text,
  team_co_head text,
  team_co_head_image_url text,
  team_co_head_linkedin_url text,
  team_co_head_github_url text,
  team_co_head_twitter_url text,
  executive_1 text,
  executive_1_image_url text,
  executive_1_linkedin_url text,
  executive_1_github_url text,
  executive_1_twitter_url text,
  executive_2 text,
  executive_2_image_url text,
  executive_2_linkedin_url text,
  executive_2_github_url text,
  executive_2_twitter_url text,
  executive_3 text,
  executive_3_image_url text,
  executive_3_linkedin_url text,
  executive_3_github_url text,
  executive_3_twitter_url text,
  executive_4 text,
  executive_4_image_url text,
  executive_4_linkedin_url text,
  executive_4_github_url text,
  executive_4_twitter_url text,
  executive_5 text,
  executive_5_image_url text,
  executive_5_linkedin_url text,
  executive_5_github_url text,
  executive_5_twitter_url text,
  executive_6 text,
  executive_6_image_url text,
  executive_6_linkedin_url text,
  executive_6_github_url text,
  executive_6_twitter_url text,
  executive_7 text,
  executive_7_image_url text,
  executive_7_linkedin_url text,
  executive_7_github_url text,
  executive_7_twitter_url text,
  executive_8 text,
  executive_8_image_url text,
  executive_8_linkedin_url text,
  executive_8_github_url text,
  executive_8_twitter_url text,
  created_at timestamptz not null default now(),
  created_by uuid not null
);

-- BLOG POSTS
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  author text,
  date text,
  category text,
  image_url text,
  read_time text,
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  created_by uuid not null
);

-- GALLERY ITEMS
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  date text,
  status text,
  image_url text,
  created_at timestamptz not null default now(),
  created_by uuid not null
);

-- RESOURCES (community submitted)
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  link text not null,
  category text,
  type text,
  description text,
  created_at timestamptz not null default now()
);

-- MIGRATIONS (if you already created tables earlier)
-- Ensures required columns exist even when the table already existed.
alter table public.events add column if not exists title text;
alter table public.events add column if not exists category text;
alter table public.events add column if not exists status text;
alter table public.events add column if not exists description text;
alter table public.events add column if not exists date text;
alter table public.events add column if not exists end_date text;
alter table public.events add column if not exists time text;
alter table public.events add column if not exists location text;
alter table public.events add column if not exists participants text;
alter table public.events add column if not exists image_url text;
alter table public.events add column if not exists registration_link text;
alter table public.events add column if not exists color text;
alter table public.events add column if not exists created_at timestamptz;
alter table public.events add column if not exists created_by uuid;

-- Inner data migrations (safe no-ops when tables already exist)
alter table public.event_timeline_items add column if not exists event_id uuid;
alter table public.event_timeline_items add column if not exists title text;
alter table public.event_timeline_items add column if not exists date text;
alter table public.event_timeline_items add column if not exists time text;
alter table public.event_timeline_items add column if not exists description text;
alter table public.event_timeline_items add column if not exists label text;
alter table public.event_timeline_items add column if not exists order_index int;
alter table public.event_timeline_items add column if not exists created_at timestamptz;
alter table public.event_timeline_items add column if not exists created_by uuid;

alter table public.event_themes add column if not exists event_id uuid;
alter table public.event_themes add column if not exists theme text;
alter table public.event_themes add column if not exists order_index int;
alter table public.event_themes add column if not exists created_at timestamptz;
alter table public.event_themes add column if not exists created_by uuid;

alter table public.event_prizes add column if not exists event_id uuid;
alter table public.event_prizes add column if not exists position text;
alter table public.event_prizes add column if not exists amount text;
alter table public.event_prizes add column if not exists description text;
alter table public.event_prizes add column if not exists icon text;
alter table public.event_prizes add column if not exists order_index int;
alter table public.event_prizes add column if not exists created_at timestamptz;
alter table public.event_prizes add column if not exists created_by uuid;

alter table public.members add column if not exists name text;
alter table public.members add column if not exists team_name text;
alter table public.members add column if not exists team_head text;
alter table public.members add column if not exists team_head_image_url text;
alter table public.members add column if not exists team_head_linkedin_url text;
alter table public.members add column if not exists team_head_github_url text;
alter table public.members add column if not exists team_head_twitter_url text;
alter table public.members add column if not exists team_co_head text;
alter table public.members add column if not exists team_co_head_image_url text;
alter table public.members add column if not exists team_co_head_linkedin_url text;
alter table public.members add column if not exists team_co_head_github_url text;
alter table public.members add column if not exists team_co_head_twitter_url text;
alter table public.members add column if not exists executive_1 text;
alter table public.members add column if not exists executive_1_image_url text;
alter table public.members add column if not exists executive_1_linkedin_url text;
alter table public.members add column if not exists executive_1_github_url text;
alter table public.members add column if not exists executive_1_twitter_url text;
alter table public.members add column if not exists executive_2 text;
alter table public.members add column if not exists executive_2_image_url text;
alter table public.members add column if not exists executive_2_linkedin_url text;
alter table public.members add column if not exists executive_2_github_url text;
alter table public.members add column if not exists executive_2_twitter_url text;
alter table public.members add column if not exists executive_3 text;
alter table public.members add column if not exists executive_3_image_url text;
alter table public.members add column if not exists executive_3_linkedin_url text;
alter table public.members add column if not exists executive_3_github_url text;
alter table public.members add column if not exists executive_3_twitter_url text;
alter table public.members add column if not exists executive_4 text;
alter table public.members add column if not exists executive_4_image_url text;
alter table public.members add column if not exists executive_4_linkedin_url text;
alter table public.members add column if not exists executive_4_github_url text;
alter table public.members add column if not exists executive_4_twitter_url text;
alter table public.members add column if not exists executive_5 text;
alter table public.members add column if not exists executive_5_image_url text;
alter table public.members add column if not exists executive_5_linkedin_url text;
alter table public.members add column if not exists executive_5_github_url text;
alter table public.members add column if not exists executive_5_twitter_url text;
alter table public.members add column if not exists executive_6 text;
alter table public.members add column if not exists executive_6_image_url text;
alter table public.members add column if not exists executive_6_linkedin_url text;
alter table public.members add column if not exists executive_6_github_url text;
alter table public.members add column if not exists executive_6_twitter_url text;
alter table public.members add column if not exists executive_7 text;
alter table public.members add column if not exists executive_7_image_url text;
alter table public.members add column if not exists executive_7_linkedin_url text;
alter table public.members add column if not exists executive_7_github_url text;
alter table public.members add column if not exists executive_7_twitter_url text;
alter table public.members add column if not exists executive_8 text;
alter table public.members add column if not exists executive_8_image_url text;
alter table public.members add column if not exists executive_8_linkedin_url text;
alter table public.members add column if not exists executive_8_github_url text;
alter table public.members add column if not exists executive_8_twitter_url text;
alter table public.members add column if not exists created_at timestamptz;
alter table public.members add column if not exists created_by uuid;

alter table public.blog_posts add column if not exists title text;
alter table public.blog_posts add column if not exists excerpt text;
alter table public.blog_posts add column if not exists author text;
alter table public.blog_posts add column if not exists date text;
alter table public.blog_posts add column if not exists category text;
alter table public.blog_posts add column if not exists image_url text;
alter table public.blog_posts add column if not exists read_time text;
alter table public.blog_posts add column if not exists status text;
alter table public.blog_posts add column if not exists created_at timestamptz;
alter table public.blog_posts add column if not exists created_by uuid;

alter table public.gallery_items add column if not exists title text;
alter table public.gallery_items add column if not exists category text;
alter table public.gallery_items add column if not exists date text;
alter table public.gallery_items add column if not exists status text;
alter table public.gallery_items add column if not exists image_url text;
alter table public.gallery_items add column if not exists created_at timestamptz;
alter table public.gallery_items add column if not exists created_by uuid;

-- Resources migrations
alter table public.resources add column if not exists title text;
alter table public.resources add column if not exists link text;
alter table public.resources add column if not exists category text;
alter table public.resources add column if not exists type text;
alter table public.resources add column if not exists description text;
alter table public.resources add column if not exists created_at timestamptz;

-- RLS
alter table public.events enable row level security;
alter table public.event_timeline_items enable row level security;
alter table public.event_themes enable row level security;
alter table public.event_prizes enable row level security;
alter table public.members enable row level security;
alter table public.blog_posts enable row level security;
alter table public.gallery_items enable row level security;
alter table public.resources enable row level security;

-- NOTE:
-- The frontend UID check is not security by itself.
-- For real protection, enforce allowed admin UIDs at the database level.
-- Replace the UUID(s) below with your admin UID(s).

-- EVENTS POLICIES
-- Public read access (used by /events page)
drop policy if exists "events_public_select" on public.events;
create policy "events_public_select" on public.events
for select to anon
using (true);

-- Public read access (used by event detail page)
drop policy if exists "event_timeline_public_select" on public.event_timeline_items;
create policy "event_timeline_public_select" on public.event_timeline_items
for select to anon
using (true);

drop policy if exists "event_themes_public_select" on public.event_themes;
create policy "event_themes_public_select" on public.event_themes
for select to anon
using (true);

drop policy if exists "event_prizes_public_select" on public.event_prizes;
create policy "event_prizes_public_select" on public.event_prizes
for select to anon
using (true);

-- RESOURCES POLICIES
drop policy if exists "resources_public_select" on public.resources;
create policy "resources_public_select" on public.resources
for select to anon
using (true);

drop policy if exists "resources_public_insert" on public.resources;
create policy "resources_public_insert" on public.resources
for insert to anon
with check (true);

drop policy if exists "events_admin_select" on public.events;
create policy "events_admin_select" on public.events
for select to authenticated
using (
  auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid
);

drop policy if exists "events_admin_insert" on public.events;
create policy "events_admin_insert" on public.events
for insert to authenticated
with check (
  auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid
  and created_by = auth.uid()
);

drop policy if exists "events_admin_update" on public.events;
create policy "events_admin_update" on public.events
for update to authenticated
using (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid)
with check (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid);

drop policy if exists "events_admin_delete" on public.events;
create policy "events_admin_delete" on public.events
for delete to authenticated
using (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid);

-- EVENT INNER DATA POLICIES
drop policy if exists "event_timeline_admin_select" on public.event_timeline_items;
create policy "event_timeline_admin_select" on public.event_timeline_items
for select to authenticated
using (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid);

drop policy if exists "event_timeline_admin_insert" on public.event_timeline_items;
create policy "event_timeline_admin_insert" on public.event_timeline_items
for insert to authenticated
with check (
  auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid
  and created_by = auth.uid()
);

drop policy if exists "event_timeline_admin_update" on public.event_timeline_items;
create policy "event_timeline_admin_update" on public.event_timeline_items
for update to authenticated
using (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid)
with check (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid);

drop policy if exists "event_timeline_admin_delete" on public.event_timeline_items;
create policy "event_timeline_admin_delete" on public.event_timeline_items
for delete to authenticated
using (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid);

drop policy if exists "event_themes_admin_select" on public.event_themes;
create policy "event_themes_admin_select" on public.event_themes
for select to authenticated
using (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid);

drop policy if exists "event_themes_admin_insert" on public.event_themes;
create policy "event_themes_admin_insert" on public.event_themes
for insert to authenticated
with check (
  auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid
  and created_by = auth.uid()
);

drop policy if exists "event_themes_admin_update" on public.event_themes;
create policy "event_themes_admin_update" on public.event_themes
for update to authenticated
using (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid)
with check (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid);

drop policy if exists "event_themes_admin_delete" on public.event_themes;
create policy "event_themes_admin_delete" on public.event_themes
for delete to authenticated
using (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid);

drop policy if exists "event_prizes_admin_select" on public.event_prizes;
create policy "event_prizes_admin_select" on public.event_prizes
for select to authenticated
using (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid);

drop policy if exists "event_prizes_admin_insert" on public.event_prizes;
create policy "event_prizes_admin_insert" on public.event_prizes
for insert to authenticated
with check (
  auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid
  and created_by = auth.uid()
);

drop policy if exists "event_prizes_admin_update" on public.event_prizes;
create policy "event_prizes_admin_update" on public.event_prizes
for update to authenticated
using (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid)
with check (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid);

drop policy if exists "event_prizes_admin_delete" on public.event_prizes;
create policy "event_prizes_admin_delete" on public.event_prizes
for delete to authenticated
using (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid);

-- GALLERY POLICIES
-- Public read access (used by /gallery page)
drop policy if exists "gallery_public_select" on public.gallery_items;
create policy "gallery_public_select" on public.gallery_items
for select to anon
using (true);

-- MEMBERS POLICIES
-- Public read access (used by /members page)
drop policy if exists "members_public_select" on public.members;
create policy "members_public_select" on public.members
for select to anon
using (true);

drop policy if exists "members_admin_select" on public.members;
create policy "members_admin_select" on public.members
for select to authenticated
using (
  auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid
);

drop policy if exists "members_admin_insert" on public.members;
create policy "members_admin_insert" on public.members
for insert to authenticated
with check (
  auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid
  and created_by = auth.uid()
);

drop policy if exists "members_admin_update" on public.members;
create policy "members_admin_update" on public.members
for update to authenticated
using (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid)
with check (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid);

drop policy if exists "members_admin_delete" on public.members;
create policy "members_admin_delete" on public.members
for delete to authenticated
using (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid);

-- BLOG POSTS POLICIES
drop policy if exists "blog_posts_admin_select" on public.blog_posts;
create policy "blog_posts_admin_select" on public.blog_posts
for select to authenticated
using (
  auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid
);

-- Public read access for published posts (used by /blog page)
drop policy if exists "blog_posts_public_select_published" on public.blog_posts;
create policy "blog_posts_public_select_published" on public.blog_posts
for select to anon
using (status = 'published');

drop policy if exists "blog_posts_admin_insert" on public.blog_posts;
create policy "blog_posts_admin_insert" on public.blog_posts
for insert to authenticated
with check (
  auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid
  and created_by = auth.uid()
);

drop policy if exists "blog_posts_admin_update" on public.blog_posts;
create policy "blog_posts_admin_update" on public.blog_posts
for update to authenticated
using (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid)
with check (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid);

drop policy if exists "blog_posts_admin_delete" on public.blog_posts;
create policy "blog_posts_admin_delete" on public.blog_posts
for delete to authenticated
using (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid);

-- GALLERY ITEMS POLICIES
drop policy if exists "gallery_items_admin_select" on public.gallery_items;
create policy "gallery_items_admin_select" on public.gallery_items
for select to authenticated
using (
  auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid
);

drop policy if exists "gallery_items_admin_insert" on public.gallery_items;
create policy "gallery_items_admin_insert" on public.gallery_items
for insert to authenticated
with check (
  auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid
  and created_by = auth.uid()
);

drop policy if exists "gallery_items_admin_update" on public.gallery_items;
create policy "gallery_items_admin_update" on public.gallery_items
for update to authenticated
using (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid)
with check (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid);

drop policy if exists "gallery_items_admin_delete" on public.gallery_items;
create policy "gallery_items_admin_delete" on public.gallery_items
for delete to authenticated
using (auth.uid() = 'ee29aa82-28cd-4004-a0ab-61d20e5a1c2e'::uuid);
