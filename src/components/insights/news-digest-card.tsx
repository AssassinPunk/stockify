'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ExternalLink, RefreshCcw } from 'lucide-react';
import type { NewsArticle } from '@/lib/types';
import { cn } from '@/lib/utils';
import { summarizeMarketNews } from '@/ai/flows/summarize-market-news';

const CATEGORY_STYLE: Record<string, string> = {
  Indices: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
  Stocks:  'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  Macro:   'border-orange-500/30 bg-orange-500/10 text-orange-400',
};

export default function NewsDigestCard({ news }: { news: NewsArticle[] }) {
  const [aiState, setAiState] = useState<'idle' | 'loading' | 'done'>('idle');
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
      setSummary('Unable to summarise news at this time. Please try again later.');
      setAiState('done');
    }
  };

  const reset = () => { setAiState('idle'); setSummary(''); };

  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div>
          <CardTitle className="text-base">News Digest</CardTitle>
          <CardDescription>Latest market headlines</CardDescription>
        </div>
        {aiState === 'idle' && (
          <Button size="sm" variant="outline" onClick={summarize}
            className="shrink-0 gap-1.5 text-xs border-border/50">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI Summary
          </Button>
        )}
        {aiState === 'done' && (
          <Button size="sm" variant="ghost" onClick={reset}
            className="shrink-0 gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <RefreshCcw className="h-3 w-3" />
            Reset
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* AI loading */}
        {aiState === 'loading' && (
          <div className="flex items-center gap-3 rounded-xl bg-primary/5 border border-primary/10 px-4 py-3">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: `${i * 0.18}s` }} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Summarising headlines…</p>
          </div>
        )}

        {/* AI summary result */}
        {aiState === 'done' && summary && (
          <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary/60 mb-2">AI Summary</p>
            <p className="text-xs leading-[1.85] text-foreground/70">{summary}</p>
          </div>
        )}

        {/* Article list */}
        <div className="flex flex-col">
          {news.slice(0, 7).map((article, i) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-start gap-3 py-3 group hover:bg-accent/30 -mx-2 px-2 rounded-lg transition-colors',
                i < news.slice(0, 7).length - 1 && 'border-b border-border/30',
              )}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-muted-foreground">{article.source}</span>
                  <span className="text-[10px] text-muted-foreground/40">·</span>
                  <span className="text-[10px] text-muted-foreground">{article.timestamp}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 mt-0.5">
                <Badge variant="outline"
                  className={cn('text-[9px] h-4 px-1.5 font-normal border', CATEGORY_STYLE[article.category] ?? CATEGORY_STYLE.Macro)}>
                  {article.category}
                </Badge>
                <ExternalLink className="h-3 w-3 text-muted-foreground/25 group-hover:text-muted-foreground/60 transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
