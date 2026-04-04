"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useT } from "../../lib/i18n/useT";

export default function LanguageSwitcher() {
  const { locale, setLocale, locales, localeLabel } = useT();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
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

  return (
    <div ref={rootRef} className="languageSwitcher">
      <div className="languageSwitcherRow">
        <span className="muted">Language</span>
        <div className="languageSwitcherControl">
          <button
            type="button"
            className="languageSwitcherTrigger"
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
          {open ? (
            <div
              id={listId}
              className="languageSwitcherPanel"
              role="listbox"
              aria-label="Language"
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
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
