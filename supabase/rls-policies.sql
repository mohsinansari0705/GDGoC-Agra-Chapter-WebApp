-- ============================================================================
-- ENABLE RLS
-- ============================================================================

alter table public.admins enable row level security;
alter table public.events enable row level security;
alter table public.event_timeline_items enable row level security;
alter table public.event_themes enable row level security;
alter table public.event_prizes enable row level security;
alter table public.members enable row level security;

alter table public.blog_posts enable row level security;
alter table public.gallery_items enable row level security;
alter table public.resources enable row level security;


-- ============================================================================
-- ADMIN SYSTEM RLS POLICIES
-- ============================================================================

-- Only super_admin can view all admins
drop policy if exists "admins_super_admin_select" on public.admins;
create policy "admins_super_admin_select" on public.admins
for select
using (public.is_super_admin());

-- Only super_admin can insert new admins (handled via RPC, but policy for safety)
drop policy if exists "admins_super_admin_insert" on public.admins;
create policy "admins_super_admin_insert" on public.admins
for insert
with check (public.is_super_admin());

-- Only super_admin can update admins
drop policy if exists "admins_super_admin_update" on public.admins;
create policy "admins_super_admin_update" on public.admins
for update
using (public.is_super_admin());

-- Only super_admin can delete admins
drop policy if exists "admins_super_admin_delete" on public.admins;
create policy "admins_super_admin_delete" on public.admins
for delete
using (
  public.is_super_admin()
  and user_id != auth.uid()  -- Prevent self-deletion
);


-- ============================================================================
-- EVENTS POLICIES
-- ============================================================================

-- Public can read upcoming, live, and completed events
drop policy if exists "events_public_select" on public.events;
create policy "events_public_select" on public.events
for select
using (status in ('upcoming', 'live', 'completed'));

-- Super Admin and Admin can manage events
drop policy if exists "events_admin_select" on public.events;
create policy "events_admin_select" on public.events
for select
using (public.is_admin_or_above());

drop policy if exists "events_admin_insert" on public.events;
create policy "events_admin_insert" on public.events
for insert
with check (public.is_admin_or_above());

drop policy if exists "events_admin_update" on public.events;
create policy "events_admin_update" on public.events
for update
using (public.is_admin_or_above());

drop policy if exists "events_admin_delete" on public.events;
create policy "events_admin_delete" on public.events
for delete
using (public.is_admin_or_above());

-- ============================================================================
-- EVENT INNER DATA POLICIES (timeline, themes, prizes)
-- ============================================================================

-- Public can view upcoming, live and completed event timelines
drop policy if exists "timeline_public_select" on public.event_timeline_items;
create policy "timeline_public_select" on public.event_timeline_items
for select
using (
  exists (
    select 1 from public.events
    where id = event_timeline_items.event_id
    and status in ('upcoming', 'live', 'completed')
  )
);

-- Admin and Super Admin have full access to timeline items
drop policy if exists "timeline_admin_all" on public.event_timeline_items;
create policy "timeline_admin_all" on public.event_timeline_items
for all
using (public.is_admin_or_above())
with check (public.is_admin_or_above());

-- Public can view upcoming, live and completed event themes
drop policy if exists "themes_public_select" on public.event_themes;
create policy "themes_public_select" on public.event_themes
for select
using (
  exists (
    select 1 from public.events
    where id = event_themes.event_id
    and status in ('upcoming', 'live', 'completed')
  )
);

-- Admin and Super Admin have full access to themes
drop policy if exists "themes_admin_all" on public.event_themes;
create policy "themes_admin_all" on public.event_themes
for all
using (public.is_admin_or_above())
with check (public.is_admin_or_above());

-- Public can view upcoming, live and completed event prizes
drop policy if exists "prizes_public_select" on public.event_prizes;
create policy "prizes_public_select" on public.event_prizes
for select
using (
  exists (
    select 1 from public.events
    where id = event_prizes.event_id
    and status in ('upcoming', 'live', 'completed')
  )
);

-- Admin and Super Admin have full access to prizes
drop policy if exists "prizes_admin_all" on public.event_prizes;
create policy "prizes_admin_all" on public.event_prizes
for all
using (public.is_admin_or_above())
with check (public.is_admin_or_above());


