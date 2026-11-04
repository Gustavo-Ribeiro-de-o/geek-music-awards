"use client";

import { useState } from "react";
import { ShieldCheck, Users, Trophy, BarChart3, RefreshCw } from "lucide-react";

type ArtistResult = {
  id: string;
  slug: string;
  name: string;
  tier: string | null;
  tierLabel: string | null;
  total: number;
  byCategory: { slug: string; name: string; count: number }[];
};

const TIER_FILTERS: { value: string; label: string }[] = [
  { value: "todos", label: "TODOS" },
  { value: "lendas", label: "LENDAS" },
  { value: "prodigios", label: "PRODÍGIOS" },
  { value: "pequenos-gigantes", label: "PEQUENOS GIGANTES" },
];

export default function EquipePage() {
  const [pwd, setPwd] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ artists: ArtistResult[]; totalVotes: number; totalUsers: number } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetPwd, setResetPwd] = useState("");
  const [resetError, setResetError] = useState("");
  const [tierFilter, setTierFilter] = useState("todos");

  async function login() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/team/votes", { headers: { "x-team-password": pwd } });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Senha incorreta.");
        return;
      }
      const body = await res.json();
      setData(body);
      setAuthed(true);
    } catch {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch("/api/team/votes", { headers: { "x-team-password": pwd } });
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }

  function cancelReset() {
    setConfirmReset(false);
    setResetPwd("");
    setResetError("");
  }

  async function resetVotes() {
    setLoading(true);
    setResetError("");
    try {
      const res = await fetch("/api/team/reset", {
        method: "POST",
        headers: { "x-team-password": pwd, "x-reset-password": resetPwd },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setResetError(body.error ?? "Não foi possível zerar os votos.");
        return;
      }
      await refresh();
      cancelReset();
    } catch {
      setResetError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  if (!authed) {
    return (
      <section className="section section--top admin-login">
        <div className="card admin-login__card">
          <ShieldCheck size={28} />
          <h2>Área da equipe</h2>
          <p className="muted small">Insira sua senha caso você faça parte da equipe da GMW.</p>
          <input
            type="password"
            placeholder="Senha da equipe"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
          {error && <span className="error-text">{error}</span>}
          <button className="btn btn--primary" onClick={login} disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
      </section>
    );
  }

  const totalVotes = data?.totalVotes ?? 0;
  const leader = data?.artists?.[0];
  const visibleArtists = (data?.artists ?? []).filter((a) => tierFilter === "todos" || a.tier === tierFilter);
  const visibleVotes = visibleArtists.reduce((sum, a) => sum + a.total, 0);

  return (
    <section className="section section--top admin">
      <div className="admin__header">
        <h1 className="page-title">Área da equipe</h1>
        <button className="btn btn--ghost btn--sm" onClick={() => setAuthed(false)}>Sair</button>
      </div>

      <div className="grid grid--stats">
        <StatCard icon={<Users size={18} />} label="Total de usuários votantes" value={data?.totalUsers ?? 0} />
        <StatCard icon={<BarChart3 size={18} />} label="Total de votos" value={totalVotes} />
        <StatCard icon={<Trophy size={18} />} label="Artista líder" value={leader?.name ?? "-"} />
      </div>

      <div className="admin__header" style={{ marginTop: 0, marginBottom: "0.75rem" }}>
        <h2 className="section-subtitle" style={{ margin: 0 }}>Votos por artista</h2>
        {confirmReset ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
            <span className="muted small">Digite a senha para zerar todos os votos:</span>
            <input
              type="password"
              placeholder="Senha de exclusão"
              value={resetPwd}
              onChange={(e) => setResetPwd(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && resetPwd && resetVotes()}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                padding: "0.4rem 0.75rem",
                color: "var(--white)",
                outline: "none",
              }}
            />
            <button className="btn btn--ghost btn--sm" onClick={cancelReset}>Cancelar</button>
            <button
              className="btn btn--sm"
              style={{ background: "#ef4444", color: "white", opacity: resetPwd ? 1 : 0.5 }}
              onClick={resetVotes}
              disabled={loading || !resetPwd}
            >
              Confirmar
            </button>
            {resetError && <span className="error-text small">{resetError}</span>}
          </div>
        ) : (
          <button className="btn btn--outline btn--sm" onClick={() => setConfirmReset(true)}>
            <RefreshCw size={14} /> Zerar todos os votos
          </button>
        )}
      </div>

      <div className="chips" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
        {TIER_FILTERS.map((f) => (
          <button
            key={f.value}
            className={`chip ${tierFilter === f.value ? "chip--active" : ""}`}
            onClick={() => setTierFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <p className="muted small" style={{ marginBottom: "0.75rem" }}>
        {visibleArtists.length} artistas · <strong style={{ color: "var(--white)" }}>{visibleVotes}</strong> votos
      </p>

      <div className="admin-table">
        {visibleArtists.map((a) => (
          <div key={a.id} className="admin-row admin-row--stacked">
            <div className="admin-row__main">
              <div className="admin-row__id">
                <span>{a.name}</span>
                {a.tierLabel && <span className="tier-tag">{a.tierLabel}</span>}
              </div>
              <span className="admin-row__votes">{a.total}</span>
            </div>
            <div className="admin-row__categories">
              {a.byCategory.map((c) => (
                <span key={c.slug} className="muted small">
                  {c.name}: <strong style={{ color: "var(--white)" }}>{c.count}</strong>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="card stat-card">
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__body">
        <span className="muted small">{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
