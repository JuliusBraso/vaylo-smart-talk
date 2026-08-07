import "server-only";

import { createHash } from "node:crypto";

import { isUntrustedProxy } from "./controlled-preflight-launcher-capability-contract";

export const CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY = Object.freeze({
  policyId: "VAYLO_CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY",
  policyVersion: 1,
  clockMode: "EXTERNALLY_SUPPLIED_FIXED_SNAPSHOT",
  representation: "UTC_ISO_8601_MILLISECONDS",
  valueOwnership: "CONTROLLED_EXTERNAL_INPUT",
  progressionMode: "NON_PROGRESSING",
  expirationMode: "NO_EXPIRATION",
  ttlMode: "NO_TTL",
  bindingMode: "EXACT_CANONICAL_SNAPSHOT_EQUALITY",
} as const);

export type ControlledSyntheticClockFailureCode =
  | "PROXY_REJECTED"
  | "NOT_A_STRING"
  | "REPRESENTATION_INVALID"
  | "CALENDAR_INVALID";

export type ControlledSyntheticClockBindingFailureCode =
  | "INVALID_ENVELOPE_CLOCK"
  | "INVALID_CURRENT_EVIDENCE_CLOCK"
  | "CLOCK_SNAPSHOT_MISMATCH";

export type ControlledSyntheticClockParseResult =
  | Readonly<{ ok: true; value: string }>
  | Readonly<{ ok: false; failureCode: ControlledSyntheticClockFailureCode }>;

export type ControlledSyntheticClockBindingResult =
  | Readonly<{ ok: true; snapshot: string }>
  | Readonly<{
      ok: false;
      failureCode: ControlledSyntheticClockBindingFailureCode;
    }>;

const SNAPSHOT =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z$/;

const isLeapYear = (year: number): boolean =>
  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

const daysInMonth = (year: number, month: number): number => {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
};

export function parseControlledSyntheticFixedClockSnapshot(
  candidate: unknown,
): ControlledSyntheticClockParseResult {
  if (isUntrustedProxy(candidate)) {
    return Object.freeze({
      ok: false as const,
      failureCode: "PROXY_REJECTED" as const,
    });
  }
  if (typeof candidate !== "string") {
    return Object.freeze({
      ok: false as const,
      failureCode: "NOT_A_STRING" as const,
    });
  }
  const match = SNAPSHOT.exec(candidate);
  if (!match) {
    return Object.freeze({
      ok: false as const,
      failureCode: "REPRESENTATION_INVALID" as const,
    });
  }
  const [, yearText, monthText, dayText, hourText, minuteText, secondText] =
    match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > daysInMonth(year, month) ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    return Object.freeze({
      ok: false as const,
      failureCode: "CALENDAR_INVALID" as const,
    });
  }
  return Object.freeze({ ok: true as const, value: candidate });
}

export function verifyControlledSyntheticFixedClockBinding(
  envelopeSnapshotCandidate: unknown,
  currentEvidenceSnapshotCandidate: unknown,
): ControlledSyntheticClockBindingResult {
  const envelope = parseControlledSyntheticFixedClockSnapshot(
    envelopeSnapshotCandidate,
  );
  if (!envelope.ok) {
    return Object.freeze({
      ok: false as const,
      failureCode: "INVALID_ENVELOPE_CLOCK" as const,
    });
  }
  const evidence = parseControlledSyntheticFixedClockSnapshot(
    currentEvidenceSnapshotCandidate,
  );
  if (!evidence.ok) {
    return Object.freeze({
      ok: false as const,
      failureCode: "INVALID_CURRENT_EVIDENCE_CLOCK" as const,
    });
  }
  if (envelope.value !== evidence.value) {
    return Object.freeze({
      ok: false as const,
      failureCode: "CLOCK_SNAPSHOT_MISMATCH" as const,
    });
  }
  return Object.freeze({ ok: true as const, snapshot: envelope.value });
}

export const getControlledSyntheticFixedClockPolicyFingerprint = (): string =>
  createHash("sha256")
    .update(JSON.stringify(CONTROLLED_SYNTHETIC_FIXED_CLOCK_POLICY), "utf8")
    .digest("hex");
