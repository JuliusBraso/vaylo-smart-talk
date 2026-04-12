# Vaylo architecture notes

## User DNA (identity)

- **Canonical engine:** `calculateVayloDNA` in `lib/vaylo/dna-engine.ts` persists JSON to `public.profiles.dna`; reads go through `getProfileDNA` in `lib/dna/get-profile-dna.ts`.
- **Legacy / unused in production flow:** `lib/dna/computeUserDNA.ts` defines an alternate `UserDNA` shape and scoring. Do not extend for new features unless migrating deliberately.

## Global user state

- **Canonical resolver:** `getUserState` in `lib/vaylo/state/get-user-state.ts` is the single consolidation point for DNA, profile scalars, live situation, progress, behavior signals, and lightweight document metadata.
- **Shared server bundle:** `loadUserStateContext` in `lib/vaylo/state/load-user-state-context.ts` runs `getUserState` plus `getDashboardActionsFromState` once; dashboard and chat both use it so action lists stay aligned with the same `UserState`.

Recommended cleanup later: grep for `computeUserDNA` / `computeUserDNA` imports and delete the legacy module if nothing references it.
