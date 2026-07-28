-- 031_PRE_KNOWLEDGE_SCHEMA_BASELINE
-- Canonical, schema-only, single-use state through migration 031.
-- Supabase platform objects (auth.*, storage.* and roles) are intentionally absent.
-- Execution: ON_ERROR_STOP is required; every object must be absent before use.
-- The transaction makes any failure atomic. No migration-history rows are written.
BEGIN;

-- Extensions and application-owned schemas.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum/composite types: no canonical pre-032 application-owned types.
-- Tables. Named keys, foreign keys and checks are declared inline so PostgreSQL
-- preserves the canonical constraint identities while dependencies are created.
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  family_status text, employment_type text, language_level text, goals text[],
  dna jsonb NOT NULL DEFAULT '{}'::jsonb, dna_updated_at timestamptz,
  has_steuer_id boolean, has_health_insurance boolean, has_bank_account boolean,
  registered_arbeitsagentur boolean, has_children boolean, children_school_age boolean,
  has_cv boolean, job_search_urgency text, has_address_registration boolean,
  region text, city text, country text DEFAULT 'DE', bundesland text, postal_code text,
  registration_status text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT profiles_registration_status_check CHECK (
    registration_status IS NULL OR registration_status IN ('unknown','not_registered','appointment_booked','registered'))
);

CREATE TABLE public.phrases (
 id uuid PRIMARY KEY DEFAULT uuid_generate_v4(), level text NOT NULL CHECK(level IN ('A0','A1','A2','B1','B2','C1')),
 category text NOT NULL CHECK(category IN ('job','tax','wohnung')),
 sector text CHECK (sector IN ('warehouse','production','gastro','cleaning','construction','care','delivery','office')),
 de_text text NOT NULL, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now());
CREATE TABLE public.phrase_translations (
 phrase_id uuid NOT NULL REFERENCES public.phrases(id) ON DELETE CASCADE, locale text NOT NULL,
 text text NOT NULL, PRIMARY KEY(phrase_id,locale),
 CONSTRAINT phrase_translations_locale_check CHECK (locale IN ('sk','hu','pl','cs','ro','bg','uk','tr')));

