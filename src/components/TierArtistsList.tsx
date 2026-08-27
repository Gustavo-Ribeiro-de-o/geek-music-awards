"use client";

import { Reveal } from "./ui";
import { ArtistCard } from "./ArtistCard";

export function TierArtistsList({
  title,
  subtitle,
  icon,
  artists,
  votingOpen,
  emptyMessage,
}: {
  title: string;
  subtitle: string;
  icon: string;
  artists: any[];
  votingOpen: boolean;
  emptyMessage: string;
}) {
  return (
    <section className="section section--top">
      <Reveal>
        <span className="eyebrow">{icon} Canais emergentes</span>
        <h1 className="page-title">{title}</h1>
        <p className="muted">{subtitle}</p>
      </Reveal>

      <div className="grid grid--artists" style={{ marginTop: "1.5rem" }}>
        {artists.map((a, i) => (
          <Reveal key={a.id} delay={i * 50}>
            <ArtistCard artist={a} votingOpen={votingOpen} />
          </Reveal>
        ))}
        {artists.length === 0 && <p className="muted">{emptyMessage}</p>}
      </div>
    </section>
  );
}
