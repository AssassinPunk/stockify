'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Globe, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/format';
import { getRiskLevel } from '@/lib/vix';
import AiBriefCard from './ai-brief-card';
import IntlAiBriefCard from './intl-ai-brief-card';
import SectorCard from './sector-card';
import MoversCard from './movers-card';
import NewsDigestCard from './news-digest-card';
import type { IndexData, VixData, Ticker, SectorData, NewsArticle } from '@/lib/types';

// ── Snapshot pill ─────────────────────────────────────────────────────────────
function SnapshotPill({ label, value, change }: { label: string; value: string; change?: number }) {
  const isUp   = change !== undefined && change >= 0;
  const isDown = change !== undefined && change < 0;
  const Icon   = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
  const color  = isUp ? '#10b981' : isDown ? '#ef4444' : '#a1a1aa';
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-border/50 bg-card/60 px-4 py-2 text-xs backdrop-blur-sm">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="font-mono font-semibold">{value}</span>
      {change !== undefined && (
        <span className="flex items-center gap-1 font-mono" style={{ color }}>
          <Icon className="h-3 w-3" />
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </span>
      )}
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
    <div className="space-y-6">
      {/* ── Tab switcher ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1 rounded-xl bg-secondary/40 p-1 w-fit border border-border/40">
        <button
          onClick={() => setTab('india')}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all',
            tab === 'india'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <Flag className="h-3.5 w-3.5" />
          Indian Markets
        </button>
        <button
          onClick={() => setTab('international')}
          className={cn(
            'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all',
            tab === 'international'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <Globe className="h-3.5 w-3.5" />
          International Markets
        </button>
      </div>

      {/* ── India tab ────────────────────────────────────────────────────── */}
      {tab === 'india' && (
        <>
          {/* Snapshot strip */}
          <div className="flex flex-wrap gap-2">
            {nifty50 && (
              <SnapshotPill
                label="NIFTY 50"
                value={formatNumber(nifty50.value, { maximumFractionDigits: 2 })}
                change={nifty50.percentChange}
              />
            )}
            {sensex && (
              <SnapshotPill
                label="SENSEX"
                value={formatNumber(sensex.value, { maximumFractionDigits: 2 })}
                change={sensex.percentChange}
              />
            )}
            {bankNifty && (
              <SnapshotPill
                label="BANK NIFTY"
                value={formatNumber(bankNifty.value, { maximumFractionDigits: 2 })}
                change={bankNifty.percentChange}
              />
            )}
            {/* VIX pill */}
            <div
              className="flex items-center gap-2.5 rounded-full border bg-card/60 px-4 py-2 text-xs backdrop-blur-sm"
              style={{ borderColor: `${risk.hex}50` }}
            >
              <span className="text-muted-foreground font-medium">INDIA VIX</span>
              <span className="font-mono font-semibold">{vixData.value.toFixed(2)}</span>
              <span
                className="text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5"
                style={{ color: risk.hex, background: `${risk.hex}20` }}
              >
                {risk.level}
              </span>
            </div>
          </div>

          {/* AI brief + sector */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <AiBriefCard
                nifty={nifty50}
                sensex={sensex}
                bankNifty={bankNifty}
                vix={vixData}
                gainers={indiaGainers}
                losers={indiaLosers}
                sectors={indiaSectors}
                news={indiaNews}
                riskHex={risk.hex}
                riskLevel={risk.level}
              />
            </div>
            <div className="lg:col-span-4">
              <SectorCard sectors={indiaSectors} />
            </div>
          </div>

          {/* Movers + news */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <MoversCard gainers={indiaGainers} losers={indiaLosers} currency="INR" />
            </div>
            <div className="lg:col-span-7">
              <NewsDigestCard news={indiaNews} />
            </div>
          </div>
        </>
      )}

      {/* ── International tab ────────────────────────────────────────────── */}
      {tab === 'international' && (
        <>
          {/* Snapshot strip */}
          <div className="flex flex-wrap gap-2">
            {sp500 && (
              <SnapshotPill
                label="S&P 500"
                value={formatNumber(sp500.value, { maximumFractionDigits: 2 })}
                change={sp500.percentChange}
              />
            )}
            {nasdaq && (
              <SnapshotPill
                label="NASDAQ"
                value={formatNumber(nasdaq.value, { maximumFractionDigits: 2 })}
                change={nasdaq.percentChange}
              />
            )}
            {ftse100 && (
              <SnapshotPill
                label="FTSE 100"
                value={formatNumber(ftse100.value, { maximumFractionDigits: 2 })}
                change={ftse100.percentChange}
              />
            )}
          </div>

          {/* AI brief + sector */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-8">
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
            <div className="lg:col-span-4">
              <SectorCard sectors={intlSectors} />
            </div>
          </div>

          {/* Movers + news */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <MoversCard gainers={intlGainers} losers={intlLosers} currency="USD" />
            </div>
            <div className="lg:col-span-7">
              <NewsDigestCard news={intlNews} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
