import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { IndexData, VixData } from '@/lib/types';

const value = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const signed = (n: number) => `${n > 0 ? '+' : n < 0 ? '-' : ''}${value(Math.abs(n))}`;

const CELL = 'flex min-w-0 items-baseline justify-between gap-x-3 gap-y-0.5 px-5 py-3 sm:block';

function IndexCell({ label, data }: { label: string; data?: IndexData }) {
  const hasData = Boolean(data && data.value > 0);
  const body = (
    <>
      <span className="block text-sm text-muted-foreground">{label}</span>
      <span className="block text-right sm:mt-0.5 sm:text-left">
        <span className={cn('text-base font-semibold tabular-nums', !hasData && 'font-normal text-muted-foreground')}>
          {hasData ? value(data!.value) : '—'}
        </span>
        {hasData ? (
          <span
            className={cn(
              'ml-2 whitespace-nowrap text-[13px] tabular-nums',
              data!.change > 0 ? 'text-up' : data!.change < 0 ? 'text-down' : 'text-muted-foreground',
            )}
          >
            {signed(data!.percentChange)}%
          </span>
        ) : (
          <span className="ml-2 text-[13px] text-muted-foreground">Unavailable</span>
        )}
      </span>
    </>
  );
  return (
    <Link href={`/stock/${encodeURIComponent(label)}`} className={cn(CELL, 'transition-colors hover:bg-secondary/40')}>
      {body}
    </Link>
  );
}

// Three figures in one divided container, so they read as one line of the market rather than three cards.
export default function MarketStrip({ indices, vix }: { indices: IndexData[]; vix: VixData }) {
  const hasVix = vix.value > 0;
  return (
    <section
      aria-label="Market snapshot, change from previous close"
      className="grid grid-cols-1 divide-y divide-border/60 overflow-hidden rounded-2xl bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0"
    >
      <IndexCell label="NIFTY 50" data={indices.find(i => i.symbol === 'NIFTY 50')} />
      <IndexCell label="SENSEX" data={indices.find(i => i.symbol === 'SENSEX')} />
      <div className={CELL}>
        <span className="block text-sm text-muted-foreground">India VIX</span>
        <span className="block text-right sm:mt-0.5 sm:text-left">
          <span className={cn('text-base font-semibold tabular-nums', !hasVix && 'font-normal text-muted-foreground')}>
            {hasVix ? value(vix.value) : '—'}
          </span>
          <span className="ml-2 text-[13px] text-muted-foreground">{hasVix ? 'Expected volatility' : 'Unavailable'}</span>
        </span>
      </div>
    </section>
  );
}
