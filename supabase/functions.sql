-- ============================================================================
-- ADMIN SYSTEM FUNCTIONS
-- ============================================================================

-- Function to check if current user is super admin
create or replace function public.is_super_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admins
    where user_id = auth.uid()
    and admin_type = 'super_admin' 
    and is_active = true
  );
end;
$$ language plpgsql security definer stable;

-- Function to check if current user is any admin
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.admins
    where user_id = auth.uid()
    and is_active = true
  );
end;
$$ language plpgsql security definer stable;

-- Function to check if current user is admin or super_admin
create or replace function public.is_admin_or_above()
returns boolean as $$
begin
  return exists (
    select 1 from public.admins
    where user_id = auth.uid()
    and admin_type in ('super_admin', 'admin')
    and is_active = true
  );
end;
$$ language plpgsql security definer stable;

-- Function to get current admin's id
create or replace function public.get_current_admin_id()
returns uuid as $$
  select id from public.admins where user_id = auth.uid() and is_active = true limit 1;
$$ language sql security definer stable;

-- Function to get current admin type
create or replace function public.get_current_admin_type()
returns text as $$
  select admin_type from public.admins where user_id = auth.uid() and is_active = true limit 1;
$$ language sql security definer stable;


-- ============================================================================
-- ADMIN LOGIN & MANAGEMENT FUNCTIONS
-- ============================================================================

-- Function to validate admin login credentials
create or replace function public.validate_admin_login(
  p_email text,
  p_team_name text,
  p_admin_position text,
  p_password text
)
returns table(
  admin_id uuid,
  user_id uuid,
  admin_name text,
  email text,
  admin_type text,
  team_name text,
  admin_position text,
  is_active boolean
) as $$
declare
  v_user_id uuid;
  v_password_valid boolean;
begin
  -- First, find the admin by email, team, and position
  select a.user_id into v_user_id
  from public.admins a
  where lower(a.email) = lower(p_email)
    and a.team_name = p_team_name
    and a.admin_position = p_admin_position
    and a.is_active = true;
  
  -- If no admin found with these credentials, return empty
  if v_user_id is null then
    return;
  end if;
  
  -- Validate password against auth.users
  select exists (
    select 1 from auth.users u
    where u.id = v_user_id
      and u.encrypted_password = crypt(p_password, u.encrypted_password)
  ) into v_password_valid;
  
  -- If password invalid, return empty
  if not v_password_valid then
    return;
  end if;
  
  -- Return admin details if all validations pass
  return query
  select 
    a.id,
    a.user_id,
    a.admin_name,
    a.email,
    a.admin_type,
    a.team_name,
    a.admin_position,
    a.is_active
  from public.admins a
  where a.user_id = v_user_id;
end;
$$ language plpgsql security definer;

-- Function to get admin details by user_id
create or replace function public.get_admin_by_user_id(p_user_id uuid)
returns table(
  admin_id uuid,
  admin_name text,
  email text,
  admin_type text,
  team_name text,
  admin_position text,
  is_active boolean
) as $$
begin
  return query
  select 
    a.id,
    a.admin_name,
    a.email,
    a.admin_type,
    a.team_name,
    a.admin_position,
    a.is_active
  from public.admins a
  where a.user_id = p_user_id and a.is_active = true;
end;
$$ language plpgsql security definer stable;

-- Function to create admin with auth user (for super_admin only)
create or replace function public.create_admin_with_auth(
  p_email text,
  p_password text,
  p_admin_name text,
  p_admin_type text,
  p_team_name text,
  p_admin_position text,
  p_is_active boolean default true
)
returns jsonb as $$
declare
  new_user_id uuid;
  new_admin_id uuid;
  caller_admin_type text;