CREATE TABLE public.knowledge_topics (
 id text PRIMARY KEY, slug text NOT NULL UNIQUE, title_key text NOT NULL, category text NOT NULL,
 description_key text, sort_order integer NOT NULL DEFAULT 0, is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.knowledge_steps (
 id text PRIMARY KEY, topic_id text NOT NULL REFERENCES public.knowledge_topics(id) ON DELETE CASCADE,
 slug text NOT NULL, title_key text NOT NULL, description_key text, sort_order integer NOT NULL DEFAULT 0,
 is_critical boolean NOT NULL DEFAULT false, action_id text, is_active boolean NOT NULL DEFAULT true,
 profile_flag_key text, eligibility_criteria jsonb, created_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT knowledge_steps_topic_slug_key UNIQUE(topic_id, slug));
CREATE TABLE public.knowledge_step_dependencies (
 step_id text NOT NULL REFERENCES public.knowledge_steps(id) ON DELETE CASCADE,
 depends_on_step_id text NOT NULL REFERENCES public.knowledge_steps(id) ON DELETE CASCADE,
 dependency_group text, PRIMARY KEY(step_id,depends_on_step_id),
 CONSTRAINT knowledge_step_dependencies_no_self CHECK(step_id <> depends_on_step_id));
CREATE TABLE public.document_types (
 id text PRIMARY KEY, slug text NOT NULL UNIQUE, title_key text NOT NULL, description_key text,
 category text, is_active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.document_type_step_links (
 document_type_id text NOT NULL REFERENCES public.document_types(id) ON DELETE CASCADE,
 step_id text NOT NULL REFERENCES public.knowledge_steps(id) ON DELETE CASCADE,
 link_type text NOT NULL,
 CONSTRAINT document_type_step_links_type_check CHECK(link_type IN ('required','proof','supporting')),
 PRIMARY KEY(document_type_id,step_id,link_type));

CREATE TABLE public.user_documents (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 file_path text NOT NULL UNIQUE, file_name text, mime_type text, created_at timestamptz NOT NULL DEFAULT now(),
 extracted_text text, document_type_id text REFERENCES public.document_types(id) ON DELETE SET NULL,
 classification_status text NOT NULL DEFAULT 'pending' CHECK(classification_status IN ('pending','completed','unknown','failed')),
 classification_confidence numeric, classification_method text, extracted_metadata jsonb, classification_notes jsonb);
CREATE TABLE public.user_progress (
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, action_id text NOT NULL,
 status text NOT NULL CHECK(status IN ('pending','completed')), completed_at timestamptz, PRIMARY KEY(user_id,action_id));
CREATE TABLE public.user_action_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 action_id text NOT NULL, event_type text NOT NULL CHECK(event_type IN ('click','complete')), created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.user_document_step_verifications (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 document_id uuid NOT NULL REFERENCES public.user_documents(id) ON DELETE CASCADE,
 step_id text NOT NULL REFERENCES public.knowledge_steps(id) ON DELETE RESTRICT,
 status text NOT NULL CHECK(status IN ('confirmed','rejected')), created_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT user_document_step_verifications_user_doc_step_key UNIQUE(user_id,document_id,step_id));
CREATE TABLE public.user_step_state (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 step_id text NOT NULL REFERENCES public.knowledge_steps(id) ON DELETE CASCADE,
 status text NOT NULL CHECK(status IN ('blocked','eligible','in_progress','completed','verified')),
 source text NOT NULL DEFAULT 'system' CHECK(source IN ('system','manual','proof','legacy_progress')),
 action_id text, document_id uuid REFERENCES public.user_documents(id) ON DELETE SET NULL, notes jsonb,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT user_step_state_user_step_unique UNIQUE(user_id,step_id));
CREATE TABLE public.document_intelligence_jobs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), document_id uuid NOT NULL REFERENCES public.user_documents(id) ON DELETE CASCADE,
 user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE, status text NOT NULL DEFAULT 'queued'
 CHECK(status IN ('pending','processing','queued','running','completed','failed')), attempt_count integer NOT NULL DEFAULT 0 CHECK(attempt_count >= 0),
 lease_token uuid, lease_expires_at timestamptz, last_error text, last_error_at timestamptz, scheduled_at timestamptz NOT NULL DEFAULT now(),
 started_at timestamptz, finished_at timestamptz, result jsonb, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT document_intelligence_jobs_lease_check CHECK (
   (status <> 'running' AND lease_token IS NULL AND lease_expires_at IS NULL)
   OR (status = 'running' AND lease_token IS NOT NULL AND lease_expires_at IS NOT NULL)),
 CONSTRAINT document_intelligence_jobs_one_per_document UNIQUE (document_id));
CREATE TABLE public.i18n_translations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), locale text NOT NULL, key text NOT NULL, value text NOT NULL,
 source text NOT NULL DEFAULT 'llm', created_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT i18n_translations_locale_key_unique UNIQUE(locale,key));
CREATE TABLE public.i18n_jobs (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), locale text NOT NULL, status text NOT NULL DEFAULT 'pending'
 CHECK(status IN ('pending','running','completed','failed','cancelled')), created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE public.user_phrase_state (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
 phrase_id text NOT NULL, is_favorite boolean NOT NULL DEFAULT true, repetitions integer NOT NULL DEFAULT 0,
 interval_days integer NOT NULL DEFAULT 1, ease_factor double precision NOT NULL DEFAULT 2.5, due_at timestamptz NOT NULL DEFAULT now(),
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT user_phrase_state_user_phrase_unique UNIQUE(user_id,phrase_id));

