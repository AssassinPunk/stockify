'use client';

import { useEffect, useState } from 'react';
import { Globe, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatChange, formatNumber } from '@/lib/format';
import { getRiskLevel } from '@/lib/vix';
import AiBriefCard from './ai-brief-card';
import IntlAiBriefCard from './intl-ai-brief-card';
import SectorCard from './sector-card';
import MoversCard from './movers-card';
import NewsDigestCard from './news-digest-card';
import type { IndexData, VixData, Ticker, SectorData, NewsArticle } from '@/lib/types';

// An index that hasn't traded for this long is from an earlier session: this also covers holidays,
// which fixed market hours would miss.
const CLOSED_AFTER_MS = 30 * 60 * 1000;

const money = (value: number) => formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function toneClass(change: number) {
  return change > 0 ? 'text-up' : change < 0 ? 'text-down' : 'text-muted-foreground';
}

function IndexChip({ index }: { index: IndexData }) {
  const hasData = index.value > 0;
  return (
    <div className="min-w-0 rounded-2xl bg-card p-4">
      <p className="text-sm text-muted-foreground">{index.symbol}</p>
      {hasData ? (
        <>
          <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{money(index.value)}</p>
          <p className={cn('mt-0.5 text-sm tabular-nums', toneClass(index.change))}>
            {formatChange(index.change, index.percentChange)}
          </p>
        </>
      ) : (
        <>
          <p className="mt-1 text-2xl font-semibold text-muted-foreground">—</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Unavailable</p>
        </>
      )}
    </div>
  );
}

function VixChip({ vix }: { vix: VixData }) {
  const hasData = vix.value > 0;
  const risk    = getRiskLevel(vix.value);
  return (
    <div className="min-w-0 rounded-2xl bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <p className="whitespace-nowrap text-sm text-muted-foreground">India VIX</p>
        {hasData && (
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold uppercase"
            style={{ color: risk.hex, backgroundColor: `${risk.hex}20` }}
          >
            {risk.level}
          </span>
        )}
      </div>
      {hasData ? (
        <>
          <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight">{money(vix.value)}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Expected volatility</p>
        </>
      ) : (
        <>
          <p className="mt-1 text-2xl font-semibold text-muted-foreground">—</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Unavailable</p>
        </>
      )}
    </div>
  );
}

