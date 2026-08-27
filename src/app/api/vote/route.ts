import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";

const MAX_VOTES_PER_USER = Number(process.env.MAX_VOTES_PER_USER ?? "3");

export async function POST(req: NextRequest) {
  // 1. Precisa estar logado — sem sessão, sem voto. Esse é o ponto central:
  // o voto fica amarrado a um e-mail verificado, não a "esse navegador".
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Você precisa fazer login para votar." }, { status: 401 });
  }

  // 2. Rate limit por IP, além do controle por usuário — dificulta scripts
  // tentando criar várias contas/tokens rapidamente.
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Muitas tentativas. Aguarde um minuto e tente de novo." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const artistSlug = body?.artistSlug as string | undefined;
  const categorySlug = body?.categorySlug as string | undefined;

  if (!artistSlug || !categorySlug) {
    return NextResponse.json({ error: "Artista e categoria são obrigatórios." }, { status: 400 });
  }

  const [artist, category] = await Promise.all([
    prisma.artist.findUnique({ where: { slug: artistSlug } }),
    prisma.category.findUnique({ where: { slug: categorySlug } }),
  ]);

  if (!artist || !category) {
    return NextResponse.json({ error: "Artista ou categoria não encontrados." }, { status: 404 });
  }

  // 3. Confere quantos votos esse usuário já usou no total, somando todas
  // as categorias — o limite geral (ex: 3 votos) é por usuário, não por navegador.
  const totalVotes = await prisma.vote.count({ where: { userId } });
  if (totalVotes >= MAX_VOTES_PER_USER) {
    return NextResponse.json(
      { error: `Você já usou seus ${MAX_VOTES_PER_USER} votos disponíveis.` },
      { status: 409 }
    );
  }

  try {
    // 4. A constraint única (userId + artistId + categoryId) no banco garante
    // que, mesmo com requisições simultâneas, o mesmo usuário não consegue
    // votar duas vezes no mesmo artista dentro da mesma categoria.
    const vote = await prisma.vote.create({
      data: { userId, artistId: artist.id, categoryId: category.id },
    });

    return NextResponse.json({ success: true, voteId: vote.id });
  } catch (err: unknown) {
    const prismaError = err as { code?: string };
    if (prismaError.code === "P2002") {
      return NextResponse.json(
        { error: `Você já votou em ${artist.name} na categoria ${category.name}.` },
        { status: 409 }
      );
    }
    console.error("[api/vote] erro:", err);
    return NextResponse.json({ error: "Erro interno ao registrar o voto." }, { status: 500 });
  }
}
