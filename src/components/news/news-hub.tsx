'use client';

import { useEffect, useMemo, useRef, useState, useTransition, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { NewsArticle } from '@/lib/types';
import {
  displayTitle, isPageTitle, mergeDesks, pickLead, shortAge, wireOrder,
  type Desk, type DeskStory,
} from '@/lib/news';

const FILTERS = ['All', 'Indices', 'Stocks', 'Macro'] as const;
type Filter = (typeof FILTERS)[number];

const LAST_VISIT_KEY = 'stockify_news_last_visit';
const REFRESH_EVERY_MS = 5 * 60 * 1000;

const plural = (count: number, noun: string) => `${count} ${noun}${count === 1 ? '' : 's'}`;

// The same neutral tag as the Insights page: green and red here only ever mean gains and losses.
function CategoryTag({ category }: { category: string }) {
  return <span className="flex-none whitespace-nowrap rounded bg-secondary px-1.5 py-0.5 text-xs text-foreground">{category}</span>;
}

function NewMark() {
  return (
    <span className="flex flex-none items-center gap-1.5 text-xs font-medium text-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-foreground" aria-hidden="true" />
      New
    </span>
  );
}

function StoryMeta({ story, isNew, withTime = false }: { story: DeskStory; isNew: boolean; withTime?: boolean }) {
  return (
    <span className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-foreground">
      <span className="min-w-0">{story.source}{withTime && ` · ${story.timestamp}`}</span>
      {isPageTitle(story.title) && <span className="flex-none">Live page</span>}
      <CategoryTag category={story.category} />
      {isNew && <NewMark />}
    </span>
  );
}

function WireRow({ story, isNew, level = false }: { story: DeskStory; isNew: boolean; level?: boolean }) {
  const pageTitle = isPageTitle(story.title);
  return (
    <li>
      <a
        href={story.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group -mx-2 grid grid-cols-[32px_minmax(0,1fr)_14px] gap-x-3 rounded-lg px-2 py-3 transition-colors hover:bg-secondary/40 active:bg-secondary/60"
      >
        <span className="pt-px text-[13px] tabular-nums text-muted-foreground" title={story.timestamp}>
          <span aria-hidden="true">{shortAge(story.timestamp)}</span>
          <span className="sr-only">{story.timestamp}</span>
        </span>
        <span className={cn('block min-w-0', level && 'xl:min-h-[66px]')}>
          <span className={cn('block text-sm leading-snug group-hover:underline', pageTitle ? 'text-muted-foreground' : 'font-medium text-foreground')}>
            {displayTitle(story.title)}
          </span>
          <StoryMeta story={story} isNew={isNew} />
        </span>
        <ExternalLink className="mt-0.5 h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-foreground" aria-hidden="true" />
        <span className="sr-only">Opens {story.source} in a new tab</span>
      </a>
    </li>
  );
}

function TopStory({ story, isNew }: { story: DeskStory; isNew: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const showImage = Boolean(story.image) && !imageFailed;
  return (
    <a
      href={story.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-4 rounded-lg sm:flex-row-reverse sm:items-start"
    >
      {showImage && (
        // Publishers' image hosts vary, so this stays a plain img rather than next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={story.image}
          alt=""
          // A picture that failed before the page hydrated never fires onError, so check on mount too.
          ref={image => {
            if (!image?.complete) return;
            if (image.naturalWidth === 0) setImageFailed(true);
            else setImageLoaded(true);
          }}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageFailed(true)}
          className={cn('aspect-video w-full flex-none rounded-lg bg-secondary object-cover sm:w-48', !imageLoaded && 'opacity-0')}
        />
      )}
      <span className="block min-w-0 flex-1">
        <span className="block text-[22px] font-semibold leading-tight tracking-tight text-foreground group-hover:underline sm:text-[28px]">
          {story.title}
        </span>
        <StoryMeta story={story} isNew={isNew} withTime />
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
          Read on {story.source}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </span>
      </span>
    </a>
  );
}

function DeskColumn({
  desk, stories, filter, feedFailed, isNew, onRetry,
}: {
  desk: Desk;
  stories: DeskStory[];
  filter: Filter;
  feedFailed: boolean;
  isNew: (story: DeskStory) => boolean;
  onRetry: () => void;
}) {
  return (
    <section aria-label={`${desk} desk`} className="min-w-0 rounded-2xl bg-card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold">{desk} desk</h2>
        {!feedFailed && <span className="text-[13px] tabular-nums text-muted-foreground">{stories.length} more</span>}
      </div>
      {feedFailed ? (
        <p role="alert" className="mt-3 text-sm text-muted-foreground">
          Couldn&apos;t load the {desk} feed.{' '}
          <button type="button" onClick={onRetry} className="font-medium text-foreground underline underline-offset-2">Try again</button>
        </p>
      ) : stories.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          No more {filter === 'All' ? '' : `${filter} `}news from the {desk} desk right now.
        </p>
      ) : (
        <ul className="mt-2 divide-y divide-border/60">
          {stories.map(story => <WireRow key={story.id} story={story} isNew={isNew(story)} level />)}
        </ul>
      )}
    </section>
  );
}

export default function NewsHub({ india, global, strip }: { india: NewsArticle[]; global: NewsArticle[]; strip: ReactNode }) {
  const router = useRouter();
  const [refreshing, startRefresh] = useTransition();
  const [filter, setFilter] = useState<Filter>('All');
  const [lastVisit, setLastVisit] = useState<number | null>(null);
  const visitRead = useRef(false);

  const refresh = () => startRefresh(() => router.refresh());

  // What counts as new is measured against the previous visit, which stays fixed while this one lasts.
  useEffect(() => {
    if (visitRead.current) return;
    visitRead.current = true;
    try {
      const stored = Number(localStorage.getItem(LAST_VISIT_KEY));
      if (stored > 0) setLastVisit(stored);
      localStorage.setItem(LAST_VISIT_KEY, String(Math.floor(Date.now() / 1000)));
    } catch {}
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') startRefresh(() => router.refresh());
    }, REFRESH_EVERY_MS);
    return () => clearInterval(id);
  }, [router]);

  const stories = useMemo(() => mergeDesks(india, global), [india, global]);
  const counts = useMemo(() => ({
    All:     stories.length,
    Indices: stories.filter(s => s.category === 'Indices').length,
    Stocks:  stories.filter(s => s.category === 'Stocks').length,
    Macro:   stories.filter(s => s.category === 'Macro').length,
  }), [stories]);

  const inView = useMemo(
    () => (filter === 'All' ? stories : stories.filter(s => s.category === filter)),
    [stories, filter],
  );
  const { top, next, rest } = useMemo(() => pickLead(inView), [inView]);

  const isNew = (story: DeskStory) =>
    lastVisit !== null && story.publishedAt !== undefined && story.publishedAt > lastVisit;

  const newCount = inView.filter(isNew).length;
  const sourceCount = new Set(inView.map(s => s.source)).size;
  const newest = inView.find(s => s.publishedAt !== undefined) ?? inView[0];
  const nothingLoaded = stories.length === 0;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight">Global News Hub</h1>
          {!nothingLoaded && (
            <p className="mt-1 text-sm text-muted-foreground">
              {inView.length > 0
                ? <>{inView.length} {inView.length === 1 ? 'story' : 'stories'} from {plural(sourceCount, 'source')}. Latest {newest.timestamp.toLowerCase()}.</>
                : <>0 of {stories.length} stories are {filter}.</>}
              {newCount > 0 && <span className="text-foreground"> {newCount} new since your last visit.</span>}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={refresh} disabled={refreshing} className="h-9 flex-none gap-1.5 max-sm:h-11">
          <RefreshCcw className={cn('h-3.5 w-3.5', refreshing && 'motion-safe:animate-spin')} aria-hidden="true" />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </Button>
      </div>

      {strip}

      <Tabs value={filter} onValueChange={value => setFilter(value as Filter)}>
        <TabsList className="grid h-auto w-full grid-cols-4 justify-start rounded-none border-b border-border bg-transparent p-0 sm:flex sm:gap-6">
          {FILTERS.map(name => (
            <TabsTrigger
              key={name}
              value={name}
              className="-mb-px min-h-11 rounded-none border-b border-transparent bg-transparent px-0 pb-2.5 pt-2 text-sm text-muted-foreground shadow-none hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none sm:min-h-0"
            >
              {name}
              <span className="ml-1.5 text-[13px] font-normal tabular-nums text-muted-foreground">{counts[name]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={filter} tabIndex={-1} className="mt-4 space-y-4">
          {nothingLoaded ? (
            <section className="rounded-2xl bg-card p-5" aria-label="News">
              <h2 className="text-base font-semibold">News feeds</h2>
              <p role="alert" className="mt-2 text-sm text-muted-foreground">
                Couldn&apos;t load the news feeds.{' '}
                <button type="button" onClick={refresh} className="font-medium text-foreground underline underline-offset-2">Try again</button>
              </p>
            </section>
          ) : inView.length === 0 ? (
            <section className="rounded-2xl bg-card p-5" aria-label={`${filter} news`}>
              <h2 className="text-base font-semibold">{filter} news</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                No {filter} news right now.{' '}
                <button type="button" onClick={() => setFilter('All')} className="font-medium text-foreground underline underline-offset-2">Show all news</button>
              </p>
            </section>
          ) : (
            <>
              {top && (
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 rounded-2xl bg-card p-5 xl:grid-cols-12">
                  <section aria-label="Top story" className={cn('min-w-0', next.length > 0 ? 'xl:col-span-7' : 'xl:col-span-12')}>
                    <h2 className="mb-3 text-base font-semibold">Top story</h2>
                    <TopStory key={top.id} story={top} isNew={isNew(top)} />
                  </section>
                  {next.length > 0 && (
                    <section aria-label="Next up" className="min-w-0 xl:col-span-5">
                      <h2 className="text-base font-semibold">Next up</h2>
                      <ul className="mt-1 divide-y divide-border/60">
                        {next.map(story => <WireRow key={story.id} story={story} isNew={isNew(story)} />)}
                      </ul>
                    </section>
                  )}
                </div>
              )}

              {rest.length > 0 && (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {(['India', 'Global'] as const).map(desk => (
                    <DeskColumn
                      key={desk}
                      desk={desk}
                      stories={wireOrder(rest.filter(s => s.desk === desk))}
                      filter={filter}
                      feedFailed={(desk === 'India' ? india : global).length === 0}
                      isNew={isNew}
                      onRetry={refresh}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