-- Explicit indexes.
CREATE INDEX profiles_dna_gin_idx ON public.profiles USING gin (dna);
CREATE INDEX profiles_location_idx ON public.profiles (country, bundesland, city);
CREATE INDEX idx_phrases_level ON public.phrases(level);
CREATE INDEX idx_phrases_category ON public.phrases(category);
CREATE INDEX idx_phrases_sector ON public.phrases(sector);
CREATE INDEX idx_phrase_translations_locale ON public.phrase_translations(locale);
CREATE INDEX idx_phrase_translations_phrase_id ON public.phrase_translations(phrase_id);
CREATE INDEX knowledge_topics_category_idx ON public.knowledge_topics(category);
CREATE INDEX knowledge_topics_sort_idx ON public.knowledge_topics(sort_order);
CREATE INDEX knowledge_steps_topic_id_idx ON public.knowledge_steps(topic_id);
CREATE INDEX knowledge_steps_topic_sort_idx ON public.knowledge_steps(topic_id,sort_order);
CREATE INDEX knowledge_steps_action_id_idx ON public.knowledge_steps(action_id) WHERE action_id IS NOT NULL;
CREATE INDEX idx_knowledge_steps_action_id ON public.knowledge_steps(action_id) WHERE is_active;
CREATE UNIQUE INDEX uq_knowledge_steps_action_id_active ON public.knowledge_steps(action_id) WHERE is_active AND action_id IS NOT NULL;
CREATE INDEX knowledge_step_dependencies_depends_idx ON public.knowledge_step_dependencies(depends_on_step_id);
CREATE INDEX document_types_category_idx ON public.document_types(category) WHERE category IS NOT NULL;
CREATE INDEX document_type_step_links_step_idx ON public.document_type_step_links(step_id);
CREATE INDEX idx_user_documents_user_created ON public.user_documents(user_id,created_at DESC);
CREATE INDEX user_documents_document_type_id_idx ON public.user_documents(document_type_id) WHERE document_type_id IS NOT NULL;
CREATE INDEX user_documents_classification_status_idx ON public.user_documents(classification_status);
CREATE INDEX user_progress_user_id_idx ON public.user_progress(user_id);
CREATE INDEX user_action_events_user_id_idx ON public.user_action_events(user_id); CREATE INDEX user_action_events_action_id_idx ON public.user_action_events(action_id);
CREATE INDEX user_document_step_verifications_user_doc_idx ON public.user_document_step_verifications(user_id,document_id);
CREATE INDEX user_step_state_user_idx ON public.user_step_state(user_id,updated_at DESC);
CREATE INDEX document_intelligence_jobs_status_scheduled_idx ON public.document_intelligence_jobs(status,scheduled_at);
CREATE INDEX document_intelligence_jobs_lease_expiry_idx ON public.document_intelligence_jobs(status,lease_expires_at) WHERE status='running';
CREATE INDEX document_intelligence_jobs_user_created_idx ON public.document_intelligence_jobs(user_id,created_at DESC);
CREATE INDEX document_intelligence_jobs_user_id_idx ON public.document_intelligence_jobs(user_id);
CREATE INDEX document_intelligence_jobs_document_id_idx ON public.document_intelligence_jobs(document_id);
CREATE INDEX document_intelligence_jobs_status_idx ON public.document_intelligence_jobs(status);
CREATE INDEX i18n_translations_locale_idx ON public.i18n_translations(locale); CREATE INDEX i18n_jobs_locale_created_idx ON public.i18n_jobs(locale,created_at DESC);

