import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';
import CalendarAutoRefresh from '@/components/calendar-auto-refresh';
import EventTracker from '@/components/calendar/event-tracker';
import { CALENDAR_EVENTS, SCHEDULE_CHECKED_ON, type CalendarEvent } from '@/lib/calendar-data';
import { WINDOW_DAYS, type TrackedEvent } from '@/lib/calendar';

export const dynamic = 'force-dynamic';

// An event stays listed until its day has ended where it happens. International events use New York,
// the latest of their time zones, so a US decision is not hidden before it comes out.
const MARKET_TIME_ZONE: Record<CalendarEvent['market'], string> = {
  India: 'Asia/Kolkata',
  International: 'America/New_York',
};

function getTodayStr(timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone }).format(new Date());
}

function daysFromToday(dateStr: string, today: string): number {
  return Math.round((Date.parse(dateStr) - Date.parse(today)) / 86_400_000);
}

function upcomingEvents(events: CalendarEvent[]): TrackedEvent[] {
  return events
    .map((e, index) => ({
      ...e,
      id: `${e.date}-${index}`,
      diff: daysFromToday(e.date, getTodayStr(MARKET_TIME_ZONE[e.market])),
    }))
    .filter(e => e.diff >= 0 && e.diff <= WINDOW_DAYS);
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
  const today = getTodayStr(MARKET_TIME_ZONE.India);
  const liveEarnings = await fetchLiveEarnings(today);
  const events = upcomingEvents([...CALENDAR_EVENTS, ...liveEarnings]);

  return (
    <div className="flex min-h-svh w-full flex-col bg-background text-foreground">
      <CalendarAutoRefresh />
      <Header />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <EventTracker
          events={events}
          today={today}
          footnote={
            <p className="text-xs text-muted-foreground">
              Dates come from the published schedules of RBI, MoSPI, the Federal Reserve, the US Bureau of Labor Statistics,
              the ECB, the Bank of England and the Bank of Japan, checked on {SCHEDULE_CHECKED_ON}. They can change, so
              confirm with the source before relying on one.
              {liveEarnings.length > 0
                ? ' Company earnings dates are live from Twelve Data.'
                : ' Company earnings dates are not currently shown.'}
            </p>
          }
        />
      </main>
      <Disclaimer />
    </div>
  );
}
