'use client';

import { generateInternationalBrief } from '@/ai/flows/generate-international-brief';
import type { IndexData, Ticker, SectorData, NewsArticle } from '@/lib/types';
import BriefShell, { briefFacts } from './brief-shell';

export default function IntlAiBriefCard({
  sp500, nasdaq, ftse100, gainers, losers, sectors, news,
}: {
  sp500:   IndexData | null;
  nasdaq:  IndexData | null;
  ftse100: IndexData | null;
  gainers: Ticker[];
  losers:  Ticker[];
  sectors: SectorData[];
  news:    NewsArticle[];
}) {
  return (
    <BriefShell
      title="AI Global Brief"
      description="Today's global markets, analysed by Gemini AI"
      facts={briefFacts(gainers, losers, sectors, news.length)}
      loadingText="Analysing global markets…"
      available={!!sp500 && sp500.value > 0}
      run={() => generateInternationalBrief({
        sp500:   sp500   ? { value: sp500.value,   change: sp500.change,   percentChange: sp500.percentChange }   : { value: 0, change: 0, percentChange: 0 },
        nasdaq:  nasdaq  ? { value: nasdaq.value,  change: nasdaq.change,  percentChange: nasdaq.percentChange }  : { value: 0, change: 0, percentChange: 0 },
        ftse100: ftse100 ? { value: ftse100.value, change: ftse100.change, percentChange: ftse100.percentChange } : { value: 0, change: 0, percentChange: 0 },
        topGainers:    gainers.slice(0, 3).map(g => ({ name: g.name, percentChange: +g.percentChange.toFixed(2) })),
        topLosers:     losers.slice(0, 3).map(l  => ({ name: l.name, percentChange: +l.percentChange.toFixed(2) })),
        topSectors:    sectors.slice(0, 6).map(s  => ({ name: s.name, change: s.change })),
        newsHeadlines: news.slice(0, 5).map(n => n.title),
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      })}
    />
  );
}