-- Functions.
CREATE FUNCTION public.update_updated_at_column() RETURNS trigger LANGUAGE plpgsql
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE FUNCTION public.reject_document_step_proof(p_document_id uuid, p_step_id text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RETURN jsonb_build_object('ok', false, 'error', 'unauthorized'); END IF;
  IF NOT EXISTS (SELECT 1 FROM public.user_documents d WHERE d.id=p_document_id AND d.user_id=v_uid)
    THEN RETURN jsonb_build_object('ok', false, 'error', 'document_not_found'); END IF;
  IF EXISTS (SELECT 1 FROM public.user_document_step_verifications v
             WHERE v.user_id=v_uid AND v.document_id=p_document_id AND v.step_id=p_step_id)
    THEN RETURN jsonb_build_object('ok', false, 'error', 'already_responded'); END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.user_documents d
    JOIN public.document_type_step_links l ON l.document_type_id=d.document_type_id
    WHERE d.id=p_document_id AND d.user_id=v_uid AND l.step_id=p_step_id AND l.link_type='proof'
  ) THEN RETURN jsonb_build_object('ok', false, 'error', 'not_a_proof_step_for_document'); END IF;
  INSERT INTO public.user_document_step_verifications(user_id,document_id,step_id,status)
  VALUES(v_uid,p_document_id,p_step_id,'rejected');
  RETURN jsonb_build_object('ok', true);
END $$;

CREATE FUNCTION public.confirm_document_step_proof(p_document_id uuid, p_step_id text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_uid uuid := auth.uid(); v_doc record; v_action_id text; v_profile_key text; v_now timestamptz := now();
BEGIN
  IF v_uid IS NULL THEN RETURN jsonb_build_object('ok', false, 'error', 'unauthorized'); END IF;
  SELECT d.id,d.user_id,d.document_type_id,d.classification_status,d.classification_confidence
  INTO v_doc FROM public.user_documents d
  WHERE d.id=p_document_id AND d.user_id=v_uid FOR UPDATE;
  IF NOT FOUND THEN RETURN jsonb_build_object('ok', false, 'error', 'document_not_found'); END IF;
  IF v_doc.classification_status IS DISTINCT FROM 'completed'
     OR v_doc.document_type_id IS NULL OR coalesce(v_doc.classification_confidence,0)<0.65
    THEN RETURN jsonb_build_object('ok', false, 'error', 'classification_not_eligible'); END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.document_type_step_links l
    JOIN public.knowledge_steps s ON s.id=l.step_id
    JOIN public.knowledge_topics t ON t.id=s.topic_id
    WHERE l.document_type_id=v_doc.document_type_id AND l.step_id=p_step_id
      AND l.link_type='proof' AND s.is_active=true AND t.is_active=true
  ) THEN RETURN jsonb_build_object('ok', false, 'error', 'not_a_proof_step_for_document'); END IF;
  IF EXISTS (SELECT 1 FROM public.user_document_step_verifications v
             WHERE v.user_id=v_uid AND v.document_id=p_document_id AND v.step_id=p_step_id)
    THEN RETURN jsonb_build_object('ok', false, 'error', 'already_responded'); END IF;
  SELECT s.action_id,s.profile_flag_key INTO v_action_id,v_profile_key
  FROM public.knowledge_steps s WHERE s.id=p_step_id AND s.is_active=true;
  INSERT INTO public.user_document_step_verifications(user_id,document_id,step_id,status)
  VALUES(v_uid,p_document_id,p_step_id,'confirmed');
  IF v_action_id IS NOT NULL AND length(trim(v_action_id))>0 THEN
    INSERT INTO public.user_progress(user_id,action_id,status,completed_at)
    VALUES(v_uid,v_action_id,'completed',v_now)
    ON CONFLICT(user_id,action_id) DO UPDATE SET status='completed',completed_at=excluded.completed_at;
  END IF;
  IF v_profile_key='has_steuer_id' THEN UPDATE public.profiles SET has_steuer_id=true WHERE id=v_uid;
  ELSIF v_profile_key='has_health_insurance' THEN UPDATE public.profiles SET has_health_insurance=true WHERE id=v_uid;
  ELSIF v_profile_key='has_address_registration' THEN UPDATE public.profiles SET has_address_registration=true WHERE id=v_uid;
  END IF;
  RETURN jsonb_build_object('ok', true);
END $$;

