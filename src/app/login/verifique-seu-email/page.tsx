export default function VerifyRequestPage() {
  return (
    <main style={{ maxWidth: 420, margin: "0 auto", padding: "4rem 1.5rem", textAlign: "center" }}>
      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📩</div>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Confira seu e-mail</h1>
      <p className="muted">
        Mandamos um link de acesso. Clique nele pra entrar — o link expira em 15 minutos.
      </p>
    </main>
  );
}
