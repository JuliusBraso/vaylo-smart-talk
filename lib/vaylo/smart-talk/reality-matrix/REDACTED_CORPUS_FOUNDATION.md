# Redacted Corpus Foundation — Phase 8.2F-10

**Version:** `8.2f-10-redacted-corpus-v1`
**Mode:** Data governance foundation / no runtime activation
**Status:** Synthetic exemplars only — no real-world data admitted

---

## Purpose

Phase 8.2F-10 defines the data governance foundation for a future real-world redacted corpus. This corpus will enable:

- Structural regression testing against real document patterns
- OCR uncertainty evaluation on representative German bureaucratic text
- Explanation mapper behavior validation on field-realistic inputs
- Privacy-safe internal quality assurance without exposing user data

**Current phase:** Only synthetic redacted exemplars are present. No real user documents. No real PII.

---

## Redaction Protocol

### Rule 1 — No real PII in the repository

Personal identifying information **must never** appear in the corpus or version control history. This includes but is not limited to:

- Real names (Vorname, Nachname, Firmenname)
- Real addresses (Straße, Hausnummer, PLZ, Ort)
- Real dates tied to a specific person
- Real monetary amounts associated with a specific person
- Real case reference numbers (Aktenzeichen, Steuernummer, Vorgangsnummer)
- Real bank account numbers, IBANs, BICs
- Real phone numbers
- Real email addresses
- Real customer / membership / insurance IDs
- Real passport or residency document numbers

### Rule 2 — Standardised placeholder tokens

All redacted fields must be replaced with standardised tokens from the `RedactedPlaceholder` type. Do not invent new placeholder formats.

| Token | Replaces |
|---|---|
| `[NAME]` | Any person's name |
| `[ADDRESS]` | Any postal address |
| `[DATE]` | Any date |
| `[AMOUNT]` | Any monetary amount |
| `[AKTENZEICHEN]` | Any case reference / file number |
| `[CUSTOMER_ID]` | Any customer / member / subscriber ID |
| `[IBAN]` | Any bank IBAN |
| `[PHONE]` | Any phone number |
| `[EMAIL]` | Any email address |
| `[AUTHORITY]` | Any authority, office, or company name |
| `[CITY]` | Any city or municipality name |

Do not use freeform text like `<redacted>`, `XXX`, `---`, or `...` in place of these tokens.

### Rule 3 — No unredacted originals stored

Real source documents must **never** be committed to the repository in any form:

- No PDF files
- No image files (JPG, PNG, TIFF, etc.)
- No raw OCR output files containing personal data
- No screenshots of documents
- No partial scans

If a real document is used as the basis for a future corpus entry, only the fully redacted text derivative is stored. The original must be discarded before any commit.

### Rule 4 — Human review gate before admission

No real-world document may enter the corpus without passing a human review gate. The review must verify:

1. Every PII field is replaced with the correct placeholder token
2. No partial fragments of personal data remain
3. The text does not reveal personal information through context (e.g. unusual amounts that identify a specific person)
4. The `redactionLevel` is set to `"fully_anonymized"`
5. `neverContainsRealPii: true` is confirmed by the reviewer

### Rule 5 — Validation scaffold must pass

Every corpus entry admitted must pass `runRedactedCorpusRegression`. Entries that trigger `possiblePiiDocumentIds` must be corrected or rejected before commit.

### Rule 6 — sourceKind discipline

| Phase | Allowed sourceKind values |
|---|---|
| 8.2F-10 (current) | `synthetic_exemplar` only |
| Future | `future_real_redacted` (requires human review gate) |
| Future | `imported_test_fixture` (requires separate review gate) |

---

## Synthetic Exemplar Protocol

Synthetic exemplars are crafted from scratch with no connection to any real person or document. They must:

- Be written specifically for this corpus with no reference to real individuals
- Use realistic German bureaucratic language patterns without copying real documents
- Include appropriate placeholder tokens for all field types that would normally carry PII
- Have `redactionLevel: "synthetic_redacted_exemplar"`
- Have `neverContainsRealPii: true`
- Pass `runRedactedCorpusRegression` before being committed

---

## Current Corpus (Phase 8.2F-10)

Five synthetic exemplars covering primary German bureaucratic document types:

| documentId | Category | Complexity | OcrConfidence |
|---|---|---|---|
| `synthetic-finanzamt-bescheid-001` | `finanzamt_bescheid` | high | 88 |
| `synthetic-rundfunkbeitrag-mahnung-001` | `rundfunkbeitrag` | low | 92 |
| `synthetic-inkasso-mahnung-001` | `inkasso_mahnung` | high | 74 |
| `synthetic-krankenkasse-notice-001` | `krankenkasse_notice` | medium | 95 |
| `synthetic-auslaenderbehoerde-letter-001` | `auslaenderbehoerde_letter` | high | 68 |

---

## Future Corpus Roadmap

The following document types are prioritised for future admission once the human review gate and redaction tooling are in place:

- `jobcenter_bescheid` — Jobcenter / ALG II notices
- `generic_bureaucracy` — Miscellaneous Behörden correspondence
- Additional `finanzamt_bescheid` variants (preliminary, estimated, VAT)
- `krankenkasse_notice` variants (Befreiung, Rückerstattung)
- `inkasso_mahnung` variants (Mahnbescheid, Vollstreckungsbescheid)

**No real-world entries may be added until:**
1. A human review gate process is formally defined
2. The redaction tooling is reviewed
3. The reviewer's sign-off is recorded alongside the entry

---

## Integration with Phase 8.2F-9

Each `RedactedDocument` carries an optional `expectedOcrDegradation` field that integrates with `OcrDegradationVector` from Phase 8.2F-9. This allows future regression pipelines to feed corpus entries directly into `evaluateOcrUncertainty` for end-to-end structural testing.

---

## What This Phase Does NOT Do

- No runtime corpus loading
- No OCR processing of any images
- No LLM calls
- No Smart Talk wiring
- No database storage
- No user-visible output
- No explanation generation
- No deadline calculation
- No legal inference

---

> **This corpus exists only to structure testing and validation of the governance layer. It never holds real personal data.**