CREATE FUNCTION public.i18n_insert_translations_if_missing(p_locale text,p_items jsonb)
RETURNS bigint LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  WITH ins AS (
    INSERT INTO public.i18n_translations(locale,key,value,source)
    SELECT p_locale,e->>'key',e->>'value',coalesce(nullif(trim(e->>'source'),''),'llm')
    FROM jsonb_array_elements(p_items) AS e
    WHERE (e->>'key') IS NOT NULL AND length(trim(e->>'key'))>0
      AND (e->>'value') IS NOT NULL AND length(trim(e->>'value'))>0
    ON CONFLICT(locale,key) DO NOTHING RETURNING 1
  ) SELECT coalesce((SELECT count(*)::bigint FROM ins),0::bigint)
$$;

CREATE FUNCTION public.enqueue_document_intelligence_job(p_document_id uuid,p_user_id uuid)
RETURNS public.document_intelligence_jobs LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE j public.document_intelligence_jobs; doc_owner uuid;
BEGIN
  SELECT ud.user_id INTO doc_owner FROM public.user_documents ud WHERE ud.id=p_document_id;
  IF doc_owner IS NULL OR doc_owner<>p_user_id THEN RAISE EXCEPTION 'document ownership mismatch'; END IF;
  INSERT INTO public.document_intelligence_jobs(document_id,user_id,status,scheduled_at)
  VALUES(p_document_id,p_user_id,'queued',now())
  ON CONFLICT(document_id) DO UPDATE SET
    user_id=excluded.user_id,
    status=CASE WHEN public.document_intelligence_jobs.status='running'
      AND public.document_intelligence_jobs.lease_expires_at IS NOT NULL
      AND public.document_intelligence_jobs.lease_expires_at>now()
      THEN public.document_intelligence_jobs.status ELSE 'queued' END,
    scheduled_at=CASE WHEN public.document_intelligence_jobs.status='running'
      AND public.document_intelligence_jobs.lease_expires_at IS NOT NULL
      AND public.document_intelligence_jobs.lease_expires_at>now()
      THEN public.document_intelligence_jobs.scheduled_at ELSE now() END,
    finished_at=NULL,last_error=NULL,last_error_at=NULL,
    lease_token=CASE WHEN public.document_intelligence_jobs.status='running'
      AND public.document_intelligence_jobs.lease_expires_at IS NOT NULL
      AND public.document_intelligence_jobs.lease_expires_at>now()
      THEN public.document_intelligence_jobs.lease_token ELSE NULL END,
    lease_expires_at=CASE WHEN public.document_intelligence_jobs.status='running'
      AND public.document_intelligence_jobs.lease_expires_at IS NOT NULL
      AND public.document_intelligence_jobs.lease_expires_at>now()
      THEN public.document_intelligence_jobs.lease_expires_at ELSE NULL END
  RETURNING * INTO j;
  RETURN j;
END $$;

CREATE FUNCTION public.claim_next_document_intelligence_job(p_lease_seconds integer DEFAULT 120)
RETURNS public.document_intelligence_jobs LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE j public.document_intelligence_jobs;
BEGIN
  WITH candidate AS (
    SELECT id FROM public.document_intelligence_jobs
    WHERE (status='queued' AND scheduled_at<=now())
       OR (status='running' AND lease_expires_at IS NOT NULL AND lease_expires_at<=now())
       OR (status='failed' AND scheduled_at<=now())
    ORDER BY scheduled_at ASC FOR UPDATE SKIP LOCKED LIMIT 1
  )
  UPDATE public.document_intelligence_jobs AS jobs SET
    status='running',attempt_count=jobs.attempt_count+1,lease_token=gen_random_uuid(),
    lease_expires_at=now()+make_interval(secs=>greatest(10,p_lease_seconds)),
    started_at=coalesce(jobs.started_at,now()),finished_at=NULL
  WHERE jobs.id IN (SELECT id FROM candidate) RETURNING * INTO j;
  RETURN j;
END $$;

