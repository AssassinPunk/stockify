'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, ExternalLink, RefreshCcw } from 'lucide-react';
import type { NewsArticle } from '@/lib/types';
import { summarizeMarketNews } from '@/ai/flows/summarize-market-news';

export default function NewsDigestCard({ news }: { news: NewsArticle[] }) {
  const [aiState, setAiState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [summary, setSummary] = useState('');

  const summarize = async () => {
    setAiState('loading');
    try {
      const res = await summarizeMarketNews({
        newsArticles: news.slice(0, 6).map(n => ({
          title:     n.title,
          source:    n.source,
          timestamp: n.timestamp,
          url:       n.url,
        })),
      });
      setSummary(res.summary);
      setAiState('done');
    } catch {
      setAiState('error');
    }
  };

  const reset = () => { setAiState('idle'); setSummary(''); };

  return (
    <section className="flex h-full flex-col gap-3 rounded-2xl bg-card p-5" aria-label="News digest">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base font-semibold">News Digest</h2>
          <p className="text-sm text-muted-foreground">Latest market headlines</p>
        </div>
        {(aiState === 'idle' || aiState === 'error') && news.length > 0 && (
          <Button size="sm" variant="outline" onClick={summarize} className="shrink-0 gap-1.5">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {aiState === 'error' ? 'Try again' : 'AI Summary'}
          </Button>
        )}
        {aiState === 'done' && (
          <Button size="sm" variant="ghost" onClick={reset} className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground">
            <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset
          </Button>
        )}
      </div>

      {aiState === 'error' && (
        <p role="alert" className="text-sm text-down">Couldn&apos;t summarise the news. Please try again.</p>
      )}

      {aiState === 'loading' && (
        <div className="flex flex-col gap-2 rounded-lg bg-secondary/50 p-4" role="status" aria-label="Summarising headlines">
          <p className="text-sm text-muted-foreground">Summarising headlines…</p>
          <div className="h-3.5 w-full rounded bg-secondary" />
          <div className="h-3.5 w-4/5 rounded bg-secondary" />
        </div>
      )}

      {aiState === 'done' && summary && (
        <div className="rounded-lg bg-secondary/50 p-4">
          <h3 className="text-sm font-medium">AI Summary</h3>
          <p className="mt-1 text-sm leading-relaxed text-foreground">{summary}</p>
        </div>
      )}

      {news.length === 0 ? (
        <p className="text-sm text-muted-foreground">News is unavailable right now. Please check back shortly.</p>
      ) : (
        <ul className="divide-y divide-border/60">
          {news.slice(0, 7).map(article => (
            <li key={article.id}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group -mx-2 flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-secondary/40"
              >
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-medium leading-snug group-hover:underline">{article.title}</p>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    {article.source} · {article.timestamp}
                  </p>
                </div>
                {/* The same neutral tag for every category: green and red on this page only ever mean gains and losses. */}
                <span className="mt-0.5 flex shrink-0 items-center gap-2">
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-xs text-foreground">{article.category}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
