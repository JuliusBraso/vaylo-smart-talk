"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { formatMessage } from "@/lib/i18n/format";
import {
  getEmploymentLabel,
  getFamilyLabel,
  getGoalLabel,
  getLanguageLabel,
} from "@/lib/i18n/labels";
import { useT } from "@/lib/i18n/useT";
import type {
  EmploymentType,
  FamilyStatus,
  Goal,
  LanguageLevel,
} from "@/lib/dna/types";
import { calculateVayloDNA } from "@/lib/vaylo/dna-engine";
import { getMyProfile, upsertMyProfile } from "@/lib/profile";
import { ROUTES } from "@/lib/routes";

type StepId =
  | "family"
  | "employment"
  | "jobSeekerFollowup"
  | "freelancerFollowup"
  | "language"
  | "goals";

export default function ProfileEditor() {
  const router = useRouter();
  const { t } = useT();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [stepIndex, setStepIndex] = useState(0);
  const [familyStatus, setFamilyStatus] = useState<FamilyStatus | null>(null);
  const [employmentType, setEmploymentType] = useState<EmploymentType | null>(
    null
  );
  const [languageLevel, setLanguageLevel] = useState<LanguageLevel | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);

  // Followups (currently not persisted; used only to guide the flow)
  const [freelancerInvoicesDE, setFreelancerInvoicesDE] = useState<
    boolean | null
  >(null);
  const [jobSeekerUrgency, setJobSeekerUrgency] = useState<
    "relaxed" | "urgent" | null
  >(null);

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

        setFamilyStatus(profile?.family_status ?? "single");
        setEmploymentType(profile?.employment_type ?? "employee");
        setLanguageLevel(profile?.language_level ?? "A2");
        setGoals(profile?.goals ?? []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mounted]);

  const languageLevels: LanguageLevel[] = useMemo(
    () => ["A1", "A2", "B1", "B2", "C1"],
    []
  );

  const steps: StepId[] = useMemo(() => {
    const list: StepId[] = [];
    list.push("family");
    list.push("employment");
    if (employmentType === "freelancer") list.push("freelancerFollowup");
    if (employmentType === "job_seeker") list.push("jobSeekerFollowup");
    list.push("language");
    list.push("goals");
    return list;
  }, [employmentType]);

  const safeIndex = Math.min(stepIndex, steps.length - 1);
  const currentStep: StepId = steps[safeIndex] ?? "family";
  const totalSteps = steps.length;
  const progress = ((safeIndex + 1) / totalSteps) * 100;

  const stepText = useMemo(
    () =>
      formatMessage(t.onboarding.step, {
        step: String(safeIndex + 1),
        total: String(totalSteps),
      }),
    [t, safeIndex, totalSteps]
  );

  const canSave =
    !!familyStatus &&
    !!employmentType &&
    !!languageLevel &&
    goals.length > 0 &&
    !saving;

  const toggleGoal = (g: Goal) => {
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  const handleNext = () => setStepIndex((idx) => Math.min(idx + 1, steps.length - 1));
  const handleBack = () => setStepIndex((idx) => Math.max(idx - 1, 0));

  const handleSave = useCallback(async () => {
    if (!familyStatus || !employmentType || !languageLevel || goals.length === 0)
      return;

    setSaving(true);
    try {
      const dna = calculateVayloDNA({
        family_status: familyStatus,
        employment_type: employmentType,
        language_level: languageLevel,
        goals,
      });

      const now = new Date().toISOString();

      const { error } = await upsertMyProfile(supabase, {
        family_status: familyStatus,
        employment_type: employmentType,
        language_level: languageLevel,
        goals,
        dna,
        dna_updated_at: now,
      });

      if (!error) {
        router.refresh();
        router.push(ROUTES.dashboard);
      } else {
        console.error("[Vaylo] Failed to save profile", error);
      }
    } finally {
      setSaving(false);
    }
  }, [employmentType, familyStatus, goals, languageLevel, router]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-xl px-6 py-12">
        <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-[0_30px_80px_-25px_rgba(15,23,42,0.25)] backdrop-blur-sm">
          <div className="border-b border-slate-200/70 bg-white px-8 py-8">
            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {t.dashboard.editProfileTitle}
              </h1>
              <p className="text-slate-500">{t.dashboard.editProfileDesc}</p>
            </div>
          </div>

          <div className="space-y-6 px-8 py-8">
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wide">{stepText}</p>
              <div className="mb-6 h-1.5 w-full rounded-full bg-slate-200">
                <div
                  className="h-1.5 rounded-full bg-indigo-500 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {loading ? (
              <div className="text-sm text-slate-600">{t.documents.loading}</div>
            ) : (
              <div className="space-y-6">
                {currentStep === "family" && (
                  <section className="space-y-4">
                    <h2 className="text-sm font-semibold text-slate-900">
                      {t.onboarding.questionFamily}
                    </h2>
                    <div className="mt-4 grid max-w-xl gap-4">
                      {(
                        ["single", "family", "children"] as const
                      ).map((value) => ({
                        value,
                        label: getFamilyLabel(value, t),
                      })).map((o) => {
                        const active = familyStatus === o.value;
                        return (
                          <button
                            key={o.value}
                            type="button"
                            onClick={() => setFamilyStatus(o.value)}
                            className={`relative block w-full rounded-2xl border px-5 py-5 text-left transition-all duration-150 ${
                              active
                                ? "border-blue-300 bg-blue-50 shadow-sm"
                                : "border-slate-200 bg-white hover:bg-blue-50"
                            }`}
                          >
                            <div className="pr-8">
                              <div className="text-base font-semibold text-slate-900">
                                {o.label}
                              </div>
                            </div>
                            {active ? (
                              <div className="absolute right-4 top-4 text-blue-600 text-lg font-bold">
                                ✓
                              </div>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={ROUTES.dashboard}
                        className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
                      >
                        {t.dashboard.cancel}
                      </Link>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
                      >
                        {t.onboarding.continue}
                      </button>
                    </div>
                  </section>
                )}

                {currentStep === "employment" && (
                  <section className="space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-sm font-semibold text-slate-900">
                        {t.onboarding.employmentTitle}
                      </h2>
                      <p className="text-xs text-slate-500">{t.onboarding.employmentDesc}</p>
                    </div>
                    <div className="mt-4 grid max-w-xl gap-4">
                      {(
                        ["employee", "freelancer", "job_seeker"] as const
                      ).map((value) => ({
                        value,
                        label: getEmploymentLabel(value, t),
                      })).map((o) => {
                        const active = employmentType === o.value;
                        return (
                          <button
                            key={o.value}
                            type="button"
                            onClick={() => setEmploymentType(o.value)}
                            className={`relative block w-full rounded-2xl border px-5 py-5 text-left transition-all duration-150 ${
                              active
                                ? "border-blue-300 bg-blue-50 shadow-sm"
                                : "border-slate-200 bg-white hover:bg-blue-50"
                            }`}
                          >
                            <div className="pr-8">
                              <div className="text-base font-semibold text-slate-900">
                                {o.label}
                              </div>
                            </div>
                            {active ? (
                              <div className="absolute right-4 top-4 text-blue-600 text-lg font-bold">
                                ✓
                              </div>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
                      >
                        {t.onboarding.back}
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
                      >
                        {t.onboarding.continue}
                      </button>
                    </div>
                  </section>
                )}

                {currentStep === "freelancerFollowup" && (
                  <section className="space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-sm font-semibold text-slate-900">
                        {t.onboarding.freelanceSetupTitle}
                      </h2>
                      <p className="text-xs text-slate-500">{t.onboarding.freelanceSetupDesc}</p>
                    </div>
                    <div className="mt-4 grid max-w-xl gap-4">
                      {(
                        [
                          { value: true, label: t.onboarding.yesRegularly },
                          { value: false, label: t.onboarding.notYetStarting },
                        ] as const
                      ).map((o) => {
                        const active = freelancerInvoicesDE === o.value;
                        return (
                          <button
                            key={String(o.value)}
                            type="button"
                            onClick={() => setFreelancerInvoicesDE(o.value)}
                            className={`relative block w-full rounded-2xl border px-5 py-5 text-left transition-all duration-150 ${
                              active
                                ? "border-blue-300 bg-blue-50 shadow-sm"
                                : "border-slate-200 bg-white hover:bg-blue-50"
                            }`}
                          >
                            <div className="pr-8">
                              <div className="text-base font-semibold text-slate-900">
                                {o.label}
                              </div>
                            </div>
                            {active ? (
                              <div className="absolute right-4 top-4 text-blue-600 text-lg font-bold">
                                ✓
                              </div>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
                      >
                        {t.onboarding.back}
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
                      >
                        {t.onboarding.continue}
                      </button>
                    </div>
                  </section>
                )}

                {currentStep === "jobSeekerFollowup" && (
                  <section className="space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-sm font-semibold text-slate-900">
                        {t.onboarding.jobUrgencyTitle}
                      </h2>
                      <p className="text-xs text-slate-500">{t.onboarding.jobUrgencyDesc}</p>
                    </div>
                    <div className="mt-4 grid max-w-xl gap-4">
                      {(
                        [
                          { value: "relaxed", label: t.onboarding.jobUrgencyRelaxed },
                          { value: "urgent", label: t.onboarding.jobUrgencyUrgent },
                        ] as const
                      ).map((o) => {
                        const active = jobSeekerUrgency === o.value;
                        return (
                          <button
                            key={o.value}
                            type="button"
                            onClick={() => setJobSeekerUrgency(o.value)}
                            className={`relative block w-full rounded-2xl border px-5 py-5 text-left transition-all duration-150 ${
                              active
                                ? "border-blue-300 bg-blue-50 shadow-sm"
                                : "border-slate-200 bg-white hover:bg-blue-50"
                            }`}
                          >
                            <div className="pr-8">
                              <div className="text-base font-semibold text-slate-900">
                                {o.label}
                              </div>
                            </div>
                            {active ? (
                              <div className="absolute right-4 top-4 text-blue-600 text-lg font-bold">
                                ✓
                              </div>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
                      >
                        {t.onboarding.back}
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
                      >
                        {t.onboarding.continue}
                      </button>
                    </div>
                  </section>
                )}

                {currentStep === "language" && (
                  <section className="space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-sm font-semibold text-slate-900">
                        {t.onboarding.languageTitle}
                      </h2>
                      <p className="text-xs text-slate-500">{t.onboarding.languageDesc}</p>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {languageLevels.map((L) => {
                        const active = languageLevel === L;
                        return (
                          <button
                            key={L}
                            type="button"
                            onClick={() => setLanguageLevel(L)}
                            className={`relative block w-full rounded-2xl border px-5 py-4 text-left transition-all duration-150 ${
                              active
                                ? "border-blue-300 bg-blue-50 shadow-sm"
                                : "border-slate-200 bg-white hover:bg-blue-50"
                            }`}
                          >
                            <div className="pr-8">
                              <div className="text-base font-semibold text-slate-900">
                                {getLanguageLabel(L, t)}
                              </div>
                            </div>
                            {active ? (
                              <div className="absolute right-4 top-4 text-blue-600 text-lg font-bold">
                                ✓
                              </div>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
                      >
                        {t.onboarding.back}
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
                      >
                        {t.onboarding.continue}
                      </button>
                    </div>
                  </section>
                )}

                {currentStep === "goals" && (
                  <section className="space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-sm font-semibold text-slate-900">
                        {t.onboarding.goalsTitle}
                      </h2>
                      <p className="text-xs text-slate-500">{t.onboarding.goalsDesc}</p>
                    </div>
                    <div className="mt-4 grid max-w-xl gap-4">
                      {(
                        ["bureaucracy", "job", "orientation"] as const
                      ).map((value) => ({
                        value,
                        label: getGoalLabel(value, t),
                      })).map((o) => {
                        const active = goals.includes(o.value);
                        return (
                          <button
                            key={o.value}
                            type="button"
                            onClick={() => toggleGoal(o.value)}
                            className={`relative block w-full rounded-2xl border px-5 py-5 text-left transition-all duration-150 ${
                              active
                                ? "border-blue-300 bg-blue-50 shadow-sm"
                                : "border-slate-200 bg-white hover:bg-blue-50"
                            }`}
                          >
                            <div className="pr-8">
                              <div className="text-base font-semibold text-slate-900">
                                {o.label}
                              </div>
                            </div>
                            {active ? (
                              <div className="absolute right-4 top-4 text-blue-600 text-lg font-bold">
                                ✓
                              </div>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="inline-flex h-12 flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
                      >
                        {t.onboarding.back}
                      </button>
                      <button
                        type="button"
                        disabled={!canSave}
                        onClick={handleSave}
                        className="inline-flex h-12 flex-1 items-center justify-center rounded-xl bg-blue-600 px-6 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {saving ? t.dashboard.saving : t.dashboard.saveChanges}
                      </button>
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                      {t.onboarding.privacyNote}
                    </p>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

