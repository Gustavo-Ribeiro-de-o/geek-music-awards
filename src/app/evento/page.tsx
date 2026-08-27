"use client";

import { useState } from "react";
import { Calendar, Bell, Tv, MapPin, Radio, Clock } from "lucide-react";
import { Reveal, CountdownBlock } from "@/components/ui";
import { DEFAULT_SETTINGS } from "@/data/gma-data";

export default function EventPage() {
  const [reminded, setReminded] = useState(false);
  const settings = DEFAULT_SETTINGS;

  return (
    <section className="section section--top event-page">
      <Reveal>
        <span className="eyebrow"><Calendar size={14} /> Cerimônia oficial</span>
        <h1 className="page-title">A Grande Final</h1>
        <p className="muted">Uma noite para descobrir quem será o grande vencedor.</p>
      </Reveal>

      <Reveal delay={80}>
        <div className="event-hero">
          <div className="event-hero__countdown">
            <span className="hero__countdown-label">A cerimônia começa em</span>
            <CountdownBlock target={settings.eventDate} size="lg" />
          </div>
          <div className="event-hero__actions">
            <button className={`btn ${reminded ? "btn--outline" : "btn--primary"}`} onClick={() => setReminded(true)}>
              <Bell size={16} /> {reminded ? "Você será lembrado" : "LEMBRAR DO EVENTO"}
            </button>
            <button className="btn btn--outline"><Tv size={16} /> ACOMPANHAR AO VIVO</button>
          </div>
        </div>
      </Reveal>

      <div className="event-details">
        <Reveal delay={120}>
          <div className="card info-card">
            <MapPin size={18} />
            <div>
              <span className="muted small">Local</span>
              <p>{settings.eventLocation}</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={160}>
          <div className="card info-card">
            <Radio size={18} />
            <div>
              <span className="muted small">Transmissão</span>
              <p>{settings.eventBroadcast}</p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div className="card info-card">
            <Clock size={18} />
            <div>
              <span className="muted small">Data</span>
              <p>{new Date(settings.eventDate).toLocaleString("pt-BR", { dateStyle: "long", timeStyle: "short" })}</p>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={220}>
        <h2 className="section-subtitle">Programação</h2>
        <div className="schedule">
          {settings.schedule.map((item: any, i: number) => (
            <div key={i} className="schedule__item">
              <span className="schedule__time">{item.time}</span>
              <span className="schedule__label">{item.label}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
