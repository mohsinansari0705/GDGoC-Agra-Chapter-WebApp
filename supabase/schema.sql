-- ==========================================================================
-- ADMIN SYSTEM
-- ==========================================================================

-- Admins table for managing GDGoC admin access
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  admin_name text not null,
  email text unique not null,
  admin_type text not null check (admin_type in ('super_admin', 'admin', 'least_access_admin')),
  team_name text check (team_name in ('Technical Team', 'Events & Operations Team', 'PR & Outreach Team', 'Social Media & Content Team', 'Design & Editing Team', 'Disciplinary Committee')),
  admin_position text check (admin_position in ('head', 'co-head', 'executive')),
  is_active boolean default true,
  created_at timestamptz not null default now(),
  created_by uuid references public.admins(id),
  updated_at timestamptz default now()
);
-- Indexes for admins table
create index if not exists idx_admins_user_id on public.admins(user_id);
create index if not exists idx_admins_email on public.admins(email);
create index if not exists idx_admins_type on public.admins(admin_type);
create index if not exists idx_admins_active on public.admins(is_active) where is_active = true;


-- ============================================================================
-- EVENTS TABLES
-- ============================================================================

-- 1. events table (main event data)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique,
  category text check (category in ('workshop', 'hackathon', 'meetup', 'conference', 'webinar', 'competition', 'other')),
  status text not null default 'upcoming' check (status in ('upcoming', 'live', 'completed', 'cancelled')),
  description text,
  date date,
  end_date date,
  time time,
  location text,
  cover_image_url text,
  banner_image_url text,
  registration_link text,
  color text,
  featured boolean default false,
  tags text[],
  created_at timestamptz not null default now(),
  created_by uuid references public.admins(id) not null,
  updated_at timestamptz default now()
);
-- Indexes for events table
create index if not exists idx_events_status on public.events(status);
create index if not exists idx_events_date on public.events(date);
create index if not exists idx_events_category on public.events(category);
create index if not exists idx_events_featured on public.events(featured) where featured = true;
create index if not exists idx_events_slug on public.events(slug);

-- 2. events_timeline_items table (used by event detail page)
create table if not exists public.event_timeline_items (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  title text not null,
  date date,
  time time,
  description text,
  label text,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  created_by uuid references public.admins(id) not null
);
-- Index for timeline items
create index if not exists idx_timeline_event_id on public.event_timeline_items(event_id);
create index if not exists idx_timeline_order on public.event_timeline_items(event_id, order_index);

-- 3. events_themes table (problem statements)
create table if not exists public.event_themes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  theme text not null,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  created_by uuid references public.admins(id) not null
);
-- Index for themes
create index if not exists idx_themes_event_id on public.event_themes(event_id);

-- 4. event_prizes table (prizes & awards)
create table if not exists public.event_prizes (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  position text not null,
  amount text,
  description text,
  icon text,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  created_by uuid references public.admins(id) not null
);
-- Index for prizes
create index if not exists idx_prizes_event_id on public.event_prizes(event_id);


-- ============================================================================
-- MEMBERS TABLES
-- ============================================================================

-- Members table (team members)
create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  profile_image_url text,
  linkedin_url text,
  github_url text,
  x_url text,
  instagram_url text,
  bio text,
  team_name text not null check (team_name in (
    'Lead Organizer',
    'Technical Team', 
    'Events & Operations Team', 
    'PR & Outreach Team', 
    'Social Media & Content Team', 
    'Design & Editing Team', 
    'Disciplinary Committee'
  )),
  position text not null check (position in ('lead', 'head', 'co-head', 'executive')),
  display_order int not null default 0,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  created_by uuid references public.admins(id) not null,
  updated_at timestamptz default now()
);
-- Indexes for members table
create index if not exists idx_members_team_name on public.members(team_name);
create index if not exists idx_members_position on public.members(position);
create index if not exists idx_members_active on public.members(is_active) where is_active = true;
create index if not exists idx_members_team_order on public.members(team_name, position, display_order);
create index if not exists idx_members_email on public.members(email);


-- ============================================================================
-- RESOURCES TABLES
-- ============================================================================

-- Resources table (learning materials, tools, articles, etc.)
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  link text not null,
  category text not null check (category in (
    'Tutorial',
    'Documentation',
    'Tool',
    'Article',
    'Video',
    'Course',
    'Book',
    'Template',
    'Other'
  )),
  type text check (type in ('Free', 'Paid', 'Freemium')),
  tags text[],
  thumbnail_url text,
  likes_count int not null default 0,
  views_count int not null default 0,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  created_by uuid references public.admins(id) not null,
  updated_at timestamptz default now()
);
-- Indexes for resources table
create index if not exists idx_resources_category on public.resources(category);
create index if not exists idx_resources_type on public.resources(type);
create index if not exists idx_resources_active on public.resources(is_active) where is_active = true;
create index if not exists idx_resources_featured on public.resources(is_featured) where is_featured = true;
create index if not exists idx_resources_created_by on public.resources(created_by);
create index if not exists idx_resources_likes on public.resources(likes_count desc);


-- ============================================================================
-- BLOG TABLES
-- ============================================================================

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
  created_by uuid references public.admins(id) not null
);


-- ============================================================================
-- GALLERY TABLES
-- ============================================================================

-- GALLERY ITEMS
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  date text,
  status text,
  image_url text,
  created_at timestamptz not null default now(),
  created_by uuid references public.admins(id) not null
);
