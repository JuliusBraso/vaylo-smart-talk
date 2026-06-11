# Controlled Text Pilot Readiness Plan — Phase 8.2J-0

**Status:** Planning only. No runtime is enabled. No API/UI/LLM/persistence is touched.  
**Plan ID:** `8.2J-0`  
**Constant:** `CONTROLLED_TEXT_PILOT_READINESS_PLAN_V1`  
**Previous epoch closed:** 8.2I — Controlled Live Text Output Contract Compatibility

---

## 1. Purpose

This plan defines the criteria, scope, blocked capabilities, acceptance criteria, failure policies, and ordered next phases required before a controlled internal text-only pilot of the Smart Talk governance chain can be safely run.

It does not implement the pilot. It prepares Phase 8.2J-1.

---

## 2. What 8.2I Closed

| Achievement | Status |
|---|---|
| `ControlledLiveTextDraftResult` type exists | ✓ |
| `ControlledLiveTextRedactionProof` type exists | ✓ |
| `validateRuntimeLLMOutputContract()` accepts `controlled_live_text` | ✓ |
| `sourceKind = "controlled_live_text"` aligned | ✓ |
| `adapterMode = "controlled_live_text"` aligned | ✓ |
| Temporary mock bridge removed | ✓ |
| Real synthetic redacted text forwarding proven end-to-end | ✓ |
| `readyForControlledRealTextForwardingTo8_2G` can be `true` | ✓ |
| `readyForPublicLaunch` remains `false` | ✓ |

---

## 3. What 8.2J Is Allowed to Plan

- Define the internal pilot scenario set (synthetic + curated text fixtures).
- Define a guarded runtime switch plan (how to enable guarded internal mode safely).
- Define a manual safety test protocol (what a reviewer checks before and during pilot).
- Define a pilot evidence record model (what observations are recorded, without raw text).
- Design a closure audit that certifies all of the above are in place before pilot begins.

---

## 4. What 8.2J-0 Does NOT Implement

- No pilot runtime is wired.
- No API route change.
- No UI change.
- No live LLM call.
- No persistence added.
- No DNA save.
- No offline save.
- No real user input processed.
- Smart Talk is NOT made public by this plan.

---

## 5. Pilot Scope

The controlled internal pilot is:

| Scope | Allowed |
|---|---|
| Internal only | ✓ |
| Text input only (no OCR, no upload) | ✓ |
| Synthetic and curated test fixtures | ✓ |
| Guarded real text manual test (internal reviewers) | ✓ |
| Slovak-first / controlled language assumption | ✓ |

---

## 6. Blocked Capabilities

The following must remain disabled for the entire duration of the internal pilot:

| Capability | Block Reason |
|---|---|
| Public anonymous runtime | Not safe until full product safety audit |
| OCR / photo / file upload | Not implemented; text-only epoch |
| Payment processing | Not implemented |
| Automatic DNA save | Not safe; no consent model in place |
| Automatic offline save | Not implemented |
| Audit persistence (broader pilot) | Requires privacy design before broader rollout |
| Multilingual runtime | Slovak-first; other languages not yet governed |
| B2B visibility | Not in scope for internal pilot |
| Deadline calculation | Not permitted; legal certainty not established |
| Legal conclusion generation | Not permitted; governance not certified |
| Production advice claims | Not permitted in any pilot phase |

---

## 7. Required Readiness Areas

All of the following must be addressed before pilot implementation begins:

| Area | Addressed In |
|---|---|
| Pilot scenario set | 8.2J-1 |
| Pilot acceptance criteria | 8.2J-1 |
| Pilot failure policy | 8.2J-1 |
| Manual safety checklist | 8.2J-3 |
| Internal access control | 8.2J-2 |
| Guarded runtime switch | 8.2J-2 |
| Raw value leak review | 8.2J-3 |
| Hallucination review | 8.2J-3 |
| Uncertainty language review | 8.2J-3 |
| No-persistence confirmation | 8.2J-1 / 8.2J-2 |
| No-public-runtime confirmation | 8.2J-2 |
| Reviewer sign-off protocol | 8.2J-3 |

---

## 8. Acceptance Criteria

The pilot is considered technically ready only when all of the following are demonstrably true:

1. Input contract rejects invalid modes (photo, file upload, public runtime, persistence flags).
2. Redaction boundary masks PII before the adapter receives text.
3. Raw value leak check passes — no synthetic email/IBAN/phone in section draft texts.
4. Output contract validator accepts `controlled_live_text` drafts with valid redaction proof.
5. Wording gate blocks hard-fail tones (legal advice, panic, reassurance).
6. Human-review score blocks user-visible authorisation.
7. Assembler blocks internal metadata from leaking to user-facing output.
8. Authorisation gate keeps `emittedToUserNow: false` for all internal packets.
9. Live LLM is disabled unless a future guarded phase explicitly enables it with its own proof.
10. `persistenceUsed`, `dnaSavePerformed`, `offlineSavePerformed` are all `false`.
11. Public runtime is disabled — guarded internal-only flag required for activation.
12. Pilot results are reviewed manually by a designated internal reviewer before any broader access.

---

## 9. Failure Policy

