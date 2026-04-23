'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  XIcon, Sparkles, Loader2, ShieldCheck, TrendingUp,
  AlertTriangle, Ban, Clock, Target, Wallet, Trophy,
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/format';
import type { VixData, ChartDataPoint } from '@/lib/types';
import {
  calculateVixMoves, getRiskLevel, getVixAnchors,
  getVixPercentile, ZONE_STRATEGIES,
} from '@/lib/vix';
import type { StrategyTip } from '@/lib/vix';
import { explainIndiaVIX } from '@/ai/flows/explain-india-vix-insights';
import VixGauge from './vix-gauge';

// ── Icon / colour maps ────────────────────────────────────────────────────────
const TIP_ICONS: Record<StrategyTip['icon'], React.ElementType> = {
  shield: ShieldCheck, trend: TrendingUp, warn: AlertTriangle,
  ban: Ban, clock: Clock, target: Target, cash: Wallet, trophy: Trophy,
};
const TIP_COLORS: Record<StrategyTip['icon'], string> = {
  shield: 'text-emerald-400', trend: 'text-blue-400', warn: 'text-yellow-400',
  ban: 'text-red-400', clock: 'text-purple-400', target: 'text-sky-400',
  cash: 'text-emerald-300', trophy: 'text-yellow-300',
};

function ordinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

// ── Small stat chip ───────────────────────────────────────────────────────────
function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex flex-col gap-1.5 px-5 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/30">{label}</p>
      <p className={cn('text-2xl font-bold font-mono leading-none', color ?? 'text-white')}>{value}</p>
    </div>
  );
}

