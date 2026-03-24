-- Private per-user documents: metadata in Postgres + files in Storage (RLS on both).

create table if not exists public.user_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  storage_path text not null,
  file_name text not null,
  content_type text,
  size_bytes bigint,
  created_at timestamptz not null default now(),
  constraint user_documents_storage_path_key unique (storage_path)
);

create index if not exists idx_user_documents_user_created
  on public.user_documents (user_id, created_at desc);

alter table public.user_documents enable row level security;

drop policy if exists "user_documents_select_own" on public.user_documents;
drop policy if exists "user_documents_insert_own" on public.user_documents;
drop policy if exists "user_documents_update_own" on public.user_documents;
drop policy if exists "user_documents_delete_own" on public.user_documents;

create policy "user_documents_select_own"
  on public.user_documents for select
  to authenticated
  using (auth.uid() = user_id);

create policy "user_documents_insert_own"
  on public.user_documents for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "user_documents_update_own"
  on public.user_documents for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user_documents_delete_own"
  on public.user_documents for delete
  to authenticated
  using (auth.uid() = user_id);

-- Private bucket: object paths must be `{user_id}/{uuid}_{filename}` (first segment = owner).
insert into storage.buckets (id, name, public, file_size_limit)
values ('user-documents', 'user-documents', false, 52428800)
on conflict (id) do nothing;

drop policy if exists "user_documents_storage_select_own" on storage.objects;
drop policy if exists "user_documents_storage_insert_own" on storage.objects;
drop policy if exists "user_documents_storage_update_own" on storage.objects;
drop policy if exists "user_documents_storage_delete_own" on storage.objects;

create policy "user_documents_storage_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'user-documents'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "user_documents_storage_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'user-documents'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "user_documents_storage_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'user-documents'
    and split_part(name, '/', 1) = auth.uid()::text
  )
  with check (
    bucket_id = 'user-documents'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "user_documents_storage_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'user-documents'
    and split_part(name, '/', 1) = auth.uid()::text
  );
