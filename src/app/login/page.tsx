"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await signIn("email", { email, callbackUrl: "/" });
    // O NextAuth redireciona pra /login/verifique-seu-email automaticamente.
  }

  return (
    <main style={{ maxWidth: 420, margin: "0 auto", padding: "4rem 1.5rem" }}>
      <h1 style={{ fontSize: "1.6rem", marginBottom: "0.5rem" }}>Entrar para votar</h1>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>
        Digite seu e-mail. A gente manda um link de acesso — sem senha, sem complicação.
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <input
          type="email"
          required
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "0.75rem 1rem",
            color: "var(--white)",
            outline: "none",
            fontSize: "1rem",
          }}
        />
        <button
          type="submit"
          disabled={sending}
          style={{
            background: "linear-gradient(90deg, var(--purple), var(--blue))",
            color: "white",
            border: "none",
            borderRadius: 999,
            padding: "0.85rem",
            fontWeight: 600,
            cursor: sending ? "default" : "pointer",
            opacity: sending ? 0.7 : 1,
          }}
        >
          {sending ? "Enviando..." : "Enviar link de acesso"}
        </button>
      </form>
    </main>
  );
}
