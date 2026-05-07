# Migration discipline (deploy-safe)

For environment variables, cron, storage, and post-deploy smoke tests, see **[PRODUCTION_RUNBOOK.md](./PRODUCTION_RUNBOOK.md)**.

## Core principle

**Deploy order must always be:**

1. **Apply migrations**
2. **Verify schema**
3. **Deploy app code**

Never deploy app code first if it expects a newer schema.

## Rules (no manual drift)

- **Every schema change must be a migration file in git** under `supabase/migrations/`.
- **Supabase UI changes are not valid** unless captured as a migration in git.
- **No production-only manual edits** without immediately adding the matching migration afterward.
- **Never edit a migration retroactively** once it has been applied to a shared environment. Create a new migration instead.

## Scripts (local + release)

- `npm run db:verify`
  - Runs a fast service-role schema check.
  - Fails non-zero with a readable missing-schema summary.
- `npm run release:check`
  - Runs `db:verify` (and can be extended with smoke tests).

## Supabase CLI workflow (preferred)

This repo is designed to work with Supabase migrations in git.

Typical flows:

- **Create a new migration**

```bash
supabase migration new "short_description"
```

- **Apply migrations locally**

```bash
supabase start
supabase db reset
```

- **Apply migrations to staging / prod**

```bash
supabase link --project-ref <ref>
supabase db push
```

Then run `npm run db:verify` against that environment.

## Staging-first release guidance

1. **Apply migrations to staging**
2. **Verify staging schema**: `npm run db:verify`
3. **Smoke test on staging**
   - dashboard loads
   - documents list loads
   - document upload works
   - worker/job system can run (cron endpoint or manual worker)
   - step-state load works
4. **Apply migrations to production**
5. **Verify production schema**: `npm run db:verify`
6. **Deploy production app code**

## Compatibility policy

### Must remain compatibility-hardened

- Document reads/details (`getDocuments`, `getDocumentById`) and optional intelligence enrichment
- Optional schema enrichments that log and degrade gracefully

### May require latest schema (must be gated by migration discipline)

- Execution database features (new catalog columns/tables)
- Worker orchestration features that depend on newer migrations

