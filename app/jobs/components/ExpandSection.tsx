"use client";

import { useState } from "react";

export default function ExpandSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ marginBottom: 10 }}>
      <button className="btnGhost" onClick={() => setOpen(!open)}>
        {open ? "−" : "+"} {title}
      </button>

      {open && (
        <div style={{ marginTop: 10, paddingLeft: 10 }}>
          {children}
        </div>
      )}
    </div>
  );
}
