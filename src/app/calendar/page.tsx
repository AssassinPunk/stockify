import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';
import CalendarAutoRefresh from '@/components/calendar-auto-refresh';
import { CALENDAR_EVENTS, SCHEDULE_CHECKED_ON, type CalendarEvent } from '@/lib/calendar-data';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Circle, IndianRupee, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

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

// An event stays listed until its day has ended where it happens. International events use New York,
// the latest of their time zones, so a US decision is not hidden before it comes out.
const MARKET_TIME_ZONE: Record<CalendarEvent['market'], string> = {
  India: 'Asia/Kolkata',
  International: 'America/New_York',
};

const WINDOW_DAYS = 183;

function getTodayStr(timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone }).format(new Date());
}

function daysFromToday(dateStr: string, today: string): number {
  return Math.round((Date.parse(dateStr) - Date.parse(today)) / 86_400_000);
}

function upcomingEvents(events: CalendarEvent[], market: CalendarEvent['market']) {
  const today = getTodayStr(MARKET_TIME_ZONE[market]);
  return events
    .filter(e => e.market === market)
    .map(e => ({ ...e, diff: daysFromToday(e.date, today) }))
    .filter(e => e.diff >= 0 && e.diff <= WINDOW_DAYS)
    .sort((a, b) => a.diff - b.diff);
}

