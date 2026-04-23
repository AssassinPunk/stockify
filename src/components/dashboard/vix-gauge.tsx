'use client';

import { useEffect, useState } from 'react';
import { getRiskLevel, MAX_VIX } from '@/lib/vix';

// ── Geometry ─────────────────────────────────────────────────────────────────
const CX = 100;
const CY = 100;
const R  = 82;
const SW = 11; // zone arc stroke-width

const ZONES = [
  { from: 0,  to: 13, color: '#10b981' },
  { from: 13, to: 18, color: '#facc15' },
  { from: 18, to: 25, color: '#fb923c' },
  { from: 25, to: 40, color: '#ef4444' },
] as const;

const BOUNDARY_TICKS = [13, 18, 25];
const MINOR_TICKS    = [5, 10, 20, 30, 35];

// ── Non-linear zone mapping ───────────────────────────────────────────────────
// Each zone gets equal angular width so HIGH/EXTREME appear clearly on the right.
// Needle: –90° = left (Low), 0° = straight up (Moderate/High boundary), +90° = right (Extreme)
const BP = [
  { vix:  0, rot: -90 },
  { vix: 13, rot: -45 },
  { vix: 18, rot:   0 },
  { vix: 25, rot:  45 },
  { vix: 40, rot:  90 },
] as const;

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function vixToSvgRot(vix: number): number {
  const v = Math.min(Math.max(vix, 0), MAX_VIX);
  for (let i = 0; i < BP.length - 1; i++) {
    if (v <= BP[i + 1].vix)
      return lerp(BP[i].rot, BP[i + 1].rot, (v - BP[i].vix) / (BP[i + 1].vix - BP[i].vix));
  }
  return 90;
}

// mathAngle: 180° = left, 90° = top, 0° = right (derived from svgRot so they always align)
function vixToMathAngle(vix: number): number { return 90 - vixToSvgRot(vix); }

function polar(angleDeg: number, r: number): [number, number] {
  const rad = (angleDeg * Math.PI) / 180;
  return [CX + r * Math.cos(rad), CY - r * Math.sin(rad)];
}

function arc(fromVix: number, toVix: number, r = R) {
  const [sx, sy] = polar(vixToMathAngle(fromVix), r);
  const [ex, ey] = polar(vixToMathAngle(toVix),   r);
  const large = vixToMathAngle(fromVix) - vixToMathAngle(toVix) > 180 ? 1 : 0;
  // Sweep=1 draws the top semicircle (the gauge lives on the upper half).
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function VixGauge({
  value,
  size = 'lg',
}: {
  value: number;
  size?: 'sm' | 'lg';
}) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 150);
    return () => clearTimeout(t);
  }, [value]);

  const risk    = getRiskLevel(value);
  const svgRot  = vixToSvgRot(animated);
  const needleR = R - SW / 2 - 2;

  return (
    <svg
      viewBox="0 0 200 108"
      className="w-full overflow-visible"
      aria-label={`India VIX ${value.toFixed(2)} — ${risk.level} zone`}
    >
      <defs>
        {/* Soft glow for the active needle tip */}
        <filter id="vix-tip-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Subtle inner shadow for track depth */}
        <filter id="vix-track-shadow">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* ── Deep background track ── */}
      <path d={arc(0, MAX_VIX)} fill="none"
        stroke="#111" strokeWidth={SW + 6} strokeLinecap="round"
        filter="url(#vix-track-shadow)" />
      <path d={arc(0, MAX_VIX)} fill="none"
        stroke="#1e1e1e" strokeWidth={SW + 2} strokeLinecap="round" />

      {/* ── Coloured zone arcs ── */}
      {ZONES.map((z, i) => (
        <path key={z.color}
          d={arc(z.from, z.to)} fill="none"
          stroke={z.color} strokeWidth={SW} strokeOpacity={0.85}
          strokeLinecap={i === 0 || i === ZONES.length - 1 ? 'round' : 'butt'} />
      ))}

      {/* ── Minor scale ticks ── */}
      {MINOR_TICKS.map(vix => {
        const a = vixToMathAngle(vix);
        const [ox, oy] = polar(a, R + SW / 2 + 5);
        const [ix, iy] = polar(a, R + SW / 2 + 1);
        return <line key={vix} x1={ox} y1={oy} x2={ix} y2={iy}
          stroke="#444" strokeWidth={1} strokeLinecap="round" />;
      })}

      {/* ── Zone boundary ticks (notches through the arc) ── */}
      {BOUNDARY_TICKS.map(vix => {
        const a = vixToMathAngle(vix);
        const [ox, oy] = polar(a, R + SW / 2 + 1);
        const [ix, iy] = polar(a, R - SW / 2 - 1);
        return <line key={vix} x1={ox} y1={oy} x2={ix} y2={iy}
          stroke="#000" strokeWidth={2.5} strokeLinecap="round" />;
      })}

      {/* ── Animated needle ── */}
      <g style={{
        transform: `translate(${CX}px, ${CY}px) rotate(${svgRot}deg)`,
        transformOrigin: '0 0',
        transition: 'transform 1.3s cubic-bezier(0.34, 1.4, 0.64, 1)',
      }}>
        {/* Needle shadow */}
        <line x1={0} y1={6} x2={0} y2={-needleR + 4}
          stroke="rgba(0,0,0,0.5)" strokeWidth={4} strokeLinecap="round" />
        {/* Main needle shaft */}
        <line x1={0} y1={6} x2={0} y2={-needleR}
          stroke="white" strokeWidth={2} strokeLinecap="round" />
        {/* Glowing tip */}
        <circle cx={0} cy={-needleR} r={3.5}
          fill={risk.hex} filter="url(#vix-tip-glow)" />
      </g>

      {/* ── Pivot ── */}
      <circle cx={CX} cy={CY} r={8} fill="#0a0a0a" stroke="#2a2a2a" strokeWidth={1.5} />
      <circle cx={CX} cy={CY} r={4} fill={risk.hex} opacity={0.9} />

      {/* ── Zone edge labels (always shown, small) ── */}
      {(() => {
        const [lx, ly] = polar(vixToMathAngle(0),      R + SW + 10);
        const [rx, ry] = polar(vixToMathAngle(MAX_VIX), R + SW + 10);
        return (
          <>
            <text x={lx} y={ly + 3} textAnchor="middle"
              fontSize={6.5} fill="#10b981" fontFamily="monospace" opacity={0.8}>Low</text>
            <text x={rx} y={ry + 3} textAnchor="middle"
              fontSize={6.5} fill="#ef4444" fontFamily="monospace" opacity={0.8}>Extreme</text>
          </>
        );
      })()}
    </svg>
  );
}