begin
  -- Check if caller is super_admin
  select admin_type into caller_admin_type
  from public.admins
  where user_id = auth.uid() and is_active = true;
  
  if caller_admin_type is null then
    raise exception 'You must be logged in as an admin';
  end if;
  
  if caller_admin_type != 'super_admin' then
    raise exception 'Only super admins can create new admins';
  end if;
  
  -- Create auth user (this bypasses RLS because function is security definer)
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    p_email,
    crypt(p_password, gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    jsonb_build_object('admin_name', p_admin_name),
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
  returning id into new_user_id;
  
  -- Create admin record
  insert into public.admins (
    user_id,
    admin_name,
    email,
    admin_type,
    team_name,
    admin_position,
    is_active,
    created_by
  )
  values (
    new_user_id,
    p_admin_name,
    p_email,
    p_admin_type,
    p_team_name,
    p_admin_position,
    p_is_active,
    (select id from public.admins where user_id = auth.uid())
  )
  returning id into new_admin_id;
  
  return jsonb_build_object(
    'user_id', new_user_id,
    'admin_id', new_admin_id
  );
end;
$$ language plpgsql security definer;

-- Function to update admin (for super_admin only)
create or replace function public.update_admin(
  p_admin_id uuid,
  p_admin_name text,
  p_email text,
  p_admin_type text,
  p_team_name text,
  p_admin_position text,
  p_is_active boolean
)
returns void as $$
declare
  caller_admin_type text;
  target_user_id uuid;
begin
  -- Check if caller is super_admin
  select admin_type into caller_admin_type
  from public.admins
  where user_id = auth.uid() and is_active = true;
  
  if caller_admin_type != 'super_admin' then
    raise exception 'Only super admins can update admins';
  end if;
  
  -- Get target admin's user_id
  select user_id into target_user_id from public.admins where id = p_admin_id;
  
  -- Update admin record
  update public.admins 
  set 
    admin_name = p_admin_name,
    email = p_email,
    admin_type = p_admin_type,
    team_name = p_team_name,
    admin_position = p_admin_position,
    is_active = p_is_active,
    updated_at = now()
  where id = p_admin_id;
  
  -- Update auth user email if changed
  if target_user_id is not null then
    update auth.users
    set email = p_email, updated_at = now()
    where id = target_user_id;
  end if;
end;
$$ language plpgsql security definer;

-- Function to delete admin (for super_admin only)
create or replace function public.delete_admin(p_admin_id uuid)
returns void as $$
declare
  caller_admin_type text;
  caller_admin_id uuid;
  target_user_id uuid;
begin
  -- Get caller's admin info
  select id, admin_type into caller_admin_id, caller_admin_type
  from public.admins
  where user_id = auth.uid() and is_active = true;
  
  if caller_admin_type != 'super_admin' then
    raise exception 'Only super admins can delete admins';
  end if;
  
  -- Prevent self-deletion
  if caller_admin_id = p_admin_id then
    raise exception 'Cannot delete your own admin account';
  end if;
  
  -- Get target admin's user_id
  select user_id into target_user_id from public.admins where id = p_admin_id;
  
  -- Delete admin record
  delete from public.admins where id = p_admin_id;
  
  -- Also delete from auth.users (this will trigger the cascade)
  if target_user_id is not null then
    delete from auth.users where id = target_user_id;
  end if;
end;
$$ language plpgsql security definer;


-- ============================================================================
-- MEMBERS MANAGEMENT FUNCTIONS
-- ============================================================================

-- Function to get all members grouped and ordered by team hierarchy
create or replace function public.get_members_hierarchy()
returns table(
  id uuid,
  name text,
  email text,
  profile_image_url text,
  linkedin_url text,
  github_url text,
  twitter_url text,
  bio text,
  team_name text,
  "position" text,
  display_order int,
  is_active boolean
) as $$
begin
  return query
  select 
    m.id,
    m.name,
    m.email,
    m.profile_image_url,
    m.linkedin_url,
    m.github_url,
    m.twitter_url,
    m.bio,
    m.team_name,
    m."position",
    m.display_order,
    m.is_active
  from public.members m
  where m.is_active = true
  order by 
    -- First: Lead Organizer
    case when m.team_name = 'Lead Organizer' then 0 else 1 end,
    -- Then: Team order
    case m.team_name
      when 'Lead Organizer' then 0
      when 'Technical Team' then 1
      when 'Events & Operations Team' then 2
      when 'PR & Outreach Team' then 3
      when 'Social Media & Content Team' then 4
      when 'Design & Editing Team' then 5
      when 'Disciplinary Committee' then 6
      else 7
    end,
    -- Within team: position order (lead/head, co-head, executive)
    case m."position"
      when 'lead' then 0
      when 'head' then 1
      when 'co-head' then 2
      when 'executive' then 3
      else 4
    end,
    -- Finally: display_order for same position members
    m.display_order,
    m.name;
end;
$$ language plpgsql security definer stable;

-- Function to add a new member (super_admin only)
create or replace function public.add_member(
  p_name text,
  p_email text,
  p_profile_image_url text,
  p_linkedin_url text,
  p_github_url text,
  p_twitter_url text,
  p_bio text,
  p_team_name text,
  p_position text,
  p_display_order int default 0
)
returns uuid as $$
declare
  new_member_id uuid;
  current_admin_id uuid;
begin
  -- Check if caller is super_admin
  if not public.is_super_admin() then
    raise exception 'Only super admins can add members';
  end if;
  
  -- Get current admin id
  select id into current_admin_id 
  from public.admins 
  where user_id = auth.uid() and is_active = true;
  
  -- Insert new member
  insert into public.members (
    name, email, profile_image_url, linkedin_url, github_url, 
    twitter_url, bio, team_name, position, display_order, 
    is_active, created_by
  )
  values (
    p_name, p_email, p_profile_image_url, p_linkedin_url, p_github_url,
    p_twitter_url, p_bio, p_team_name, p_position, p_display_order,
    true, current_admin_id
  )
  returning id into new_member_id;
  
  return new_member_id;
end;
$$ language plpgsql security definer;

-- Function to update member (super_admin only)
create or replace function public.update_member(
  p_member_id uuid,
  p_name text,
  p_email text,
  p_profile_image_url text,
  p_linkedin_url text,
  p_github_url text,
  p_twitter_url text,
  p_bio text,
  p_team_name text,
  p_position text,
  p_display_order int,
  p_is_active boolean
)
returns void as $$
begin
  -- Check if caller is super_admin
  if not public.is_super_admin() then
    raise exception 'Only super admins can update members';
  end if;
  
  -- Update member
  update public.members
  set
    name = p_name,
    email = p_email,
    profile_image_url = p_profile_image_url,
    linkedin_url = p_linkedin_url,
    github_url = p_github_url,
    twitter_url = p_twitter_url,
    bio = p_bio,
    team_name = p_team_name,
    position = p_position,
    display_order = p_display_order,
    is_active = p_is_active,
    updated_at = now()
  where id = p_member_id;
end;
$$ language plpgsql security definer;

-- Function to delete member (super_admin only)
create or replace function public.delete_member(p_member_id uuid)
returns void as $$
begin
  -- Check if caller is super_admin
  if not public.is_super_admin() then
    raise exception 'Only super admins can delete members';
  end if;
  
  -- Delete member
  delete from public.members where id = p_member_id;
end;
$$ language plpgsql security definer;

-- Function to toggle member active status (super_admin only)
create or replace function public.toggle_member_status(p_member_id uuid)
returns boolean as $$
declare
  new_status boolean;
begin
  -- Check if caller is super_admin
  if not public.is_super_admin() then
    raise exception 'Only super admins can toggle member status';
  end if;
  
  -- Toggle status
  update public.members
  set is_active = not is_active, updated_at = now()
  where id = p_member_id
  returning is_active into new_status;
  
  return new_status;
end;
$$ language plpgsql security definer;

-- Function to get members by specific team
create or replace function public.get_members_by_team(p_team_name text)
returns table(
  id uuid,
  name text,
  email text,
  profile_image_url text,
  linkedin_url text,
  github_url text,
  twitter_url text,
  bio text,
  team_name text,
  "position" text,
  display_order int
) as $$
begin
  return query
  select 
    m.id, m.name, m.email, m.profile_image_url,
    m.linkedin_url, m.github_url, m.twitter_url,
    m.bio, m.team_name, m."position", m.display_order
  from public.members m
  where m.team_name = p_team_name
    and m.is_active = true
  order by 
    case m."position"
      when 'lead' then 0
      when 'head' then 1
      when 'co-head' then 2
      when 'executive' then 3
      else 4
    end,
    m.display_order,
    m.name;
end;
$$ language plpgsql security definer stable;

-- Function to count members per team
create or replace function public.get_team_member_counts()
returns table(
  team_name text,
  total_members bigint,
  heads_count bigint,
  executives_count bigint
) as $$
begin
  return query
  select 
    m.team_name,
    count(*)::bigint as total_members,
    count(*) filter (where m.position in ('lead', 'head', 'co-head'))::bigint as heads_count,
    count(*) filter (where m.position = 'executive')::bigint as executives_count
  from public.members m
  where m.is_active = true
  group by m.team_name
  order by 
    case m.team_name
      when 'Lead Organizer' then 0
      when 'Technical Team' then 1
      when 'Events & Operations Team' then 2
      when 'PR & Outreach Team' then 3
      when 'Social Media & Content Team' then 4
      when 'Design & Editing Team' then 5
      when 'Disciplinary Committee' then 6
      else 7
    end;
end;
$$ language plpgsql security definer stable;

-- Function to reorder members within a team/position
create or replace function public.reorder_members(
  p_member_ids uuid[],
  p_new_orders int[]
)
returns void as $$
declare
  i int;
begin
  -- Check if caller is super_admin
  if not public.is_super_admin() then
    raise exception 'Only super admins can reorder members';
  end if;
  
  -- Validate arrays have same length
  if array_length(p_member_ids, 1) != array_length(p_new_orders, 1) then
    raise exception 'Member IDs and orders arrays must have same length';
  end if;
  
  -- Update display order for each member
  for i in 1..array_length(p_member_ids, 1) loop
    update public.members
    set display_order = p_new_orders[i], updated_at = now()
    where id = p_member_ids[i];
  end loop;
end;
$$ language plpgsql security definer;
