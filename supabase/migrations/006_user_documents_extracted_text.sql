-- Documents v3: optional extracted plain text (PDF, text/*, DOCX — no OCR).

alter table public.user_documents
  add column if not exists extracted_text text;

drop policy if exists "user_documents_update_own" on public.user_documents;

create policy "user_documents_update_own"
  on public.user_documents for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
