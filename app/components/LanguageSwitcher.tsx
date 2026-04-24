"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useT } from "../../lib/i18n/useT";

type PanelPos = {
  top: number;
  left: number;
  width: number;
};

export default function LanguageSwitcher() {
  const { locale, setLocale, locales, localeLabel } = useT();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const [pos, setPos] = useState<PanelPos | null>(null);

  const portalReady = useMemo(() => typeof document !== "undefined", []);

  const recompute = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = Math.min(280, Math.max(Math.round(r.width), 220));
    const gap = 6;

    let left = Math.round(r.left);
    const padding = 12;
    const maxLeft = Math.max(padding, window.innerWidth - width - padding);
    left = Math.max(padding, Math.min(maxLeft, left));

    const top = Math.round(r.bottom + gap);
    setPos({ top, left, width });
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      const inTrigger = !!rootRef.current?.contains(target);
      const inPanel = !!panelRef.current?.contains(target);
      if (!inTrigger && !inPanel) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    recompute();

    const onResize = () => recompute();
    const onScroll = () => recompute();

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div ref={rootRef} className="languageSwitcher">
      <div className="languageSwitcherRow">
        <span className="text-slate-500 text-sm mb-1">Language</span>
        <div className="languageSwitcherControl">
          <button
            type="button"
            className="languageSwitcherTrigger"
            ref={triggerRef}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-controls={listId}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="languageSwitcherTriggerLabel">{localeLabel(locale)}</span>
            <span className="languageSwitcherChevron" aria-hidden>
              ▼
            </span>
          </button>
        </div>
      </div>

      {open && portalReady
        ? createPortal(
            <div
              ref={panelRef}
              id={listId}
              className="languageSwitcherPanel languageSwitcherPanelPortal"
              role="listbox"
              aria-label="Language"
              style={
                pos
                  ? {
                      position: "fixed",
                      top: pos.top,
                      left: pos.left,
                      width: pos.width,
                      maxWidth: 280,
                    }
                  : { position: "fixed" }
              }
            >
              {locales.map((l) => (
                <button
                  key={l}
                  type="button"
                  role="option"
                  aria-selected={l === locale}
                  className={
                    l === locale
                      ? "languageSwitcherOption languageSwitcherOptionActive"
                      : "languageSwitcherOption"
                  }
                  onClick={() => {
                    setLocale(l);
                    setOpen(false);
                  }}
                >
                  {localeLabel(l)}
                </button>
              ))}
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
