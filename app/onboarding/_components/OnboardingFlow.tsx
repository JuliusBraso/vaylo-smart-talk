"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useT } from "@/lib/i18n/useT";
import type {
  FamilyStatus,
  EmploymentType,
  LanguageLevel,
  Goal,
} from "@/lib/dna/types";
import { calculateVayloDNA } from "@/lib/vaylo/dna-engine";
import { upsertMyProfile } from "@/lib/profile";

type StepId =
  | "family"
  | "familyFollowup"
  | "employment"
  | "freelancerFollowup"
  | "jobSeekerFollowup"
  | "language"
  | "goals";

export default function OnboardingFlow() {
  const router = useRouter();
  const { t } = useT();
  const [mounted, setMounted] = useState(false);

  const [stepIndex, setStepIndex] = useState(0);
  const [familyStatus, setFamilyStatus] = useState<FamilyStatus | null>(null);
  const [employmentType, setEmploymentType] = useState<EmploymentType | null>(
    null
  );
  const [languageLevel, setLanguageLevel] =
    useState<LanguageLevel | null>("A2");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [saving, setSaving] = useState(false);

  const [hasSchoolAgeChildren, setHasSchoolAgeChildren] = useState<
    boolean | null
  >(null);
  const [freelancerInvoicesDE, setFreelancerInvoicesDE] = useState<
    boolean | null
  >(null);
  const [jobSeekerUrgency, setJobSeekerUrgency] = useState<
    "relaxed" | "urgent" | null
  >(null);

  const languageLevels: LanguageLevel[] = useMemo(
    () => ["A1", "A2", "B1", "B2", "C1"],
    []
  );

  const toggleGoal = (g: Goal) => {
    setGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  // Branching step tree based on answers
  const steps: StepId[] = (() => {
    const list: StepId[] = [];
    list.push("family");
    if (familyStatus === "children") list.push("familyFollowup");
    list.push("employment");
    if (employmentType === "freelancer") list.push("freelancerFollowup");
    if (employmentType === "job_seeker") list.push("jobSeekerFollowup");
    list.push("language");
    list.push("goals");
    return list;
  })();

  const safeIndex = Math.min(stepIndex, steps.length - 1);
  const currentStep: StepId = steps[safeIndex] ?? "family";
  const totalSteps = steps.length;
  const progress = ((safeIndex + 1) / totalSteps) * 100;

  const canSubmit =
    familyStatus && employmentType && languageLevel && goals.length > 0 && !saving;

  const handleNext = () => {
    setStepIndex((idx) => Math.min(idx + 1, steps.length - 1));
  };

  const handleBack = () => {
    setStepIndex((idx) => Math.max(idx - 1, 0));
  };

  const title = t.onboarding.title;
  const subtitle = t.onboarding.subtitle;
  const description = t.onboarding.description;

  const handleFamilyChange = (value: FamilyStatus) => {
    setFamilyStatus(value);
    if (value !== "children") {
      setHasSchoolAgeChildren(null);
    }
  };

  const handleEmploymentChange = (value: EmploymentType) => {
    setEmploymentType(value);
    if (value !== "freelancer") {
      setFreelancerInvoicesDE(null);
    }
    if (value !== "job_seeker") {
      setJobSeekerUrgency(null);
    }
  };

  const handleSubmit = async () => {
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
        router.push("/dashboard");
      } else {
        console.error("[Vaylo] Failed to save profile", error);
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  if (!mounted) return null;

  const stepText = t.onboarding.step
    .replace("{step}", String(safeIndex + 1))
    .replace("{total}", String(totalSteps));
  const familyOptions: { value: FamilyStatus; label: string }[] = [
    { value: "single", label: t.onboarding.optionSingle },
    { value: "family", label: t.onboarding.optionCouple },
    { value: "children", label: t.onboarding.optionFamilyKids },
  ];

  return (
    <main className="min-h-screen bg-slate-950/95 text-slate-50">
      <div className="max-w-xl mx-auto px-6 py-12">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 shadow-[0_40px_120px_rgba(15,23,42,1)] backdrop-blur-2xl">
          {/* Header */}
          <div className="border-b border-white/10 bg-slate-950/80 px-6 py-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-white">{title}</h1>
              <p className="text-slate-400 text-lg mt-2">{subtitle}</p>
              <p className="max-w-2xl text-xs text-slate-400">{description}</p>
            </div>
          </div>

          {/* Body */}
          <div className="space-y-8 px-6 py-6">
            {/* Progress */}
            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase tracking-wide">
                {stepText}
              </p>
              <div className="w-full h-1 bg-slate-800 rounded-full mb-6">
                <div
                  className="h-1 bg-blue-500 rounded-full transition-all duration-200"
                  style={{ width: currentStep === "family" ? "25%" : `${progress}%` }}
                />
              </div>
            </div>

            {/* Steps container */}
            <div className="space-y-5">
              {/* FAMILY */}
              {currentStep === "family" && (
                <section className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-slate-50">
                      {t.onboarding.questionFamily}
                    </h2>
                  </div>
                  <div className="mt-4 grid gap-4 max-w-xl">
                    {familyOptions.map((option) => {
                      const active = familyStatus === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleFamilyChange(option.value)}
                          className={`relative block w-full rounded-2xl border px-5 py-5 text-left transition-all duration-200 ${
                            active
                              ? "border-blue-500 bg-blue-500/15 shadow-lg"
                              : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                          }`}
                        >
                          <div className="pr-8">
                            <div className="text-base font-semibold text-white">
                              {option.label}
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
                  <button
                    type="button"
                    disabled={!familyStatus}
                    onClick={handleNext}
                    className={`mt-6 block w-full max-w-xl rounded-xl px-4 py-3 text-center font-semibold transition ${
                      familyStatus
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-white/10 text-white/40 cursor-not-allowed"
                    }`}
                  >
                    {t.onboarding.continue}
                  </button>
                </section>
              )}

              {/* FAMILY FOLLOWUP */}
              {currentStep === "familyFollowup" && (
                <section className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-slate-50">
                      {t.onboarding.kidsSchoolingTitle}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {t.onboarding.kidsSchoolingDesc}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setHasSchoolAgeChildren(true)}
                      className={chipClasses(hasSchoolAgeChildren === true)}
                    >
                      {t.onboarding.yesSchoolAge}
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasSchoolAgeChildren(false)}
                      className={chipClasses(hasSchoolAgeChildren === false)}
                    >
                      {t.onboarding.notYetSmallKids}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-500/70 bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-slate-200"
                    >
                      {t.onboarding.back}
                    </button>
                    <button
                      type="button"
                      disabled={hasSchoolAgeChildren === null}
                      onClick={handleNext}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-emerald-500/70 bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-2.5 text-xs font-semibold text-emerald-50 shadow-[0_16px_40px_rgba(4,120,87,0.9)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {t.onboarding.continue}
                    </button>
                  </div>
                </section>
              )}

              {/* EMPLOYMENT */}
              {currentStep === "employment" && (
                <section className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-slate-50">
                      {t.onboarding.employmentTitle}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {t.onboarding.employmentDesc}
                    </p>
                  </div>
                  <div className="mt-4 grid gap-4 max-w-xl">
                    <button
                      type="button"
                      onClick={() => handleEmploymentChange("employee")}
                      className={`relative block w-full rounded-2xl border px-5 py-5 text-left transition-all duration-200 ${
                        employmentType === "employee"
                          ? "border-blue-500 bg-blue-500/15 shadow-lg"
                          : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                      }`}
                    >
                      <div className="pr-8">
                        <div className="text-base font-semibold text-white">
                          {t.onboarding.employmentEmployee}
                        </div>
                      </div>
                      {employmentType === "employee" ? (
                        <div className="absolute right-4 top-4 text-blue-400 text-lg font-bold">
                          ✓
                        </div>
                      ) : null}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEmploymentChange("freelancer")}
                      className={`relative block w-full rounded-2xl border px-5 py-5 text-left transition-all duration-200 ${
                        employmentType === "freelancer"
                          ? "border-blue-500 bg-blue-500/15 shadow-lg"
                          : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                      }`}
                    >
                      <div className="pr-8">
                        <div className="text-base font-semibold text-white">
                          {t.onboarding.employmentFreelancer}
                        </div>
                      </div>
                      {employmentType === "freelancer" ? (
                        <div className="absolute right-4 top-4 text-blue-400 text-lg font-bold">
                          ✓
                        </div>
                      ) : null}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEmploymentChange("job_seeker")}
                      className={`relative block w-full rounded-2xl border px-5 py-5 text-left transition-all duration-200 ${
                        employmentType === "job_seeker"
                          ? "border-blue-500 bg-blue-500/15 shadow-lg"
                          : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                      }`}
                    >
                      <div className="pr-8">
                        <div className="text-base font-semibold text-white">
                          {t.onboarding.employmentJobSeeker}
                        </div>
                      </div>
                      {employmentType === "job_seeker" ? (
                        <div className="absolute right-4 top-4 text-blue-400 text-lg font-bold">
                          ✓
                        </div>
                      ) : null}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-500/70 bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-slate-200"
                    >
                      {t.onboarding.back}
                    </button>
                    <button
                      type="button"
                      disabled={!employmentType}
                      onClick={handleNext}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-emerald-500/70 bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-2.5 text-xs font-semibold text-emerald-50 shadow-[0_16px_40px_rgba(4,120,87,0.9)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {t.onboarding.continue}
                    </button>
                  </div>
                </section>
              )}

              {/* FREELANCER FOLLOWUP */}
              {currentStep === "freelancerFollowup" && (
                <section className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-slate-50">
                      {t.onboarding.freelanceSetupTitle}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {t.onboarding.freelanceSetupDesc}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setFreelancerInvoicesDE(true)}
                      className={chipClasses(freelancerInvoicesDE === true)}
                    >
                      {t.onboarding.yesRegularly}
                    </button>
                    <button
                      type="button"
                      onClick={() => setFreelancerInvoicesDE(false)}
                      className={chipClasses(freelancerInvoicesDE === false)}
                    >
                      {t.onboarding.notYetStarting}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-500/70 bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-slate-200"
                    >
                      {t.onboarding.back}
                    </button>
                    <button
                      type="button"
                      disabled={freelancerInvoicesDE === null}
                      onClick={handleNext}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-emerald-500/70 bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-2.5 text-xs font-semibold text-emerald-50 shadow-[0_16px_40px_rgba(4,120,87,0.9)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {t.onboarding.continue}
                    </button>
                  </div>
                </section>
              )}

              {/* JOB SEEKER FOLLOWUP */}
              {currentStep === "jobSeekerFollowup" && (
                <section className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-slate-50">
                      {t.onboarding.jobUrgencyTitle}
                    </h2>
                    <p className="text-xs text-slate-300">
                      {t.onboarding.jobUrgencyDesc}
                    </p>
                  </div>
                  <div className="mt-4 grid gap-4 max-w-xl">
                    <button
                      type="button"
                      onClick={() => setJobSeekerUrgency("relaxed")}
                      className={`relative block w-full rounded-2xl border px-5 py-5 text-left transition-all duration-200 ${
                        jobSeekerUrgency === "relaxed"
                          ? "border-blue-500 bg-blue-500/15 shadow-lg"
                          : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                      }`}
                    >
                      <div className="pr-8">
                        <div className="text-base font-semibold text-white">
                          {t.onboarding.jobUrgencyRelaxed}
                        </div>
                      </div>
                      {jobSeekerUrgency === "relaxed" ? (
                        <div className="absolute right-4 top-4 text-blue-400 text-lg font-bold">
                          ✓
                        </div>
                      ) : null}
                    </button>
                    <button
                      type="button"
                      onClick={() => setJobSeekerUrgency("urgent")}
                      className={`relative block w-full rounded-2xl border px-5 py-5 text-left transition-all duration-200 ${
                        jobSeekerUrgency === "urgent"
                          ? "border-blue-500 bg-blue-500/15 shadow-lg"
                          : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                      }`}
                    >
                      <div className="pr-8">
                        <div className="text-base font-semibold text-white">
                          {t.onboarding.jobUrgencyUrgent}
                        </div>
                      </div>
                      {jobSeekerUrgency === "urgent" ? (
                        <div className="absolute right-4 top-4 text-blue-400 text-lg font-bold">
                          ✓
                        </div>
                      ) : null}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-500/70 bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-slate-200"
                    >
                      {t.onboarding.back}
                    </button>
                    <button
                      type="button"
                      disabled={jobSeekerUrgency === null}
                      onClick={handleNext}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-emerald-500/70 bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-2.5 text-xs font-semibold text-emerald-50 shadow-[0_16px_40px_rgba(4,120,87,0.9)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {t.onboarding.continue}
                    </button>
                  </div>
                </section>
              )}

              {/* LANGUAGE */}
              {currentStep === "language" && (
                <section className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-slate-50">
                      {t.onboarding.languageTitle}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {t.onboarding.languageDesc}
                    </p>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {languageLevels.map((L) => (
                      <button
                        key={L}
                        type="button"
                        onClick={() => setLanguageLevel(L)}
                        className={`relative block w-full rounded-2xl border px-5 py-4 text-left transition-all duration-200 ${
                          languageLevel === L
                            ? "border-blue-500 bg-blue-500/15 shadow-lg"
                            : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                        }`}
                      >
                        <div className="pr-8">
                          <div className="text-base font-semibold text-white">{L}</div>
                        </div>
                        {languageLevel === L ? (
                          <div className="absolute right-4 top-4 text-blue-400 text-lg font-bold">
                            ✓
                          </div>
                        ) : null}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-500/70 bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-slate-200"
                    >
                      {t.onboarding.back}
                    </button>
                    <button
                      type="button"
                      disabled={!languageLevel}
                      onClick={handleNext}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-emerald-500/70 bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-2.5 text-xs font-semibold text-emerald-50 shadow-[0_16px_40px_rgba(4,120,87,0.9)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {t.onboarding.continue}
                    </button>
                  </div>
                </section>
              )}

              {/* GOALS */}
              {currentStep === "goals" && (
                <section className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-sm font-semibold text-slate-50">
                      {t.onboarding.goalsTitle}
                    </h2>
                    <p className="text-xs text-slate-300">
                      {t.onboarding.goalsDesc}
                    </p>
                  </div>
                  <div className="mt-4 grid gap-4 max-w-xl">
                    <button
                      type="button"
                      onClick={() => toggleGoal("bureaucracy")}
                      className={`relative block w-full rounded-2xl border px-5 py-5 text-left transition-all duration-200 ${
                        goals.includes("bureaucracy")
                          ? "border-blue-500 bg-blue-500/15 shadow-lg"
                          : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                      }`}
                    >
                      <div className="pr-8">
                        <div className="text-base font-semibold text-white">
                          {t.onboarding.goalBureaucracy}
                        </div>
                      </div>
                      {goals.includes("bureaucracy") ? (
                        <div className="absolute right-4 top-4 text-blue-400 text-lg font-bold">
                          ✓
                        </div>
                      ) : null}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleGoal("job")}
                      className={`relative block w-full rounded-2xl border px-5 py-5 text-left transition-all duration-200 ${
                        goals.includes("job")
                          ? "border-blue-500 bg-blue-500/15 shadow-lg"
                          : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                      }`}
                    >
                      <div className="pr-8">
                        <div className="text-base font-semibold text-white">
                          {t.onboarding.goalJob}
                        </div>
                      </div>
                      {goals.includes("job") ? (
                        <div className="absolute right-4 top-4 text-blue-400 text-lg font-bold">
                          ✓
                        </div>
                      ) : null}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleGoal("orientation")}
                      className={`relative block w-full rounded-2xl border px-5 py-5 text-left transition-all duration-200 ${
                        goals.includes("orientation")
                          ? "border-blue-500 bg-blue-500/15 shadow-lg"
                          : "border-white/15 bg-white/5 hover:border-white/30 hover:bg-white/10"
                      }`}
                    >
                      <div className="pr-8">
                        <div className="text-base font-semibold text-white">
                          {t.onboarding.goalOrientation}
                        </div>
                      </div>
                      {goals.includes("orientation") ? (
                        <div className="absolute right-4 top-4 text-blue-400 text-lg font-bold">
                          ✓
                        </div>
                      ) : null}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-500/70 bg-slate-900/80 px-4 py-2.5 text-xs font-semibold text-slate-200"
                    >
                      {t.onboarding.back}
                    </button>
                    <button
                      type="button"
                      disabled={!canSubmit}
                      onClick={handleSubmit}
                      className="inline-flex flex-1 items-center justify-center rounded-2xl border border-emerald-500/70 bg-gradient-to-br from-emerald-500 to-emerald-600 px-4 py-2.5 text-xs font-semibold text-emerald-50 shadow-[0_16px_40px_rgba(4,120,87,0.9)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {t.onboarding.finish}
                    </button>
                  </div>
                </section>
              )}

              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                {t.onboarding.privacyNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function chipClasses(active: boolean): string {
  const base =
    "inline-flex items-center justify-center rounded-full border px-3.5 py-2 text-xs font-semibold transition";
  const inactive =
    " border-slate-500/70 bg-slate-900/80 text-slate-200 hover:border-slate-300/80 hover:bg-slate-900";
  const activeClasses =
    " border-indigo-400/80 bg-slate-900 text-slate-50 shadow-[0_0_20px_rgba(79,70,229,0.8)]";
  return base + (active ? " " + activeClasses : " " + inactive);
}

