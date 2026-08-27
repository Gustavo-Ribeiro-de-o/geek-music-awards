import Link from "next/link";
import { Sparkles, Instagram, Youtube, Twitter } from "lucide-react";

export function GmaFooter() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="logo logo--footer">
          <Sparkles size={18} className="logo__icon" />
          <span>GEEK MUSIC <b>AWARDS</b></span>
        </div>
        <div className="footer__links">
          <Link href="/">Início</Link>
          <Link href="/artistas">Artistas</Link>
          <Link href="/categorias">Categorias</Link>
          <Link href="/evento">Evento</Link>
          <Link href="/equipe">Área da equipe</Link>
        </div>
      </div>
      <div className="footer__socials">
        <a
          href="https://www.instagram.com/geek_music_awards?igsi=MTVpZzF6eGVlbXY2cg%3D%3D&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
          className="social-icon"
        >
          <Instagram size={16} />
        </a>
        <a href="#" className="social-icon"><Youtube size={16} /></a>
        <a href="#" className="social-icon"><Twitter size={16} /></a>
      </div>
      <p className="muted small">© 2026 Geek Music Awards. Todos os direitos reservados.</p>
    </footer>
  );
}
