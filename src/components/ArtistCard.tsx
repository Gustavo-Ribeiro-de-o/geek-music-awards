"use client";

import Link from "next/link";
import { useVote } from "./VoteProvider";

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
        <p className="muted small">{artist.short}</p>
        <div className="artist-card__actions">
          <Link
            href={`/artistas/${artist.slug}`}
            className="btn btn--ghost btn--sm"
            style={votingOpen ? undefined : { flex: 1 }}
          >
            VER PERFIL
          </Link>
          {votingOpen && (
            <button className="btn btn--primary btn--sm" style={{ background: artist.color }} onClick={() => openVote(artist)}>
              VOTAR
            </button>
          )}
        </div>
        {!votingOpen && <span className="badge badge--closed">Votação encerrada</span>}
      </div>
    </div>
  );
}
