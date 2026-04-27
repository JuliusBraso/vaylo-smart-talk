"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n/useT";
import { calculateVayloDNA } from "@/lib/vaylo/dna-engine";
import { getMyProfile } from "@/lib/profile";
import { ROUTES } from "@/lib/routes";
import type { Goal } from "@/lib/dna/types";
import { GERMAN_REGIONS, REGION_CONFIG } from "@/lib/vaylo/region/region-config";

type RegistrationStatus =
  | "unknown"
  | "not_registered"
  | "appointment_booked"
  | "registered";

type OptBool = boolean | null;

function readBool(p: Record<string, unknown>, key: string): OptBool {
  const v = p[key];
  return typeof v === "boolean" ? v : null;
}

function readString(p: Record<string, unknown>, key: string): string | null {
  const v = p[key];
  return typeof v === "string" ? v : null;
}

export default function RefineProfile() {
  const { t } = useT();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Extended profile fields (optional)
  const [hasSteuerId, setHasSteuerId] = useState<OptBool>(null);
  const [hasHealthInsurance, setHasHealthInsurance] = useState<OptBool>(null);
  const [hasBankAccount, setHasBankAccount] = useState<OptBool>(null);
  const [registeredArbeitsagentur, setRegisteredArbeitsagentur] =
    useState<OptBool>(null);
  const [hasChildren, setHasChildren] = useState<OptBool>(null);
  const [childrenSchoolAge, setChildrenSchoolAge] = useState<OptBool>(null);
  const [hasCv, setHasCv] = useState<OptBool>(null);
  const [jobSearchUrgency, setJobSearchUrgency] = useState<
    "relaxed" | "urgent" | null
  >(null);
  const [bundesland, setBundesland] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [registrationStatus, setRegistrationStatus] =
    useState<RegistrationStatus | "">("");

  // Keep core inputs for DNA recomputation (not presented as “DNA”)
  const [familyStatus, setFamilyStatus] = useState<string | null>(null);
  const [employmentType, setEmploymentType] = useState<string | null>(null);
  const [languageLevel, setLanguageLevel] = useState<string | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const { profile } = await getMyProfile(supabase);
        if (cancelled) return;
        const p = (profile ?? {}) as Record<string, unknown>;

        // Prefill extended fields if present
        setHasSteuerId(readBool(p, "has_steuer_id"));
        setHasHealthInsurance(readBool(p, "has_health_insurance"));
        setHasBankAccount(readBool(p, "has_bank_account"));
        setRegisteredArbeitsagentur(readBool(p, "registered_arbeitsagentur"));
        setHasChildren(readBool(p, "has_children"));
        setChildrenSchoolAge(readBool(p, "children_school_age"));
        setHasCv(readBool(p, "has_cv"));

        const urg = readString(p, "job_search_urgency");
        setJobSearchUrgency(urg === "urgent" || urg === "relaxed" ? urg : null);

        // Pull core inputs from existing profile for recomputation
        setFamilyStatus(typeof p.family_status === "string" ? p.family_status : null);
        setEmploymentType(
          typeof p.employment_type === "string" ? p.employment_type : null
        );
        setLanguageLevel(
          typeof p.language_level === "string" ? p.language_level : null
        );
        setGoals((profile?.goals as Goal[]) ?? []);
        setBundesland(
          typeof p.bundesland === "string"
            ? p.bundesland
            : typeof p.region === "string"
              ? p.region
              : "",
        );
        setCity(typeof p.city === "string" ? p.city : "");
        setPostalCode(typeof p.postal_code === "string" ? p.postal_code : "");
        setRegistrationStatus(
          p.registration_status === "unknown" ||
            p.registration_status === "not_registered" ||
            p.registration_status === "appointment_booked" ||
            p.registration_status === "registered"
            ? p.registration_status
            : "",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mounted]);

  const toggleGoal = (g: Goal) => {
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  const canSave = !saving;

  const yesNoCards = useCallback(
    (
      value: OptBool,
      setValue: (v: OptBool) => void,
      yesLabel: string,
      noLabel: string
    ) => {
      return (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(
            [
              { v: true, label: yesLabel },
              { v: false, label: noLabel },
            ] as const
          ).map((o) => {
            const active = value === o.v;
            return (
              <button
                key={String(o.v)}
                type="button"
                onClick={() => setValue(o.v)}
                className={`relative block w-full rounded-2xl border px-5 py-4 text-left transition-all duration-200 ${
                  active
                    ? "border-indigo-200 bg-indigo-50 shadow-sm"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                }`}
              >
                <div className="pr-8">
                  <div className="text-sm font-semibold text-slate-900">{o.label}</div>
                </div>
                {active ? (
                  <div className="absolute right-4 top-4 text-indigo-600 text-lg font-bold">
                    ✓
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      );
    },
    []
  );

  const urgencyCards = useMemo(() => {
    const items = [
      { v: "relaxed" as const, label: t.onboarding.jobUrgencyRelaxed },
      { v: "urgent" as const, label: t.onboarding.jobUrgencyUrgent },
    ];
    return (
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((o) => {
          const active = jobSearchUrgency === o.v;
          return (
            <button
              key={o.v}
              type="button"
              onClick={() => setJobSearchUrgency(o.v)}
              className={`relative block w-full rounded-2xl border px-5 py-4 text-left transition-all duration-200 ${
                active
                  ? "border-indigo-200 bg-indigo-50 shadow-sm"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="pr-8">
                <div className="text-sm font-semibold text-slate-900">{o.label}</div>
              </div>
              {active ? (
                <div className="absolute right-4 top-4 text-indigo-600 text-lg font-bold">
                  ✓
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    );
  }, [jobSearchUrgency, t.onboarding.jobUrgencyRelaxed, t.onboarding.jobUrgencyUrgent]);

  const handleSave = useCallback(async () => {
    if (!familyStatus || !employmentType || !languageLevel || goals.length === 0) {
      // Core inputs missing → we can still save extended fields, but DNA recompute needs inputs.
      // Keep it simple: do not block UX; just persist extended fields and keep existing DNA.
    }

    setSaving(true);
    try {
      const now = new Date().toISOString();
      const payload: Record<string, unknown> = {};

      // Only send optional fields when user actually set them.
      // This avoids 400s caused by NOT NULL columns or stricter DB constraints.
      if (hasSteuerId !== null) payload.has_steuer_id = hasSteuerId;
      if (hasHealthInsurance !== null)
        payload.has_health_insurance = hasHealthInsurance;
      if (hasBankAccount !== null) payload.has_bank_account = hasBankAccount;
      if (registeredArbeitsagentur !== null)
        payload.registered_arbeitsagentur = registeredArbeitsagentur;
      if (hasChildren !== null) payload.has_children = hasChildren;
      if (childrenSchoolAge !== null) payload.children_school_age = childrenSchoolAge;
      if (hasCv !== null) payload.has_cv = hasCv;

      // Normalize urgency to allowed values only.
      if (jobSearchUrgency === "urgent" || jobSearchUrgency === "relaxed") {
        payload.job_search_urgency = jobSearchUrgency;
      }
      payload.country = "DE";
      payload.bundesland = bundesland.trim().length > 0 ? bundesland.trim() : null;
      payload.city = city.trim().length > 0 ? city.trim() : null;
      payload.postal_code =
        postalCode.trim().length > 0 ? postalCode.trim() : null;
      payload.registration_status = registrationStatus || null;

      // Recompute DNA if core inputs are present.
      if (familyStatus && employmentType && languageLevel && goals.length > 0) {
        const dna = calculateVayloDNA({
          family_status: familyStatus as any,
          employment_type: employmentType as any,
          language_level: languageLevel as any,
          goals,
        });

        payload.family_status = familyStatus;
        payload.employment_type = employmentType;
        payload.language_level = languageLevel;
        payload.goals = goals;
        payload.dna = dna;
        payload.dna_updated_at = now;
      }

      if (!familyStatus || !employmentType || !languageLevel || goals.length === 0) {
        // If something is missing (shouldn't happen for normal users), just route back.
        router.push(ROUTES.dashboard);
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("[Vaylo] Failed to resolve user for profile save", userError);
        return;
      }

      // Temporary debug logging (remove after backend issue is fixed)
      console.log("[Vaylo] PAYLOAD", JSON.stringify(payload, null, 2));

      const res = await supabase
        .from("profiles")
        .update(payload)
        .eq("id", user.id);

      if (!res.error) {
        router.refresh();
        router.push(ROUTES.dashboard);
      } else {
        console.error("[Vaylo] Failed to save refine profile");
        console.error("[Vaylo] FULL ERROR", JSON.stringify(res.error, null, 2));
        console.error("[Vaylo] RAW ERROR", res.error);
      }
    } finally {
      setSaving(false);
    }
  }, [
    bundesland,
    city,
    childrenSchoolAge,
    employmentType,
    familyStatus,
    goals,
    hasBankAccount,
    hasChildren,
    hasCv,
    hasHealthInsurance,
    hasSteuerId,
    jobSearchUrgency,
    registeredArbeitsagentur,
    router,
    languageLevel,
    postalCode,
    registrationStatus,
  ]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-[0_30px_80px_-25px_rgba(15,23,42,0.25)] backdrop-blur-sm transition-all duration-200 ease-out hover:shadow-[0_35px_90px_-25px_rgba(15,23,42,0.28)]">
          <div className="border-b border-slate-200/70 bg-white px-8 py-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {t.dashboard.refineProfileTitle}
              </h1>
              <p className="text-slate-500">{t.dashboard.refineProfileDesc}</p>
            </div>
          </div>

          <div className="space-y-6 px-8 py-8">
            {loading ? (
              <div className="text-sm text-slate-600">{t.documents.loading}</div>
            ) : (
              <>
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Location (Germany)
                  </h2>
                  <p className="mt-1 text-xs text-slate-600">
                    Keep your location updated for regional guidance and authority routing.
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-slate-600">
                        Country
                      </label>
                      <input
                        value="DE"
                        readOnly
                        className="h-10 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 text-sm text-slate-700"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="refine-bundesland"
                        className="mb-1 block text-xs font-medium text-slate-600"
                      >
                        Bundesland
                      </label>
                      <select
                        id="refine-bundesland"
                        value={bundesland}
                        onChange={(e) => setBundesland(e.target.value)}
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
                      >
                        <option value="">Select Bundesland</option>
                        {GERMAN_REGIONS.map((regionId) => (
                          <option key={regionId} value={regionId}>
                            {REGION_CONFIG[regionId].germanLabel}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="refine-city"
                        className="mb-1 block text-xs font-medium text-slate-600"
                      >
                        City
                      </label>
                      <input
                        id="refine-city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
                        placeholder="e.g. Berlin"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="refine-postal-code"
                        className="mb-1 block text-xs font-medium text-slate-600"
                      >
                        Postal code
                      </label>
                      <input
                        id="refine-postal-code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
                        placeholder="e.g. 10115"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="refine-registration-status"
                        className="mb-1 block text-xs font-medium text-slate-600"
                      >
                        Registration status
                      </label>
                      <select
                        id="refine-registration-status"
                        value={registrationStatus}
                        onChange={(e) =>
                          setRegistrationStatus(
                            e.target.value as RegistrationStatus | "",
                          )
                        }
                        className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900"
                      >
                        <option value="">Select status</option>
                        <option value="unknown">unknown</option>
                        <option value="not_registered">not_registered</option>
                        <option value="appointment_booked">appointment_booked</option>
                        <option value="registered">registered</option>
                      </select>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-sm font-semibold text-slate-900">
                    {t.dashboard.refineSectionFamilyTitle}
                  </h2>
                  <p className="mt-1 text-xs text-slate-600">
                    {t.dashboard.refineSectionFamilyDesc}
                  </p>
                  {yesNoCards(
                    hasChildren,
                    setHasChildren,
                    t.dashboard.refineYesChildren,
                    t.dashboard.refineNoChildren
                  )}
                  {yesNoCards(
                    childrenSchoolAge,
                    setChildrenSchoolAge,
                    t.dashboard.refineYesSchoolAge,
                    t.dashboard.refineNoSchoolAge
                  )}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-sm font-semibold text-slate-900">
                    {t.dashboard.refineSectionWorkTitle}
                  </h2>
                  <p className="mt-1 text-xs text-slate-600">
                    {t.dashboard.refineSectionWorkDesc}
                  </p>
                  {yesNoCards(
                    registeredArbeitsagentur,
                    setRegisteredArbeitsagentur,
                    t.dashboard.refineYesArbeitsagentur,
                    t.dashboard.refineNoArbeitsagentur
                  )}
                  {yesNoCards(hasCv, setHasCv, t.dashboard.refineYesHasCv, t.dashboard.refineNoHasCv)}
                  <div className="mt-3">
                    <div className="text-xs font-semibold text-slate-700">
                      {t.dashboard.refineJobUrgencyLabel}
                    </div>
                    {urgencyCards}
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-sm font-semibold text-slate-900">
                    {t.dashboard.refineSectionDocsTitle}
                  </h2>
                  <p className="mt-1 text-xs text-slate-600">
                    {t.dashboard.refineSectionDocsDesc}
                  </p>
                  {yesNoCards(
                    hasSteuerId,
                    setHasSteuerId,
                    t.dashboard.refineYesSteuerId,
                    t.dashboard.refineNoSteuerId
                  )}
                  {yesNoCards(
                    hasHealthInsurance,
                    setHasHealthInsurance,
                    t.dashboard.refineYesHealthInsurance,
                    t.dashboard.refineNoHealthInsurance
                  )}
                  {yesNoCards(
                    hasBankAccount,
                    setHasBankAccount,
                    t.dashboard.refineYesBankAccount,
                    t.dashboard.refineNoBankAccount
                  )}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-sm font-semibold text-slate-900">
                    {t.dashboard.refineSectionFocusTitle}
                  </h2>
                  <p className="mt-1 text-xs text-slate-600">
                    {t.dashboard.refineSectionFocusDesc}
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {(
                      [
                        { v: "bureaucracy" as const, label: t.onboarding.goalBureaucracy },
                        { v: "job" as const, label: t.onboarding.goalJob },
                        { v: "orientation" as const, label: t.onboarding.goalOrientation },
                      ] as const
                    ).map((o) => {
                      const active = goals.includes(o.v);
                      return (
                        <button
                          key={o.v}
                          type="button"
                          onClick={() => toggleGoal(o.v)}
                          className={`relative block w-full rounded-2xl border px-5 py-4 text-left transition-all duration-200 ${
                            active
                              ? "border-indigo-200 bg-indigo-50 shadow-sm"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          }`}
                        >
                          <div className="pr-8">
                            <div className="text-sm font-semibold text-slate-900">{o.label}</div>
                          </div>
                          {active ? (
                            <div className="absolute right-4 top-4 text-indigo-600 text-lg font-bold">
                              ✓
                            </div>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </section>

                <div className="flex gap-2">
                  <Link
                    href={ROUTES.dashboard}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {t.dashboard.cancel}
                  </Link>
                  <button
                    type="button"
                    disabled={!canSave}
                    onClick={handleSave}
                    className="inline-flex flex-1 items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? t.dashboard.saving : t.dashboard.saveChanges}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

