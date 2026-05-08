'use client';

// Semicircular gauge: score 0 (left) → 50 (top) → 100 (right)
// Angle formula: angleDeg = score * 1.8 − 180
//   score=0  → −180° → left  (cos=−1, sin=0)
//   score=50 → −90°  → top   (cos=0,  sin=−1 → y decreases → up in SVG)
//   score=100→   0°  → right (cos=+1, sin=0)
// Arc drawn with sweep=1 (clockwise in SVG) which traces the upper semicircle.

const CX = 160, CY = 148, R = 116, SW = 20;

const ZONES = [
  { from: 0,  to: 20,  color: '#dc2626' }, // Extreme Fear
  { from: 20, to: 40,  color: '#f97316' }, // Fear
  { from: 40, to: 60,  color: '#eab308' }, // Neutral
  { from: 60, to: 80,  color: '#84cc16' }, // Greed
  { from: 80, to: 100, color: '#22c55e' }, // Extreme Greed
] as const;

const LABEL_COLOR: Record<string, string> = {
  'Extreme Fear': '#dc2626',
  Fear:           '#f97316',
  Neutral:        '#eab308',
  Greed:          '#84cc16',
  'Extreme Greed':'#22c55e',
};

function scoreToAngleDeg(score: number) {
  return score * 1.8 - 180;
}

function toXY(angleDeg: number, r: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

// Arc path from fromScore to toScore (sweep=1 → upper semicircle)
function arcD(fromScore: number, toScore: number, r: number) {
  const p1 = toXY(scoreToAngleDeg(fromScore), r);
  const p2 = toXY(scoreToAngleDeg(toScore),   r);
  return `M ${p1.x.toFixed(3)} ${p1.y.toFixed(3)} A ${r} ${r} 0 0 1 ${p2.x.toFixed(3)} ${p2.y.toFixed(3)}`;
}

// Tick marks at zone boundaries
const TICK_SCORES = [0, 20, 40, 60, 80, 100];
const TICK_LABELS = ['0', '20', '40', '60', '80', '100'];

export default function FearGreedGauge({
  score,
  label,
}: {
  score: number;
  label: string;
}) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const needleAngle  = scoreToAngleDeg(clampedScore);
  const needleTip    = toXY(needleAngle, R - SW / 2 - 3);
  const accentColor  = LABEL_COLOR[label] ?? '#eab308';

  return (
    <svg viewBox="0 0 320 185" className="w-full max-w-sm select-none">
      {/* ── Background track ─────────────────────────────────────── */}
      <path
        d={arcD(0, 100, R)}
        fill="none"
        stroke="#111"
        strokeWidth={SW + 6}
        strokeLinecap="round"
      />

      {/* ── Colored zone arcs ────────────────────────────────────── */}
      {ZONES.map(z => (
        <path
          key={z.from}
          d={arcD(z.from, z.to, R)}
          fill="none"
          stroke={z.color}
          strokeWidth={SW}
          strokeLinecap="butt"
          opacity={0.9}
        />
      ))}

      {/* ── Tick marks and labels at zone boundaries ─────────────── */}
      {TICK_SCORES.map((s, i) => {
        const outer = toXY(scoreToAngleDeg(s), R + SW / 2 + 6);
        const inner = toXY(scoreToAngleDeg(s), R - SW / 2 - 2);
        const lbl   = toXY(scoreToAngleDeg(s), R + SW / 2 + 17);
        return (
          <g key={s}>
            <line
              x1={inner.x.toFixed(2)} y1={inner.y.toFixed(2)}
              x2={outer.x.toFixed(2)} y2={outer.y.toFixed(2)}
              stroke="#333" strokeWidth={1.5}
            />
            <text
              x={lbl.x.toFixed(2)} y={lbl.y.toFixed(2)}
              textAnchor="middle" dominantBaseline="middle"
              fill="#444" fontSize={8} fontFamily="monospace"
            >
              {TICK_LABELS[i]}
            </text>
          </g>
        );
      })}

      {/* ── Needle shadow ────────────────────────────────────────── */}
      <line
        x1={CX} y1={CY}
        x2={(needleTip.x + 1.5).toFixed(2)} y2={(needleTip.y + 1.5).toFixed(2)}
        stroke="#000" strokeWidth={4} strokeLinecap="round" opacity={0.35}
      />

      {/* ── Needle ───────────────────────────────────────────────── */}
      <line
        x1={CX} y1={CY}
        x2={needleTip.x.toFixed(2)} y2={needleTip.y.toFixed(2)}
        stroke="white" strokeWidth={2.5} strokeLinecap="round"
      />

      {/* ── Hub ──────────────────────────────────────────────────── */}
      <circle cx={CX} cy={CY} r={11} fill="#0a0a0a" stroke={accentColor} strokeWidth={2.5} />
      <circle cx={CX} cy={CY} r={4}  fill={accentColor} />

      {/* ── Score number ─────────────────────────────────────────── */}
      <text
        x={CX} y={CY + 32}
        textAnchor="middle"
        fill="white"
        fontSize={34}
        fontWeight="700"
        fontFamily="monospace"
      >
        {clampedScore}
      </text>

      {/* ── Label text ───────────────────────────────────────────── */}
      <text
        x={CX} y={CY + 54}
        textAnchor="middle"
        fill={accentColor}
        fontSize={11}
        fontWeight="700"
        letterSpacing="1.5"
        fontFamily="sans-serif"
      >
        {label.toUpperCase()}
      </text>

      {/* ── End labels ───────────────────────────────────────────── */}
      <text x={CX - R - SW / 2 - 8} y={CY + 10} textAnchor="end"   fill="#555" fontSize={9} fontFamily="sans-serif">Fear</text>
      <text x={CX + R + SW / 2 + 8} y={CY + 10} textAnchor="start" fill="#555" fontSize={9} fontFamily="sans-serif">Greed</text>
    </svg>
  );
}
