import SmartTalkClient from "./SmartTalkClient";

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

        <div
          style={{
            marginBottom: 18,
            padding: "14px 16px",
            borderRadius: "var(--r16)",
            border: "1px solid var(--border)",
            background: "rgba(248, 250, 252, 1)",
            display: "grid",
            gap: 12,
          }}
        >
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--text)" }}>
            Súkromie na prvom mieste: Text sa v tejto fáze neukladá do DNA ani do dokumentov.
          </p>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--muted)" }}>
            Dôležité: Vaylo Smart Talk poskytuje praktickú pomoc pri porozumení textu. Nenahrádza právne poradenstvo ani oficiálny preklad.
          </p>
        </div>

        <SmartTalkClient />
      </div>
    </main>
  );
}