// ── Main dialog ───────────────────────────────────────────────────────────────
export default function VixDialog({
  isOpen, onOpenChange, vixData, chartData,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  vixData: VixData;
  chartData: ChartDataPoint[];
}) {
  const [aiText,    setAiText]    = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDone,    setAiDone]    = useState(false);

  const risk     = getRiskLevel(vixData.value);
  const moves    = calculateVixMoves(vixData.value);
  const anchors  = getVixAnchors(chartData);
  const pct      = getVixPercentile(vixData.value, chartData);
  const strategy = ZONE_STRATEGIES[risk.level];

  const handleAI = async () => {
    setAiLoading(true);
    setAiText('');
    setAiDone(false);
    try {
      const res = await explainIndiaVIX({
        vixValue:    vixData.value,
        dailyMove:   moves.daily,
        weeklyMove:  moves.weekly,
        monthlyMove: moves.monthly,
        yearlyMove:  moves.yearly,
      });
      setAiText(res.explanation);
      setAiDone(true);
    } catch {
      setAiText('Unable to fetch AI analysis right now. Please try again.');
      setAiDone(true);
    }
    setAiLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] w-[94vw] max-h-[92vh] overflow-y-auto rounded-3xl bg-[#080808] border border-white/[0.07] p-0 gap-0">
        <DialogTitle className="sr-only">India VIX Deep Dive</DialogTitle>
        <DialogDescription className="sr-only">Full India VIX analysis</DialogDescription>

        {/* ── HERO — gauge + value ─────────────────────────────────────────── */}
        <div
          className="relative flex flex-col items-center pt-10 pb-8 px-8 overflow-hidden"
          style={{
            background: `radial-gradient(ellipse 70% 120% at 50% 0%, ${risk.hex}20 0%, transparent 70%)`,
          }}
        >
          {/* Close button */}
          <Button variant="ghost" size="icon"
            className="absolute top-4 right-4 text-white/30 hover:text-white hover:bg-white/10 rounded-xl z-10"
            onClick={() => onOpenChange(false)}
          >
            <XIcon className="h-4 w-4" />
          </Button>

          {/* Label */}
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30 mb-6">
            India VIX · Fear &amp; Volatility Gauge
          </p>

          {/* Gauge SVG */}
          <div className="w-full max-w-[300px]">
            <VixGauge value={vixData.value} size="lg" />
          </div>

          {/* Value + zone displayed as HTML (cleaner than SVG text) */}
          <div className="flex flex-col items-center gap-1 -mt-2">
            <span className="text-5xl font-bold font-mono text-white tracking-tight">
              {formatNumber(vixData.value, { minimumFractionDigits: 2 })}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-xs font-semibold uppercase tracking-[0.18em] px-3 py-1 rounded-full"
                style={{ background: risk.hex + '22', color: risk.hex, border: `1px solid ${risk.hex}44` }}
              >
                {risk.level} Zone
              </span>
              <span className="text-xs text-white/25">{vixData.lastUpdated}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5 px-6 pb-8">

          {/* ── STATS ROW ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Stat
              label="1-Month Percentile"
              value={ordinal(pct)}
              color={pct > 70 ? 'text-red-400' : pct < 30 ? 'text-emerald-400' : 'text-yellow-400'}
            />
            <Stat label="Period High" value={String(anchors.high)} color="text-red-400" />
            <Stat label="Period Low"  value={String(anchors.low)}  color="text-emerald-400" />
            <Stat label="Period Avg"  value={String(anchors.avg)} />
          </div>

          {/* ── IMPLIED MOVES ─────────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Daily move',   val: moves.daily },
              { label: 'Weekly move',  val: moves.weekly },
              { label: 'Monthly move', val: moves.monthly },
              { label: 'Yearly move',  val: moves.yearly },
            ].map(({ label, val }) => (
              <div key={label}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs">
                <span className="text-white/35">{label}</span>
                <span className="font-mono font-semibold text-white">
                  ±{formatNumber(val, { minimumFractionDigits: 2 })}%
                </span>
              </div>
            ))}
          </div>

          {/* ── STRATEGY + AI ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Strategy guide */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden">
              {/* Card header strip in zone colour */}
              <div className="px-5 pt-5 pb-4" style={{ borderLeft: `3px solid ${risk.hex}` }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-1"
                  style={{ color: risk.hex }}>Strategy Guide</p>
                <p className="font-semibold text-white text-sm leading-snug">{strategy.title}</p>
                <p className="text-xs text-white/40 mt-1.5 leading-relaxed">{strategy.description}</p>
              </div>
              <div className="px-5 pb-5 flex flex-col gap-3.5">
                {strategy.tips.map((tip, i) => {
                  const Icon = TIP_ICONS[tip.icon];
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className={cn('mt-0.5 shrink-0 rounded-md p-1', TIP_COLORS[tip.icon].replace('text-', 'bg-') + '/10')}>
                        <Icon className={cn('h-3.5 w-3.5', TIP_COLORS[tip.icon])} />
                      </div>
                      <p className="text-xs text-white/55 leading-relaxed pt-0.5">{tip.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Analysis */}
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] flex flex-col overflow-hidden">
              <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3 border-b border-white/[0.05]">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-1">AI Analyst</p>
                  <p className="font-semibold text-white text-sm">Plain-English Breakdown</p>
                </div>
                {!aiLoading && !aiDone && (
                  <Button size="sm" onClick={handleAI} variant="outline"
                    className="shrink-0 gap-1.5 text-xs border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20">
                    <Sparkles className="h-3.5 w-3.5" style={{ color: risk.hex }} />
                    Get Analysis
                  </Button>
                )}
                {aiDone && (
                  <Button size="sm" variant="ghost" onClick={() => { setAiDone(false); setAiText(''); }}
                    className="shrink-0 text-xs text-white/25 hover:text-white/60 h-7">
                    Refresh
                  </Button>
                )}
              </div>

              <div className="flex-1 px-5 py-5">
                {/* Idle */}
                {!aiLoading && !aiDone && (
                  <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                    <div className="rounded-full p-3 bg-white/5 border border-white/[0.07]">
                      <Sparkles className="h-6 w-6 text-white/20" />
                    </div>
                    <p className="text-xs text-white/25 max-w-[180px] leading-relaxed">
                      Get a plain-English explanation of what VIX {vixData.value.toFixed(2)} means for your investments.
                    </p>
                  </div>
                )}

                {/* Loading */}
                {aiLoading && (
                  <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="h-2 w-2 rounded-full animate-bounce"
                          style={{ background: risk.hex, animationDelay: `${i * 0.18}s` }} />
                      ))}
                    </div>
                    <p className="text-xs text-white/30">Analysing market conditions…</p>
                  </div>
                )}

                {/* Result */}
                {aiDone && aiText && (
                  <div className="rounded-xl bg-black/30 border border-white/[0.06] p-4">
                    <p className="text-xs leading-[1.85] text-white/60 whitespace-pre-wrap">{aiText}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── HISTORICAL CHART ─────────────────────────────────────────── */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-5">
              30-Day History · Zone Reference Lines
            </p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="vixHistGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={risk.hex} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={risk.hex} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                  <XAxis dataKey="date" hide />
                  <YAxis domain={['auto', 'auto']} stroke="#ffffff15"
                    fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: 10, fontSize: 11 }}
                    labelFormatter={l => new Date(l).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    formatter={(v: number) => [v.toFixed(2), 'VIX']}
                    cursor={{ stroke: risk.hex, strokeWidth: 1, strokeDasharray: '4 3' }}
                  />
                  <ReferenceLine y={13} stroke="#10b981" strokeDasharray="4 3" strokeOpacity={0.45}
                    label={{ value: '13', fill: '#10b981', fontSize: 8, position: 'insideTopRight' }} />
                  <ReferenceLine y={18} stroke="#facc15" strokeDasharray="4 3" strokeOpacity={0.45}
                    label={{ value: '18', fill: '#facc15', fontSize: 8, position: 'insideTopRight' }} />
                  <ReferenceLine y={25} stroke="#ef4444" strokeDasharray="4 3" strokeOpacity={0.45}
                    label={{ value: '25', fill: '#ef4444', fontSize: 8, position: 'insideTopRight' }} />
                  <Area type="monotone" dataKey="value"
                    stroke={risk.hex} strokeWidth={2}
                    fill="url(#vixHistGrad)" dot={false} activeDot={{ r: 3, fill: risk.hex }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
