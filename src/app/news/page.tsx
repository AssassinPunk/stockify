import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';
import NewsFeed from '@/components/dashboard/news-feed';
import { fetchLiveNews, fetchLiveInternationalNews } from '@/lib/yahoo-finance';
import { Newspaper } from 'lucide-react';

export default async function NewsPage() {
  const [indianNews, intlNews] = await Promise.all([
    fetchLiveNews(),
    fetchLiveInternationalNews(),
  ]);

  const news = [...indianNews, ...intlNews];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="flex items-center gap-2">
          <Newspaper className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Global News Hub</h1>
        </div>
        <div className="grid grid-cols-1">
          <NewsFeed news={news} />
        </div>
      </main>
      <Disclaimer />
    </div>
  );
}
