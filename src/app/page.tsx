import Link from "next/link";
import { Music2, Sparkles, Users, Trophy, Radio, ChevronRight } from "lucide-react";
import { Reveal, CountdownBlock } from "@/components/ui";
import { ArtistCard } from "@/components/ArtistCard";
import { ARTISTS, DEFAULT_SETTINGS, MAIN_MIN_SUBSCRIBERS, TROPHY_IMAGE_URL } from "@/data/gma-data";

export default function HomePage() {
  const settings = DEFAULT_SETTINGS;
  const votingOpen = settings.votingOpen;

  // Destaques da home: os 6 primeiros artistas "grandes" (100K+) cadastrados.
  const featured = ARTISTS.filter(
    (a: any) => a.subscriberCount === undefined || a.subscriberCount >= MAIN_MIN_SUBSCRIBERS
  ).slice(0, 6);

  return (
    <>
      <section className="hero">
        <div className="hero__glow hero__glow--a" />
        <div className="hero__glow hero__glow--b" />
        <div className="hero__stage">
          <div className="hero__silhouette" />
        </div>
        <div className="hero__content">
          <Reveal>
            <span className="eyebrow"><Music2 size={14} /> Premiação anual da cena geek</span>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="hero__title">
              O palco é <span className="grad-text">deles.</span><br />
              A escolha é <span className="grad-text">sua.</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="hero__subtitle">
              Vote nos maiores nomes da música geek e ajude a escolher quem será o grande vencedor.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="hero__actions">
              <Link href="/artistas" className="btn btn--primary btn--lg">VOTAR AGORA</Link>
              <Link href="/artistas" className="btn btn--outline btn--lg">CONHECER OS ARTISTAS</Link>
            </div>
          </Reveal>
          <Reveal delay={320}>
            <div className="hero__countdown">
              <span className="hero__countdown-label">A votação termina em</span>
              <CountdownBlock target={settings.votingEndsAt} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <Reveal>
          <div className="section__head">
            <h2>Conheça os indicados</h2>
            <Link href="/artistas" className="link-btn">
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>
        </Reveal>
        <div className="grid grid--artists">
          {featured.map((a: any, i: number) => (
            <Reveal key={a.id} delay={i * 60}>
              <ArtistCard artist={a} votingOpen={votingOpen} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <Reveal>
          <div className="trophy-banner">
            <img src={TROPHY_IMAGE_URL} alt="Prêmio Geek Music Awards" className="trophy-banner__img" />
            <p className="trophy-banner__caption">Você pode premiar seu artista votando nele!</p>
          </div>
        </Reveal>
      </section>

      <section className="section section--strip">
        <Reveal>
          <div className="strip">
            <div className="strip__item"><Music2 /><span>Música</span></div>
            <div className="strip__item"><Sparkles /><span>Anime</span></div>
            <div className="strip__item"><Users /><span>Cultura geek</span></div>
            <div className="strip__item"><Trophy /><span>Premiação</span></div>
            <div className="strip__item"><Radio /><span>Tecnologia</span></div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
