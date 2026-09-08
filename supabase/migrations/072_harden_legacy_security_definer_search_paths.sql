alter function public.reject_document_step_proof(uuid, text)
set search_path = pg_catalog, pg_temp;

alter function public.confirm_document_step_proof(uuid, text)
set search_path = pg_catalog, pg_temp;

alter function public.i18n_insert_translations_if_missing(text, jsonb)
set search_path = pg_catalog, pg_temp;

alter function public.enqueue_document_intelligence_job(uuid, uuid)
set search_path = pg_catalog, pg_temp;

alter function public.claim_next_document_intelligence_job(integer)
set search_path = pg_catalog, pg_temp;
