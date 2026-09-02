"use client";

import Link from "next/link";
import { useVote } from "./VoteProvider";

// Garante que só um player toque por vez entre todos os cards da página:
// ao começar a tocar um, pausa o que estava tocando antes.
let activeCardAudio: HTMLAudioElement | null = null;

function handleCardAudioPlay(e: React.SyntheticEvent<HTMLAudioElement>) {
  const audio = e.currentTarget;
  if (activeCardAudio && activeCardAudio !== audio) {
    activeCardAudio.pause();
  }
  activeCardAudio = audio;
}

type Artist = {
  id: string;
  slug: string;
  name: string;
  genre: string;
  short: string;
  color: string;
  accent: string;
  photo?: string;
  photoPosition?: string;
  clipTitle?: string;
  clipUrl?: string;
};

export function ArtistCard({ artist, votingOpen }: { artist: Artist; votingOpen: boolean }) {
  const { openVote } = useVote();

  return (
    <div className="card artist-card" style={{ ["--accent" as string]: artist.color }}>
      <div
        className="artist-card__avatar"
        style={{ background: artist.photo ? undefined : `linear-gradient(160deg, ${artist.color}55, transparent)` }}
      >
        {artist.photo ? (
          <img
            src={artist.photo}
            alt={artist.name}
            className="artist-card__photo"
            style={artist.photoPosition ? { objectPosition: artist.photoPosition } : undefined}
          />
        ) : (
          <span>{artist.name[0]}</span>
        )}
      </div>
      <div className="artist-card__body">
        <h3>{artist.name}</h3>
        {artist.clipUrl ? (
          <div className="artist-card__clip">
            <p className="muted small">
              {artist.clipTitle ? (
                <>Faixa que os fãs gostam: <strong>{artist.clipTitle}</strong></>
              ) : (
                "Ouça um trecho:"
              )}
            </p>
            <audio controls preload="metadata" src={artist.clipUrl} className="artist-card__audio" onPlay={handleCardAudioPlay} />
          </div>
        ) : (
          <p className="muted small">{artist.short}</p>
        )}
        <div className="artist-card__actions">
          <Link
            href={`/artistas/${artist.slug}`}
            className="btn btn--ghost btn--sm"
            style={votingOpen ? undefined : { flex: 1 }}
          >
            VER PERFIL
          </Link>
          {votingOpen && (
            <button
              className="btn btn--primary btn--sm"
              style={{ background: artist.color, boxShadow: `0 8px 24px -8px ${artist.color}99` }}
              onClick={() => openVote(artist)}
            >
              VOTAR
            </button>
          )}
        </div>
        {!votingOpen && <span className="badge badge--closed">Votação encerrada</span>}
      </div>
    </div>
  );
}