-- Triggers.
CREATE TRIGGER update_phrases_updated_at BEFORE UPDATE ON public.phrases
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_step_state_updated_at BEFORE UPDATE ON public.user_step_state
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER document_intelligence_jobs_set_updated_at BEFORE UPDATE ON public.document_intelligence_jobs
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER update_user_phrase_state_updated_at BEFORE UPDATE ON public.user_phrase_state
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS enablement.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phrases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phrase_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_step_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_type_step_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_action_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_document_step_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_step_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_intelligence_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.i18n_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.i18n_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_phrase_state ENABLE ROW LEVEL SECURITY;

-- Policies.
CREATE POLICY "Allow public read access to phrases" ON public.phrases FOR SELECT USING (true);
CREATE POLICY "Allow public read access to phrase_translations" ON public.phrase_translations FOR SELECT USING (true);
CREATE POLICY profiles_select_own ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY profiles_insert_own ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_update_own ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY user_documents_select_own ON public.user_documents FOR SELECT TO authenticated USING(auth.uid()=user_id);
CREATE POLICY user_documents_insert_own ON public.user_documents FOR INSERT TO authenticated WITH CHECK(auth.uid()=user_id);
CREATE POLICY user_documents_update_own ON public.user_documents FOR UPDATE TO authenticated USING(auth.uid()=user_id) WITH CHECK(auth.uid()=user_id);
CREATE POLICY user_documents_delete_own ON public.user_documents FOR DELETE TO authenticated USING(auth.uid()=user_id);

CREATE POLICY documents_storage_select_own ON storage.objects FOR SELECT TO authenticated
USING(bucket_id='documents' AND split_part(name,'/',1)=auth.uid()::text);
CREATE POLICY documents_storage_insert_own ON storage.objects FOR INSERT TO authenticated
WITH CHECK(bucket_id='documents' AND split_part(name,'/',1)=auth.uid()::text);
CREATE POLICY documents_storage_update_own ON storage.objects FOR UPDATE TO authenticated
USING(bucket_id='documents' AND split_part(name,'/',1)=auth.uid()::text)
WITH CHECK(bucket_id='documents' AND split_part(name,'/',1)=auth.uid()::text);
CREATE POLICY documents_storage_delete_own ON storage.objects FOR DELETE TO authenticated
USING(bucket_id='documents' AND split_part(name,'/',1)=auth.uid()::text);

CREATE POLICY "Users can read own user_progress" ON public.user_progress FOR SELECT USING(auth.uid()=user_id);
CREATE POLICY "Users can insert own user_progress" ON public.user_progress FOR INSERT WITH CHECK(auth.uid()=user_id);
CREATE POLICY "Users can update own user_progress" ON public.user_progress FOR UPDATE
USING(auth.uid()=user_id) WITH CHECK(auth.uid()=user_id);
CREATE POLICY "Users can read own user_action_events" ON public.user_action_events FOR SELECT USING(auth.uid()=user_id);
CREATE POLICY "Users can insert own user_action_events" ON public.user_action_events FOR INSERT WITH CHECK(auth.uid()=user_id);

CREATE POLICY knowledge_topics_select_active_authenticated ON public.knowledge_topics FOR SELECT TO authenticated
USING(is_active=true);
CREATE POLICY knowledge_steps_select_active_authenticated ON public.knowledge_steps FOR SELECT TO authenticated
USING(is_active=true AND EXISTS(
  SELECT 1 FROM public.knowledge_topics t WHERE t.id=topic_id AND t.is_active=true));
CREATE POLICY knowledge_step_dependencies_select_authenticated ON public.knowledge_step_dependencies FOR SELECT TO authenticated
USING(
  EXISTS(SELECT 1 FROM public.knowledge_steps s JOIN public.knowledge_topics t ON t.id=s.topic_id
         WHERE s.id=step_id AND s.is_active=true AND t.is_active=true)
  AND EXISTS(SELECT 1 FROM public.knowledge_steps s2 JOIN public.knowledge_topics t2 ON t2.id=s2.topic_id
             WHERE s2.id=depends_on_step_id AND s2.is_active=true AND t2.is_active=true));
