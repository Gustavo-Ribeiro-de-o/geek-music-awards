"use client";

import { useEffect, useRef, useState } from "react";

export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible] as const;
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "reveal--visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function useCountdown(target: string) {
  const [remaining, setRemaining] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    if (!target) return;
    const targetMs = new Date(target).getTime();
    const tick = () => {
      const diff = targetMs - Date.now();
      if (diff <= 0) {
        setRemaining({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }
      setRemaining({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return remaining;
}

export function CountdownBlock({ target, size = "md" }: { target: string; size?: "md" | "lg" }) {
  const t = useCountdown(target);
  const units: [string, number][] = [
    ["Dias", t.d],
    ["Horas", t.h],
    ["Minutos", t.m],
    ["Segundos", t.s],
  ];
  return (
    <div className={`countdown countdown--${size}`}>
      {units.map(([label, val]) => (
        <div className="countdown__unit" key={label}>
          <span className="countdown__value">{String(val).padStart(2, "0")}</span>
          <span className="countdown__label">{label}</span>
        </div>
      ))}
    </div>
  );
}
