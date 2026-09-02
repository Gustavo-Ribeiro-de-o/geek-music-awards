"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Trophy, CheckCircle2, AlertTriangle } from "lucide-react";
import { VOTE_CATEGORIES } from "@/data/gma-data";

type Artist = { id: string; slug: string; name: string; color: string };
type VoteCategory = { id: string; name: string; icon: string };
type Step = "login" | "category" | "confirm" | null;
type Toast = { type: "success" | "blocked"; message: string } | null;

type VoteContextType = {
  openVote: (artist: Artist) => void;
};

const VoteContext = createContext<VoteContextType | null>(null);

export function useVote() {
  const ctx = useContext(VoteContext);
  if (!ctx) throw new Error("useVote precisa estar dentro de <VoteProvider>");
  return ctx;
}

export function VoteProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [target, setTarget] = useState<Artist | null>(null);
  const [step, setStep] = useState<Step>(null);
  const [category, setCategory] = useState<VoteCategory | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  const openVote = useCallback(
    (artist: Artist) => {
      setTarget(artist);
      setCategory(null);
      setStep(session?.user ? "category" : "login");
    },
    [session]
  );

  const close = useCallback(() => {
    setTarget(null);
    setStep(null);
    setCategory(null);
  }, []);

  const confirm = useCallback(async () => {
    if (!target || !category) return;
    setBusy(true);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistSlug: target.slug, categorySlug: category.id }),
      });
      const data = await res.json();
      close();
      if (!res.ok) {
        setToast({ type: "blocked", message: data.error ?? "Não foi possível registrar o voto." });
      } else {
        setToast({ type: "success", message: `Seu voto em ${target.name} (${category.name}) foi registrado!` });
      }
    } catch {
      close();
      setToast({ type: "blocked", message: "Erro de conexão. Tente de novo." });
    } finally {
      setBusy(false);
    }
  }, [target, category, close]);

  return (
    <VoteContext.Provider value={{ openVote }}>
      {children}
      <VoteModal
        artist={target}
        step={step}
        category={category}
        busy={busy}
        onSelectCategory={setCategory}
        onProceedToConfirm={() => category && setStep("confirm")}
        onBackToCategory={() => setStep("category")}
        onConfirm={confirm}
        onClose={close}
      />
      <ToastView toast={toast} onClose={() => setToast(null)} />
    </VoteContext.Provider>
  );
}

function VoteModal({
  artist,
  step,
  category,
  busy,
  onSelectCategory,
  onProceedToConfirm,
  onBackToCategory,
  onConfirm,
  onClose,
}: {
  artist: Artist | null;
  step: Step;
  category: VoteCategory | null;
  busy: boolean;
  onSelectCategory: (c: VoteCategory) => void;
  onProceedToConfirm: () => void;
  onBackToCategory: () => void;
  onConfirm: () => void;
  onClose: () => void;
}) {
  if (!artist || !step) return null;

  if (step === "login") {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal__icon" style={{ background: `${artist.color}22`, color: artist.color }}>
            <Trophy size={28} />
          </div>
          <h3>Faça login pra votar em {artist.name}</h3>
          <p className="muted">Cada voto precisa de um e-mail verificado, pra impedir votos duplicados.</p>
          <div className="modal__actions">
            <button className="btn btn--ghost" onClick={onClose}>Cancelar</button>
            <Link href="/login" className="btn btn--primary" style={{ background: artist.color, boxShadow: `0 8px 24px -8px ${artist.color}99` }} onClick={onClose}>
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (step === "category") {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal__icon" style={{ background: `${artist.color}22`, color: artist.color }}>
            <Trophy size={28} />
          </div>
          <h3>Em qual categoria você quer votar em {artist.name}?</h3>
          <p className="muted">Você pode votar em até 3 artistas diferentes em cada categoria.</p>
          <div className="vote-category-list">
            {VOTE_CATEGORIES.map((cat: VoteCategory) => (
              <button
                key={cat.id}
                className={`vote-category-option ${category?.id === cat.id ? "vote-category-option--active" : ""}`}
                style={category?.id === cat.id ? { borderColor: artist.color, background: `${artist.color}18` } : undefined}
                onClick={() => onSelectCategory(cat)}
              >
                <span className="vote-category-option__icon">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
          <div className="modal__actions">
            <button className="btn btn--ghost" onClick={onClose}>Cancelar</button>
            <button
              className="btn btn--primary"
              style={{ background: artist.color, boxShadow: `0 8px 24px -8px ${artist.color}99`, opacity: category ? 1 : 0.5 }}
              disabled={!category}
              onClick={onProceedToConfirm}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__icon" style={{ background: `${artist.color}22`, color: artist.color }}>
          <Trophy size={28} />
        </div>
        <h3>Confirmar voto em {artist.name}?</h3>
        <p className="muted">
          Categoria: <strong style={{ color: "var(--white)" }}>{category?.name}</strong>. Seu voto ajuda {artist.name} a subir no ranking geral do Geek Music Awards.
        </p>
        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onBackToCategory}>Voltar</button>
          <button className="btn btn--primary" style={{ background: artist.color, boxShadow: `0 8px 24px -8px ${artist.color}99`, opacity: busy ? 0.7 : 1 }} disabled={busy} onClick={onConfirm}>
            {busy ? "Enviando..." : "Confirmar voto"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ToastView({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 3200);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;
  const isSuccess = toast.type === "success";

  return (
    <div className={`toast ${isSuccess ? "toast--success" : "toast--blocked"}`}>
      {isSuccess ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
      <span>{toast.message}</span>
    </div>
  );
}
