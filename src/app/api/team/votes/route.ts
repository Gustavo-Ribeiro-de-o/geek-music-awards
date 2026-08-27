import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const pwd = req.headers.get("x-team-password");
  if (!pwd || pwd !== process.env.TEAM_PASSWORD) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  const [artists, categories, perArtist, perArtistCategory, totalVotes, totalUsers] = await Promise.all([
    prisma.artist.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.vote.groupBy({ by: ["artistId"], _count: { _all: true } }),
    prisma.vote.groupBy({ by: ["artistId", "categoryId"], _count: { _all: true } }),
    prisma.vote.count(),
    prisma.user.count(),
  ]);

  const artistTotals: Record<string, number> = {};
  for (const row of perArtist) artistTotals[row.artistId] = row._count._all;

  const breakdown: Record<string, Record<string, number>> = {};
  for (const row of perArtistCategory) {
    breakdown[row.artistId] = breakdown[row.artistId] ?? {};
    breakdown[row.artistId][row.categoryId] = row._count._all;
  }

  const results = artists.map((artist) => ({
    id: artist.id,
    slug: artist.slug,
    name: artist.name,
    total: artistTotals[artist.id] ?? 0,
    byCategory: categories.map((cat) => ({
      slug: cat.slug,
      name: cat.name,
      count: breakdown[artist.id]?.[cat.id] ?? 0,
    })),
  }));

  results.sort((a, b) => b.total - a.total);

  return NextResponse.json({ artists: results, totalVotes, totalUsers });
}
