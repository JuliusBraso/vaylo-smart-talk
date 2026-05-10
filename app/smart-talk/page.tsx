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

        <SmartTalkClient />
      </div>
    </main>
  );
}
