import Link from "next/link";
import { Reveal } from "@/components/ui";
import { ARTISTS, CATEGORIES } from "@/data/gma-data";

export default function CategoriesPage() {
  return (
    <section className="section section--top">
      <Reveal>
        <h1 className="page-title">Categorias da premiação</h1>
        <p className="muted">Cada categoria reúne artistas indicados com base em critérios próprios do júri e da comunidade.</p>
      </Reveal>

      <div className="grid grid--categories">
        {CATEGORIES.map((c: any, i: number) => {
          const nominees = c.nominees.map((id: string) => ARTISTS.find((a: any) => a.id === id)).filter(Boolean);
          return (
            <Reveal key={c.id} delay={i * 60}>
              <div className="card category-card">
                <div className="category-card__icon">{c.icon}</div>
                <h3>{c.name}</h3>
                <p className="muted small">{c.desc}</p>
                <div className="category-card__nominees">
                  {nominees.map((a: any) => (
                    <Link
                      key={a.id}
                      href={`/artistas/${a.slug}`}
                      className="mini-avatar"
                      style={{ background: a.photo ? undefined : `linear-gradient(160deg, ${a.color}, ${a.accent})` }}
                      title={a.name}
                    >
                      {a.photo ? (
                        <img
                          src={a.photo}
                          alt={a.name}
                          className="avatar-photo"
                          style={a.photoPosition ? { objectPosition: a.photoPosition } : undefined}
                        />
                      ) : (
                        a.name[0]
                      )}
                    </Link>
                  ))}
                </div>
                <div className="category-card__footer">
                  <span className="muted small">{nominees.length} indicados</span>
                  <span className="badge badge--open">Votação aberta</span>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
