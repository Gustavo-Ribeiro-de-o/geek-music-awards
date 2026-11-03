"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Instagram, Crown, Play } from "lucide-react";
import { Reveal } from "./ui";
import { useVote } from "./VoteProvider";

export function ArtistProfile({ artist, votingOpen }: { artist: any; votingOpen: boolean }) {
  const { openVote } = useVote();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playingSong = artist.songs.find((s: any) => s.id === playingId);

  useEffect(() => {
    if (playingId && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [playingId]);

  const toggleSong = (song: any) => {
    if (playingId === song.id) {
      audioRef.current?.pause();
      setPlayingId(null);
    } else {
      setPlayingId(song.id);
    }
  };

  return (
    <section className="artist-profile">
      <Link href="/artistas" className="link-btn back-link">← Voltar aos artistas</Link>

      <div
        className="artist-profile__banner"
        style={{
          background: "radial-gradient(circle at 25% 20%, rgba(255,214,10,0.28), transparent 55%), radial-gradient(circle at 85% 90%, rgba(225,29,46,0.22), transparent 55%), linear-gradient(160deg, #141414, #0a0a0a)",
        }}
      >
        <div className="artist-profile__id">
          <div
            className="artist-profile__avatar"
            style={{ background: artist.photo ? undefined : "linear-gradient(160deg, #ffd60a, #e11d2e)" }}
          >
            {artist.photo ? (
              <img
                src={artist.photo}
                alt={artist.name}
                className="artist-profile__photo"
                style={artist.photoPosition ? { objectPosition: artist.photoPosition } : undefined}
              />
            ) : (
              artist.name[0]
            )}
          </div>
          <div>
            <h1>{artist.name} <Crown size={20} color="#ffd60a" /></h1>
            {artist.subscribers && <span className="subscriber-count">{artist.subscribers}</span>}
          </div>
        </div>
      </div>

      <div className="artist-profile__grid">
        <div>
          <Reveal>
            <p className="muted">
              Você pode votar em <strong style={{ color: "var(--white)" }}>{artist.name}</strong> para que ele seja eleito o melhor artista em sua categoria.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <div className="socials">
              <a href={artist.socials?.instagram} target="_blank" rel="noopener noreferrer" className="social-icon"><Instagram size={16} /></a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h2 className="section-subtitle">Músicas</h2>
            <div className="songs-list">
              {artist.songs.map((s: any) => (
                <SongRow key={s.id} song={s} playing={playingId === s.id} onToggle={() => toggleSong(s)} />
              ))}
            </div>
            {playingSong?.url && (
              <audio
                ref={audioRef}
                src={playingSong.url}
                onEnded={() => setPlayingId(null)}
                onPause={() => setPlayingId(null)}
              />
            )}
          </Reveal>
        </div>

        <Reveal delay={100} className="artist-profile__side">
          <div className="card side-card">
            <span className="muted small">Vote e apoie {artist.name}</span>
            {votingOpen ? (
              <button
                className="btn btn--primary"
                style={{ marginTop: "1rem", width: "100%" }}
                onClick={() => openVote(artist)}
              >
                VOTAR NESTE ARTISTA
              </button>
            ) : (
              <span className="badge badge--closed" style={{ marginTop: "1rem" }}>Votação encerrada</span>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function SongRow({ song, playing, onToggle }: { song: any; playing: boolean; onToggle: () => void }) {
  return (
    <div className="song-row">
      <div className="song-row__cover">
        {typeof song.cover === "string" && song.cover.startsWith("data:image") ? (
          <img src={song.cover} alt="" className="song-row__cover-img" />
        ) : (
          song.cover
        )}
      </div>
      <div className="song-row__info">
        <span className="song-row__title">{song.title}</span>
        <span className="muted small">{song.ref}</span>
      </div>
      <span className="muted small">{song.duration}</span>
      <button className={`play-btn ${playing ? "play-btn--active" : ""}`} onClick={onToggle}>
        <Play size={14} fill={playing ? "#0a0a0a" : "none"} />
      </button>
    </div>
  );
}
