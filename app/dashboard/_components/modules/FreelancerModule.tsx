import type { ProfileDNA } from "@/lib/dna/types";
import { getContextualPhrases } from "@/lib/vaylo/content-engine";

type Props = {
  dna: ProfileDNA;
};

export default function FreelancerModule({ dna }: Props) {
  const score = dna.scores?.freelancer_focus ?? dna.scores?.JP ?? 0;
  const phrases = getContextualPhrases(dna);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-400/40 bg-slate-950/80 p-4 text-sm text-slate-100 shadow-[0_0_36px_rgba(16,185,129,0.45)] backdrop-blur-2xl md:col-span-1">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0_0,rgba(16,185,129,0.28),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(56,189,248,0.25),transparent_55%)]" />
      <div className="relative flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Freelancer cockpit
          </h2>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-100 ring-1 ring-emerald-400/60">
            Tax & Invoices
          </span>
        </div>
        <p className="text-[11px] text-emerald-100/80">
          Track your invoices, Umsatzsteuer and Einkommensteuer obligations in one place. We surface deadlines
          and paperwork pressure based on your DNA.
        </p>

        <div className="mt-1 rounded-2xl border border-emerald-400/40 bg-emerald-900/30 px-3 py-2 text-[11px] text-emerald-50">
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-[0.16em] text-emerald-300/80">Load</span>
            <span className="text-xs font-semibold">{Math.round(score)}%</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-emerald-950/60">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-300 shadow-[0_0_18px_rgba(16,185,129,0.85)]"
              style={{ width: `${Math.max(10, Math.min(100, score))}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] text-emerald-100/80">
            We use your answers to pre-rank which tax topics to stabilise first (Finanzamt, invoices, health insurance, etc.).
          </p>
        </div>

        <ul className="mt-1 space-y-1.5 text-[11px] text-emerald-100/90">
          <li className="flex items-start gap-1.5">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
            Umsatzsteuer, Einkommensteuer and social contributions pre-mapped for freelancers.
          </li>
          <li className="flex items-start gap-1.5">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
            Invoice templates optimised for German clients & Finanzamt.
          </li>
          <li className="flex items-start gap-1.5">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-200 shadow-[0_0_10px_rgba(190,242,100,0.9)]" />
            Upcoming: automatic reminders before quarterly and yearly tax events.
          </li>
        </ul>

        {phrases.length > 0 && (
          <div className="mt-3 rounded-2xl border border-emerald-400/40 bg-slate-950/70 px-3 py-2">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300/80">
              Quick phrases
            </div>
            <div className="flex flex-wrap gap-1.5">
              {phrases.map((p) => (
                <span
                  key={p}
                  className="inline-flex items-center rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1 text-[10px] font-medium text-emerald-50 shadow-[0_0_14px_rgba(16,185,129,0.7)]"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

