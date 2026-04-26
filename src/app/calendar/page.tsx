import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';
import { CALENDAR_EVENTS, type CalendarEvent } from '@/lib/calendar-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Circle, IndianRupee, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const TODAY = '2026-04-26';

const CATEGORY_COLORS: Record<CalendarEvent['category'], string> = {
  RBI:           'bg-purple-500/15 text-purple-400 border-purple-500/30',
  Earnings:      'bg-blue-500/15 text-blue-400 border-blue-500/30',
  Global:        'bg-orange-500/15 text-orange-400 border-orange-500/30',
  Index:         'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  Macro:         'bg-secondary text-muted-foreground border-border/50',
  'Central Bank':'bg-rose-500/15 text-rose-400 border-rose-500/30',
  Forex:         'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

const IMPACT_COLORS: Record<CalendarEvent['impact'], string> = {
  High:   'fill-red-500 text-red-500',
  Medium: 'fill-yellow-500 text-yellow-500',
  Low:    'fill-green-500 text-green-500',
};

const IMPACT_LABEL: Record<CalendarEvent['impact'], string> = {
  High:   'High Impact',
  Medium: 'Medium Impact',
  Low:    'Low Impact',
};

function daysFromToday(dateStr: string): number {
  const today = new Date(TODAY + 'T00:00:00');
  const event = new Date(dateStr + 'T00:00:00');
  return Math.round((event.getTime() - today.getTime()) / 86_400_000);
}

function DaysLabel({ diff }: { diff: number }) {
  if (diff === 0) return <span className="text-xs font-bold text-primary">Today</span>;
  if (diff === 1) return <span className="text-xs text-muted-foreground">Tomorrow</span>;
  if (diff > 0)  return <span className="text-xs text-muted-foreground">In {diff}d</span>;
  return <span className="text-xs text-muted-foreground/50">{Math.abs(diff)}d ago</span>;
}

function groupByMonth(events: (CalendarEvent & { diff: number })[]) {
  const map = new Map<string, (CalendarEvent & { diff: number })[]>();
  for (const e of events) {
    const d = new Date(e.date + 'T00:00:00');
    const key = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(e);
  }
  return map;
}

function EventTable({ events }: { events: (CalendarEvent & { diff: number })[] }) {
  const grouped = groupByMonth(events);

  return (
    <div className="space-y-8">
      {[...grouped.entries()].map(([month, monthEvents]) => (
        <div key={month}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {month}
          </h2>
          <div className="overflow-hidden rounded-xl border border-border/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground w-24">Date</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Event</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground w-32 hidden sm:table-cell">Category</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground w-28 hidden md:table-cell">Impact</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground w-24">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {monthEvents.map((event, idx) => {
                  const d = new Date(event.date + 'T00:00:00');
                  const day   = d.toLocaleDateString('en-IN', { day: '2-digit' });
                  const month = d.toLocaleDateString('en-IN', { month: 'short' });
                  const weekday = d.toLocaleDateString('en-IN', { weekday: 'short' });
                  const isPast  = event.diff < 0;
                  const isToday = event.diff === 0;

                  return (
                    <tr
                      key={`${event.date}-${idx}`}
                      className={cn(
                        'transition-colors',
                        isToday  && 'bg-primary/5',
                        !isToday && !isPast && 'hover:bg-secondary/30',
                        isPast   && 'opacity-40',
                      )}
                    >
                      {/* Date */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className={cn('font-bold leading-none', isToday ? 'text-primary' : 'text-foreground')}>
                            {day} {month}
                          </span>
                          <span className="mt-0.5 text-[10px] text-muted-foreground uppercase tracking-wide">{weekday}</span>
                        </div>
                      </td>

                      {/* Title + description */}
                      <td className="px-4 py-3">
                        <p className={cn('font-medium leading-snug', isPast && 'line-through')}>
                          {event.title}
                        </p>
                        {event.description && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{event.description}</p>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge
                          variant="outline"
                          className={cn('text-[10px] font-semibold border px-1.5 py-0', CATEGORY_COLORS[event.category])}
                        >
                          {event.category}
                        </Badge>
                      </td>

                      {/* Impact */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          <Circle className={cn('h-2 w-2 shrink-0', IMPACT_COLORS[event.impact])} />
                          <span className="text-xs text-muted-foreground">{IMPACT_LABEL[event.impact]}</span>
                        </div>
                      </td>

                      {/* Days label */}
                      <td className="px-4 py-3 text-right">
                        <DaysLabel diff={event.diff} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CalendarPage() {
  const india = [...CALENDAR_EVENTS]
    .filter(e => e.market === 'India')
    .map(e => ({ ...e, diff: daysFromToday(e.date) }))
    .sort((a, b) => a.diff - b.diff);

  const international = [...CALENDAR_EVENTS]
    .filter(e => e.market === 'International')
    .map(e => ({ ...e, diff: daysFromToday(e.date) }))
    .sort((a, b) => a.diff - b.diff);

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-8 p-4 md:p-6">

        {/* Page title */}
        <div className="flex items-center gap-3">
          <CalendarDays className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Economic Calendar</h1>
            <p className="text-sm text-muted-foreground">Upcoming market-moving events — India & International</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* India */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold">India Markets</h2>
            </div>
            <EventTable events={india} />
          </div>

          {/* International */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold">International</h2>
            </div>
            <EventTable events={international} />
          </div>
        </div>

      </main>
      <Disclaimer />
    </div>
  );
}
