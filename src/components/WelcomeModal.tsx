"use client";

import { useEffect, useState } from "react";
import { Code2 } from "lucide-react";

const STORAGE_KEY = "gma-welcome-seen";

export function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    setOpen(true);
  }, []);

  const close = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__icon modal__icon--success">
          <Code2 size={28} />
        </div>
        <h3>Geek Music Awards</h3>
        <p className="muted">Este sistema foi desenvolvido manualmente por: <strong style={{ color: "var(--white)" }}>BachiraMusic</strong></p>
        <div className="modal__actions">
          <button className="btn btn--primary" style={{ width: "100%" }} onClick={close}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
