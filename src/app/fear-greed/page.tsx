'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';
import FearGreedGauge from '@/components/fear-greed/gauge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCcw, Activity, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FearGreedData, FGIComponent } from '../api/fear-greed/route';

const ZONE_CONFIG = {
  'Extreme Fear': { color: '#dc2626', bg: 'bg-red-600/10',    border: 'border-red-600/25',    bar: 'bg-red-600'    },
  'Fear':         { color: '#f97316', bg: 'bg-orange-500/10', border: 'border-orange-500/25', bar: 'bg-orange-500' },
  'Neutral':      { color: '#eab308', bg: 'bg-yellow-500/10', border: 'border-yellow-500/25', bar: 'bg-yellow-500' },
  'Greed':        { color: '#84cc16', bg: 'bg-lime-500/10',   border: 'border-lime-500/25',   bar: 'bg-lime-500'   },
  'Extreme Greed':{ color: '#22c55e', bg: 'bg-emerald-500/10',border: 'border-emerald-500/25',bar: 'bg-emerald-500'},
} as const;

const WEIGHTS = [30, 30, 25, 15]; // matching the API

function ComponentBar({ c, weight }: { c: FGIComponent; weight: number }) {
  const cfg = ZONE_CONFIG[c.label as keyof typeof ZONE_CONFIG] ?? ZONE_CONFIG['Neutral'];
  return (
    <div className={cn('rounded-xl border p-4', cfg.bg, cfg.border)}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{c.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{c.value}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-lg font-mono font-bold" style={{ color: cfg.color }}>{c.score}</span>
          <p className="text-[10px] font-semibold" style={{ color: cfg.color }}>{c.label}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 w-full rounded-full bg-secondary/60 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-700', cfg.bar)}
          style={{ width: `${c.score}%` }}
        />
      </div>

      <p className="text-[10px] text-muted-foreground/70 mt-2 leading-relaxed">{c.description}</p>
      <p className="text-[10px] text-muted-foreground/40 mt-1">Weight: {weight}%</p>
    </div>
  );
}

const ZONE_DESCRIPTIONS: Record<string, string> = {
  'Extreme Fear':  'Investors are extremely worried. Historically, extreme fear can signal buying opportunities for long-term investors.',
  'Fear':          'The market is showing signs of anxiety. Prices may be undervalued relative to fundamentals.',
  'Neutral':       'Markets are balanced between greed and fear. No strong signal in either direction.',
  'Greed':         'Investors are becoming more risk-seeking. Rally may continue but watch for signs of excess.',
  'Extreme Greed': 'Markets may be overheated. Historically, extreme greed has preceded corrections.',
};

export default function FearGreedPage() {
  const [data,      setData]      = useState<FearGreedData | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setError('');
    try {
      const res  = await fetch('/api/fear-greed', { cache: 'no-store' });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setData(json);
    } catch {
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const cfg = data ? (ZONE_CONFIG[data.label as keyof typeof ZONE_CONFIG] ?? ZONE_CONFIG['Neutral']) : null;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-6 p-4 md:p-6">

        {/* Page header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Activity className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-bold leading-none">Fear &amp; Greed Index</h1>
              <p className="text-xs text-muted-foreground mt-1">India market sentiment composite — updated every 5 minutes</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => load(true)}
            disabled={loading || refreshing}
            className="gap-1.5 text-xs border-border/50"
          >
            <RefreshCcw className={cn('h-3.5 w-3.5', refreshing && 'animate-spin')} />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </Button>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="h-[420px] rounded-2xl border border-border/50 bg-card animate-pulse" />
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 gap-4 sm:grid-cols-2 content-start">
              {[0,1,2,3].map(i => (
                <div key={i} className="h-36 rounded-xl border border-border/50 bg-card animate-pulse" />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-400">{error}</div>
        )}

        {data && !loading && (
          <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

              {/* ── Gauge card ─────────────────────────────────────────── */}
              <div className="lg:col-span-5">
                <Card
                  className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 overflow-hidden h-full"
                  style={{ borderColor: `${cfg!.color}30` }}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full animate-pulse" style={{ background: cfg!.color }} />
                      Today&apos;s Reading
                    </CardTitle>
                    <CardDescription>
                      {data.updatedAt && `Updated ${new Date(data.updatedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-4 pt-2">
                    <FearGreedGauge score={data.score} label={data.label} />

                    {/* Zone description */}
                    <div
                      className="w-full rounded-xl p-4 text-sm leading-relaxed"
                      style={{ background: `${cfg!.color}0d`, border: `1px solid ${cfg!.color}25` }}
                    >
                      <p style={{ color: cfg!.color }} className="text-xs font-semibold uppercase tracking-wider mb-1">
                        What this means
                      </p>
                      <p className="text-foreground/70 text-xs">
                        {ZONE_DESCRIPTIONS[data.label]}
                      </p>
                    </div>

                    {/* Score scale legend */}
                    <div className="w-full flex justify-between text-[9px] text-muted-foreground/50 px-1 font-mono">
                      <span>0<br/>Ext. Fear</span>
                      <span className="text-center">25<br/>Fear</span>
                      <span className="text-center">50<br/>Neutral</span>
                      <span className="text-center">75<br/>Greed</span>
                      <span className="text-right">100<br/>Ext. Greed</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* ── Component breakdown ────────────────────────────────── */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full content-start">
                  {data.components.map((c, i) => (
                    <ComponentBar key={c.name} c={c} weight={WEIGHTS[i] ?? 25} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── How it works explainer ─────────────────────────────────── */}
            <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  How the Index is Calculated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: 'Volatility — 30%', body: 'India VIX from NSE. High VIX = fear, low VIX = greed. The single strongest signal in the composite.' },
                    { title: 'Momentum — 30%', body: 'NIFTY 50 relative to its 50-day moving average. Prices above MA signal bullish sentiment.' },
                    { title: 'Sector Breadth — 25%', body: 'Proportion of Nifty sectors trading positive. Broad rally = healthier market, narrow = suspect.' },
                    { title: 'Safe Haven — 15%', body: 'Gold vs equities 30-day return. Money flowing into gold signals risk-off behavior.' },
                  ].map(item => (
                    <div key={item.title} className="rounded-lg bg-secondary/30 p-3">
                      <p className="text-xs font-semibold text-foreground/80 mb-1">{item.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}

      </main>
      <Disclaimer />
    </div>
  );
}