CREATE POLICY document_types_select_active_authenticated ON public.document_types FOR SELECT TO authenticated
USING(is_active=true);
CREATE POLICY document_type_step_links_select_authenticated ON public.document_type_step_links FOR SELECT TO authenticated
USING(
  EXISTS(SELECT 1 FROM public.document_types dt WHERE dt.id=document_type_id AND dt.is_active=true)
  AND EXISTS(SELECT 1 FROM public.knowledge_steps s JOIN public.knowledge_topics t ON t.id=s.topic_id
             WHERE s.id=step_id AND s.is_active=true AND t.is_active=true));

CREATE POLICY user_document_step_verifications_select_own ON public.user_document_step_verifications
FOR SELECT TO authenticated USING(auth.uid()=user_id);
CREATE POLICY i18n_translations_select_public ON public.i18n_translations FOR SELECT TO anon,authenticated USING(true);
CREATE POLICY i18n_jobs_deny_all ON public.i18n_jobs FOR ALL TO authenticated,anon USING(false) WITH CHECK(false);
CREATE POLICY user_step_state_select_own ON public.user_step_state FOR SELECT TO authenticated USING(auth.uid()=user_id);
CREATE POLICY user_step_state_insert_own ON public.user_step_state FOR INSERT TO authenticated WITH CHECK(auth.uid()=user_id);
CREATE POLICY user_step_state_update_own ON public.user_step_state FOR UPDATE TO authenticated
USING(auth.uid()=user_id) WITH CHECK(auth.uid()=user_id);
CREATE POLICY document_intelligence_jobs_select_own ON public.document_intelligence_jobs
FOR SELECT TO authenticated USING(auth.uid()=user_id);
CREATE POLICY document_intelligence_jobs_insert_own ON public.document_intelligence_jobs
FOR INSERT TO authenticated WITH CHECK(auth.uid()=user_id);
CREATE POLICY document_intelligence_jobs_update_own ON public.document_intelligence_jobs
FOR UPDATE TO authenticated USING(auth.uid()=user_id) WITH CHECK(auth.uid()=user_id);
CREATE POLICY document_intelligence_jobs_delete_own ON public.document_intelligence_jobs
FOR DELETE TO authenticated USING(auth.uid()=user_id);
CREATE POLICY user_phrase_state_select_own ON public.user_phrase_state FOR SELECT TO authenticated USING(auth.uid()=user_id);
CREATE POLICY user_phrase_state_insert_own ON public.user_phrase_state FOR INSERT TO authenticated WITH CHECK(auth.uid()=user_id);
CREATE POLICY user_phrase_state_update_own ON public.user_phrase_state FOR UPDATE TO authenticated
USING(auth.uid()=user_id) WITH CHECK(auth.uid()=user_id);
CREATE POLICY user_phrase_state_delete_own ON public.user_phrase_state FOR DELETE TO authenticated USING(auth.uid()=user_id);

-- Grants and revokes.
REVOKE ALL ON TABLE public.profiles FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE ON TABLE public.profiles TO authenticated;
REVOKE ALL ON FUNCTION public.reject_document_step_proof(uuid,text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.confirm_document_step_proof(uuid,text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.i18n_insert_translations_if_missing(text,jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.enqueue_document_intelligence_job(uuid,uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.claim_next_document_intelligence_job(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.reject_document_step_proof(uuid,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_document_step_proof(uuid,text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.i18n_insert_translations_if_missing(text,jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.enqueue_document_intelligence_job(uuid,uuid) TO service_role;
GRANT EXECUTE ON FUNCTION public.claim_next_document_intelligence_job(integer) TO service_role;

-- Deterministic closure: schema-only baseline through migration 031.
COMMIT;
