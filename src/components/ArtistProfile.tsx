"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Instagram, Youtube, Twitter, Crown, Play } from "lucide-react";
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
          background: `radial-gradient(circle at 30% 20%, ${artist.color}55, transparent 60%), linear-gradient(160deg, #0d0616, #050208)`,
        }}
      >
        <div className="artist-profile__id">
          <div
            className="artist-profile__avatar"
            style={{ background: artist.photo ? undefined : `linear-gradient(160deg, ${artist.color}, ${artist.accent})` }}
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
            <h1>{artist.name} <Crown size={20} color={artist.color} /></h1>
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
              <a href={artist.socials?.youtube} target="_blank" rel="noopener noreferrer" className="social-icon"><Youtube size={16} /></a>
              <a href={artist.socials?.twitter} target="_blank" rel="noopener noreferrer" className="social-icon"><Twitter size={16} /></a>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h2 className="section-subtitle">Músicas</h2>
            <div className="songs-list">
              {artist.songs.map((s: any) => (
                <SongRow key={s.id} song={s} color={artist.color} playing={playingId === s.id} onToggle={() => toggleSong(s)} />
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
                style={{ background: artist.color, boxShadow: `0 8px 24px -8px ${artist.color}99`, marginTop: "1rem", width: "100%" }}
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

function isDarkColor(hex: string) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.45;
}

function SongRow({ song, color, playing, onToggle }: { song: any; color: string; playing: boolean; onToggle: () => void }) {
  const idleColor = isDarkColor(color) ? "#e5e5e5" : color;
  const activeFg = isDarkColor(color) ? "#ffffff" : "#000000";
  return (
    <div className="song-row">
      <div className="song-row__cover" style={{ background: `${color}22` }}>
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
      <button
        className={`play-btn ${playing ? "play-btn--active" : ""}`}
        style={{ borderColor: idleColor, color: playing ? activeFg : idleColor, background: playing ? color : "transparent" }}
        onClick={onToggle}
      >
        <Play size={14} fill={playing ? activeFg : "none"} />
      </button>
    </div>
  );
}
