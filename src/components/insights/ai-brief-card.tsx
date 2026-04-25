'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCcw, TrendingUp, TrendingDown, Minus, AlertTriangle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateMarketBrief } from '@/ai/flows/generate-market-brief';
import type { MarketBriefOutput } from '@/ai/flows/generate-market-brief';
import type { IndexData, VixData, Ticker, SectorData, NewsArticle } from '@/lib/types';

const SENTIMENT_CONFIG = {
  Bullish:  { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', Icon: TrendingUp },
  Neutral:  { color: 'text-yellow-400',  bg: 'bg-yellow-400/10',  border: 'border-yellow-400/20',  Icon: Minus },
  Bearish:  { color: 'text-red-400',     bg: 'bg-red-400/10',     border: 'border-red-400/20',     Icon: TrendingDown },
  Volatile: { color: 'text-orange-400',  bg: 'bg-orange-400/10',  border: 'border-orange-400/20',  Icon: AlertTriangle },
};

export default function AiBriefCard({
  nifty, sensex, bankNifty, vix, gainers, losers, sectors, news, riskHex, riskLevel,
}: {
  nifty:     IndexData | null;
  sensex:    IndexData | null;
  bankNifty: IndexData | null;
  vix:       VixData;
  gainers:   Ticker[];
  losers:    Ticker[];
  sectors:   SectorData[];
  news:      NewsArticle[];
  riskHex:   string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Extreme';
}) {
  const [state,  setState]  = useState<'idle' | 'loading' | 'done'>('idle');
  const [result, setResult] = useState<MarketBriefOutput | null>(null);
  const [error,  setError]  = useState('');

  const generate = async () => {
    setState('loading');
    setError('');
    try {
      const res = await generateMarketBrief({
        nifty:     nifty     ? { value: nifty.value,     change: nifty.change,     percentChange: nifty.percentChange }     : { value: 0, change: 0, percentChange: 0 },
        sensex:    sensex    ? { value: sensex.value,    change: sensex.change,    percentChange: sensex.percentChange }    : { value: 0, change: 0, percentChange: 0 },
        bankNifty: bankNifty ? { value: bankNifty.value, change: bankNifty.change, percentChange: bankNifty.percentChange } : { value: 0, change: 0, percentChange: 0 },
        vix:       vix.value,
        vixZone:   riskLevel,
        topGainers:    gainers.slice(0, 3).map(g => ({ name: g.name, percentChange: +g.percentChange.toFixed(2) })),
        topLosers:     losers.slice(0, 3).map(l  => ({ name: l.name, percentChange: +l.percentChange.toFixed(2) })),
        topSectors:    sectors.slice(0, 6).map(s => ({ name: s.name, change: s.change })),
        newsHeadlines: news.slice(0, 5).map(n => n.title),
        date: new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      });
      setResult(res);
      setState('done');
    } catch {
      setError('Unable to generate analysis. Please try again later.');
      setState('idle');
    }
  };

  const sentimentCfg = result ? SENTIMENT_CONFIG[result.sentiment] : null;

  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 overflow-hidden h-full flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4" style={{ color: riskHex }} />
            AI Market Brief
          </CardTitle>
          <CardDescription className="mt-0.5">Real-time analysis powered by Gemini AI</CardDescription>
        </div>
        {state !== 'loading' && (
          <Button
            size="sm"
            variant={state === 'idle' ? 'default' : 'outline'}
            onClick={generate}
            className="shrink-0 gap-1.5 text-xs border-border/50"
          >
            {state === 'done'
              ? <><RefreshCcw className="h-3 w-3" /> Refresh</>
              : <><Sparkles className="h-3.5 w-3.5" /> Generate</>
            }
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* ── Idle ── */}
        {state === 'idle' && (
          <div
            className="flex-1 flex flex-col items-center justify-center gap-4 py-14 rounded-xl text-center"
            style={{ background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${riskHex}12 0%, transparent 70%)` }}
          >
            <div className="rounded-full p-4 bg-white/[0.03] border border-white/[0.06]">
              <Sparkles className="h-8 w-8 text-white/20" />
            </div>
            <div className="max-w-xs">
              <p className="text-sm font-medium text-foreground/50 mb-1.5">Daily Intelligence Report</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Get an AI breakdown of today's market conditions, key themes, and risks — all in plain English.
              </p>
            </div>
            <Button onClick={generate} size="sm" className="mt-1 gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Generate Analysis
            </Button>
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>
        )}

        {/* ── Loading ── */}
        {state === 'loading' && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-14">
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="h-2 w-2 rounded-full animate-bounce"
                  style={{ background: riskHex, animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Analysing market conditions…</p>
          </div>
        )}

        {/* ── Done ── */}
        {state === 'done' && result && (() => {
          const cfg = SENTIMENT_CONFIG[result.sentiment];
          const { Icon } = cfg;
          return (
            <div className="flex flex-col gap-5">
              {/* Headline + sentiment badge */}
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-bold leading-snug flex-1">{result.headline}</h2>
                <span className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold',
                  cfg.color, cfg.bg, cfg.border,
                )}>
                  <Icon className="h-3 w-3" />
                  {result.sentiment}
                </span>
              </div>

              {/* Summary */}
              <p className="text-sm text-muted-foreground leading-relaxed">{result.summary}</p>

              <div className="h-px bg-border/40" />

              {/* Outlook */}
              <div className="rounded-xl p-4" style={{ background: `${riskHex}0f`, border: `1px solid ${riskHex}25` }}>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] mb-1.5" style={{ color: riskHex }}>
                  Near-Term Outlook
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">{result.outlook}</p>
              </div>

              {/* Key risks */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/60 mb-3">
                  Key Risks to Watch
                </p>
                <div className="flex flex-col gap-2">
                  {result.keyRisks.map((risk, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <ChevronRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-orange-400" />
                      <p className="text-xs text-muted-foreground leading-relaxed">{risk}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </CardContent>
    </Card>
  );
}
