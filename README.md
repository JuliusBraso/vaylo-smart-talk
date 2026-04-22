This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Multi-language Expansion

This app supports multiple languages for both UI and phrase translations. German (de) is always the source language for phrases.

### Supported Locales

The app supports the following locales:
- **de** (Deutsch) - German
- **sk** (Slovenčina) - Slovak
- **hu** (Magyar) - Hungarian
- **pl** (Polski) - Polish
- **cs** (Čeština) - Czech
- **ro** (Română) - Romanian
- **bg** (Български) - Bulgarian
- **uk** (Українська) - Ukrainian
- **tr** (Türkçe) - Turkish

### Database Setup

#### 0. Migration discipline (deploy-safe)

This repo treats the database as a versioned part of the product.

**Deploy order must always be:**

1. apply migrations
2. verify schema
3. deploy app code

See `docs/MIGRATIONS.md` for the full workflow, staging-first release guidance, and the no-drift policy.

#### 1. Run Migrations in Supabase

The app requires two database tables: `phrases` and `phrase_translations`. Run the migration files in order:

1. **Create tables and indexes:**
   ```sql
   -- Run: supabase/migrations/001_create_phrases_tables.sql
   ```
   This creates:
   - `public.phrases` table with columns: id, level, category, sector, de_text, created_at, updated_at
   - `public.phrase_translations` table with columns: phrase_id (FK), locale, text
   - Indexes on level, category, sector, and locale for performance
   - Row Level Security (RLS) policies for public read access

2. **Seed initial data:**
   ```sql
   -- Run: supabase/migrations/002_seed_phrases.sql
   ```
   This seeds:
   - 5 sample phrases with German text
   - Slovak translations for all phrases
   - Placeholder translations (copying SK text) for all other locales

#### 2. Running Migrations

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `001_create_phrases_tables.sql`
4. Click "Run"
5. Repeat for `002_seed_phrases.sql`

**Option B: Using Supabase CLI**
```bash
# If you have Supabase CLI installed
supabase db push
```

#### 3. Verify schema (deploy-time)

Run:

```bash
npm run db:verify
```

This uses the service role to check for required tables/columns and fails with actionable output if the schema is behind.

**Option C: Direct SQL Execution**
1. Connect to your Supabase database using any PostgreSQL client
2. Execute the migration files in order

### Phrase Translation Model

- **Source language:** German (`de_text`) is always the primary text
- **Translation display logic:**
  - If `locale === 'de'`: Hide translation line (or show Slovak fallback)
  - Else: Show `translation[locale]` if exists
  - Fallback to `translation['sk']` if locale translation missing
  - Hide translation line if no translation available

### Adding New Phrases

To add new phrases:

```sql
-- 1. Insert the German phrase
INSERT INTO public.phrases (level, category, sector, de_text)
VALUES ('A1', 'job', 'warehouse', 'Wo ist die Toilette?')
RETURNING id;

-- 2. Add translations (replace {phrase_id} with the returned ID)
INSERT INTO public.phrase_translations (phrase_id, locale, text)
VALUES
  ({phrase_id}, 'sk', 'Kde je toaleta?'),
  ({phrase_id}, 'hu', 'Hol van a mosdó?'),
  -- ... add other locales
ON CONFLICT (phrase_id, locale) DO UPDATE SET text = EXCLUDED.text;
```

### Updating Translations

To update existing translations:

```sql
-- Update a specific translation
UPDATE public.phrase_translations
SET text = 'New translation text'
WHERE phrase_id = '{phrase_id}' AND locale = 'sk';

-- Or use UPSERT to insert or update
INSERT INTO public.phrase_translations (phrase_id, locale, text)
VALUES ('{phrase_id}', 'sk', 'Updated translation')
ON CONFLICT (phrase_id, locale) DO UPDATE SET text = EXCLUDED.text;
```

### Verifying Locally

1. **Check database connection:**
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in `.env.local`
   
2. **Start the dev server:**
   ```bash
   npm run dev
   ```

3. **Test the phrases page:**
   - Navigate to `/phrases`
   - Verify phrases load from Supabase
   - Change app locale in settings and verify translations display correctly
   - Test search across German text and all translations

4. **Check console for errors:**
   - Open browser DevTools
   - Look for any Supabase query errors
   - Verify RLS policies allow public read access

### UI Internationalization

All UI strings are defined in `lib/i18n/locales/<locale>.ts`. Each locale file must have identical keys:
- `app.*` - App name, tagline, language name
- `nav.*` - Navigation labels
- `dashboard.*` - Dashboard page strings
- `settings.*` - Settings page strings
- `phrases.*` - Phrases page strings (including category and sector labels)
- `premium.*` - Premium page strings

Missing translations will fall back to German (default locale).
