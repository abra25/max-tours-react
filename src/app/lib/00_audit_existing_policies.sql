-- READ-ONLY AUDIT: run in Supabase SQL Editor, then share the results (no secrets).
-- We need these results BEFORE changing live packages/bookings/storage policies.
select schemaname, tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where (schemaname = 'public' and tablename in ('packages', 'bookings', 'admin_users'))
   or (schemaname = 'storage' and tablename = 'objects')
order by schemaname, tablename, policyname;

select n.nspname as schema_name, c.relname as table_name,
       c.relrowsecurity as rls_enabled
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where (n.nspname='public' and c.relname in ('packages','bookings','admin_users'))
order by c.relname;

select id, name, public as is_public from storage.buckets where id = 'tour-images';
