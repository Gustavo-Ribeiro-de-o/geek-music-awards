import { TierArtistsList } from "@/components/TierArtistsList";
import { ARTISTS, DEFAULT_SETTINGS, MAIN_MIN_SUBSCRIBERS, REVELACAO_MAX_SUBSCRIBERS } from "@/data/gma-data";

export default function ProdigiosPage() {
  const artists = ARTISTS.filter(
    (a: any) =>
      a.subscriberCount !== undefined &&
      a.subscriberCount > REVELACAO_MAX_SUBSCRIBERS &&
      a.subscriberCount < MAIN_MIN_SUBSCRIBERS
  );

  return (
    <TierArtistsList
      title="Prodígios"
      subtitle="Canais entre 30 mil e 100 mil inscritos, já com uma base sólida de fãs."
      icon="🌟"
      artists={artists}
      votingOpen={DEFAULT_SETTINGS.votingOpen}
      emptyMessage="Nenhum artista nessa faixa ainda — em breve novos nomes chegam por aqui."
    />
  );
}
