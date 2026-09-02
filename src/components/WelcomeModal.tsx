"use client";

import { useEffect, useState } from "react";
import { Code2, Vote } from "lucide-react";

const STORAGE_KEY = "gma-welcome-seen";

type Step = "credit" | "votes" | null;

export function WelcomeModal() {
  const [step, setStep] = useState<Step>(null);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    setStep("credit");
  }, []);

  const closeAll = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setStep(null);
  };

  if (!step) return null;

  if (step === "credit") {
    return (
      <div className="modal-overlay" onClick={() => setStep("votes")}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal__icon modal__icon--success">
            <Code2 size={28} />
          </div>
          <h3>Geek Music Awards</h3>
          <p className="muted">Este sistema foi desenvolvido manualmente por: <strong style={{ color: "var(--white)" }}>BachiraMusic</strong></p>
          <div className="modal__actions">
            <button className="btn btn--primary" style={{ width: "100%" }} onClick={() => setStep("votes")}>
              Fechar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={closeAll}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__icon modal__icon--success">
          <Vote size={28} />
        </div>
        <h3>Como funciona a votação</h3>
        <p className="muted">Você tem <strong style={{ color: "var(--white)" }}>5 votos por categoria</strong> (Artista, Prodígio e Revelações).</p>
        <div className="modal__actions">
          <button className="btn btn--primary" style={{ width: "100%" }} onClick={closeAll}>
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
