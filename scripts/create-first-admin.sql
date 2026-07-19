-- Replace the email below, then execute with a service role connection.
-- This does not create the auth user; sign up once first, then promote that user.

with target_user as (
  select id
  from auth.users
  where lower(email) = lower('admin@example.test')
  limit 1
)
insert into public.user_roles (user_id, role)
select id, 'admin'::public.user_role
from target_user
on conflict do nothing;

insert into public.admin_audit_logs (actor_id, action, entity_table, entity_id, metadata)
select id, 'promote_first_admin', 'user_roles', id, jsonb_build_object('source', 'scripts/create-first-admin.sql')
from target_user;
