# Production runbook (Vaylo)

Single reference for predictable deploys. **Do not put real secrets in git**—use your platform’s env UI and `.env.example` as the variable list only.

## Hard rules

| Rule | Why |
|------|-----|
| **Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client** | It bypasses RLS; treat like a root password. Server-only env, never `NEXT_PUBLIC_*`. |
| **`CRON_SECRET` must be a long random string** | Protects document-intelligence worker HTTP endpoints; short or default values are trivially brute-forced. |
| **Debug flags must be disabled in production** | See *Dangerous flags* below—extra surfaces, verbose errors, or internal APIs. |
| **Apply migrations through the latest numbered file in `supabase/migrations/` before deploying app code that needs them** | Avoid runtime failures and partial schema. |
| **After migration, run DB verification and smoke tests** | `db:verify` catches missing tables/columns; smoke tests catch auth, storage, and jobs. |

## Deployment checklist

- [ ] Staging: migrations applied through latest numbered migration.
- [ ] Staging: `npm run db:verify` passes (with `SUPABASE_SERVICE_ROLE_KEY` + URL for that environment).
- [ ] Staging: smoke tests pass (below).
- [ ] Production: same migration version as the release branch expects.
- [ ] Production: `npm run db:verify` passes.
- [ ] Production: all required env vars set (compare `.env.example`).
- [ ] Production: deploy app **after** DB is verified.
- [ ] Production: smoke tests pass.

## Migration checklist

- [ ] No manual SQL in Supabase UI unless immediately captured as a new migration in git.
- [ ] Do **not** edit already-applied migration files—add a new numbered migration.
- [ ] Apply migrations in order up to the highest `NNN_*.sql` in `supabase/migrations/`.
- [ ] Run `npm run db:verify` against the target project.
- [ ] Only then deploy application code that depends on the new schema.

More detail: [MIGRATIONS.md](./MIGRATIONS.md).

## Supabase checklist

- [ ] **Auth:** Production redirect URLs and site URL match your deployed domain.
- [ ] **RLS:** Core tables use RLS as defined in migrations (e.g. `user_documents`, `user_progress`, `user_step_state`, `user_phrase_state`, `user_action_events`).
- [ ] **RPCs:** Security-definer functions (e.g. document intelligence enqueue) are updated by migrations—do not drift from repo SQL.
- [ ] **Secrets:** `anon` + `service_role` keys come from the Supabase project dashboard; only anon + URL are `NEXT_PUBLIC_*`.

## Storage checklist

- [ ] Documents bucket is **private** (`public: false`), not world-readable.
- [ ] Policies require object path first segment to match `auth.uid()` (see migrations—`documents` bucket).
- [ ] Application uses signed URLs for downloads, not permanent public links.

## Cron / worker checklist

- [ ] `CRON_SECRET` is set in the server environment.
- [ ] Cron or scheduler calls the document-intelligence worker route with header `x-cron-secret: <CRON_SECRET>` (see app route under `app/api/internal/document-intelligence/worker/`).
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is available **only** to server runtime that runs workers / enqueue—not to the browser.

## Security checklist

- [ ] No `NEXT_PUBLIC_*` variable holds the service role key.
- [ ] Internal debug routes (e.g. step-state debug) return 404 unless explicitly enabled **and** `VAYLO_INTERNAL_DEBUG_SECRET` is set—prefer **off** in prod.
- [ ] Production API errors: generic client messages; no stack traces or raw DB internals to end users (use existing safe error helpers).
- [ ] OpenAI keys only on server; never in client bundles.

## Dangerous flags that must stay off in production

Unless you have a **documented, time-bounded** reason and accept the risk:

| Variable | Risk if enabled |
|----------|-----------------|
| `I18N_STEP_STATE_DEBUG=1` / `VAYLO_STEP_STATE_DEBUG=1` | Can expose internal step-state API when combined with `VAYLO_INTERNAL_DEBUG_SECRET`. |
| `NEXT_PUBLIC_VAYLO_DEBUG=1` | Extra client-visible logging / behavior. |
| `NEXT_PUBLIC_I18N_LOG_MISSING=1` | Noisy diagnostics; avoid in prod unless debugging i18n. |
| `NEXT_PUBLIC_ASSISTANT_DEBUG=1` | Assistant debug surface in client. |

**Production defaults:** use `0` or omit; leave `VAYLO_INTERNAL_DEBUG_SECRET` empty unless you truly need internal debug with a **strong** random secret.

## Required smoke tests after deploy

Run against **the same environment** you just migrated/deployed:

1. **Auth:** Sign in; confirm session persists across a hard refresh on a protected page.
2. **Dashboard:** Load dashboard; actions/data render without console auth errors.
3. **Documents:** List documents; upload a small test file; confirm row appears; open detail if applicable.
4. **Favorites / progress (if applicable):** Toggle favorite; mark an action complete—no 401/500.
5. **Worker (staging or controlled prod test):** Trigger worker with valid `x-cron-secret`; confirm jobs can progress or endpoint returns authorized success shape (no secret in logs).
6. **i18n:** Hit locale/dict path used by the app; confirm 200 and no leaked stack traces on failure.

## Reference

- **Env variable names and grouping:** root `.env.example`
- **Migration order and no-drift policy:** [MIGRATIONS.md](./MIGRATIONS.md)
