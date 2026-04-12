-- Document Intelligence Phase 1: classification fields on user_documents.
-- Does not auto-mutate profiles or UserState; stores explainable signals only.

alter table public.user_documents
  add column if not exists document_type_id text references public.document_types (id) on delete set null,
  add column if not exists classification_status text not null default 'pending',
  add column if not exists classification_confidence numeric,
  add column if not exists classification_method text,
  add column if not exists extracted_metadata jsonb;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'user_documents_classification_status_check'
  ) then
    alter table public.user_documents
      add constraint user_documents_classification_status_check check (
        classification_status in ('pending', 'completed', 'unknown', 'failed')
      );
  end if;
end $$;

create index if not exists user_documents_document_type_id_idx
  on public.user_documents (document_type_id)
  where document_type_id is not null;

create index if not exists user_documents_classification_status_idx
  on public.user_documents (classification_status);
