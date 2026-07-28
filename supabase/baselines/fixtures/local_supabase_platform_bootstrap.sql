-- VALIDATION ONLY. This fixture is never part of the canonical baseline.
-- It supplies only the Supabase-shaped platform dependencies referenced by
-- application-owned schema and policies.
CREATE ROLE anon NOLOGIN;
CREATE ROLE authenticated NOLOGIN;
CREATE ROLE service_role NOLOGIN BYPASSRLS;
CREATE SCHEMA auth;
CREATE TABLE auth.users (
  id uuid PRIMARY KEY,
  email text NOT NULL CHECK (email LIKE '%.invalid'),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE FUNCTION auth.uid() RETURNS uuid
LANGUAGE sql STABLE
AS 'SELECT NULLIF(current_setting(''request.jwt.claim.sub'', true), '''')::uuid';
CREATE SCHEMA storage;
CREATE TABLE storage.buckets (id text PRIMARY KEY);
CREATE TABLE storage.objects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id text NOT NULL REFERENCES storage.buckets(id),
  name text NOT NULL,
  owner uuid
);
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
GRANT USAGE ON SCHEMA auth, public TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA storage TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE storage.objects TO authenticated;
