'use client';

import { generateMarketBrief } from '@/ai/flows/generate-market-brief';
import type { IndexData, VixData, Ticker, SectorData, NewsArticle } from '@/lib/types';
import { formatNumber } from '@/lib/format';
import BriefShell, { briefFacts } from './brief-shell';

export default function AiBriefCard({
  nifty, sensex, bankNifty, vix, gainers, losers, sectors, news, riskLevel,
}: {
  nifty:     IndexData | null;
  sensex:    IndexData | null;
  bankNifty: IndexData | null;
  vix:       VixData;
  gainers:   Ticker[];
  losers:    Ticker[];
  sectors:   SectorData[];
  news:      NewsArticle[];
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Extreme';
}) {
  const facts = briefFacts(gainers, losers, sectors, news.length);
  if (vix.value > 0) {
    facts.unshift({ label: `India VIX: ${riskLevel.toLowerCase()}`, value: formatNumber(vix.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) });
  }

  return (
    <BriefShell
      title="AI Market Brief"
      description="Today's Indian market, analysed by Gemini AI"
      facts={facts}
      loadingText="Analysing market conditions…"
      available={!!nifty && nifty.value > 0}
      run={() => generateMarketBrief({
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
      })}
    />
  );
}