-- ============================================================================
-- MEMBERS POLICIES
-- ============================================================================

-- Public can view active members only
drop policy if exists "members_public_select" on public.members;
create policy "members_public_select" on public.members
for select
using (is_active = true);

-- Super admin can view all members (including inactive)
drop policy if exists "members_admin_select" on public.members;
create policy "members_admin_select" on public.members
for select
using (public.is_super_admin());

-- Only super_admin can insert members
drop policy if exists "members_super_admin_insert" on public.members;
create policy "members_super_admin_insert" on public.members
for insert
with check (public.is_super_admin());

-- Only super_admin can update members
drop policy if exists "members_super_admin_update" on public.members;
create policy "members_super_admin_update" on public.members
for update
using (public.is_super_admin());

-- Only super_admin can delete members
drop policy if exists "members_super_admin_delete" on public.members;
create policy "members_super_admin_delete" on public.members
for delete
using (public.is_super_admin());

-- ============================================================================
-- BLOG POSTS POLICIES
-- ============================================================================

-- Public can view published blogs
drop policy if exists "blogs_public_select" on public.blog_posts;
create policy "blogs_public_select" on public.blog_posts
for select
using (status = 'published');

-- All admins can view their own blogs, super_admin sees all
drop policy if exists "blogs_admin_select" on public.blog_posts;
create policy "blogs_admin_select" on public.blog_posts
for select
using (
  public.is_admin()
  and (
    public.get_current_admin_type() = 'super_admin'
    or created_by = public.get_current_admin_id()
  )
);

-- All admins can insert blogs
drop policy if exists "blogs_admin_insert" on public.blog_posts;
create policy "blogs_admin_insert" on public.blog_posts
for insert
with check (public.is_admin());

-- Super admin can update any blog, others can only update their own
drop policy if exists "blogs_admin_update" on public.blog_posts;
create policy "blogs_admin_update" on public.blog_posts
for update
using (
  public.is_admin()
  and (
    public.get_current_admin_type() = 'super_admin'
    or created_by = public.get_current_admin_id()
  )
);

-- Super admin can delete any blog, others can only delete their own
drop policy if exists "blogs_admin_delete" on public.blog_posts;
create policy "blogs_admin_delete" on public.blog_posts
for delete
using (
  public.is_admin()
  and (
    public.get_current_admin_type() = 'super_admin'
    or created_by = public.get_current_admin_id()
  )
);

-- ============================================================================
-- RESOURCES POLICIES
-- ============================================================================

-- Public can view all resources
drop policy if exists "resources_public_select" on public.resources;
create policy "resources_public_select" on public.resources
for select
using (true);

-- Super Admin can view all, others see only their own
drop policy if exists "resources_admin_select" on public.resources;
create policy "resources_admin_select" on public.resources
for select
using (
  public.is_admin()
  and (
    public.get_current_admin_type() = 'super_admin'
    or created_by = public.get_current_admin_id()
  )
);

-- All admins can insert resources
drop policy if exists "resources_admin_insert" on public.resources;
create policy "resources_admin_insert" on public.resources
for insert
with check (public.is_admin());

-- Super Admin can update any resource, others can only update their own
drop policy if exists "resources_admin_update" on public.resources;
create policy "resources_admin_update" on public.resources
for update
using (
  public.is_admin()
  and (
    public.get_current_admin_type() = 'super_admin'
    or created_by = public.get_current_admin_id()
  )
);

-- Super Admin can delete any resource, others can only delete their own
drop policy if exists "resources_admin_delete" on public.resources;
create policy "resources_admin_delete" on public.resources
for delete
using (
  public.is_admin()
  and (
    public.get_current_admin_type() = 'super_admin'
    or created_by = public.get_current_admin_id()
  )
);

-- ============================================================================
-- GALLERY POLICIES
-- ============================================================================

-- Public can view published gallery items
drop policy if exists "gallery_public_select" on public.gallery_items;
create policy "gallery_public_select" on public.gallery_items
for select
using (status = 'published' or status is null);

-- Admin and Super Admin have full access to gallery
drop policy if exists "gallery_admin_all" on public.gallery_items;
create policy "gallery_admin_all" on public.gallery_items
for all
using (public.is_admin_or_above())
with check (public.is_admin_or_above());
