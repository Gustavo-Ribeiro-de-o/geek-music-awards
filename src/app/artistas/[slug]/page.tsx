import { notFound } from "next/navigation";
import { ArtistProfile } from "@/components/ArtistProfile";
import { ARTISTS, DEFAULT_SETTINGS } from "@/data/gma-data";

export default async function ArtistProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artist = ARTISTS.find((a: any) => a.slug === slug);

  if (!artist) notFound();

  return <ArtistProfile artist={artist} votingOpen={DEFAULT_SETTINGS.votingOpen} />;
}
