import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rateLimit";
import { ARTISTS, MAIN_MIN_SUBSCRIBERS, REVELACAO_MAX_SUBSCRIBERS } from "@/data/gma-data";

const MAX_VOTES_PER_TIER = Number(process.env.MAX_VOTES_PER_USER ?? "5");

type Tier = "artistas" | "prodigios" | "revelacoes";

function getTier(subscriberCount: number | undefined): Tier {
  if (subscriberCount === undefined || subscriberCount >= MAIN_MIN_SUBSCRIBERS) return "artistas";
  if (subscriberCount > REVELACAO_MAX_SUBSCRIBERS) return "prodigios";
  return "revelacoes";
}

const TIER_LABEL: Record<Tier, string> = {
  artistas: "Artistas",
  prodigios: "Prodígios",
  revelacoes: "Revelações",
};

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

  // 3. Descobre a faixa (Artistas / Prodígios / Revelações) do artista alvo
  // a partir dos dados estáticos (subscriberCount não fica no banco), e reúne
  // os slugs de todos os artistas dessa mesma faixa.
  const staticArtist = ARTISTS.find((a: any) => a.slug === artistSlug);
  const tier = getTier(staticArtist?.subscriberCount);
  const tierSlugs = ARTISTS.filter((a: any) => getTier(a.subscriberCount) === tier).map((a: any) => a.slug);

  const tierArtists = await prisma.artist.findMany({
    where: { slug: { in: tierSlugs } },
    select: { id: true },
  });
  const tierArtistIds = tierArtists.map((a) => a.id);

  // 4. Confere quantos votos esse usuário já usou nessa FAIXA de artista,
  // somando todas as categorias de premiação — o limite (ex: 5 votos) vale
  // por faixa (Artistas / Prodígios / Revelações), não por categoria isolada.
  const votesInTier = await prisma.vote.count({
    where: { userId, artistId: { in: tierArtistIds } },
  });
  if (votesInTier >= MAX_VOTES_PER_TIER) {
    return NextResponse.json(
      { error: `Você já usou seus ${MAX_VOTES_PER_TIER} votos disponíveis na faixa ${TIER_LABEL[tier]}.` },
      { status: 409 }
    );
  }

  try {
    // 5. A constraint única (userId + artistId + categoryId) no banco garante
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
