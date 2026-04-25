import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';
import AiBriefCard from '@/components/insights/ai-brief-card';
import SectorCard from '@/components/insights/sector-card';
import MoversCard from '@/components/insights/movers-card';
import NewsDigestCard from '@/components/insights/news-digest-card';
import { fetchLiveIndianIndices, fetchIndiaVix, fetchLiveNews, fetchLiveTrendingTickers } from '@/lib/yahoo-finance';
import { getSectors } from '@/lib/data';
import { getRiskLevel } from '@/lib/vix';
import { formatNumber } from '@/lib/format';
import { Lightbulb, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Snapshot pill shown in the live strip ─────────────────────────────────────
function SnapshotPill({
  label, value, change, hex,
}: {
  label: string;
  value: string;
  change?: number;
  hex?: string;
}) {
  const isUp   = change !== undefined && change >= 0;
  const isDown = change !== undefined && change < 0;
  const Icon   = isUp ? TrendingUp : isDown ? TrendingDown : Minus;
  const color  = hex
    ? undefined
    : isUp ? '#10b981' : isDown ? '#ef4444' : '#a1a1aa';

  return (
    <div className="flex items-center gap-2.5 rounded-full border border-border/50 bg-card/60 px-4 py-2 text-xs backdrop-blur-sm">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="font-mono font-semibold">{value}</span>
      {change !== undefined && (
        <span className="flex items-center gap-1 font-mono" style={{ color: color ?? hex }}>
          <Icon className="h-3 w-3" />
          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
        </span>
      )}
      {hex && !change && (
        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: hex }}>
          {label === 'INDIA VIX' ? '' : ''}
        </span>
      )}
    </div>
  );
}

export default async function InsightsPage() {
  const [liveIndices, { vixData }, trending, news] = await Promise.all([
    fetchLiveIndianIndices(),
    fetchIndiaVix(),
    fetchLiveTrendingTickers(),
    fetchLiveNews(),
  ]);

  const sectors  = getSectors();
  const nifty50  = liveIndices[0] ?? null;
  const sensex   = liveIndices[1] ?? null;
  const bankNifty = liveIndices[2] ?? null;
  const risk     = getRiskLevel(vixData.value);

  const dateLabel = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-6 p-4 md:p-6">

        {/* ── Page title ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Lightbulb className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Market Insights</h1>
          </div>
          <span className="text-xs text-muted-foreground">{dateLabel}</span>
        </div>

        {/* ── Live snapshot strip ─────────────────────────────────────────── */}
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
          {/* VIX pill — coloured border + zone label */}
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

        {/* ── Main grid: AI brief (8/12) + sector (4/12) ─────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <AiBriefCard
              nifty={nifty50}
              sensex={sensex}
              bankNifty={bankNifty}
              vix={vixData}
              gainers={trending.gainers}
              losers={trending.losers}
              sectors={sectors}
              news={news}
              riskHex={risk.hex}
              riskLevel={risk.level}
            />
          </div>
          <div className="lg:col-span-4">
            <SectorCard sectors={sectors} />
          </div>
        </div>

        {/* ── Second row: movers (5/12) + news digest (7/12) ─────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <MoversCard gainers={trending.gainers} losers={trending.losers} />
          </div>
          <div className="lg:col-span-7">
            <NewsDigestCard news={news} />
          </div>
        </div>

      </main>
      <Disclaimer />
    </div>
  );
}
