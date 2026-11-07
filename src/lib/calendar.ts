import type { CalendarEvent } from '@/lib/calendar-data';

export type TrackedEvent = CalendarEvent & { id: string; diff: number };
export type RegionFilter = 'All' | CalendarEvent['market'];
export type ImpactFilter = CalendarEvent['impact'] | null;
// 'all' | 'month' | `week:YYYY-MM-DD`, where the date is that week's Monday.
export type Period = string;

export const WINDOW_DAYS = 183;

const DAY_MS = 86_400_000;
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const IMPACT_RANK: Record<CalendarEvent['impact'], number> = { High: 0, Medium: 1, Low: 2 };

const toIso = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const parts = (iso: string) => new Date(`${iso}T00:00:00Z`);

export const addDays = (iso: string, days: number) => toIso(Date.parse(iso) + days * DAY_MS);

// Weeks start on Monday. Dates are compared as plain calendar days, so no viewer's time zone can move them.
export const dayOfWeek = (iso: string) => (parts(iso).getUTCDay() + 6) % 7;
export const weekOf = (iso: string) => addDays(iso, -dayOfWeek(iso));

export function formatDay(iso: string) {
  const d = parts(iso);
  return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
}

export const shortDay = (iso: string) => {
  const d = parts(iso);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;
};

export const dayNumber = (iso: string) => parts(iso).getUTCDate();
export const monthName = (iso: string) => MONTHS[parts(iso).getUTCMonth()];

export function formatWeek(start: string, today: string) {
  const end = addDays(start, 6);
  const a = parts(start);
  const b = parts(end);
  const span = a.getUTCMonth() === b.getUTCMonth()
    ? `${a.getUTCDate()}–${b.getUTCDate()} ${MONTHS[b.getUTCMonth()]}`
    : `${a.getUTCDate()} ${MONTHS[a.getUTCMonth()]} – ${b.getUTCDate()} ${MONTHS[b.getUTCMonth()]}`;
  return b.getUTCFullYear() === parts(today).getUTCFullYear() ? span : `${span} ${b.getUTCFullYear()}`;
}

export function weekName(start: string, today: string) {
  const thisWeek = weekOf(today);
  if (start === thisWeek) return 'This week';
  if (start === addDays(thisWeek, 7)) return 'Next week';
  return null;
}

// "In 3 days" is the same fact everywhere it appears, so all three wordings come from here.
export const countdown = (diff: number) =>
  diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `In ${diff} days`;
export const countdownFigure = (diff: number) =>
  diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `${diff} days`;
export const countdownPhrase = (diff: number) =>
  diff === 0 ? 'today' : diff === 1 ? 'tomorrow' : `in ${diff} days`;

export function regionOf(event: CalendarEvent): { code: string; name: string } {
  if (event.market === 'India') return { code: 'IN', name: 'India' };
  if (event.title.startsWith('US ')) return { code: 'US', name: 'United States' };
  if (event.title.startsWith('ECB')) return { code: 'EU', name: 'Euro area' };
  if (event.title.startsWith('Bank of England')) return { code: 'UK', name: 'United Kingdom' };
  if (event.title.startsWith('Bank of Japan')) return { code: 'JP', name: 'Japan' };
  // The international earnings list on the calendar page holds US companies only.
  if (event.category === 'Earnings') return { code: 'US', name: 'United States' };
  return { code: 'INT', name: 'International' };
}

export const sortEvents = (events: TrackedEvent[]) =>
  [...events].sort((a, b) =>
    a.date.localeCompare(b.date)
    || IMPACT_RANK[a.impact] - IMPACT_RANK[b.impact]
    || a.market.localeCompare(b.market)
    || a.title.localeCompare(b.title));

export const matchesRegion = (event: CalendarEvent, region: RegionFilter) =>
  region === 'All' || event.market === region;

export const matchesImpact = (event: CalendarEvent, impact: ImpactFilter) =>
  impact === null || event.impact === impact;

export function matchesPeriod(event: CalendarEvent, period: Period, today: string) {
  if (period === 'all') return true;
  if (period === 'month') return event.date.slice(0, 7) === today.slice(0, 7);
  return weekOf(event.date) === period.slice(5);
}

export function periodTouchesWeek(week: string, period: Period, today: string) {
  if (period === 'all') return false;
  if (period !== 'month') return period.slice(5) === week;
  const month = today.slice(0, 7);
  return week.slice(0, 7) === month || addDays(week, 6).slice(0, 7) === month;
}

export function periodWords(period: Period, today: string) {
  if (period === 'all') return 'in the next 6 months';
  if (period === 'month') return 'this month';
  const start = period.slice(5);
  return start === weekOf(today) ? 'this week' : `in the week of ${shortDay(start)}`;
}

export function groupByWeek(events: TrackedEvent[]) {
  const groups = new Map<string, TrackedEvent[]>();
  for (const event of events) {
    const week = weekOf(event.date);
    groups.set(week, [...(groups.get(week) ?? []), event]);
  }
  return [...groups.entries()].map(([week, rows]) => ({ week, rows }));
}

export function weeksAhead(today: string) {
  const last = weekOf(addDays(today, WINDOW_DAYS));
  const weeks: string[] = [];
  for (let week = weekOf(today); week <= last; week = addDays(week, 7)) weeks.push(week);
  return weeks;
}

// The nearest high-impact day, with every event on that day, and the high-impact events after it.
export function pickNext(events: TrackedEvent[], afterCount = 2) {
  const high = events.filter(e => e.impact === 'High');
  if (high.length === 0) return { next: [] as TrackedEvent[], after: [] as TrackedEvent[] };
  const day = high[0].date;
  return {
    next: high.filter(e => e.date === day),
    after: high.filter(e => e.date !== day).slice(0, afterCount),
  };
}