// Open, closed or unavailable, worked out from when each index last traded.
function MarketStatus({ indices, leadName, sectors }: { indices: (IndexData | null)[]; leadName: string; sectors: SectorData[] }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const live = indices.filter((i): i is IndexData => !!i && i.value > 0);
  if (live.length === 0) {
    return (
      <p role="status" className="text-base text-foreground">
        Market data is unavailable right now. Please check back shortly.
      </p>
    );
  }

  const newest = live.reduce((a, b) => ((a.lastTradeAt ?? 0) >= (b.lastTradeAt ?? 0) ? a : b));
  const closed = now !== null && newest.lastTradeAt !== undefined && now - newest.lastTradeAt * 1000 > CLOSED_AFTER_MS;

  const lead  = live.find(i => i.symbol === leadName) ?? live[0];
  const parts = [
    lead.change === 0
      ? `${lead.symbol} is unchanged.`
      : `${lead.symbol} ${closed ? 'closed' : 'is'} ${lead.change > 0 ? 'up' : 'down'} ${Math.abs(lead.percentChange).toFixed(2)}%.`,
  ];
  if (sectors.length > 1) {
    const sorted = [...sectors].sort((a, b) => b.change - a.change);
    const name   = (s: SectorData) => s.name.replace(/^Nifty\s*/i, '');
    parts.push(`${name(sorted[0])} is the strongest sector and ${name(sorted[sorted.length - 1])} the weakest.`);
  }

  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
      <p className="min-w-0 text-base text-foreground">{parts.join(' ')}</p>
      <p className="text-sm tabular-nums text-muted-foreground">
        {closed ? 'Markets closed. Last session' : 'Updated'} {newest.lastUpdated}
      </p>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
export type InsightsTabsProps = {
  // India
  nifty50:     IndexData | null;
  sensex:      IndexData | null;
  bankNifty:   IndexData | null;
  vixData:     VixData;
  indiaGainers: Ticker[];
  indiaLosers:  Ticker[];
  indiaSectors: SectorData[];
  indiaNews:    NewsArticle[];
  // International
  sp500:       IndexData | null;
  nasdaq:      IndexData | null;
  ftse100:     IndexData | null;
  intlGainers: Ticker[];
  intlLosers:  Ticker[];
  intlSectors: SectorData[];
  intlNews:    NewsArticle[];
};

const TABS = [
  { id: 'india',         label: 'Indian Markets',        Icon: Flag  },
  { id: 'international', label: 'International Markets', Icon: Globe },
] as const;

export default function InsightsTabs(props: InsightsTabsProps) {
  const [tab, setTab] = useState<'india' | 'international'>('india');

  const {
    nifty50, sensex, bankNifty, vixData,
    indiaGainers, indiaLosers, indiaSectors, indiaNews,
    sp500, nasdaq, ftse100,
    intlGainers, intlLosers, intlSectors, intlNews,
  } = props;

  const risk = getRiskLevel(vixData.value);

  return (
    <div className="space-y-4">
      {/* ── Tab switcher ─────────────────────────────────────────────────── */}
      <div role="tablist" aria-label="Market" className="grid w-full grid-cols-2 gap-1 rounded-xl bg-card p-1 sm:w-fit">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              'flex h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-9 sm:px-4',
              tab === id ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="hidden h-3.5 w-3.5 sm:block" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {/* ── India tab ────────────────────────────────────────────────────── */}
      {tab === 'india' && (
        <>
          <MarketStatus indices={[nifty50, sensex, bankNifty]} leadName="NIFTY 50" sectors={indiaSectors} />

          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {nifty50 && <IndexChip index={nifty50} />}
            {sensex && <IndexChip index={sensex} />}
            {bankNifty && <IndexChip index={bankNifty} />}
            <VixChip vix={vixData} />
          </div>

          {/* AI brief + sector */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="min-w-0 xl:col-span-8">
              <AiBriefCard
                nifty={nifty50}
                sensex={sensex}
                bankNifty={bankNifty}
                vix={vixData}
                gainers={indiaGainers}
                losers={indiaLosers}
                sectors={indiaSectors}
                news={indiaNews}
                riskLevel={risk.level}
              />
            </div>
            <div className="min-w-0 xl:col-span-4">
              <SectorCard sectors={indiaSectors} />
            </div>
          </div>

          {/* Movers + news */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-5">
              <MoversCard gainers={indiaGainers} losers={indiaLosers} currency="INR" />
            </div>
            <div className="min-w-0 lg:col-span-7">
              <NewsDigestCard news={indiaNews} />
            </div>
          </div>
        </>
      )}

      {/* ── International tab ────────────────────────────────────────────── */}
      {tab === 'international' && (
        <>
          <MarketStatus indices={[sp500, nasdaq, ftse100]} leadName="S&P 500" sectors={intlSectors} />

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {sp500 && <div className="col-span-2 lg:col-span-1"><IndexChip index={sp500} /></div>}
            {nasdaq && <IndexChip index={nasdaq} />}
            {ftse100 && <IndexChip index={ftse100} />}
          </div>

          {/* AI brief + sector */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
            <div className="min-w-0 xl:col-span-8">
              <IntlAiBriefCard
                sp500={sp500}
                nasdaq={nasdaq}
                ftse100={ftse100}
                gainers={intlGainers}
                losers={intlLosers}
                sectors={intlSectors}
                news={intlNews}
              />
            </div>
            <div className="min-w-0 xl:col-span-4">
              <SectorCard sectors={intlSectors} />
            </div>
          </div>

          {/* Movers + news */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-5">
              <MoversCard gainers={intlGainers} losers={intlLosers} currency="USD" />
            </div>
            <div className="min-w-0 lg:col-span-7">
              <NewsDigestCard news={intlNews} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
