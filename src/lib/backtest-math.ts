// Return maths for the backtester, kept apart from the route so it can be tested on its own.

export type CashFlow = { date: string; amount: number }; // ISO date; money in is negative, money out positive

const DAY_MS = 86_400_000;
const YEAR_DAYS = 365;

// The annual rate that makes the cash flows' value zero, with time counted in real days (XIRR, as in Excel).
// For a single investment and a final value it is the same as CAGR over the real dates.
// Returns a percentage, or null when the flows have no answer (all in, or all out).
export function xirr(flows: CashFlow[]): number | null {
  if (flows.length < 2 || !flows.some(f => f.amount < 0)) return null;
  if (!flows.some(f => f.amount > 0)) return -100; // everything put in, nothing left

  const start = Date.parse(flows[0].date);
  const years = flows.map(f => (Date.parse(f.date) - start) / DAY_MS / YEAR_DAYS);
  const valueAt = (rate: number) => flows.reduce((sum, f, i) => sum + f.amount / Math.pow(1 + rate, years[i]), 0);

  // Money goes in first and comes out last, so the value falls as the rate rises: one root, found by bisection.
  let low = -0.999999;
  let high = 1;
  if (valueAt(low) < 0) return -100; // lost so nearly everything that no rate above -99.9999% fits
  // A big gain over a short span annualises to a huge rate, so the ceiling keeps doubling until it holds.
  while (valueAt(high) > 0 && high < 1e300) high *= 2;
  if (valueAt(high) > 0) return null;

  for (let i = 0; i < 300; i += 1) {
    const mid = (low + high) / 2;
    if (valueAt(mid) > 0) low = mid; else high = mid;
    if (high - low < 1e-12 * Math.max(1, Math.abs(mid))) break;
  }
  return ((low + high) / 2) * 100;
}

export type MonthBar = { month: string; date: string; close: number }; // month YYYY-MM, date YYYY-MM-DD

const isoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const monthEnd = (month: string) => {
  const [year, m] = month.split('-').map(Number);
  return isoDay(Date.UTC(year, m, 0)); // day 0 of the next month is the last day of this one
};

// The calendar day of a timestamp where the exchange is. A named time zone follows daylight saving; Yahoo's
// gmtoffset is only today's offset, so a New York summer bar read with it slips into the month before.
function exchangeDay(stamp: number, timeZone?: string, gmtoffset = 0) {
  if (timeZone) {
    try {
      return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(stamp * 1000);
    } catch { /* an unknown zone name falls back to the offset */ }
  }
  return isoDay((stamp + gmtoffset) * 1000);
}

// One close per calendar month, read in the exchange's own time.
// Yahoo stamps an NSE month bar at midnight IST, which is the day before in UTC, so the zone matters.
// It can also add a point for the latest trade inside the month already on the list; the later close wins.
// Each month is dated at its close (its last day), and the month still running at its latest trade.
export function monthlyBars(
  timestamps: number[],
  closes: (number | null)[],
  zone: { timeZone?: string; gmtoffset?: number } = {},
): MonthBar[] {
  const byMonth = new Map<string, number>();
  let lastDay = '';
  timestamps.forEach((stamp, i) => {
    const close = closes[i];
    if (close == null) return;
    const day = exchangeDay(stamp, zone.timeZone, zone.gmtoffset);
    byMonth.set(day.slice(0, 7), close);
    if (day > lastDay) lastDay = day;
  });
  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, close]) => {
      const end = monthEnd(month);
      return { month, date: end < lastDay ? end : lastDay, close };
    });
}

// The stock's months that the benchmark also has, paired by month rather than by position in the list.
export function alignByMonth(stock: MonthBar[], bench: MonthBar[]) {
  const benchClose = new Map(bench.map(bar => [bar.month, bar.close]));
  return stock
    .filter(bar => benchClose.has(bar.month))
    .map(bar => ({ date: bar.date, sp: bar.close, bp: benchClose.get(bar.month)! }));
}

// Each month's return on the money already invested, before that month's new SIP instalment.
// With one stock held, this is the stock's own price change for the month.
export function monthlyReturns(closes: number[]): number[] {
  const out: number[] = [];
  for (let i = 1; i < closes.length; i += 1) out.push((closes[i] / closes[i - 1] - 1) * 100);
  return out;
}
