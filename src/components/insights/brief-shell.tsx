'use client';

import { useState } from 'react';
import { Sparkles, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type BriefResult = {
  headline:  string;
  summary:   string;
  outlook:   string;
  sentiment: 'Bullish' | 'Neutral' | 'Bearish' | 'Volatile';
  keyRisks:  string[];
};

export type BriefFact = { label: string; value: string; tone?: 'up' | 'down' };

const SENTIMENT_STYLE: Record<BriefResult['sentiment'], string> = {
  Bullish:  'bg-up/15 text-up',
  Neutral:  'bg-secondary text-foreground',
  Bearish:  'bg-down/15 text-down',
  Volatile: 'bg-secondary text-foreground',
};

// Shared frame for the India and global briefs. Before generating it shows the real figures the
// brief will be built from, so the card is useful without a click and only one button does the job.
export default function BriefShell({
  title, description, facts, loadingText, available, run,
}: {
  title:       string;
  description: string;
  facts:       BriefFact[];
  loadingText: string;
  available:   boolean;
  run:         () => Promise<BriefResult>;
}) {
  const [state,  setState]  = useState<'idle' | 'loading' | 'done'>('idle');
  const [result, setResult] = useState<BriefResult | null>(null);
  const [error,  setError]  = useState('');

  const generate = async () => {
    setState('loading');
    setError('');
    try {
      setResult(await run());
      setState('done');
    } catch {
      setError("Couldn't generate the brief. Please try again.");
      setState(result ? 'done' : 'idle');
    }
  };

  return (
    <section className="flex h-full flex-col gap-4 rounded-2xl bg-card p-5" aria-label={title}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {state !== 'loading' && (
          <Button
            size="sm"
            variant={state === 'idle' ? 'default' : 'outline'}
            onClick={generate}
            disabled={!available}
            className="shrink-0 gap-1.5"
          >
            {state === 'done'
              ? <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
              : <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />}
            {state === 'done' ? 'Refresh' : 'Generate'}
          </Button>
        )}
      </div>

      {error && <p role="alert" className="text-sm text-down">{error}</p>}

      {state === 'idle' && (
        <>
          <p className="text-sm text-foreground">
            {available
              ? 'Generate a plain-English read on these figures, with the key themes, the near-term outlook and three risks to watch.'
              : 'The brief needs live market data, which is unavailable right now. Please check back shortly.'}
          </p>
          {facts.length > 0 && (
            <dl className="grid flex-1 auto-rows-fr grid-cols-2 gap-2 sm:grid-cols-3">
              {facts.map(fact => (
                <div key={fact.label} className="min-w-0 rounded-lg bg-secondary/50 p-3">
                  <dt className="text-[13px] text-muted-foreground">{fact.label}</dt>
                  <dd className={cn(
                    'mt-0.5 text-sm font-medium tabular-nums',
                    fact.tone === 'up' && 'text-up',
                    fact.tone === 'down' && 'text-down',
                  )}>
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </>
      )}

      {state === 'loading' && (
        <div className="flex flex-col gap-3" role="status" aria-label={loadingText}>
          <p className="text-sm text-muted-foreground">{loadingText}</p>
          <div className="h-5 w-2/3 rounded bg-secondary" />
          <div className="h-4 w-full rounded bg-secondary" />
          <div className="h-4 w-full rounded bg-secondary" />
          <div className="h-4 w-4/5 rounded bg-secondary" />
          <div className="mt-2 h-16 w-full rounded-lg bg-secondary/50" />
        </div>
      )}

      {state === 'done' && result && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3 className="min-w-0 flex-1 text-lg font-semibold leading-snug">{result.headline}</h3>
            <span className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-[13px] font-medium', SENTIMENT_STYLE[result.sentiment])}>
              {result.sentiment}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-foreground">{result.summary}</p>
          <div className="rounded-lg bg-secondary/50 p-4">
            <h4 className="text-sm font-medium">Near-term outlook</h4>
            <p className="mt-1 text-sm leading-relaxed text-foreground">{result.outlook}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium">Key risks to watch</h4>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-foreground marker:text-muted-foreground">
              {result.keyRisks.map(risk => <li key={risk}>{risk}</li>)}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

// The figures a brief will use, taken from the same data the page shows.
export function briefFacts(
  gainers: { name: string; price: number; percentChange: number }[],
  losers:  { name: string; price: number; percentChange: number }[],
  sectors: { name: string; change: number }[],
  headlineCount: number,
): BriefFact[] {
  const pct = (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(2)}%`;
  const tone = (v: number): BriefFact['tone'] => (v > 0 ? 'up' : v < 0 ? 'down' : undefined);
  const facts: BriefFact[] = [];

  const gainer = gainers.find(t => t.price > 0);
  const loser  = losers.find(t => t.price > 0);
  if (gainer) facts.push({ label: `Top gainer: ${gainer.name}`, value: pct(gainer.percentChange), tone: tone(gainer.percentChange) });
  if (loser)  facts.push({ label: `Top loser: ${loser.name}`,  value: pct(loser.percentChange),  tone: tone(loser.percentChange) });

  if (sectors.length > 0) {
    const sorted = [...sectors].sort((a, b) => b.change - a.change);
    const short  = (n: string) => n.replace(/^Nifty\s*/i, '');
    const best   = sorted[0];
    const worst  = sorted[sorted.length - 1];
    facts.push({ label: `Strongest sector: ${short(best.name)}`, value: pct(best.change), tone: tone(best.change) });
    facts.push({ label: `Weakest sector: ${short(worst.name)}`,  value: pct(worst.change), tone: tone(worst.change) });
  }
  if (headlineCount > 0) facts.push({ label: 'Headlines used', value: String(Math.min(headlineCount, 5)) });
  return facts;
}
