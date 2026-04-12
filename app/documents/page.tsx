"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useT } from "@/lib/i18n/useT";
import type { UserDocumentRow } from "@/lib/vaylo/documents";
import { supabase } from "@/lib/supabase";

const MAX_BYTES = 52_428_800;

function FromDashboardStepBanner() {
  const searchParams = useSearchParams();
  const { t } = useT();
  if (!searchParams.get("step")) return null;
  return (
    <div
      className="muted"
      style={{
        fontSize: 13,
        marginBottom: 10,
        padding: "10px 12px",
        borderRadius: 10,
        border: "1px solid rgba(52,211,153,0.35)",
        background: "rgba(16,185,129,0.08)",
      }}
    >
      {t.documents.fromDashboardStepHint}
    </div>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsPage() {
  const { t } = useT();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [rows, setRows] = useState<UserDocumentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadList = useCallback(async () => {
    const res = await fetch("/api/documents", { method: "GET" });
    if (res.status === 401) {
      setRows([]);
      return;
    }
    const json = (await res.json()) as {
      documents?: UserDocumentRow[];
      error?: string;
    };
    if (!res.ok) {
      setError(json.error ?? t.documents.loadError);
      setRows([]);
      return;
    }
    setRows(json.documents ?? []);
  }, [t.documents.loadError]);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      if (!user) {
        setUserId(null);
        setRows([]);
        setLoading(false);
        setAuthReady(true);
        return;
      }
      setUserId(user.id);
      setAuthReady(true);
      setLoading(true);
      await loadList();
      if (!cancelled) setLoading(false);
    }

    void init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cancelled) return;
      const next = session?.user ?? null;
      if (!next) {
        setUserId(null);
        setRows([]);
        setLoading(false);
        return;
      }
      setUserId(next.id);
      setLoading(true);
      await loadList();
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [loadList]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !userId) return;

    setError(null);
    if (file.size > MAX_BYTES) {
      setError(t.documents.fileTooLarge.replace("{size}", formatBytes(MAX_BYTES)));
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.set("file", file);

    const res = await fetch("/api/documents", { method: "POST", body: fd });
    const json = (await res.json()) as { document?: UserDocumentRow; error?: string };

    if (!res.ok) {
      setError(json.error ?? t.documents.uploadFailed);
      setUploading(false);
      return;
    }

    if (json.document) {
      setRows((prev) => [json.document!, ...prev]);
    } else {
      await loadList();
    }
    setUploading(false);
  }

  async function handleDelete(id: string, name: string | null) {
    if (
      !confirm(
        t.documents.deleteConfirm.replace("{name}", name ?? t.documents.untitled),
      )
    )
      return;
    setError(null);
    const res = await fetch(`/api/documents?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const json = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(json.error ?? t.documents.deleteFailed);
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  if (!mounted) return null;

  return (
    <main className="container">
      <div className="card" style={{ display: "grid", gap: 14 }}>
        <div className="cardHeader">
          <div className="cardTitle">{t.documents.title}</div>
          <div className="cardSub muted">
            {t.documents.subtitle}
          </div>
        </div>

        <Suspense fallback={null}>
          <FromDashboardStepBanner />
        </Suspense>

        {!authReady || loading ? (
          <div className="muted" style={{ fontSize: 13 }}>
            {t.documents.loading}
          </div>
        ) : !userId ? (
          <div style={{ display: "grid", gap: 12 }}>
            <p className="muted" style={{ fontSize: 14, margin: 0 }}>
              {t.documents.signInPrompt}
            </p>
            <Link href="/login" className="pill" style={{ width: "fit-content" }}>
              {t.documents.signIn}
            </Link>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                alignItems: "center",
              }}
            >
              <input
                ref={fileRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleUpload}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="pill"
                style={{
                  border: "1px solid rgba(79,156,255,0.45)",
                  background: "rgba(79,156,255,0.16)",
                  fontWeight: 800,
                  cursor: uploading ? "wait" : "pointer",
                }}
              >
                {uploading ? t.documents.uploading : t.documents.upload}
              </button>
              <span className="muted" style={{ fontSize: 12 }}>
                {t.documents.maxPerFile.replace("{size}", formatBytes(MAX_BYTES))}
              </span>
            </div>

            {error ? (
              <div
                style={{
                  fontSize: 13,
                  color: "rgba(255,180,180,0.95)",
                  borderRadius: 12,
                  border: "1px solid rgba(255,120,120,0.35)",
                  background: "rgba(255,80,80,0.08)",
                  padding: "10px 12px",
                }}
              >
                {error}
              </div>
            ) : null}

            {rows.length === 0 ? (
              <div className="muted" style={{ fontSize: 13 }}>
                {t.documents.empty}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gap: 10,
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.02)",
                  padding: 12,
                }}
              >
                {rows.map((row) => (
                  <div
                    key={row.id}
                    className="card"
                    style={{
                      display: "grid",
                      gap: 10,
                      gridTemplateColumns: "1fr auto",
                      alignItems: "center",
                      margin: 0,
                      padding: 12,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={row.file_name ?? row.file_path}
                      >
                        {row.file_name ?? t.documents.untitled}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          marginTop: 6,
                          alignItems: "center",
                        }}
                      >
                        {row.mime_type ? (
                          <span className="badgeSmall">{row.mime_type}</span>
                        ) : null}
                        <span className="muted" style={{ fontSize: 12 }}>
                          {new Date(row.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 8,
                        justifyContent: "flex-end",
                      }}
                    >
                      <Link
                        href={`/documents/${row.id}`}
                        className="pill"
                        style={{ textDecoration: "none" }}
                      >
                        {t.documents.open}
                      </Link>
                      <button
                        type="button"
                        className="pill"
                        style={{
                          border: "1px solid rgba(255,120,120,0.45)",
                          background: "rgba(255,120,120,0.12)",
                          fontWeight: 600,
                          cursor: "pointer",
                          font: "inherit",
                        }}
                        onClick={() => void handleDelete(row.id, row.file_name)}
                      >
                        {t.documents.delete}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
