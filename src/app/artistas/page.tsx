"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Reveal } from "@/components/ui";
import { ArtistCard } from "@/components/ArtistCard";
import { ARTISTS, DEFAULT_SETTINGS, MAIN_MIN_SUBSCRIBERS } from "@/data/gma-data";

export default function ArtistsPage() {
  const [query, setQuery] = useState("");
  const votingOpen = DEFAULT_SETTINGS.votingOpen;

  const eligible = ARTISTS.filter(
    (a: any) => a.subscriberCount === undefined || a.subscriberCount >= MAIN_MIN_SUBSCRIBERS
  );

  const filtered = eligible.filter((a: any) => a.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <section className="section section--top">
      <Reveal>
        <h1 className="page-title">Artistas indicados</h1>
        <p className="muted">Conheça todos os artistas concorrendo ao Geek Music Awards e vote no seu favorito.</p>
      </Reveal>

      <Reveal delay={80}>
        <div className="toolbar">
          <div className="search">
            <Search size={16} />
            <input placeholder="Buscar artista..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </div>
      </Reveal>

      <div className="grid grid--artists">
        {filtered.map((a: any, i: number) => (
          <Reveal key={a.id} delay={i * 50}>
            <ArtistCard artist={a} votingOpen={votingOpen} />
          </Reveal>
        ))}
        {filtered.length === 0 && <p className="muted">Nenhum artista encontrado para essa busca.</p>}
      </div>
    </section>
  );
}
