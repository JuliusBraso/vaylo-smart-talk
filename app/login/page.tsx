"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

type AuthMode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = "Vaylo";
  const tagline = "AI assistant for bureaucracy and life in Germany";

  const pill = (active: boolean) =>
    ({
      padding: "8px 14px",
      borderRadius: 999,
      border: `1px solid ${
        active ? "rgba(120,255,210,0.45)" : "rgba(255,255,255,0.12)"
      }`,
      background: active
        ? "rgba(120,255,210,0.10)"
        : "rgba(255,255,255,0.04)",
      color: active
        ? "rgba(210,255,240,0.95)"
        : "rgba(255,255,255,0.78)",
      cursor: "pointer",
      fontWeight: 600 as const,
      letterSpacing: 0.2,
      fontSize: 13,
      transition: "transform .08s ease, background .2s ease, border .2s ease",
    });

  const card: React.CSSProperties = {
    maxWidth: 480,
    margin: "40px auto",
    padding: 22,
  };

  const panel: React.CSSProperties = {
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.10)",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
    boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
    padding: 22,
  };

  const hero: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
    padding: "14px 14px 18px",
    borderRadius: 16,
    background: "rgba(0,0,0,0.22)",
    border: "1px solid rgba(255,255,255,0.08)",
  };

  const badge: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "rgba(255,255,255,0.82)",
    fontSize: 11,
    fontWeight: 700,
  };

  const btnPrimary: React.CSSProperties = {
    width: "100%",
    marginTop: 16,
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(120,255,210,0.35)",
    background:
      "linear-gradient(180deg, rgba(120,255,210,0.22), rgba(120,255,210,0.10))",
    color: "rgba(235,255,248,0.95)",
    fontWeight: 800,
    cursor: "pointer",
    letterSpacing: 0.3,
    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.35)",
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
  };

  const handleAuth = async () => {
    setError(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      }

      router.replace("/");
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : typeof e === "object" && e && "message" in e
            ? String((e as { message?: unknown }).message ?? "Authentication failed")
            : "Authentication failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={card}>
      <div style={panel}>
        <div style={hero}>
          <div style={{ display: "grid", gap: 6 }}>
            <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: 0.2 }}>
              {title}
            </div>
            <div style={{ opacity: 0.78, fontWeight: 600 }}>{tagline}</div>
          </div>
          <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
            <span style={badge}>🔐 Login</span>
          </div>
        </div>

        <div style={{ padding: "16px 6px 4px" }}>
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 16,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              style={pill(mode === "signin")}
              onClick={() => setMode("signin")}
            >
              Prihlásiť sa
            </button>
            <button
              type="button"
              style={pill(mode === "signup")}
              onClick={() => setMode("signup")}
            >
              Vytvoriť účet
            </button>
          </div>

          <div style={{ display: "grid", gap: 12 }}>
            <div>
              <div
                style={{ fontWeight: 800, marginBottom: 6, opacity: 0.9 }}
              >
                Email
              </div>
              <input
                type="email"
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ty@example.com"
              />
            </div>

            <div>
              <div
                style={{ fontWeight: 800, marginBottom: 6, opacity: 0.9 }}
              >
                Heslo
              </div>
              <input
                type="password"
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255,120,120,0.95)",
                  marginTop: 4,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleAuth}
              style={btnPrimary}
              disabled={loading || !email || !password}
            >
              {loading
                ? "Prebieha spracovanie…"
                : mode === "signin"
                ? "Prihlásiť sa →"
                : "Vytvoriť účet →"}
            </button>

            <div
              style={{
                marginTop: 6,
                opacity: 0.55,
                fontSize: 12,
                lineHeight: 1.35,
              }}
            >
              Tvoj účet je viazaný na Supabase auth (email + heslo). Dáta sú
              chránené cez RLS.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

