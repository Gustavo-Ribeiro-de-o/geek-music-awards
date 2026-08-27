import { TierArtistsList } from "@/components/TierArtistsList";
import { ARTISTS, DEFAULT_SETTINGS, REVELACAO_MAX_SUBSCRIBERS } from "@/data/gma-data";

export default function RevelacoesPage() {
  const artists = ARTISTS.filter(
    (a: any) => a.subscriberCount !== undefined && a.subscriberCount <= REVELACAO_MAX_SUBSCRIBERS
  );

  return (
    <TierArtistsList
      title="Revelações"
      subtitle="Canais com até 30 mil inscritos que estão explodindo na cena geek agora."
      icon="✨"
      artists={artists}
      votingOpen={DEFAULT_SETTINGS.votingOpen}
      emptyMessage="Nenhum artista nessa faixa ainda — em breve novos nomes chegam por aqui."
    />
  );
}
