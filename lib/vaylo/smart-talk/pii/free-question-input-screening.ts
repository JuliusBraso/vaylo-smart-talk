/**
 * Bounded local screening for accidental personal data in public free-form questions.
 *
 * Outcomes are limited to fixed reason codes only. A no-hit means no supported
 * signal was detected — not that the text is safe, anonymous, or privacy-cleared.
 *
 * Supported signals (narrow, explicit):
 * - Conventional email addresses
 * - Phone numbers with international "+" prefix or explicit contact labels
 * - IBAN-shaped values; labelled personal document / customer identifiers (bounded values)
 * - Six-digit "/" three-or-four-digit birth-number-shaped tokens (not dotted/ISO dates)
 * - Explicit self-identification phrases (SK/DE/EN) followed by a name-like token
 * - Residential/delivery intros directly followed by bounded word-token street + house-number (SK/DE/EN)
 *   Address tokens use horizontal whitespace only (no CR/LF/U+2028/U+2029); not a general address parser.
 *
 * Labelled-ID gap: alphanumeric labels without digits, free-form prose values, and many
 * authority or account reference formats are not screened.
 *
 * Known gaps: bare names, authority-only addresses, obfuscated identifiers,
 * indirect identity descriptions, and contextual personal data without these patterns.
 */

export const FREE_QUESTION_INPUT_MAX_LENGTH = 12_000;

export type FreeQuestionInputScreeningReasonCode =
  | "no_supported_signal_detected"
  | "user_revision_required"
  | "invalid_input";

export type FreeQuestionInputScreeningResult = {
  reasonCode: FreeQuestionInputScreeningReasonCode;
};

const EMAIL_RE =
  /\b[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z]{2,63})+\b/;

const PHONE_INTL_RE = /\+[1-9]\d(?:[\s.-]?\d){6,13}\b/;

