import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';
import MarketStrip from '@/components/news/market-strip';
import NewsHub from '@/components/news/news-hub';
import {
  fetchIndiaVix,
  fetchLiveIndianIndices,
  fetchLiveInternationalNews,
  fetchLiveNews,
} from '@/lib/yahoo-finance';

export default async function NewsPage() {
  const [indianNews, intlNews, indices, { vixData }] = await Promise.all([
    fetchLiveNews(),
    fetchLiveInternationalNews(),
    fetchLiveIndianIndices(),
    fetchIndiaVix(),
  ]);

  return (
    <div className="flex min-h-svh w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <NewsHub india={indianNews} global={intlNews} strip={<MarketStrip indices={indices} vix={vixData} />} />
      </main>
      <Disclaimer />
    </div>
  );
}
