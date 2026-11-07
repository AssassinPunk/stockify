'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@/lib/calendar-data';
import {
  countdown, countdownFigure, countdownPhrase, formatDay, formatWeek, groupByWeek, matchesImpact, matchesPeriod,
  matchesRegion, periodWords, pickNext, shortDay, sortEvents, weekName, weekOf,
  type ImpactFilter, type Period, type RegionFilter, type TrackedEvent,
} from '@/lib/calendar';
import { CategoryTag, ImpactLabel, RegionCode } from './event-marks';
import EventRunway from './event-runway';

const REGIONS: { value: RegionFilter; label: string }[] = [
  { value: 'All', label: 'All' },
  { value: 'India', label: 'India Markets' },
  { value: 'International', label: 'International' },
];
const IMPACTS: CalendarEvent['impact'][] = ['High', 'Medium', 'Low'];
const ROW_CAP = 12;
const URGENT_DAYS = 7;

const plural = (count: number, noun: string) => `${count} ${noun}${count === 1 ? '' : 's'}`;

// A high-impact event inside a week is the only countdown in the data hue; the rest step down to grey.
const whenTone = (event: TrackedEvent) =>
  event.diff > URGENT_DAYS
    ? 'text-muted-foreground'
    : event.impact === 'High' ? 'font-medium text-amber-400' : 'font-medium text-foreground';

