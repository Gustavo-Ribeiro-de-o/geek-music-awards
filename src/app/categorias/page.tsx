import { Reveal } from "@/components/ui";
import { CATEGORIES } from "@/data/gma-data";

export default function CategoriesPage() {
  return (
    <section className="section section--top">
      <Reveal>
        <h1 className="page-title">Categorias da premiação</h1>
        <p className="muted">Cada categoria reúne artistas indicados com base em critérios próprios do júri e da comunidade.</p>
      </Reveal>

      <div className="grid grid--categories">
        {CATEGORIES.map((c: any, i: number) => (
          <Reveal key={c.id} delay={i * 60}>
            <div className="card category-card">
              <div className="category-card__icon">{c.icon}</div>
              <h3>{c.name}</h3>
              <p className="muted small">{c.desc}</p>
              <div className="category-card__footer">
                <span className="badge badge--open">Votação aberta</span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
