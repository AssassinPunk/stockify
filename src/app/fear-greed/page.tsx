'use client';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';
import FearGreedGauge from '@/components/fear-greed/gauge';
import IndicatorPanel from '@/components/fear-greed/indicator-panel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  clockTime, formatPoints, HOW_IT_WORKS, marketStatus, points, ZONE_DESCRIPTIONS, ZONES, zoneColor,
} from '@/lib/fear-greed';
import type { FearGreedData } from '../api/fear-greed/route';

const Bar = ({ className }: { className: string }) => <div className={cn('rounded bg-secondary', className)} />;
const TryAgain = ({ onClick }: { onClick: () => void }) => (
  <button type="button" onClick={onClick} className="font-medium text-foreground underline underline-offset-2">Try again</button>
);

function Scale({ label }: { label: string | null }) {
  return (
    <ul className="grid grid-cols-5 gap-1">
      {ZONES.map(zone => {
        const active = zone.name === label;
        return (
          <li key={zone.name} aria-current={active ? 'true' : undefined} className="min-w-0">
            <div className="h-[3px] rounded-full" style={{ background: label ? zone.color : 'hsl(var(--secondary))', opacity: !label || active ? 1 : 0.32 }} />
            <p className={cn('mt-1.5 text-xs leading-4', active ? 'font-medium text-foreground' : 'text-muted-foreground')}>{zone.name}</p>
            <p className="text-xs leading-4 tabular-nums text-muted-foreground">{zone.range}</p>
          </li>
        );
      })}
    </ul>
  );
}

export default function FearGreedPage() {
  const [data, setData] = useState<FearGreedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [failed, setFailed] = useState(false);
  const [readAt, setReadAt] = useState<Date | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    setFailed(false);
    try {
      const res = await fetch('/api/fear-greed', { cache: 'no-store' });
      const json = await res.json();
      // With no sector data the score cannot be worked out, and it arrives as null.
      if (json.error || typeof json.score !== 'number') throw new Error(json.error ?? 'No score');
      setData(json);
      setReadAt(new Date());
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const missing = data?.components.filter(c => c.usedDefault) ?? [];
  const sum = data?.components.map(c => formatPoints(points(c.score, c.weight))).join(' + ');
  const total = data?.components.reduce((value, c) => value + points(c.score, c.weight), 0);

  return (
    <div className="flex min-h-svh w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-4 p-4 md:p-6" aria-busy={loading}>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4">
          <h1 className="text-2xl font-semibold tracking-tight">Fear &amp; Greed Index</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => load(data !== null)}
            disabled={loading || refreshing}
            className="h-9 flex-none gap-1.5 max-sm:h-11"
          >
            <RefreshCcw className={cn('h-3.5 w-3.5', refreshing && 'motion-safe:animate-spin')} aria-hidden="true" />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </Button>
          <p className="col-span-2 text-sm text-muted-foreground max-sm:mt-1 sm:-mt-3">
            India market sentiment composite
            {data && <><span className="max-sm:hidden"> · </span><span className="text-foreground max-sm:block">{marketStatus(data)}</span></>}
          </p>
        </div>

        {failed && data && readAt && (
          <p role="alert" className="rounded-2xl bg-card px-5 py-3 text-sm text-muted-foreground">
            Couldn&apos;t refresh. Showing the reading taken at {clockTime(readAt)}. <TryAgain onClick={() => load(true)} />
          </p>
        )}
        {missing.length > 0 && (
          <p className="rounded-2xl bg-card px-5 py-3 text-sm text-muted-foreground">
            Treat this reading with care: no data came back for {missing.map(c => c.name).join(', ')}, so {missing.length === 1 ? 'that indicator uses' : 'those indicators use'} a default input.
          </p>
        )}

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <section aria-label="Today's reading" className="flex flex-col rounded-2xl bg-card p-5">
            <h2 className="text-base font-semibold">Today&apos;s Reading</h2>
            <div className="mt-1">
              <FearGreedGauge key={data ? 'reading' : 'empty'} score={data?.score ?? null} label={data?.label ?? null} />
            </div>

            <div className="mt-1 flex min-h-12 flex-wrap items-baseline justify-center gap-x-3 text-center">
              {data ? (
                <>
                  <span className="text-[40px] font-semibold leading-[48px] tracking-tight tabular-nums">{data.score}</span>
                  <span aria-hidden="true" className="text-xl text-muted-foreground">·</span>
                  <span className="text-xl font-semibold tracking-tight" style={{ color: zoneColor(data.label) }}>{data.label}</span>
                </>
              ) : failed ? (
                <p role="alert" className="pt-3 text-sm text-muted-foreground">
                  Couldn&apos;t load today&apos;s reading. <TryAgain onClick={() => load()} />
                </p>
              ) : (
                <Bar className="h-12 w-64 max-w-full" />
              )}
            </div>

            <div className="mt-4"><Scale label={data?.label ?? null} /></div>

            <div className="mt-4 border-t border-border pt-4">
              <h3 className="text-sm font-semibold">What this means</h3>
              {data
                ? <p className="mt-1 text-sm">{ZONE_DESCRIPTIONS[data.label]}</p>
                : failed
                  ? <p className="mt-1 text-sm text-muted-foreground">—</p>
                  : <><Bar className="mt-1.5 h-4 w-full" /><Bar className="mt-1 h-4 w-2/5" /></>}
            </div>
          </section>

          <IndicatorPanel indicators={data?.components ?? null} score={data?.score ?? null} failed={failed} />
        </div>

        <section aria-label="How the Index is Calculated" className="rounded-2xl bg-card p-5">
          <h2 className="text-base font-semibold">How the Index is Calculated</h2>
          {data ? (
            <p className="mt-1 text-sm tabular-nums text-muted-foreground">
              Today: {sum} = {formatPoints(total ?? 0)}, shown as <span className="font-medium text-foreground">{data.score}</span>.
            </p>
          ) : !failed && <Bar className="mt-1.5 h-4 w-96 max-w-full" />}
          <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 xl:grid-cols-4">
            {HOW_IT_WORKS.map(item => (
              <div key={item.title} className="min-w-0">
                <h3 className="flex items-baseline justify-between gap-3 text-sm font-medium">
                  {item.title}
                  <span className="font-normal tabular-nums text-muted-foreground">{item.weight}%</span>
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Disclaimer />
    </div>
  );
}