function Description({ text }: { text?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [clamped, setClamped] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || open) return;
    const measure = () => setClamped(element.scrollWidth > element.clientWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [open, text]);

  if (!text) return null;
  // The text element stays mounted whether or not it is clamped, so the size observer keeps watching it.
  return (
    <div className="group relative mt-0.5 flex items-start gap-1 text-sm text-muted-foreground">
      <span ref={ref} className={cn('min-w-0 group-has-[button:hover]:text-foreground', !open && 'truncate')} title={clamped && !open ? text : undefined}>{text}</span>
      {(clamped || open) && (
        <button
          type="button"
          onClick={() => setOpen(value => !value)}
          aria-expanded={open}
          aria-label={open ? 'Show less' : 'Show full description'}
          className="flex-none transition-colors after:absolute after:inset-0 hover:text-foreground"
        >
          <ChevronDown className={cn('mt-[3px] h-3.5 w-3.5 transition-transform', open && 'rotate-180')} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

// Below xl a row is three lines (title and countdown, description, then the facts); from xl each fact
// takes its own column, so `xl:contents` lets the same elements land on the same grid.
function EventRow({ event }: { event: TrackedEvent }) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 py-3 xl:grid-cols-[88px_84px_28px_minmax(0,1fr)_104px_72px] xl:gap-x-4">
      <p className="min-w-0 text-sm font-medium xl:col-start-4 xl:row-start-1">{event.title}</p>
      <p className={cn('whitespace-nowrap text-right text-sm tabular-nums xl:col-start-2 xl:row-start-1 xl:text-left', whenTone(event))}>
        {countdown(event.diff)}
      </p>
      <div className="col-span-2 min-w-0 xl:col-span-1 xl:col-start-4 xl:row-start-2"><Description text={event.description} /></div>
      <div className="col-span-2 mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 xl:contents">
        <p className="text-sm tabular-nums xl:col-start-1 xl:row-start-1">{formatDay(event.date)}</p>
        <RegionCode event={event} className="xl:col-start-3 xl:row-start-1 xl:pt-0.5" />
        <span className="flex xl:col-start-5 xl:row-start-1 xl:items-start"><CategoryTag category={event.category} /></span>
        <ImpactLabel impact={event.impact} className="xl:col-start-6 xl:row-start-1 xl:h-5" />
      </div>
    </li>
  );
}

function NextUp({ events, region }: { events: TrackedEvent[]; region: RegionFilter }) {
  const { next, after } = useMemo(() => pickNext(events), [events]);
  const scope = region === 'All' ? '' : `${region} `;

  if (next.length === 0) {
    return (
      <section aria-label="Next high-impact event" className="rounded-2xl bg-card p-5">
        <h2 className="text-base font-semibold">Next high-impact event</h2>
        <p className="mt-2 text-sm text-muted-foreground">No high-impact {scope}events are listed in the next 6 months.</p>
      </section>
    );
  }

  const lead = next[0];
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-5 rounded-2xl bg-card p-5 xl:grid-cols-12">
      <section aria-label="Next high-impact event" className={cn('min-w-0', after.length > 0 ? 'xl:col-span-7' : 'xl:col-span-12')}>
        <h2 className="text-base font-semibold">Next high-impact event</h2>
        <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-[auto_minmax(0,1fr)]">
          <div className="flex items-baseline gap-3 sm:block">
            <p className={cn('text-[32px] font-semibold leading-9 tracking-tight tabular-nums', lead.diff <= URGENT_DAYS && 'text-amber-400')}>
              {countdownFigure(lead.diff)}
            </p>
            <p className="text-sm tabular-nums text-muted-foreground sm:mt-1">{formatDay(lead.date)}</p>
          </div>
          <ul className="min-w-0 space-y-3">
            {next.map(event => (
              <li key={event.id} className="min-w-0">
                <p className="text-xl font-semibold leading-7 tracking-tight">{event.title}</p>
                {event.description && <p className="mt-0.5 text-sm text-muted-foreground">{event.description}</p>}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <RegionCode event={event} />
                  <CategoryTag category={event.category} />
                  <ImpactLabel impact={event.impact} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* The list below carries the same events straight after this block on a phone, so this stays off there. */}
      {after.length > 0 && (
        <section aria-label="After that" className="hidden min-w-0 sm:block xl:col-span-5">
          <h2 className="text-base font-semibold">After that</h2>
          <ul className="mt-1 divide-y divide-border/60">
            {after.map(event => (
              <li key={event.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 py-2">
                <p className="truncate text-sm font-medium" title={event.title}>{event.title}</p>
                <p className={cn('whitespace-nowrap text-right text-sm tabular-nums', whenTone(event))}>{countdown(event.diff)}</p>
                <p className="flex items-center gap-2 text-xs tabular-nums text-muted-foreground">
                  {formatDay(event.date)} <RegionCode event={event} />
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function FilterToggle({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        'min-h-11 flex-none whitespace-nowrap border-b text-sm transition-colors hover:text-foreground xl:min-h-0 xl:pb-2.5 xl:pt-2',
        pressed ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground',
      )}
    >
      {children}
    </button>
  );
}

const FilterCount = ({ value }: { value: number }) => (
  <span className="ml-1.5 text-xs font-normal tabular-nums text-muted-foreground">{value}</span>
);

export default function EventTracker({ events, today, footnote }: { events: TrackedEvent[]; today: string; footnote: ReactNode }) {
  const [region, setRegion] = useState<RegionFilter>('All');
  const [impact, setImpact] = useState<ImpactFilter>(null);
  const [period, setPeriod] = useState<Period>('all');
  const [showAll, setShowAll] = useState(false);

  const sorted = useMemo(() => sortEvents(events), [events]);
  const thisWeek = `week:${weekOf(today)}`;
  const inPeriod = (e: TrackedEvent) => matchesPeriod(e, period, today);

  const inRegion = sorted.filter(e => matchesRegion(e, region));
  const inView = inRegion.filter(e => matchesImpact(e, impact) && inPeriod(e));
  const regionCount = (value: RegionFilter) =>
    sorted.filter(e => matchesRegion(e, value) && matchesImpact(e, impact) && inPeriod(e)).length;
  const impactCount = (value: CalendarEvent['impact']) =>
    inRegion.filter(e => e.impact === value && inPeriod(e)).length;

  // Whole weeks only: the list never stops halfway through one.
  const groups = groupByWeek(inView);
  const capped = period === 'all' && !showAll;
  const shownGroups: typeof groups = [];
  let shownRows = 0;
  for (const group of groups) {
    if (capped && shownRows >= ROW_CAP) break;
    shownGroups.push(group);
    shownRows += group.rows.length;
  }

  const { next } = pickNext(inRegion);
  const lead = next[0];
  const highSoon = inRegion.filter(e => e.impact === 'High' && e.diff <= 30).length;
  const filtered = region !== 'All' || impact !== null || period !== 'all';
  const clear = () => { setRegion('All'); setImpact(null); setPeriod('all'); };
  const pickedWeek = period.startsWith('week:') && period !== thisWeek ? period.slice(5) : null;

  const emptyWords = `No ${impact ? `${impact}-impact ` : ''}${region === 'All' ? '' : `${region} `}events ${periodWords(period, today)}.`;
  const nextMatch = inRegion.find(e => matchesImpact(e, impact));

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Economic Calendar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {lead
            ? <><span className="text-foreground">{lead.title}</span> is next, {countdownPhrase(lead.diff)}. {plural(highSoon, 'high-impact event')} in the next 30 days.</>
            : <>No high-impact {region === 'All' ? '' : `${region} `}events are listed in the next 6 months.</>}
        </p>
      </div>

      <Tabs value={region} onValueChange={value => setRegion(value as RegionFilter)}>
        <TabsList className="grid h-auto w-full grid-cols-3 justify-start rounded-none border-b border-border bg-transparent p-0 sm:flex sm:gap-6">
          {REGIONS.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="-mb-px min-h-11 rounded-none border-b border-transparent bg-transparent px-0 pb-2.5 pt-2 text-sm text-muted-foreground shadow-none hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none sm:min-h-0"
            >
              {label}
              <FilterCount value={regionCount(value)} />
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={region} tabIndex={-1} className="mt-4 space-y-4">
          <NextUp events={inRegion} region={region} />

          <EventRunway
            events={sorted}
            region={region}
            impact={impact}
            period={period}
            today={today}
            onPickWeek={week => setPeriod(current => (current === `week:${week}` ? 'all' : `week:${week}`))}
          />

          <section aria-label="Upcoming events" className="rounded-2xl bg-card px-5 pb-3 pt-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h2 className="text-base font-semibold">Upcoming events</h2>
              <p className="flex items-baseline gap-3 text-xs tabular-nums text-muted-foreground" aria-live="polite">
                {capped && shownRows < inView.length ? `${shownRows} of ${inView.length} events` : plural(inView.length, 'event')}
                {filtered && (
                  <button type="button" onClick={clear} className="font-medium text-foreground underline underline-offset-2">Clear filters</button>
                )}
              </p>
            </div>

            <div className="-mx-1 mt-2 flex items-center gap-x-3 overflow-x-auto border-b border-border px-1 [scrollbar-width:none] sm:gap-x-4 xl:gap-x-5 [&::-webkit-scrollbar]:hidden">
              {IMPACTS.map(value => (
                <FilterToggle key={value} pressed={impact === value} onClick={() => setImpact(current => (current === value ? null : value))}>
                  {value}<span className="max-sm:hidden"><FilterCount value={impactCount(value)} /></span>
                </FilterToggle>
              ))}
              <span aria-hidden="true" className="h-4 w-px flex-none bg-border" />
              <FilterToggle pressed={period === thisWeek} onClick={() => setPeriod(current => (current === thisWeek ? 'all' : thisWeek))}>This week</FilterToggle>
              <FilterToggle pressed={period === 'month'} onClick={() => setPeriod(current => (current === 'month' ? 'all' : 'month'))}>This month</FilterToggle>
              {pickedWeek && (
                <FilterToggle pressed onClick={() => setPeriod('all')}>Week of {shortDay(pickedWeek)}</FilterToggle>
              )}
            </div>

            {inView.length === 0 ? (
              <p className="py-4 text-sm text-muted-foreground">
                {sorted.length === 0
                  ? 'No upcoming events are listed right now. The next official schedule still needs to be added.'
                  : <>
                      {emptyWords}
                      {nextMatch && period !== 'all' && <> Next is {nextMatch.title} on {formatDay(nextMatch.date)}, {countdownPhrase(nextMatch.diff)}.</>}
                      {' '}
                      <button type="button" onClick={clear} className="font-medium text-foreground underline underline-offset-2">Show all events</button>
                    </>}
              </p>
            ) : (
              <>
                {shownGroups.map(({ week, rows }) => (
                  <div key={week} className="mt-4">
                    <h3 className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold">
                      {weekName(week, today) ?? <span className="tabular-nums">{formatWeek(week, today)}</span>}
                      {weekName(week, today) && <span className="font-normal tabular-nums text-muted-foreground">{formatWeek(week, today)}</span>}
                    </h3>
                    <ul className="divide-y divide-border/60">
                      {rows.map(event => <EventRow key={event.id} event={event} />)}
                    </ul>
                  </div>
                ))}
                {period === 'all' && groups.length > 0 && shownRows < inView.length && (
                  <Button variant="outline" size="sm" onClick={() => setShowAll(true)} className="my-2 h-9 max-sm:h-11">
                    Show all {inView.length} events
                  </Button>
                )}
                {period === 'all' && showAll && inView.length > ROW_CAP && (
                  <Button variant="outline" size="sm" onClick={() => setShowAll(false)} className="my-2 h-9 max-sm:h-11">
                    Show fewer
                  </Button>
                )}
              </>
            )}
          </section>
        </TabsContent>
      </Tabs>

      {footnote}
    </>
  );
}
