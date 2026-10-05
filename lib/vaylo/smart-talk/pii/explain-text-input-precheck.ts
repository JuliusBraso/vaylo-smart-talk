/**
 * Isolated precheck for a future "Explain text" intake.
 *
 * Not wired to any route, model, payment, OCR, or public runtime.
 * `eligible_for_controlled_review` means only that a later controlled review
 * may be considered. It does not mean the text is anonymous, model-ready,
 * paid, or allowed for public processing.
 *
 * Every result keeps modelCallPermitted false. The result carries fixed codes
 * and safe metadata only: never the input, an excerpt, or an identifier value.
 */

export const EXPLAIN_TEXT_PRECHECK_MAX_LENGTH = 12_000;

export type ExplainTextPrecheckDisposition =
  | "blocked"
  | "needs_user_revision"
  | "eligible_for_controlled_review";

export type ExplainTextPrecheckReasonCode =
  | "non_string_input"
  | "empty_input"
  | "input_too_long"
  | "malformed_unicode"
  | "letter_header_name_and_address"
  | "email_address"
  | "phone_number"
  | "iban"
  | "case_or_customer_number"
  | "unknown_identifier_format"
  | "no_supported_personal_data_signal";

export type ExplainTextLanguageHint = "de" | "sk";

export type ExplainTextPrecheckResult = {
  disposition: ExplainTextPrecheckDisposition;
  reasonCodes: readonly ExplainTextPrecheckReasonCode[];
  languageHints: readonly ExplainTextLanguageHint[];
  modelCallPermitted: false;
  textTreatedAsAnonymous: false;
  readyForModel: false;
  paymentAuthorized: false;
  publicProcessingPermitted: false;
};

const REVISION_REASON_ORDER = [
  "letter_header_name_and_address",
  "email_address",
  "phone_number",
  "iban",
  "case_or_customer_number",
  "unknown_identifier_format",
] as const satisfies readonly ExplainTextPrecheckReasonCode[];

const EMAIL_RE =
  /\b[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z]{2,63})+\b/;

const PHONE_RE =
  /(?:\+[1-9]\d{1,2}(?:[\s.-]?\d){6,14}\b|\b(?:tel(?:efon)?|handy|mobil|phone)\s*[:#]?\s*(?:\+?\d[\s./-]?){6,16}\d\b)/i;

const IBAN_RE =
  /\b(?:DE\d{20}|(?:DE|AT|SK|CZ)[\s-]?\d{2}(?:[\s-]?[A-Z0-9]{4}){4,6})\b/i;

const CASE_OR_CUSTOMER_RE =
  /(?<![\p{L}\p{N}_])(?:číslo\s+spisu|cislo\s+spisu|číslo\s+zákazníka|cislo\s+zakaznika|aktenzeichen|kundennummer|customer\s+number|case\s+number)\s*[:#]?\s*(?=[A-Z0-9./-]*\d)[A-Z0-9][A-Z0-9./-]{2,31}\b/iu;

const UNKNOWN_IDENTIFIER_RE =
  /(?<![\p{L}\p{N}_])(?:referenz|kennung|značka|znacka|identifier)\s*[:#]\s*(?=[A-Z0-9-]*\d)[A-Z0-9][A-Z0-9-]{3,23}\b/iu;

const SK_HINT_RE = /\b(?:pros[ií]m|vysvetlite|oznam|žiadosť|ziadost)\b/iu;
const DE_HINT_RE = /\b(?:bitte|erkl[aä]ren|hinweis|antrag|bescheid)\b/iu;

const HEADER_NAME_LINE = /^[\p{Lu}][\p{L}'-]{1,40}(?:\s+[\p{Lu}][\p{L}'-]{1,40}){1,2}$/u;
const HEADER_ADDRESS_LINE =
  /(?:\b[\p{L}][\p{L}'-]{1,40}(?:\s+[\p{L}][\p{L}'-]{1,40}){0,3}\s+ulic[aá]\s+\d{1,4}\b|\bulic[aá]\s+[\p{L}][\p{L}'-]{1,40}(?:\s+[\p{L}][\p{L}'-]{1,40}){0,2}\s+\d{1,4}\b|\b[\p{L}][\p{L}ßäöüÄÖÜ-]{2,48}(?:straße|strasse|gasse|weg|platz)\s+\d{1,4}\b)/iu;

function hasMalformedUnicode(value: string): boolean {
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    if (code >= 0xd800 && code <= 0xdbff) {
      if (index + 1 >= value.length) return true;
      const next = value.charCodeAt(index + 1);
      if (next < 0xdc00 || next > 0xdfff) return true;
      index += 1;
    } else if (code >= 0xdc00 && code <= 0xdfff) {
      return true;
    }
  }
  return false;
}

function hasLetterHeaderNameAndAddress(value: string): boolean {
  const prefix = value.slice(0, 1_500);
  const lines = prefix.split(/\r\n|\n|\r/).slice(0, 16);
  let nameLine = false;
  let addressLine = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (HEADER_NAME_LINE.test(trimmed)) nameLine = true;
    if (HEADER_ADDRESS_LINE.test(trimmed)) addressLine = true;
  }
  return nameLine && addressLine;
}

function languageHintsFor(value: string): ExplainTextLanguageHint[] {
  const hints: ExplainTextLanguageHint[] = [];
  if (DE_HINT_RE.test(value)) hints.push("de");
  if (SK_HINT_RE.test(value)) hints.push("sk");
  return hints;
}

function closedResult(
  disposition: ExplainTextPrecheckDisposition,
  reasonCodes: readonly ExplainTextPrecheckReasonCode[],
  languageHints: readonly ExplainTextLanguageHint[] = [],
): ExplainTextPrecheckResult {
  return {
    disposition,
    reasonCodes,
    languageHints,
    modelCallPermitted: false,
    textTreatedAsAnonymous: false,
    readyForModel: false,
    paymentAuthorized: false,
    publicProcessingPermitted: false,
  };
}

export function precheckExplainTextInput(input: unknown): ExplainTextPrecheckResult {
  if (typeof input !== "string") {
    return closedResult("blocked", ["non_string_input"]);
  }
  if (input.length > EXPLAIN_TEXT_PRECHECK_MAX_LENGTH) {
    return closedResult("blocked", ["input_too_long"]);
  }
  if (hasMalformedUnicode(input)) {
    return closedResult("blocked", ["malformed_unicode"]);
  }
  if (input.trim().length === 0) {
    return closedResult("blocked", ["empty_input"]);
  }

  const text = input.normalize("NFC");
  const revisionCodes: ExplainTextPrecheckReasonCode[] = [];
  if (hasLetterHeaderNameAndAddress(text)) revisionCodes.push("letter_header_name_and_address");
  if (EMAIL_RE.test(text)) revisionCodes.push("email_address");
  if (PHONE_RE.test(text)) revisionCodes.push("phone_number");
  if (IBAN_RE.test(text)) revisionCodes.push("iban");
  if (CASE_OR_CUSTOMER_RE.test(text)) revisionCodes.push("case_or_customer_number");
  if (UNKNOWN_IDENTIFIER_RE.test(text)) revisionCodes.push("unknown_identifier_format");

  const hints = languageHintsFor(text);
  if (revisionCodes.length > 0) {
    const ordered = REVISION_REASON_ORDER.filter((code) => revisionCodes.includes(code));
    return closedResult("needs_user_revision", ordered, hints);
  }
  return closedResult("eligible_for_controlled_review", ["no_supported_personal_data_signal"], hints);
}
