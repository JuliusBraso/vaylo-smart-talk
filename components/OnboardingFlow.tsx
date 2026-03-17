"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type {
  FamilyStatus,
  EmploymentType,
  LanguageLevel,
  Goal,
} from "@/lib/dna/types";
import { calculateVayloDNA } from "@/lib/vaylo/dna-engine";
import { upsertMyProfile } from "@/lib/profile";

type Step = 0 | 1 | 2 | 3;

export default function OnboardingFlow() {
  const router = useRouter();

  const [step, setStep] = useState<Step>(0);
  const [familyStatus, setFamilyStatus] = useState<FamilyStatus | null>(null);
  const [employmentType, setEmploymentType] = useState<EmploymentType | null>(
    null
  );
  const [languageLevel, setLanguageLevel] =
    useState<LanguageLevel | null>("A2");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [saving, setSaving] = useState(false);

  const title = "Willkommen in Deutschland";
  const tagline = "Your Life Assistant in Germany";

  const languageLevels: LanguageLevel[] = useMemo(
    () => ["A1", "A2", "B1", "B2", "C1"],
    []
  );

  const toggleGoal = (g: Goal) => {
    setGoals((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  const canSubmit =
    familyStatus && employmentType && languageLevel && goals.length > 0 && !saving;

  const pill = (active: boolean) =>
    ({
      padding: "10px 14px",
      borderRadius: 999,
      border: `1px solid ${
        active ? "rgba(120,255,210,0.55)" : "rgba(255,255,255,0.14)"
      }`,
      background: active
        ? "radial-gradient(circle at 0 0, rgba(120,255,210,0.22), transparent 60%), rgba(8,12,24,0.96)"
        : "rgba(9,12,26,0.82)",
      color: active
        ? "rgba(230,255,250,0.98)"
        : "rgba(238,242,255,0.82)",
      cursor: "pointer",
      fontWeight: 600 as const,
      letterSpacing: 0.2,
      transition:
        "transform .10s ease, box-shadow .18s ease, background .18s ease, border .18s ease",
      boxShadow: active
        ? "0 0 18px rgba(120,255,210,0.45)"
        : "0 0 0 rgba(0,0,0,0)",
    });

  const card: React.CSSProperties = {
    maxWidth: 760,
    margin: "40px auto",
    padding: 22,
  };

  const panel: React.CSSProperties = {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.12)",
    background:
      "linear-gradient(145deg, rgba(10,14,28,0.9), rgba(10,8,24,0.96))",
    boxShadow:
      "0 40px 120px rgba(0,0,0,0.9), 0 0 80px rgba(94,234,212,0.25), 0 0 120px rgba(129,140,248,0.18)",
    padding: 24,
    backdropFilter: "blur(26px)",
  };

  const hero: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    padding: "14px 14px 18px",
    borderRadius: 18,
    background:
      "radial-gradient(circle at 0 0, rgba(94,234,212,0.28), transparent 55%), radial-gradient(circle at 100% 0, rgba(129,140,248,0.28), transparent 55%), rgba(6,10,20,0.92)",
    border: "1px solid rgba(255,255,255,0.18)",
  };

  const badge: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 999,
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,64,175,0.9))",
    border: "1px solid rgba(191,219,254,0.35)",
    color: "rgba(226,232,255,0.96)",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 0.16,
  };

  const btnPrimary: React.CSSProperties = {
    width: "100%",
    marginTop: 18,
    padding: "14px 16px",
    borderRadius: 16,
    border: "1px solid rgba(94,234,212,0.55)",
    background:
      "radial-gradient(circle at 0 0, rgba(94,234,212,0.38), transparent 55%), radial-gradient(circle at 100% 0, rgba(129,140,248,0.38), transparent 55%), linear-gradient(180deg, rgba(6,182,212,0.9), rgba(14,116,144,0.95))",
    color: "rgba(240,253,250,0.98)",
    fontWeight: 800,
    cursor: "pointer",
    letterSpacing: 0.3,
    boxShadow:
      "0 22px 60px rgba(8,47,73,0.9), 0 0 40px rgba(56,189,248,0.45)",
    transition: "transform .10s ease, box-shadow .18s ease, filter .18s ease",
  };

  const btnSecondary: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.45)",
    background:
      "linear-gradient(145deg, rgba(15,23,42,0.9), rgba(15,23,42,0.7))",
    color: "rgba(226,232,240,0.9)",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 13,
  };

  const progressOuter: React.CSSProperties = {
    width: "100%",
    height: 5,
    borderRadius: 999,
    background:
      "linear-gradient(90deg, rgba(15,23,42,0.9), rgba(15,23,42,0.4))",
    overflow: "hidden",
    border: "1px solid rgba(148,163,184,0.32)",
    boxShadow: "0 0 18px rgba(59,130,246,0.35)",
  };

  const progressInner: React.CSSProperties = {
    height: "100%",
    width: `${((step + 1) / 4) * 100}%`,
    borderRadius: 999,
    background:
      "linear-gradient(90deg, rgba(56,189,248,1), rgba(45,212,191,1))",
    boxShadow: "0 0 24px rgba(56,189,248,0.8)",
    transition: "width .25s ease-out",
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

      const { error } = await upsertMyProfile(supabase, {
        family_status: familyStatus,
        employment_type: employmentType,
        language_level: languageLevel,
        goals,
        dna,
        dna_updated_at: dna.updated_at,
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

  const stepLabel = (() => {
    switch (step) {
      case 0:
        return "Krok 1/4 • Rodina";
      case 1:
        return "Krok 2/4 • Práca";
      case 2:
        return "Krok 3/4 • Nemčina";
      case 3:
        return "Krok 4/4 • Ciele";
    }
  })();

  return (
    <main style={card}>
      <div style={panel}>
        {/* HERO */}
        <div style={hero}>
          <div style={{ display: "grid", gap: 6 }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: 0.2,
              }}
            >
              {title}
            </div>
            <div
              style={{
                opacity: 0.8,
                fontWeight: 600,
                fontSize: 13,
                color: "rgba(226,232,255,0.92)",
              }}
            >
              {tagline}
            </div>
          </div>

          <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
            <span style={badge}>Vaylo AI Onboarding</span>
            <span
              style={{
                ...badge,
                opacity: 0.9,
                background:
                  "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(76,29,149,0.9))",
                border: "1px solid rgba(192,132,252,0.45)",
              }}
            >
              v1.0
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div style={{ padding: "18px 6px 4px", display: "grid", gap: 14 }}>
          {/* PROGRESS */}
          <div style={{ display: "grid", gap: 6 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 12,
                color: "rgba(203,213,225,0.9)",
                fontWeight: 600,
              }}
            >
              <span>{stepLabel}</span>
              <span>~ 30 sekúnd</span>
            </div>
            <div style={progressOuter}>
              <div style={progressInner} />
            </div>
          </div>

          <div style={{ fontSize: 18, fontWeight: 900 }}>
            Nastavenie profilu
          </div>
          <div
            style={{
              opacity: 0.8,
              marginTop: 2,
              lineHeight: 1.4,
              fontSize: 13,
              color: "rgba(203,213,225,0.95)",
            }}
          >
            Vaylo si z teba vytvorí „DNA“ – čo riešiš, aká je tvoja nemčina a
            rodina. Na základe toho zoradíme obsah a odporúčania.
          </div>

          <div style={{ display: "grid", gap: 18, marginTop: 10 }}>
            {/* STEP 0: FAMILY STATUS */}
            {step === 0 && (
              <>
                <div>
                  <div
                    style={{ fontWeight: 800, marginBottom: 10, opacity: 0.9 }}
                  >
                    Aká je tvoja rodinná situácia?
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={() => setFamilyStatus("single")}
                      style={pill(familyStatus === "single")}
                    >
                      Sám / sama
                    </button>
                    <button
                      onClick={() => setFamilyStatus("family")}
                      style={pill(familyStatus === "family")}
                    >
                      Pár / rodina bez detí
                    </button>
                    <button
                      onClick={() => setFamilyStatus("children")}
                      style={pill(familyStatus === "children")}
                    >
                      Rodina s deťmi
                    </button>
                  </div>
                </div>
                <button
                  style={btnPrimary}
                  disabled={!familyStatus}
                  onClick={() => familyStatus && setStep(1)}
                >
                  Pokračovať →
                </button>
              </>
            )}

            {/* STEP 1: EMPLOYMENT TYPE */}
            {step === 1 && (
              <>
                <div>
                  <div
                    style={{ fontWeight: 800, marginBottom: 10, opacity: 0.9 }}
                  >
                    Ako pracuješ teraz?
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={() => setEmploymentType("employee")}
                      style={pill(employmentType === "employee")}
                    >
                      Zamestnanec
                    </button>
                    <button
                      onClick={() => setEmploymentType("freelancer")}
                      style={pill(employmentType === "freelancer")}
                    >
                      SZČO / freelancer
                    </button>
                    <button
                      onClick={() => setEmploymentType("job_seeker")}
                      style={pill(employmentType === "job_seeker")}
                    >
                      Hľadám prácu
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button style={btnSecondary} onClick={() => setStep(0)}>
                    ← Späť
                  </button>
                  <button
                    style={{ ...btnPrimary, flex: 1 }}
                    disabled={!employmentType}
                    onClick={() => employmentType && setStep(2)}
                  >
                    Pokračovať →
                  </button>
                </div>
              </>
            )}

            {/* STEP 2: LANGUAGE LEVEL */}
            {step === 2 && (
              <>
                <div>
                  <div
                    style={{ fontWeight: 800, marginBottom: 10, opacity: 0.9 }}
                  >
                    Aká je tvoja nemčina?
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {languageLevels.map((L) => (
                      <button
                        key={L}
                        onClick={() => setLanguageLevel(L)}
                        style={pill(languageLevel === L)}
                      >
                        {L}
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button style={btnSecondary} onClick={() => setStep(1)}>
                    ← Späť
                  </button>
                  <button
                    style={{ ...btnPrimary, flex: 1 }}
                    disabled={!languageLevel}
                    onClick={() => languageLevel && setStep(3)}
                  >
                    Pokračovať →
                  </button>
                </div>
              </>
            )}

            {/* STEP 3: GOALS */}
            {step === 3 && (
              <>
                <div>
                  <div
                    style={{ fontWeight: 800, marginBottom: 10, opacity: 0.9 }}
                  >
                    Čo v Nemecku teraz najviac riešiš?
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={() => toggleGoal("bureaucracy")}
                      style={pill(goals.includes("bureaucracy"))}
                    >
                      Úrady a papiere
                    </button>
                    <button
                      onClick={() => toggleGoal("job")}
                      style={pill(goals.includes("job"))}
                    >
                      Práca a kariéra
                    </button>
                    <button
                      onClick={() => toggleGoal("orientation")}
                      style={pill(goals.includes("orientation"))}
                    >
                      Život v DE / orientácia
                    </button>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button style={btnSecondary} onClick={() => setStep(2)}>
                    ← Späť
                  </button>
                  <button
                    style={{ ...btnPrimary, flex: 1 }}
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                  >
                    Dokončiť onboarding →
                  </button>
                </div>
              </>
            )}

            <div
              style={{
                marginTop: 6,
                opacity: 0.7,
                fontSize: 12,
                lineHeight: 1.4,
                color: "rgba(148,163,184,0.95)",
              }}
            >
              Vaylo tvoje odpovede používa iba na zoradenie obsahu a plán
              krokov. Nič nezdielame ďalej.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

