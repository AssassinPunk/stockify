'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FGIComponent } from '@/app/api/fear-greed/route';
import { formatPoints, INDICATOR_NAMES, points, zoneColor } from '@/lib/fear-greed';

const Bar = ({ className }: { className: string }) => <div className={cn('rounded bg-secondary', className)} />;

const Tag = ({ children }: { children: string }) => (
  <span className="flex-none whitespace-nowrap rounded bg-secondary px-1.5 py-0.5 text-xs text-foreground">{children}</span>
);

function IndicatorRow({ indicator }: { indicator: FGIComponent }) {
  const [open, setOpen] = useState(false);
  const earned = points(indicator.score, indicator.weight);
  const color = zoneColor(indicator.label);

  return (
    <li className="flex flex-1 flex-col justify-center py-3">
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex min-w-0 items-center gap-1.5">
          <h3 className="text-sm font-medium">{indicator.name}</h3>
          <button
            type="button"
            onClick={() => setOpen(value => !value)}
            aria-expanded={open}
            aria-label={`About ${indicator.name}`}
            className={cn('-m-1 flex-none p-1 transition-colors hover:text-foreground max-sm:-m-[15px] max-sm:p-[15px]', open ? 'text-foreground' : 'text-muted-foreground')}
          >
            <Info className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
        <p className="flex-none whitespace-nowrap text-sm font-medium tabular-nums">{formatPoints(earned)} pts</p>
      </div>

      <div className="mt-0.5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span className="tabular-nums">{indicator.value}</span>
          {indicator.capped && <Tag>{`Capped at ${indicator.capped}`}</Tag>}
          {indicator.usedDefault && <Tag>No data, default used</Tag>}
        </div>
        <p className="flex-none whitespace-nowrap text-sm tabular-nums text-muted-foreground">{indicator.score} × {indicator.weight}%</p>
      </div>

      <div className="mt-2 flex items-center gap-3">
        <div className="relative h-1.5 min-w-0 flex-1 rounded-full bg-secondary">
          <div
            className="h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none"
            style={{ width: `${indicator.score}%`, background: color }}
          />
          {indicator.capped && <span aria-hidden="true" className={cn('absolute -top-[3px] h-3 w-0.5 bg-foreground', indicator.score === 0 ? 'left-0' : 'right-0')} />}
        </div>
        <p className="w-24 flex-none text-right text-xs font-medium" style={{ color }}>{indicator.label}</p>
      </div>

      {open && (
        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
          <p>{indicator.description}</p>
          {indicator.capped && <p>{indicator.value} is past the {indicator.capped} end of this scale, so it scores {indicator.score}.</p>}
        </div>
      )}
    </li>
  );
}

const SkeletonRow = ({ name, failed }: { name: string; failed: boolean }) => (
  <li className="flex flex-1 flex-col justify-center py-3">
    <div className="flex items-baseline justify-between gap-3">
      <h3 className="text-sm font-medium">{name}</h3>
      {failed ? <span className="text-sm text-muted-foreground">—</span> : <Bar className="h-4 w-14" />}
    </div>
    {failed
      ? <div className="mt-3 h-1.5 rounded-full bg-secondary" />
      : <><Bar className="mt-1.5 h-4 w-40" /><Bar className="mt-2.5 h-1.5 w-full" /></>}
  </li>
);

export default function IndicatorPanel({
  indicators, score, failed,
}: {
  indicators: FGIComponent[] | null;
  score: number | null;
  failed: boolean;
}) {
  const total = indicators?.reduce((sum, item) => sum + points(item.score, item.weight), 0);

  return (
    <section aria-label="Indicators" className="flex flex-col rounded-2xl bg-card px-5 pb-3 pt-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold">Indicators</h2>
        <p className="text-xs text-muted-foreground">Score × weight = points</p>
      </div>
      <ul className="mt-1 flex flex-1 flex-col divide-y divide-border/60">
        {indicators
          ? indicators.map(item => <IndicatorRow key={item.name} indicator={item} />)
          : INDICATOR_NAMES.map(name => <SkeletonRow key={name} name={name} failed={failed} />)}
      </ul>
      <div className="flex items-baseline justify-between gap-3 border-t border-border py-3 text-sm">
        <p className="text-muted-foreground">
          {score !== null ? <>Index score, rounded to <span className="font-medium text-foreground tabular-nums">{score}</span></> : 'Index score'}
        </p>
        {total !== undefined
          ? <p className="font-medium tabular-nums">{formatPoints(total)} pts</p>
          : failed ? <p className="text-muted-foreground">—</p> : <Bar className="h-4 w-16" />}
      </div>
    </section>
  );
}
