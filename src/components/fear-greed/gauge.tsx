'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ZONES } from '@/lib/fear-greed';

const BAND = 18;
const SIDE = 30;    // room for the 0 and 100 labels beside the arc
const TOP = 26;     // room for the labels above it
const BELOW = 14;   // room for the hub under the pivot
const MAX_RADIUS = 236;

const angleOf = (score: number) => Math.PI * (1 - score / 100);

// Drawn at the width it really has, so the labels stay 12px on a phone and on a desktop.
export default function FearGreedGauge({ score, label }: { score: number | null; label: string | null }) {
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [settled, setSettled] = useState(false);

  useLayoutEffect(() => {
    const element = box.current;
    if (!element) return;
    setWidth(element.clientWidth);
    const observer = new ResizeObserver(() => setWidth(element.clientWidth));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // The needle starts at 0 and swings to the reading once it has been painted there.
  const hasReading = score !== null;
  useEffect(() => {
    if (!hasReading) return;
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setSettled(true)));
    return () => cancelAnimationFrame(frame);
  }, [hasReading]);

  const radius = Math.max(90, Math.min(MAX_RADIUS, (width - SIDE * 2) / 2));
  const cx = width / 2;
  const cy = TOP + radius;
  const height = cy + BELOW;
  const at = (s: number, r: number) => ({ x: cx + r * Math.cos(angleOf(s)), y: cy - r * Math.sin(angleOf(s)) });
  const arc = (from: number, to: number, r: number) => {
    const a = at(from, r);
    const b = at(to, r);
    return `M ${a.x.toFixed(2)} ${a.y.toFixed(2)} A ${r} ${r} 0 0 1 ${b.x.toFixed(2)} ${b.y.toFixed(2)}`;
  };

  const middle = radius - BAND / 2;
  const clamped = score === null ? 0 : Math.max(0, Math.min(100, score));
  const needleLength = radius - BAND - 8;
  const description = score === null ? 'Gauge with no reading yet' : `Gauge reading ${score} out of 100, ${label}`;

  return (
    <div ref={box} className="w-full" style={{ height: width ? height : 2 * MAX_RADIUS * 0.6 }}>
      {width > 0 && (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={description} className="block select-none">
          {ZONES.map(zone => {
            const active = zone.name === label;
            return (
              <path
                key={zone.name}
                d={arc(zone.from + (zone.from === 0 ? 0 : 0.5), zone.to - (zone.to === 100 ? 0 : 0.5), middle)}
                fill="none"
                strokeWidth={BAND}
                style={{ stroke: score === null ? 'hsl(var(--secondary))' : zone.color }}
                opacity={score === null || active ? 1 : 0.32}
              />
            );
          })}

          {Array.from({ length: 21 }, (_, i) => i * 5).map(s => {
            const major = s % 20 === 0;
            const a = at(s, radius - BAND - 3);
            const b = at(s, radius - BAND - (major ? 11 : 7));
            return <line key={s} x1={a.x} y1={a.y} x2={b.x} y2={b.y} strokeWidth={1} style={{ stroke: major ? 'hsl(var(--muted-foreground))' : 'hsl(var(--border))' }} />;
          })}

          {[0, 20, 40, 60, 80, 100].map(s => {
            const p = at(s, radius + 13);
            return (
              <text key={s} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize={12} style={{ fill: 'hsl(var(--muted-foreground))', fontVariantNumeric: 'tabular-nums' }}>
                {s}
              </text>
            );
          })}

          {score !== null && (
            <g
              className="transition-transform duration-1000 ease-out motion-reduce:transition-none"
              style={{ transform: `rotate(${(settled ? clamped : 0) * 1.8}deg)`, transformOrigin: `${cx}px ${cy}px` }}
            >
              <polygon points={`${cx - needleLength},${cy} ${cx},${cy - 3.5} ${cx},${cy + 3.5}`} style={{ fill: 'hsl(var(--foreground))' }} />
            </g>
          )}
          {score !== null && <circle cx={cx} cy={cy} r={7} strokeWidth={2} style={{ fill: 'hsl(var(--card))', stroke: 'hsl(var(--foreground))' }} />}
        </svg>
      )}
    </div>
  );
}
