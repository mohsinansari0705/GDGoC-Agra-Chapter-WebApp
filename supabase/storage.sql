-- ============================================================================
-- EVENT IMAGES STORAGE RLS POLICIES
-- ============================================================================

-- Public can view/download event images
drop policy if exists "event_images_public_select" on storage.objects;
create policy "event_images_public_select"
on storage.objects for select
using (bucket_id = 'event-images');

-- Only admin and super_admin can upload event images
drop policy if exists "event_images_admin_insert" on storage.objects;
create policy "event_images_admin_insert"
on storage.objects for insert
with check (
  bucket_id = 'event-images'
  and public.is_admin_or_above()
);

-- Only admin and super_admin can update event images
drop policy if exists "event_images_admin_update" on storage.objects;
create policy "event_images_admin_update"
on storage.objects for update
using (
  bucket_id = 'event-images'
  and public.is_admin_or_above()
);

-- Only admin and super_admin can delete event images
drop policy if exists "event_images_admin_delete" on storage.objects;
create policy "event_images_admin_delete"
on storage.objects for delete
using (
  bucket_id = 'event-images'
  and public.is_admin_or_above()
);