If any of the following occur during the pilot, output must be blocked immediately:

| Event | Policy |
|---|---|
| Output contract violation | Block output |
| Redaction failure | Block output |
| Raw value leak detected | Block output |
| Wording hard fail | Block output |
| Uncertainty / unclear topic | Route to human review |
| Deadline certainty implied | Do not show — uncertainty notice required |
| Legal conclusion detected | Do not generate — blocked by wording gate |
| Raw text persistence attempted | Do not persist |
| DNA save attempted | Do not save |
| Offline save attempted | Do not save |

---

## 10. Manual Reviewer Expectations

Internal pilot reviewers are expected to:

- Review each output manually against the scenario expectation.
- Flag any response that implies certainty where uncertainty is appropriate.
- Flag any output that could be mistaken for legal or financial advice.
- Flag any response that names a specific law or deadline with certainty.
- Not share pilot outputs externally without explicit governance sign-off.
- Report observations in a structured record (no raw user text in observations).

---

## 11. Guarded Access Expectations

- Pilot mode must require an explicit internal flag (`VAYLO_ENABLE_INTERNAL_SMART_TALK_RUNTIME=true`).
- Pilot must require a secret header (`x-vaylo-internal-runtime-secret`).
- Only pre-approved internal accounts may access the guarded mode.
- Activation must be auditable — no silent enablement.
- Public-facing routes must not be modified to expose pilot mode.

---

## 12. No Persistence / No DNA / No Offline Save Rule

During the entire 8.2J epoch (including the pilot):

- No user text, redacted text, or adapter draft text is written to any database.
- No DNA save is performed.
- No offline save is performed.
- Pilot observations are recorded by a human reviewer in a separate system, not the application.
- This rule applies even if a future phase introduces audit persistence — that feature requires its own safety design and is not unlocked by this plan.

---

## 13. No Public Runtime Rule

- Smart Talk is **not public** during the 8.2J pilot.
- The guarded internal mode is activated only through explicit internal flags and secret headers.
- Anonymous user access to the governance chain is blocked throughout the pilot.
- The public Smart Talk feature flag (if any) must remain disabled.
- This plan does not create any path to public launch.

---

## 14. Proposed Next Phases

| Phase | Title | Objective |
|---|---|---|
| 8.2J-1 | Pilot Scenario Set and Acceptance Criteria | Define curated text fixtures and formal acceptance criteria |
| 8.2J-2 | Guarded Internal Pilot Runtime Switch Plan | Define how to safely enable guarded internal mode |
| 8.2J-3 | Manual Safety Test Protocol | Define reviewer checklist and sign-off protocol |
| 8.2J-4 | Pilot Evidence Record Model | Define how to record pilot observations without raw text |
| 8.2J-5 | Controlled Text Pilot Readiness Closure Audit | Formally certify all readiness areas met before pilot implementation |

---

## 15. Exit Criteria for 8.2J-0

This planning phase is complete when:

- `CONTROLLED_TEXT_PILOT_READINESS_PLAN_V1` is defined and type-safe.
- `readyForGuardedManualPilotPlanning: true`.
- `readyForInternalPilotImplementation: false` (remains false until 8.2J-5 closure).
- `readyForPublicLaunch: false`.
- No runtime has been wired.
- No API route has been modified.
- TypeScript compiles without errors.
- The plan document is committed to the repository.

---

---

## Update — Phase 8.2J-5

Phase 8.2J-5 closes the controlled text pilot readiness epoch (`closed_with_warnings`). All six required layers (8.2J-0 through 8.2J-4) are verified; 7 open items recorded, none blocking epoch closure.  
Runtime implementation remains disabled: `readyForRuntimeExecution: false`, `readyForPublicLaunch: false`.  
Next epoch: 8.2K-0 — Guarded Internal Pilot Runtime Implementation Plan.

---

## Update — Phase 8.2K-0

Phase 8.2K-0 begins the guarded internal pilot runtime implementation epoch with a planning-only phase. It defines 12 implementation scope items, 7 required contracts, 16 required guards, 11 blocked capabilities, and a 5-phase ordered roadmap (8.2K-1 through 8.2K-5).  
Runtime execution remains disabled: `readyForRuntimeImplementation: false`, `readyForApiRouteModification: false`.  
Next: 8.2K-1 Pilot Runtime Guard Contract Types.

---

## Update — Phase 8.2J-3

Phase 8.2J-3 defines the manual safety test protocol: 24-item reviewer checklist, 5 test phases, 5 verdicts, 14 escalation reasons, prohibited evidence fields (raw text, PII, secrets), and sign-off requirements.  
Runtime execution remains disabled: `readyForRuntimeExecution: false`.  
Pilot evidence record model (8.2J-4) is the next step.

---

## Update — Phase 8.2J-2

Phase 8.2J-2 defines the guarded internal pilot runtime switch model (feature flags, guard phrase, allowlist, kill switch, failure verdicts, 16 activation rules).  
Runtime implementation remains disabled: `readyForPilotRuntimeImplementation: false`.  
Manual safety protocol (8.2J-3) is the next step before any switch is wired.

---

*This plan is a governance planning artefact only. It does not enable, authorise, or implement any runtime feature.*
