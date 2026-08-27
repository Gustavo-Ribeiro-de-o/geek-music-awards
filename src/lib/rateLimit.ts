/**
 * Rate limiter simples em memória — trava tentativas repetidas vindas do
 * mesmo IP num curto espaço de tempo (ajuda contra scripts automatizados
 * tentando criar contas/tokens em massa).
 *
 * Isso é por instância do processo Node. Em produção com múltiplas
 * instâncias/serverless, troque por algo compartilhado (Redis, Upstash).
 */

const hits = new Map<string, number[]>();

const WINDOW_MS = 60_000; // janela de 1 minuto
const MAX_REQUESTS = 8; // no máximo 8 tentativas de voto por IP por minuto

export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(identifier) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(identifier, timestamps);
    return false;
  }

  timestamps.push(now);
  hits.set(identifier, timestamps);
  return true;
}
