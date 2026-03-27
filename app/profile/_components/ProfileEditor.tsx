"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { getLanguageLabel } from "@/lib/i18n/labels";
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

  const canSave =
    !!familyStatus &&
    !!employmentType &&
    !!languageLevel &&
    goals.length > 0 &&
    !saving;

  const stepText = t.onboarding.step
    .replace("{step}", String(safeIndex + 1))
    .replace("{total}", String(totalSteps));

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
    <main className="min-h-screen bg-slate-950/95 text-slate-50">
      <div className="max-w-xl mx-auto px-6 py-12">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 shadow-[0_40px_120px_rgba(15,23,42,1)] backdrop-blur-2xl">
          <div className="border-b border-white/10 bg-slate-950/80 px-6 py-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {t.dashboard.editProfileTitle}
              </h1>
              <p className="text-slate-400">{t.dashboard.editProfileDesc}</p>
            </div>
          </div>

          <div className="space-y-8 px-6 py-6">
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wide">{stepText}</p>
              <div className="w-full h-1 bg-slate-800 rounded-full mb-6">
                <div
                  className="h-1 bg-blue-500 rounded-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {loading ? (
              <div className="text-sm text-slate-300">{t.documents.loading}</div>
            ) : (
              <div className="space-y-6">
                {currentStep === "family" && (
                  <section className="space-y-4">
                    <h2 className="text-sm font-semibold text-slate-50">
                      {t.onboarding.questionFamily}
                    </h2>
                    <div className="mt-4 grid gap-4 max-w-xl">
                      {(
                        [
                          { value: "single", label: t.onboarding.optionSingle },
                          { value: "family", label: t.onboarding.optionCouple },
                          { value: "children", label: t.onboarding.optionFamilyKids },
                        ] as const
                      ).map((o) => {
                        const active = familyStatus === o.value;
                        return (
                          <button
                            key={o.value}
                            type="button"
                            onClick={() => setFamilyStatus(o.value)}
                            className={`relative block w-full rounded-2xl border px-5 py-5 text-left transition-all duration-200 ${
                              active
                                ? "border-blue-500 bg-blue-500/15 shadow-lg"
                                : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                            }`}
                          >
                            <div className="pr-8">
                              <div className="text-base font-semibold text-white">
                                {o.label}
                              </div>
                            </div>
                            {active ? (
                              <div className="absolute right-4 top-4 text-blue-400 text-lg font-bold">
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
                        className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200"
                      >
                        {t.dashboard.cancel}
                      </Link>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex flex-1 items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        {t.onboarding.continue}
                      </button>
                    </div>
                  </section>
                )}

                {currentStep === "employment" && (
                  <section className="space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-sm font-semibold text-slate-50">
                        {t.onboarding.employmentTitle}
                      </h2>
                      <p className="text-xs text-slate-300">{t.onboarding.employmentDesc}</p>
                    </div>
                    <div className="mt-4 grid gap-4 max-w-xl">
                      {(
                        [
                          { value: "employee", label: t.onboarding.employmentEmployee },
                          { value: "freelancer", label: t.onboarding.employmentFreelancer },
                          { value: "job_seeker", label: t.onboarding.employmentJobSeeker },
                        ] as const
                      ).map((o) => {
                        const active = employmentType === o.value;
                        return (
                          <button
                            key={o.value}
                            type="button"
                            onClick={() => setEmploymentType(o.value)}
                            className={`relative block w-full rounded-2xl border px-5 py-5 text-left transition-all duration-200 ${
                              active
                                ? "border-blue-500 bg-blue-500/15 shadow-lg"
                                : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                            }`}
                          >
                            <div className="pr-8">
                              <div className="text-base font-semibold text-white">
                                {o.label}
                              </div>
                            </div>
                            {active ? (
                              <div className="absolute right-4 top-4 text-blue-400 text-lg font-bold">
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
                        className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200"
                      >
                        {t.onboarding.back}
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex flex-1 items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        {t.onboarding.continue}
                      </button>
                    </div>
                  </section>
                )}

                {currentStep === "freelancerFollowup" && (
                  <section className="space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-sm font-semibold text-slate-50">
                        {t.onboarding.freelanceSetupTitle}
                      </h2>
                      <p className="text-xs text-slate-300">{t.onboarding.freelanceSetupDesc}</p>
                    </div>
                    <div className="mt-4 grid gap-4 max-w-xl">
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
                            className={`relative block w-full rounded-2xl border px-5 py-5 text-left transition-all duration-200 ${
                              active
                                ? "border-blue-500 bg-blue-500/15 shadow-lg"
                                : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                            }`}
                          >
                            <div className="pr-8">
                              <div className="text-base font-semibold text-white">
                                {o.label}
                              </div>
                            </div>
                            {active ? (
                              <div className="absolute right-4 top-4 text-blue-400 text-lg font-bold">
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
                        className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200"
                      >
                        {t.onboarding.back}
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex flex-1 items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        {t.onboarding.continue}
                      </button>
                    </div>
                  </section>
                )}

                {currentStep === "jobSeekerFollowup" && (
                  <section className="space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-sm font-semibold text-slate-50">
                        {t.onboarding.jobUrgencyTitle}
                      </h2>
                      <p className="text-xs text-slate-300">{t.onboarding.jobUrgencyDesc}</p>
                    </div>
                    <div className="mt-4 grid gap-4 max-w-xl">
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
                            className={`relative block w-full rounded-2xl border px-5 py-5 text-left transition-all duration-200 ${
                              active
                                ? "border-blue-500 bg-blue-500/15 shadow-lg"
                                : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                            }`}
                          >
                            <div className="pr-8">
                              <div className="text-base font-semibold text-white">
                                {o.label}
                              </div>
                            </div>
                            {active ? (
                              <div className="absolute right-4 top-4 text-blue-400 text-lg font-bold">
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
                        className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200"
                      >
                        {t.onboarding.back}
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex flex-1 items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        {t.onboarding.continue}
                      </button>
                    </div>
                  </section>
                )}

                {currentStep === "language" && (
                  <section className="space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-sm font-semibold text-slate-50">
                        {t.onboarding.languageTitle}
                      </h2>
                      <p className="text-xs text-slate-300">{t.onboarding.languageDesc}</p>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {languageLevels.map((L) => {
                        const active = languageLevel === L;
                        return (
                          <button
                            key={L}
                            type="button"
                            onClick={() => setLanguageLevel(L)}
                            className={`relative block w-full rounded-2xl border px-5 py-4 text-left transition-all duration-200 ${
                              active
                                ? "border-blue-500 bg-blue-500/15 shadow-lg"
                                : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                            }`}
                          >
                            <div className="pr-8">
                              <div className="text-base font-semibold text-white">
                                {getLanguageLabel(L, t)}
                              </div>
                            </div>
                            {active ? (
                              <div className="absolute right-4 top-4 text-blue-400 text-lg font-bold">
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
                        className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200"
                      >
                        {t.onboarding.back}
                      </button>
                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex flex-1 items-center justify-center rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        {t.onboarding.continue}
                      </button>
                    </div>
                  </section>
                )}

                {currentStep === "goals" && (
                  <section className="space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-sm font-semibold text-slate-50">
                        {t.onboarding.goalsTitle}
                      </h2>
                      <p className="text-xs text-slate-300">{t.onboarding.goalsDesc}</p>
                    </div>
                    <div className="mt-4 grid gap-4 max-w-xl">
                      {(
                        [
                          { value: "bureaucracy", label: t.onboarding.goalBureaucracy },
                          { value: "job", label: t.onboarding.goalJob },
                          { value: "orientation", label: t.onboarding.goalOrientation },
                        ] as const
                      ).map((o) => {
                        const active = goals.includes(o.value);
                        return (
                          <button
                            key={o.value}
                            type="button"
                            onClick={() => toggleGoal(o.value)}
                            className={`relative block w-full rounded-2xl border px-5 py-5 text-left transition-all duration-200 ${
                              active
                                ? "border-blue-500 bg-blue-500/15 shadow-lg"
                                : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                            }`}
                          >
                            <div className="pr-8">
                              <div className="text-base font-semibold text-white">
                                {o.label}
                              </div>
                            </div>
                            {active ? (
                              <div className="absolute right-4 top-4 text-blue-400 text-lg font-bold">
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
                        className="inline-flex flex-1 items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200"
                      >
                        {t.onboarding.back}
                      </button>
                      <button
                        type="button"
                        disabled={!canSave}
                        onClick={handleSave}
                        className="inline-flex flex-1 items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
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

