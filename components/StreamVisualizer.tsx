"use client";

import { useRef, useState, useEffect } from "react";
import { mockTelemetryEvents } from "@/lib/mockData";

function colorizeSnippet(obj: Record<string, unknown>): string {
  const pairs = Object.entries(obj)
    .slice(0, 4)
    .map(([k, v]) => {
      const keySpan = `<span class="sv-key">"${k}"</span>`;
      let valSpan: string;
      if (typeof v === "number") {
        valSpan = `<span class="sv-num">${v}</span>`;
      } else if (typeof v === "string" && v.length > 20) {
        valSpan = `<span class="sv-str">"${v.slice(0, 18)}…"</span>`;
      } else {
        valSpan = `<span class="sv-str">"${v}"</span>`;
      }
      return `${keySpan}: ${valSpan}`;
    });
  return `{ ${pairs.join(",&nbsp;&nbsp;")} }`;
}

interface Particle {
  id: number;
  event: Record<string, unknown>;
  yPercent: number;
  duration: number;
  delay: number;
  opacity: number;
}

function buildParticles(): Particle[] {
  return mockTelemetryEvents.map((ev, i) => ({
    id: i,
    event: ev as unknown as Record<string, unknown>,
    yPercent: 3 + (i / mockTelemetryEvents.length) * 88,
    duration: 20 + (i % 5) * 3,
    delay: i * 1.2,
    opacity: 0.4 + (i % 3) * 0.1,
  }));
}

export function StreamVisualizer() {
  const [mounted, setMounted] = useState(false);
  const particles = useRef(buildParticles()).current;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <style>{`
        @keyframes sv-drift {
          0%   { transform: translateX(-12vw); opacity: 0; }
          4%   { opacity: 1; }
          88%  { opacity: 1; }
          100% { transform: translateX(112vw); opacity: 0; }
        }
        .sv-wrap {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .sv-particle {
          position: absolute;
          left: 0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.68rem;
          white-space: nowrap;
          padding: 7px 14px;
          border-radius: 7px;
          border: 1px solid rgba(255,255,255,0.05);
          background: rgba(5,5,10,0.65);
          backdrop-filter: blur(6px);
          line-height: 1.5;
          letter-spacing: 0.01em;
        }
        .sv-key  { color: rgba(150,195,220,0.75); }
        .sv-str  { color: rgba(190,190,200,0.6); }
        .sv-num  { color: rgba(120,210,155,0.8); }
      `}</style>
      <div className="sv-wrap">
        {particles.map((p) => (
          <div
            key={p.id}
            className="sv-particle"
            style={{
              top: `${p.yPercent}%`,
              opacity: p.opacity,
              animation: `sv-drift ${p.duration}s ${p.delay}s linear infinite`,
            }}
            dangerouslySetInnerHTML={{ __html: colorizeSnippet(p.event) }}
          />
        ))}
      </div>
    </>
  );
}
