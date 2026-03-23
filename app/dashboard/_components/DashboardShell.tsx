import type { ReactNode } from "react";
import type { ProfileDNA } from "@/lib/dna/types";

type Props = {
  dna: ProfileDNA;
  children: ReactNode;
};

export default function DashboardShell({ dna, children }: Props) {
  const primaryGoal = dna.priority?.[0] ?? "orientation";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/80">
              Vaylo Control Center
            </p>
            <h1 className="mt-2 bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-400 bg-clip-text text-3xl font-semibold text-transparent md:text-4xl">
              Your Germany operations cockpit
            </h1>
            <p className="mt-2 max-w-xl text-sm text-slate-400">
              We tuned this workspace to your onboarding DNA so you can focus on what matters most right now.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-400/30 bg-slate-950/60 px-4 py-3 text-right shadow-[0_0_40px_rgba(16,185,129,0.35)] backdrop-blur-2xl">
            <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
              Active Priority
            </div>
            <div className="mt-1 text-sm font-semibold text-emerald-300">
              {primaryGoal === "job"
                ? "Job & Bewerbung"
                : primaryGoal === "bureaucracy"
                  ? "Paperwork & Behörden"
                  : primaryGoal === "family_admin"
                    ? "Family & Kindergeld"
                    : "Orientation & Integration"}
            </div>
            <div className="mt-1 text-[10px] text-slate-500">
              DNA v{dna.version} • {dna.inputs.language_level}
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-[0_0_40px_rgba(56,189,248,0.25)] backdrop-blur-2xl md:col-span-2">
            <div className="pointer-events-none absolute inset-px rounded-[22px] bg-gradient-to-br from-emerald-500/15 via-transparent to-indigo-500/20" />
            <div className="relative flex flex-col gap-2">
              <h2 className="text-sm font-semibold tracking-wide text-slate-100">
                Vaylo DNA snapshot
              </h2>
              <p className="text-xs text-slate-400">
                We continuously adapt this dashboard as your situation, paperwork and job status evolve.
              </p>
              <div className="mt-4 grid gap-3 text-xs text-slate-300 sm:grid-cols-4">
                <div className="rounded-2xl border border-emerald-400/30 bg-emerald-900/20 px-3 py-2">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-emerald-300/80">
                    Family
                  </div>
                  <div className="mt-1 text-xs font-semibold">
                    {dna.inputs.family_status === "children"
                      ? "Children in household"
                      : dna.inputs.family_status === "family"
                        ? "Partner / dependants"
                        : "Single"}
                  </div>
                </div>
                <div className="rounded-2xl border border-cyan-400/30 bg-cyan-900/20 px-3 py-2">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-cyan-300/80">
                    Work mode
                  </div>
                  <div className="mt-1 text-xs font-semibold">
                    {dna.inputs.employment_type === "freelancer"
                      ? "Freelancer / Selbstständig"
                      : dna.inputs.employment_type === "job_seeker"
                        ? "Job seeker"
                        : "Employee"}
                  </div>
                </div>
                <div className="rounded-2xl border border-indigo-400/30 bg-indigo-900/30 px-3 py-2">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-indigo-300/80">
                    Language
                  </div>
                  <div className="mt-1 text-xs font-semibold">
                    Deutsch {dna.inputs.language_level}
                  </div>
                </div>
                <div className="rounded-2xl border border-fuchsia-400/30 bg-fuchsia-900/20 px-3 py-2">
                  <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-fuchsia-300/80">
                    Focus
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1 text-[11px]">
                    {dna.inputs.goals.map((g) => (
                      <span
                        key={g}
                        className="rounded-full bg-fuchsia-500/15 px-2 py-0.5 text-fuchsia-100/90 ring-1 ring-fuchsia-400/40"
                      >
                        {g === "bureaucracy"
                          ? "Paperwork"
                          : g === "job"
                            ? "Job"
                            : "Orientation"}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-3">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 shadow-[0_0_30px_rgba(129,140,248,0.35)] backdrop-blur-2xl">
              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-400">
                Status
              </div>
              <div className="mt-1 text-xs font-semibold text-indigo-200">
                DNA profile locked in
              </div>
              <div className="mt-2 text-[11px] text-slate-400">
                This is your first version of the Vaylo dashboard. We will unlock more automation modules as you progress.
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 md:grid-cols-3">{children}</section>
      </div>
    </main>
  );
}

