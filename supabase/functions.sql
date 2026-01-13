-- ============================================================================
-- ADMIN SYSTEM FUNCTIONS
-- ============================================================================

-- ============================================================================
-- RLS HELPER FUNCTIONS (using Supabase Auth)
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
