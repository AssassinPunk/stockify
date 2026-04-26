'use client';

import { useMemo, useState } from 'react';
import { CALENDAR_EVENTS, type CalendarEvent } from '@/lib/calendar-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Circle, IndianRupee, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const TODAY = '2026-04-25';

const CATEGORY_COLORS: Record<CalendarEvent['category'], string> = {
  RBI:          'bg-purple-500/15 text-purple-400 border-purple-500/30',
  Earnings:     'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Global:       'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Index:        'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  Macro:        'bg-secondary text-muted-foreground border-border/50',
  'Central Bank': 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  Forex:        'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

const IMPACT_COLORS: Record<CalendarEvent['impact'], string> = {
  High:   'fill-red-500 text-red-500',
  Medium: 'fill-yellow-500 text-yellow-500',
  Low:    'fill-green-500 text-green-500',
};

function daysFromToday(dateStr: string): number {
  const today = new Date(TODAY + 'T00:00:00');
  const event = new Date(dateStr + 'T00:00:00');
  return Math.round((event.getTime() - today.getTime()) / 86_400_000);
}

function DaysLabel({ diff }: { diff: number }) {
  if (diff === 0) return <span className="text-[10px] font-bold text-primary">Today</span>;
  if (diff === 1) return <span className="text-[10px] text-muted-foreground">Tomorrow</span>;
  if (diff > 0)  return <span className="text-[10px] text-muted-foreground">In {diff}d</span>;
  return <span className="text-[10px] text-muted-foreground/50">{Math.abs(diff)}d ago</span>;
}

function EventList({ events }: { events: (CalendarEvent & { diff: number })[] }) {
  if (events.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-xs text-muted-foreground">
        No events in the next 45 days
      </div>
    );
  }
  return (
    <div className="space-y-0.5">
      {events.map((event, idx) => {
        const d = new Date(event.date + 'T00:00:00');
        const day   = d.toLocaleDateString('en-IN', { day: '2-digit' });
        const month = d.toLocaleDateString('en-IN', { month: 'short' });
        const isPast  = event.diff < 0;
        const isToday = event.diff === 0;

        return (
          <div
            key={`${event.date}-${idx}`}
            className={cn(
              'flex items-start gap-3 rounded-xl px-2.5 py-2 transition-colors',
              isToday  && 'bg-primary/5 ring-1 ring-primary/20',
              !isToday && !isPast && 'hover:bg-secondary/40',
              isPast   && 'opacity-45',
            )}
          >
            {/* Date block */}
            <div className="flex w-8 shrink-0 flex-col items-center pt-0.5">
              <span className={cn('text-sm font-bold leading-none', isToday ? 'text-primary' : 'text-foreground')}>
                {day}
              </span>
              <span className="mt-0.5 text-[9px] uppercase tracking-wide text-muted-foreground">{month}</span>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-0.5 min-w-0">
              <div className="flex flex-wrap items-center gap-1">
                <Badge
                  variant="outline"
                  className={cn('h-4 px-1.5 text-[9px] font-semibold border', CATEGORY_COLORS[event.category])}
                >
                  {event.category}
                </Badge>
                <Circle className={cn('h-1.5 w-1.5 shrink-0', IMPACT_COLORS[event.impact])} />
                <DaysLabel diff={event.diff} />
              </div>
              <p className={cn('text-xs font-medium leading-snug', isPast && 'line-through')}>
                {event.title}
              </p>
              {event.description && (
                <p className="text-[10px] leading-snug text-muted-foreground">{event.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function EconomicCalendar() {
  const [tab, setTab] = useState<'India' | 'International'>('India');

  const sorted = useMemo(() => {
    return [...CALENDAR_EVENTS]
      .map(e => ({ ...e, diff: daysFromToday(e.date) }))
      .sort((a, b) => a.diff - b.diff);
  }, []);

  const filtered = useMemo(() => {
    const byMarket = sorted.filter(e => e.market === tab);
    const past     = byMarket.filter(e => e.diff < 0).slice(-2);
    const upcoming = byMarket.filter(e => e.diff >= 0 && e.diff <= 60);
    return [...past, ...upcoming];
  }, [sorted, tab]);

  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 flex flex-col h-full">
      <CardHeader className="shrink-0 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Economic Calendar
          </CardTitle>
        </div>

        {/* Tab switcher */}
        <div className="flex rounded-lg bg-secondary/50 p-0.5 gap-0.5">
          {(['India', 'International'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors',
                tab === t
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t === 'India'
                ? <IndianRupee className="h-3 w-3" />
                : <Globe className="h-3 w-3" />}
              {t}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto pb-3 min-h-0 px-3">
        <EventList events={filtered} />
      </CardContent>
    </Card>
  );
}
