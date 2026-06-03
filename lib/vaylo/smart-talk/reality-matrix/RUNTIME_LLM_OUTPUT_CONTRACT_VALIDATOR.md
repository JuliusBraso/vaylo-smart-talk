# Runtime LLM Output Contract Validator — Phase 8.2G-2

**Epoch**: 8.2G — Runtime LLM Integration  
**Phase**: 8.2G-2  
**Status**: `validator_defined` — liveLLMCalled: false — userVisibleOutputAllowed: false — acceptedForUserVisibleAssembly: false  
**Author**: Vaylo Document Reasoning Constitution V1 Governance Kernel

---

## 1. Purpose

The Runtime LLM Output Contract Validator is the first safety gate after the LLM
draft adapter (Phase 8.2G-1). It validates that a `RuntimeLLMDraftAdapterResult`
respects all governance boundaries before the draft can proceed to the wording
governance gate (Phase 8.2G-3).

Position in the 15-layer runtime pipeline (Phase 8.2G-0):

```
llm_draft_adapter (8.2G-1)
  → llm_output_contract_validator (8.2G-2)  [THIS GATE]
  → wording_evaluation_gate (8.2G-3)
  → wording_review_gate (8.2G-4)
  → ...
  → user_visible_response_assembler (8.2G-6)
```

This validator is a **pure function** — no LLM called, no external service,
no persistence, no logging, no side effects.

---

## 2. Why This Validator Exists Before a Live LLM

The validator is built before any live LLM call for three reasons:

1. **Pipeline shape first**: The validation contract (what rules to check, what
   violations to emit, what verdict precedence to apply) must be established and
   tested against mock output before a real LLM can produce anything unpredictable.

2. **Downstream confidence**: Phases 8.2G-3 (wording gate) and 8.2G-4 (wording
   review) depend on knowing the validator's output contract. Building the validator
   first lets those phases be implemented without a live LLM.

3. **Safety invariant hardcoding**: `acceptedForUserVisibleAssembly: false` is a
   compile-time literal type in this phase. It cannot accidentally become `true`
   until Phase 8.2G-6 deliberately replaces this type boundary.

---

## 3. What It Validates

| Rule | Check |
|---|---|
| **liveLLMCalled invariant** | `result.liveLLMCalled === false` — defensive runtime check |
| **userVisibleOutputAllowed invariant** | `result.userVisibleOutputAllowed === false` — defensive runtime check |
| **result neverUserVisible** | `result.neverUserVisible === true` — defensive runtime check |
| **section neverUserVisible** | Every section.neverUserVisible === true |
| **allowed section membership** | Every section.sectionType ∈ input.allowedSectionTypes |
| **unsafe safety flags** | No section.safetyFlags may be non-empty |
| **forbidden move coverage** | Every input.activeForbiddenMoves[i] ∈ result.appliedForbiddenMoves |
| **required constraint coverage** | Every input.activeRequiredConstraints[i] ∈ result.appliedRequiredConstraints |
| **mock prefix** | Every section.draftText starts with `[MOCK_DRAFT_NEVER_USER_VISIBLE]` |
| **empty draft text** | No section.draftText is blank |
| **forbidden adapter mode** | input.adapterMode must not be `future_live_llm` |
| **user-visible diagnostic flag** | `contains_user_visible_diagnostic` triggers extra violation code |

---

## 4. What It Refuses

The validator refuses any draft that:

- Has `liveLLMCalled !== false` at runtime (even if the type says it's always false).
- Has `userVisibleOutputAllowed !== false` at runtime.
- Has `result.neverUserVisible !== true` at runtime.
- Has any section with `neverUserVisible !== true`.
- Contains sections whose `sectionType` is not in `input.allowedSectionTypes`.
- Has any section with non-empty `safetyFlags`.
- Is missing coverage for any `activeForbiddenMoves` entry.
- Is missing coverage for any `activeRequiredConstraints` entry.
- Has a `draftText` without the `[MOCK_DRAFT_NEVER_USER_VISIBLE]` prefix.
- Has blank `draftText`.
- Was produced by `input.adapterMode === "future_live_llm"` (forbidden mode in Phase 8.2G-2).

---

## 5. Why `acceptedForUserVisibleAssembly` Remains False

`acceptedForUserVisibleAssembly: false` is a **literal type** on
`RuntimeLLMOutputContractValidationResult`. It can never be set to `true`
in Phase 8.2G-2 and is not a runtime boolean.

This gate validates that a draft is safe to pass to the **next governance gate**
(Phase 8.2G-3 wording evaluation). It does not validate that a draft is safe
to show to a user. User-visible assembly requires all of the following:

1. This validator: contract validity.
2. Phase 8.2G-3: wording evaluation gate.
3. Phase 8.2G-4: wording review gate.
4. Phase 8.2G-6: response assembler authorisation.

Only Phase 8.2G-6, after all previous gates pass, may produce user-visible output.

---

## 6. Relationship to Phase 8.2G-1 Mock Adapter

Phase 8.2G-1 produces a `RuntimeLLMDraftAdapterResult` with:
- `liveLLMCalled: false`
- `userVisibleOutputAllowed: false`
- `neverUserVisible: true`
- `draftText` prefixed with `[MOCK_DRAFT_NEVER_USER_VISIBLE]`
- `safetyFlags: []` for normal sections

Under normal mock adapter output, this validator will return `accepted_for_next_gate`.

The only exception is the controlled unsafe fixture path (`contractRef === "__mock_unsafe_fixture_test__"`),
which the validator correctly identifies as `rejected_unsafe_draft`.

---

## 7. Relationship to Future Phase 8.2G-3 Wording Gate

When a draft receives verdict `accepted_for_next_gate` and
`acceptedForWordingGate === true`, it may be passed to the Phase 8.2G-3
Wording Governance Runtime Gate, which will:

- Apply the wording score evaluation scaffold from the governance kernel.
- Verify forbidden moves are not reflected in candidate wording.
- Verify required constraints are present in candidate wording.
- Produce per-section wording scores and gate decisions.

The contract validator does not inspect wording quality — it only checks
structural and safety invariants.

---

## 8. Relationship to Future Live LLM (Phase 8.2G-5)

When a real LLM is introduced in Phase 8.2G-5, this validator will receive
real LLM output instead of mock fixtures. The validation rules do not change.
The only expected difference:

- `draftText` will no longer start with `[MOCK_DRAFT_NEVER_USER_VISIBLE]`.
- A new prefix or no-prefix policy will be established in Phase 8.2G-5.
- The `llm_output_missing_mock_prefix` rule may be replaced by a different
  prefix / structure check.

Until Phase 8.2G-5, this validator assumes mock fixtures and enforces
the `[MOCK_DRAFT_NEVER_USER_VISIBLE]` prefix rule.

---

## 9. Visibility Invariants

The following invariants are checked defensively at **runtime**, not only at
the type level, because future code paths might cast these values:

| Invariant | Checked via |
|---|---|
| `result.liveLLMCalled === false` | `unsafeReadField` + `!== false` |
| `result.userVisibleOutputAllowed === false` | `unsafeReadField` + `!== false` |
| `result.neverUserVisible === true` | `unsafeReadField` + `!== true` |
| `section.neverUserVisible === true` | `unsafeReadField` + `!== true` (per section) |

Violation of any visibility invariant produces `rejected_visibility_violation`,
which has the highest verdict precedence.

---

## 10. Contract Coverage Invariants

Forbidden move and required constraint coverage is checked by intersection:

- Every entry in `input.activeForbiddenMoves` must appear in `result.appliedForbiddenMoves`.
- Every entry in `input.activeRequiredConstraints` must appear in `result.appliedRequiredConstraints`.

If coverage is incomplete, `rejected_contract_violation` is returned and the
missing items are documented in `result.notes`.

`validatedForbiddenMoves` and `validatedRequiredConstraints` in the result
contain only the confirmed-covered subset — never the full input set.

---

## 11. Safety Flag Behavior

Any section with non-empty `safetyFlags` is rejected as `rejected_unsafe_draft`.

Special handling for `contains_user_visible_diagnostic`:
- When present, `llm_output_user_visible_diagnostic_detected` is emitted in
  addition to `llm_output_unsafe_safety_flag`.
- This signals that the section text contains governance metadata (trace IDs,
  diagnostic codes) that must never be exposed to a user.

The `sourceBound` field is advisory only in Phase 8.2G-2:
- A section with `sourceBound: false` is NOT rejected.
- A note is added: `"sourceBound remains false in mock phase; production source binding is future work."`
- The `llm_output_section_not_source_bound_policy` violation code is reserved
  for a future phase when source binding becomes mandatory.

---

## 12. Verdict Precedence

```
rejected_visibility_violation   (highest — breaks neverUserVisible/liveLLMCalled/userVisibleOutputAllowed)
  ↓
rejected_unsafe_draft            (safety flags on any section)
  ↓
rejected_contract_violation      (adapter mode, section membership, coverage gaps, prefix, empty text)
  ↓
accepted_for_next_gate           (all rules pass)
```

---

## 13. Regression Cases

`runRuntimeLLMOutputContractValidatorRegressionScaffold()` runs 14 cases:

| Case | Description | Expected Verdict |
|---|---|---|
| 1 | Valid mock free_preview | `accepted_for_next_gate` |
| 2 | Valid mock paid_explanation (4 sections) | `accepted_for_next_gate` |
| 3 | Unsafe fixture flags from 8.2G-1 | `rejected_unsafe_draft` |
| 4 | `future_live_llm` adapter mode | `rejected_contract_violation` |
| 5 | `liveLLMCalled` forced true via cast | `rejected_visibility_violation` |
| 6 | `userVisibleOutputAllowed` forced true via cast | `rejected_visibility_violation` |
| 7 | `result.neverUserVisible` forced false via cast | `rejected_visibility_violation` |
| 8 | `section.neverUserVisible` forced false via cast | `rejected_visibility_violation` |
| 9 | Section type not in allowedSectionTypes | `rejected_contract_violation` |
| 10 | Missing forbidden move coverage | `rejected_contract_violation` |
| 11 | Missing required constraint coverage | `rejected_contract_violation` |
| 12 | Missing mock prefix on draftText | `rejected_visibility_violation` |
| 13 | Empty draftText | `rejected_contract_violation` |
| 14 | `contains_user_visible_diagnostic` safety flag | `rejected_unsafe_draft` |

---

## Files

| File | Purpose |
|---|---|
| `runtime-llm-output-contract-validator-types.ts` | All types for Phase 8.2G-2 |
| `validate-runtime-llm-output-contract.ts` | `validateRuntimeLLMOutputContract()` |
| `runtime-llm-output-contract-validator-regression-scaffold.ts` | 14-case regression scaffold |

---

## Safety Boundary

This phase:
- Does **not** call any LLM or external API.
- Does **not** import any LLM SDK.
- Does **not** add API keys, env vars, or configuration.
- Does **not** modify Smart Talk prompts, API routes, UI, OCR, payments, or production rendering.
- Does **not** produce user-visible text.
- Does **not** modify the mock adapter (Phase 8.2G-1).

`acceptedForUserVisibleAssembly` is always `false`.  
`liveLLMCalled` is always `false`.  
`userVisibleOutputAllowed` is always `false`.

Next phase: **8.2G-3 — Wording Governance Runtime Gate**