function DaysLabel({ diff }: { diff: number }) {
  if (diff === 0) return <span className="text-xs font-bold text-primary">Today</span>;
  if (diff === 1) return <span className="text-xs text-muted-foreground">Tomorrow</span>;
  return <span className="text-xs text-muted-foreground">In {diff}d</span>;
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

  if (events.length === 0) {
    return (
      <p className="rounded-xl border border-border/50 p-6 text-sm text-muted-foreground">
        No upcoming events are listed right now. The next official schedule still needs to be added.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {[...grouped.entries()].map(([month, monthEvents]) => (
        <div key={month}>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {month}
          </h2>
          <div className="overflow-hidden rounded-xl border border-border/50">
            <table className="w-full table-fixed text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/30">
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground w-24">Date</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground">Event</th>
                  <th className="px-4 py-2.5 text-right text-xs font-semibold text-muted-foreground w-24">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {monthEvents.map((event, idx) => {
                  const d = new Date(event.date + 'T00:00:00');
                  const day     = d.toLocaleDateString('en-IN', { day: '2-digit' });
                  const month   = d.toLocaleDateString('en-IN', { month: 'short' });
                  const weekday = d.toLocaleDateString('en-IN', { weekday: 'short' });
                  const isToday = event.diff === 0;

                  return (
                    <tr
                      key={`${event.date}-${idx}`}
                      className={cn(
                        'transition-colors',
                        isToday  && 'bg-primary/5',
                        !isToday && 'hover:bg-secondary/30',
                      )}
                    >
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className={cn('font-bold leading-none', isToday ? 'text-primary' : 'text-foreground')}>
                            {day} {month}
                          </span>
                          <span className="mt-0.5 text-[10px] text-muted-foreground uppercase tracking-wide">{weekday}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-medium leading-snug">
                          {event.title}
                        </p>
                        {event.description && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{event.description}</p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <Badge
                            variant="outline"
                            className={cn('text-[10px] font-semibold border px-1.5 py-0', CATEGORY_COLORS[event.category])}
                          >
                            {event.category}
                          </Badge>
                          <div className="flex items-center gap-1.5">
                            <Circle className={cn('h-2 w-2 shrink-0', IMPACT_COLORS[event.impact])} />
                            <span className="text-xs text-muted-foreground">{IMPACT_LABEL[event.impact]}</span>
                          </div>
                        </div>
                      </td>

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

// ── Live earnings from Twelve Data ───────────────────────────────────────────

interface TwelveEarning {
  date?: string;
  eps_estimate?: string;
}

interface TwelveSymbolData {
  meta?: { name?: string; symbol?: string };
  earnings?: TwelveEarning[];
}

async function fetchLiveEarnings(today: string): Promise<CalendarEvent[]> {
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  if (!apiKey) return [];

  const usSymbols   = ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'META', 'AMZN', 'TSLA'];
  const indiaSymbols = ['TCS.NS', 'INFY.NS', 'WIPRO.NS', 'HDFCBANK.NS', 'RELIANCE.NS', 'ICICIBANK.NS'];
  const symbols = [...usSymbols, ...indiaSymbols];

  const maxDate = new Date(Date.now() + 120 * 86_400_000).toISOString().split('T')[0];

  try {
    const res = await fetch(
      `https://api.twelvedata.com/earnings?symbol=${symbols.join(',')}&apikey=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];

    const data: Record<string, unknown> = await res.json();
    if ((data as { code?: number }).code === 429 || (data as { status?: string }).status === 'error') return [];

    const events: CalendarEvent[] = [];

    const processSymbol = (symbolKey: string, info: unknown) => {
      if (!info || typeof info !== 'object') return;
      const sd = info as TwelveSymbolData;
      if (!Array.isArray(sd.earnings)) return;

      const rawName = sd.meta?.name ?? symbolKey.replace('.NS', '');
      // Shorten very long names (e.g. "Tata Consultancy Services Limited" → "TCS")
      const name = rawName.length > 30 ? (sd.meta?.symbol ?? symbolKey.replace('.NS', '')) : rawName;
      const isIndia = symbolKey.endsWith('.NS');

      for (const e of sd.earnings) {
        if (!e.date) continue;
        // Only show events within the displayed window
        if (e.date < today || e.date > maxDate) continue;
        events.push({
          date: e.date,
          title: `${name} Earnings`,
          category: 'Earnings',
          market: isIndia ? 'India' : 'International',
          impact: 'High',
          description: e.eps_estimate ? `EPS estimate: ${isIndia ? '₹' : '$'}${e.eps_estimate}` : 'Quarterly earnings announcement',
        });
      }
    };

    // Twelve Data returns flat {meta, earnings} for a single symbol,
    // or {AAPL: {meta, earnings}, MSFT: ...} for multiple symbols.
    if ('earnings' in data && Array.isArray(data.earnings)) {
      processSymbol(symbols[0], data);
    } else {
      for (const [sym, info] of Object.entries(data)) {
        processSymbol(sym, info);
      }
    }

    return events;
  } catch {
    return [];
  }
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function CalendarPage() {
  const liveEarnings = await fetchLiveEarnings(getTodayStr(MARKET_TIME_ZONE.India));

  const allEvents = [...CALENDAR_EVENTS, ...liveEarnings];
  const india = upcomingEvents(allEvents, 'India');
  const international = upcomingEvents(allEvents, 'International');

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      <CalendarAutoRefresh />
      <Header />
      <main className="flex-1 space-y-8 p-4 md:p-6">

        <div className="flex items-center gap-3">
          <CalendarDays className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Economic Calendar</h1>
            <p className="text-sm text-muted-foreground">
              Upcoming market-moving events — India &amp; International
              {liveEarnings.length > 0 && (
                <span className="ml-2 text-green-500/70">· Live earnings data</span>
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <IndianRupee className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold">India Markets</h2>
            </div>
            <EventTable events={india} />
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <h2 className="text-base font-semibold">International</h2>
            </div>
            <EventTable events={international} />
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Dates come from the published schedules of RBI, MoSPI, the Federal Reserve, the US Bureau of Labor Statistics,
          the ECB, the Bank of England and the Bank of Japan, checked on {SCHEDULE_CHECKED_ON}. They can change, so
          confirm with the source before relying on one.
          {liveEarnings.length === 0 && ' Company earnings dates are not currently shown.'}
        </p>

      </main>
      <Disclaimer />
    </div>
  );
}
