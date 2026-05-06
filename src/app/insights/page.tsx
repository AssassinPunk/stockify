import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';
import InsightsTabs from '@/components/insights/insights-tabs';
import {
  fetchLiveIndianIndices,
  fetchIndiaVix,
  fetchLiveNews,
  fetchLiveTrendingTickers,
  fetchLiveInternationalIndices,
  fetchLiveInternationalTrendingTickers,
  fetchLiveInternationalNews,
} from '@/lib/yahoo-finance';
import { getSectors, getInternationalSectors } from '@/lib/data';
import { Lightbulb } from 'lucide-react';

export default async function InsightsPage() {
  const [
    liveIndices, { vixData }, indiaTrending, indiaNews,
    intlIndices, intlTrending, intlNews,
  ] = await Promise.all([
    fetchLiveIndianIndices(),
    fetchIndiaVix(),
    fetchLiveTrendingTickers(),
    fetchLiveNews(),
    fetchLiveInternationalIndices(),
    fetchLiveInternationalTrendingTickers(),
    fetchLiveInternationalNews(),
  ]);

  const nifty50    = liveIndices[0] ?? null;
  const sensex     = liveIndices[1] ?? null;
  const bankNifty  = liveIndices[2] ?? null;
  const sp500      = intlIndices[0] ?? null;
  const nasdaq     = intlIndices[1] ?? null;
  const ftse100    = intlIndices[2] ?? null;

  const indiaSectors = getSectors();
  const intlSectors  = getInternationalSectors();

  const dateLabel = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-6 p-4 md:p-6">

        {/* Page title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Lightbulb className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Market Insights</h1>
          </div>
          <span className="text-xs text-muted-foreground">{dateLabel}</span>
        </div>

        <InsightsTabs
          nifty50={nifty50}
          sensex={sensex}
          bankNifty={bankNifty}
          vixData={vixData}
          indiaGainers={indiaTrending.gainers}
          indiaLosers={indiaTrending.losers}
          indiaSectors={indiaSectors}
          indiaNews={indiaNews}
          sp500={sp500}
          nasdaq={nasdaq}
          ftse100={ftse100}
          intlGainers={intlTrending.gainers}
          intlLosers={intlTrending.losers}
          intlSectors={intlSectors}
          intlNews={intlNews}
        />

      </main>
      <Disclaimer />
    </div>
  );
}
