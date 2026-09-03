"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles, Lock } from "lucide-react";

const LINKS: [string, string][] = [
  ["/", "Início"],
  ["/artistas", "Artistas"],
  ["/revelacoes", "Revelações"],
  ["/prodigios", "Prodígios"],
  ["/categorias", "Categorias"],
  ["/evento", "Evento"],
  ["/projetos-2027", "Projetos 2027"],
];

export function GmaHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="header__inner">
        <Link href="/" className="logo">
          <Sparkles size={20} className="logo__icon" />
          <span>GEEK MUSIC <b>AWARDS</b></span>
        </Link>

        <nav className="nav nav--desktop">
          {LINKS.map(([href, label]) => (
            <Link key={href} href={href} className={`nav__link ${pathname === href ? "nav__link--active" : ""}`}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="header__actions">
          <Link href="/artistas" className="btn btn--vote">VOTAR AGORA</Link>
          <button className="menu-toggle" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="nav nav--mobile">
          {LINKS.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className={`nav__link ${pathname === href ? "nav__link--active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link href="/equipe" className="nav__link nav__link--admin" onClick={() => setMenuOpen(false)}>
            <Lock size={14} /> Área da equipe
          </Link>
        </div>
      )}
    </header>
  );
}
