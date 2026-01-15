-- ============================================================================
-- ADMIN SYSTEM TRIGGER FUNCTIONS
-- ============================================================================

-- 1. Auto-update updated_at timestamp for admins
create or replace function public.handle_admin_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_admins_updated_at on public.admins;
create trigger update_admins_updated_at
before update on public.admins
for each row
execute function public.handle_admin_updated_at();


-- ============================================================================
-- EVENT SYSTEM TRIGGER FUNCTIONS
-- ============================================================================

-- 1. Auto-update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply to events table
create trigger update_events_updated_at
before update on public.events
for each row
execute function public.handle_updated_at();

-- ============================================================================
-- 2. Auto-generate slug from title (SEO Best Practice)
-- ============================================================================
create or replace function public.slugify(value text)
returns text as $$
  select lower(
    trim(
      regexp_replace(
        regexp_replace(value, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-'
    )
  );
$$ language sql immutable;

create or replace function public.handle_event_slug()
returns trigger as $$
begin
  if new.slug is null or new.slug = '' then
    new.slug = public.slugify(new.title);
    
    -- Handle duplicate slugs by appending random suffix
    while exists (select 1 from public.events where slug = new.slug and id != new.id) loop
      new.slug = public.slugify(new.title) || '-' || substr(md5(random()::text), 1, 6);
    end loop;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger generate_event_slug
before insert or update of title on public.events
for each row
execute function public.handle_event_slug();

-- ============================================================================
-- 3. Validate event dates
-- ============================================================================
create or replace function public.validate_event_dates()
returns trigger as $$
begin
  -- Ensure end_date is after or equal to date
  if new.end_date is not null and new.date is not null then
    if new.end_date < new.date then
      raise exception 'end_date cannot be before date';
    end if;
  end if;
  
  return new;
end;
$$ language plpgsql;

create trigger validate_event_dates_trigger
before insert or update on public.events
for each row
execute function public.validate_event_dates();

-- ============================================================================
-- 4. Audit log for important changes (Security & Compliance)
-- ============================================================================
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id uuid not null,
  action text not null check (action in ('INSERT', 'UPDATE', 'DELETE')),
  old_data jsonb,
  new_data jsonb,
  changed_by uuid references public.admins(id),
  changed_at timestamptz not null default now()
);
create index if not exists idx_audit_log_record on public.audit_log(table_name, record_id);
create index if not exists idx_audit_log_user on public.audit_log(changed_by);

create or replace function public.log_event_changes()
returns trigger as $$
declare
  current_admin_id uuid;
begin
  -- Get current admin from session
  begin
    current_admin_id := current_setting('app.admin_id', true)::uuid;
  exception when others then
    current_admin_id := null;
  end;

  if TG_OP = 'DELETE' then
    insert into public.audit_log (table_name, record_id, action, old_data, changed_by)
    values (TG_TABLE_NAME, old.id, 'DELETE', to_jsonb(old), current_admin_id);
    return old;
  elsif TG_OP = 'UPDATE' then
    insert into public.audit_log (table_name, record_id, action, old_data, new_data, changed_by)
    values (TG_TABLE_NAME, new.id, 'UPDATE', to_jsonb(old), to_jsonb(new), current_admin_id);
    return new;
  elsif TG_OP = 'INSERT' then
    insert into public.audit_log (table_name, record_id, action, new_data, changed_by)
    values (TG_TABLE_NAME, new.id, 'INSERT', to_jsonb(new), current_admin_id);
    return new;
  end if;
end;
$$ language plpgsql security definer;

-- Apply audit logging to events table
create trigger audit_events_changes
after insert or update or delete on public.events
for each row
execute function public.log_event_changes();

-- ============================================================================
-- 5. Prevent deletion of published events
-- Only super_admins can delete published events
-- ============================================================================
create or replace function public.prevent_published_event_deletion()
returns trigger as $$
declare
  current_admin_type text;
begin
  -- Allow super_admin to delete published events
  select admin_type into current_admin_type
  from public.admins
  where user_id = auth.uid() and is_active = true;
  
  if current_admin_type = 'super_admin' then
    return old;
  end if;
  
  -- For non-super admins, prevent deletion of published events
  if old.status = 'published' then
    raise exception 'Cannot delete published events. Change status to cancelled or completed instead.';
  end if;
  
  return old;
end;
$$ language plpgsql security definer;

create trigger prevent_published_event_deletion_trigger
before delete on public.events
for each row
execute function public.prevent_published_event_deletion();


-- ============================================================================
-- MEMBERS SYSTEM TRIGGER FUNCTIONS
-- ============================================================================

-- 1. Auto-update updated_at timestamp for members
create or replace function public.handle_members_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists update_members_updated_at on public.members;
create trigger update_members_updated_at
before update on public.members
for each row
execute function public.handle_members_updated_at();

-- 2. Validate member email uniqueness
create or replace function public.validate_member_email()
returns trigger as $$
begin
  -- Check if email already exists (excluding current record for updates)
  if exists (
    select 1 from public.members 
    where lower(email) = lower(new.email) 
    and id != coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
  ) then
    raise exception 'Member with this email already exists';
  end if;
  
  return new;
end;
$$ language plpgsql;

drop trigger if exists validate_member_email_trigger on public.members;
create trigger validate_member_email_trigger
before insert or update on public.members
for each row
execute function public.validate_member_email();

-- 3. Validate team and position combinations
create or replace function public.validate_member_position()
returns trigger as $$
begin
  -- Lead Organizer must have position 'lead'
  if new.team_name = 'Lead Organizer' and new.position != 'lead' then
    raise exception 'Lead Organizer must have position "lead"';
  end if;
  
  -- Other teams cannot have position 'lead'
  if new.team_name != 'Lead Organizer' and new.position = 'lead' then
    raise exception 'Only Lead Organizer can have position "lead"';
  end if;
  
  return new;
end;
$$ language plpgsql;

drop trigger if exists validate_member_position_trigger on public.members;
create trigger validate_member_position_trigger
before insert or update on public.members
for each row
execute function public.validate_member_position();

-- 4. Audit log for member changes
drop trigger if exists audit_members_changes on public.members;
create trigger audit_members_changes
after insert or update or delete on public.members
for each row
execute function public.log_event_changes();


-- ============================================================================
-- RESOURCES SYSTEM TRIGGER FUNCTIONS
-- ============================================================================

-- 1. Auto-update updated_at timestamp for resources
drop trigger if exists update_resources_updated_at on public.resources;
create trigger update_resources_updated_at
before update on public.resources
for each row
execute function public.handle_updated_at();

-- 2. Audit log for resource changes
drop trigger if exists audit_resources_changes on public.resources;
create trigger audit_resources_changes
after insert or update or delete on public.resources
for each row
execute function public.log_event_changes();