const PHONE_LABELLED_RE =
  /\b(?:tel(?:ef[oó]n)?|telefon|handy|mobil(?:e)?|phone|kontakt(?:ný)?(?:\s+telef[oó]n)?)\s*[:#]?\s*(?:\+?\d[\s./-]?){7,18}\d\b/i;

const IBAN_RE =
  /\b(?:DE|AT|SK|CZ|HU|PL|RO|BG|HR|SI|EE|LV|LT|MT|CY|LU|IE|FR|IT|ES|PT|NL|BE|FI|SE|DK|NO|CH|GB)[\s-]?(?:\d{2})[\s-]?(?:[A-Z0-9]{4}[\s-]?){2,7}[A-Z0-9]{1,4}\b/i;

/** Unicode-aware label boundary; value must include digits and stay tightly bounded (no prose). */
const LABELLED_ID_RE =
  /(?<![\p{L}\p{N}_])(?:číslo\s+(?:op|pasu)|identifik[aá]čn[eé]\s+číslo|rodn[eé]\s+číslo|personalausweis(?:nummer)?|reisepass(?:nummer)?|ausweis(?:nummer)?|kundennummer|client\s*id)\s*[:#]?\s*(?=[A-Z0-9]*\d)[A-Z0-9]{6,16}\b/iu;

const CUSTOMER_ID_LABELLED_RE =
  /(?<![\p{L}\p{N}_])customer\s*id\s*[:#]\s*(?=[A-Z0-9]*\d)[A-Z0-9]{6,16}\b/iu;

/** Shape-only: six digits, slash, three or four digits — not calendar dates with dots or hyphens. */
const BIRTH_NUMBER_SHAPED_RE = /(?<!\d)\d{6}\/\d{3,4}(?!\d)/;

const EXPLICIT_NAME_RE =
  /\b(?:vol[aá]m\s+sa|moje\s+meno\s+je|ich\s+hei[sß]e|my\s+name\s+is)\s+[\p{L}][\p{L}'-]{1,48}(?:\s+[\p{L}][\p{L}'-]{1,48}){0,3}/iu;

const H = "[ \\t]";
const H_OPT = `${H}*`;
const H_REQ = `${H}+`;

const STREET_WORD_TOKEN = "[\\p{L}\\p{M}][\\p{L}\\p{M}0-9'-]{0,31}";
const STREET_NAME_TOKENS = `(?:${STREET_WORD_TOKEN})(?:${H_REQ}${STREET_WORD_TOKEN}){0,4}`;
const HOUSE_NUMBER = "\\d{1,4}[a-zA-Z]?(?:\\/\\d{1,4})?";
const ADDR_TOKEN_END = `(?=$|[ \\t.,;:!?\\)])`;

const EN_STREET_TYPE =
  "(?:Street|St\\.|Road|Rd\\.|Avenue|Ave\\.|Lane|Ln\\.|Drive|Dr\\.)";

const EN_IMMEDIATE_STREET_ADDRESS = `(?:${HOUSE_NUMBER}${H_REQ}${STREET_NAME_TOKENS}${H_REQ}${EN_STREET_TYPE}${ADDR_TOKEN_END}|${STREET_NAME_TOKENS}${H_REQ}${EN_STREET_TYPE}${H_REQ}${HOUSE_NUMBER}${ADDR_TOKEN_END})`;

const DE_STREET_CORE =
  `[\\p{L}\\p{M}][\\p{L}\\p{M}0-9ßäöüÄÖÜ-]{0,55}(?:straße|strasse|str\\.|gasse|weg|platz|allee)`;
const DE_IMMEDIATE_STREET_ADDRESS = `${DE_STREET_CORE}${H_REQ}${HOUSE_NUMBER}${ADDR_TOKEN_END}`;

const SK_IMMEDIATE_STREET_ADDRESS = `(?:${STREET_NAME_TOKENS}${H_REQ}ulic[aaei]?${H_REQ}${HOUSE_NUMBER}|ulic[aaei]?${H_REQ}${STREET_NAME_TOKENS}${H_REQ}${HOUSE_NUMBER})`;

const DELIVERY_INTRO_TAIL =
  `${H_OPT}(?::|is${H_REQ}(?!required\\b|needed\\b|mandatory\\b|optional\\b|on\\b|not\\b))${H_OPT}`;

const BOUND_RESIDENTIAL_ADDRESS_PATTERNS: readonly RegExp[] = [
  new RegExp(`\\bmoja${H_REQ}adresa${H_REQ}je${H_REQ}${SK_IMMEDIATE_STREET_ADDRESS}`, "iu"),
  new RegExp(
    `\\b(?:bývam|byvam)${H_REQ}na${H_REQ}(?:ulic[aaei]?${H_REQ}${STREET_NAME_TOKENS}${H_REQ}${HOUSE_NUMBER}|${STREET_NAME_TOKENS}${H_REQ}ulic[aaei]?${H_REQ}${HOUSE_NUMBER})`,
    "iu",
  ),
  new RegExp(
    `\\b(?:moj[aá]${H_REQ}doručovac(?:ia|ká)${H_REQ}adresa|doručovacia${H_REQ}adresa${H_REQ}je)${H_REQ}${SK_IMMEDIATE_STREET_ADDRESS}`,
    "iu",
  ),
  new RegExp(`\\bich${H_REQ}wohne${H_REQ}in${H_REQ}${DE_IMMEDIATE_STREET_ADDRESS}`, "iu"),
  new RegExp(`\\bmy${H_REQ}(?:home${H_REQ})?address${H_REQ}is${H_REQ}${EN_IMMEDIATE_STREET_ADDRESS}`, "iu"),
  new RegExp(`\\bi${H_REQ}live${H_REQ}at${H_REQ}${EN_IMMEDIATE_STREET_ADDRESS}`, "iu"),
  new RegExp(
    `\\b(?:lieferadresse|delivery${H_REQ}address)${DELIVERY_INTRO_TAIL}(?:${EN_IMMEDIATE_STREET_ADDRESS}|${DE_IMMEDIATE_STREET_ADDRESS}|${SK_IMMEDIATE_STREET_ADDRESS})`,
    "iu",
  ),
];

function hasMalformedUnicode(value: string): boolean {
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff) {
      if (i + 1 >= value.length) return true;
      const next = value.charCodeAt(i + 1);
      if (next < 0xdc00 || next > 0xdfff) return true;
      i += 1;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      return true;
    }
  }
  return false;
}

function normalizedScanText(value: string): string {
  return value.normalize("NFC");
}

function matchesResidentialAddress(text: string): boolean {
  for (const pattern of BOUND_RESIDENTIAL_ADDRESS_PATTERNS) {
    if (pattern.test(text)) return true;
  }
  return false;
}

function matchesSupportedSignal(text: string): boolean {
  if (EMAIL_RE.test(text)) return true;
  if (PHONE_INTL_RE.test(text)) return true;
  if (PHONE_LABELLED_RE.test(text)) return true;
  if (IBAN_RE.test(text)) return true;
  if (LABELLED_ID_RE.test(text)) return true;
  if (CUSTOMER_ID_LABELLED_RE.test(text)) return true;
  if (BIRTH_NUMBER_SHAPED_RE.test(text)) return true;
  if (EXPLICIT_NAME_RE.test(text)) return true;
  if (matchesResidentialAddress(text)) return true;
  return false;
}

export function screenFreeQuestionInput(input: unknown): FreeQuestionInputScreeningResult {
  if (typeof input !== "string") {
    return { reasonCode: "invalid_input" };
  }
  if (input.length > FREE_QUESTION_INPUT_MAX_LENGTH) {
    return { reasonCode: "invalid_input" };
  }
  if (hasMalformedUnicode(input)) {
    return { reasonCode: "invalid_input" };
  }
  const text = normalizedScanText(input);
  if (matchesSupportedSignal(text)) {
    return { reasonCode: "user_revision_required" };
  }
  return { reasonCode: "no_supported_signal_detected" };
}
