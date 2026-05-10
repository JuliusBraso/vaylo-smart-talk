export const metadata = {
  title: "Smart Talk · Vaylo",
};

export default function SmartTalkPage() {
  return (
    <main className="container">
      <div className="card" style={{ maxWidth: 560, margin: "0 auto" }}>
        <header style={{ marginBottom: 20 }}>
          <h1 className="cardTitle" style={{ fontSize: "clamp(1.25rem, 4vw, 1.5rem)", lineHeight: 1.25 }}>
            Rozumiete svojmu nemeckému dokumentu?
          </h1>
          <p className="cardSub muted" style={{ marginTop: 10, fontSize: 15, lineHeight: 1.55 }}>
            Vložte text listu alebo formulára a Vaylo vám ho jednoducho vysvetlí.
          </p>
        </header>

        <div style={{ display: "grid", gap: 14 }}>
          <label htmlFor="smart-talk-input" className="sr-only">
            Text dokumentu
          </label>
          <textarea
            id="smart-talk-input"
            name="smart-talk-text"
            rows={8}
            placeholder="Sem vložte text z listu, úradu alebo formulára…"
            className="w-full resize-y rounded-[var(--r12)] border border-[var(--border)] bg-[var(--bg0)] px-3 py-3 text-[15px] leading-relaxed text-[var(--text)] outline-none placeholder:text-[var(--muted2)] focus:border-[color:rgba(199,210,254,1)] focus:shadow-[0_0_0_3px_rgba(199,210,254,0.45)] min-h-[168px]"
          />

          <button
            type="button"
            style={{
              width: "100%",
              height: 44,
              borderRadius: "var(--r999)",
              border: "1px solid var(--accentBorder)",
              background: "var(--accent)",
              color: "rgba(255,255,255,0.98)",
              fontWeight: 800,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Vysvetliť text
          </button>

          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--muted2)" }}>
            Text sa v tejto fáze neukladá do DNA ani do dokumentov.
          </p>

          <div
            aria-live="polite"
            style={{
              marginTop: 4,
              padding: "14px 16px",
              borderRadius: "var(--r16)",
              border: "1px dashed rgba(203, 213, 225, 1)",
              background: "rgba(248, 250, 252, 1)",
              minHeight: 88,
              fontSize: 14,
              lineHeight: 1.55,
              color: "var(--muted)",
            }}
          >
            Výsledok vysvetlenia sa zobrazí tu.
          </div>
        </div>
      </div>
    </main>
  );
}
