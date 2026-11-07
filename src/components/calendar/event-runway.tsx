import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@/lib/calendar-data';
import {
  dayNumber, dayOfWeek, matchesImpact, matchesRegion, monthName, periodTouchesWeek, shortDay, weekOf, weeksAhead,
  type ImpactFilter, type Period, type RegionFilter, type TrackedEvent,
} from '@/lib/calendar';
import { ImpactTick } from './event-marks';

const LANES: { market: CalendarEvent['market']; short: string }[] = [
  { market: 'India', short: 'India' },
  { market: 'International', short: 'Intl' },
];
const IMPACTS: CalendarEvent['impact'][] = ['High', 'Medium', 'Low'];
const RANK = { High: 0, Medium: 1, Low: 2 };

function LaneTicks({ events, inView }: { events: TrackedEvent[]; inView: (e: TrackedEvent) => boolean }) {
  const ordered = [...events].sort((a, b) => Number(inView(b)) - Number(inView(a)) || RANK[a.impact] - RANK[b.impact]);
  const overflow = ordered.length > 4;
  const drawn = overflow ? ordered.slice(0, 2) : ordered;
  return (
    <span className="flex h-6 items-center gap-0.5 border-t border-border/60 pl-1.5">
      {drawn.map(event => <ImpactTick key={event.id} impact={event.impact} dim={!inView(event)} />)}
      {overflow && <span className="text-xs tabular-nums text-muted-foreground">+{ordered.length - 2}</span>}
    </span>
  );
}

// India and International as two lanes through the same six months: the screen's one element that only
// this product has. Each week is a button that narrows the list below to that week.
export default function EventRunway({
  events, region, impact, period, today, onPickWeek,
}: {
  events: TrackedEvent[];
  region: RegionFilter;
  impact: ImpactFilter;
  period: Period;
  today: string;
  onPickWeek: (week: string) => void;
}) {
  const weeks = useMemo(() => weeksAhead(today), [today]);
  const thisWeek = weekOf(today);
  const inView = (e: TrackedEvent) => matchesRegion(e, region) && matchesImpact(e, impact);
  const kinds = IMPACTS.filter(kind => events.some(e => e.impact === kind));

  return (
    <section aria-label="Next 6 months" className="rounded-2xl bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
        <h2 className="text-base font-semibold">Next 6 months</h2>
        <ul className="flex items-center gap-3 text-xs text-muted-foreground">
          {kinds.map(kind => <li key={kind} className="flex items-center gap-1.5"><ImpactTick impact={kind} />{kind}</li>)}
          <li className="flex items-center gap-1.5"><span aria-hidden="true" className="block h-3.5 w-px bg-foreground" />Today</li>
        </ul>
      </div>

      <div className="mt-3 flex">
        <div className="w-14 flex-none pt-11 text-xs text-muted-foreground sm:w-[88px]" aria-hidden="true">
          {LANES.map(lane => (
            <div key={lane.market} className="flex h-6 items-center border-t border-border/60">
              <span className="sm:hidden">{lane.short}</span>
              <span className="hidden sm:inline">{lane.market}</span>
            </div>
          ))}
        </div>

        <div className="grid min-w-0 flex-1 auto-cols-[minmax(44px,1fr)] grid-flow-col overflow-x-auto [scrollbar-width:none] sm:auto-cols-[minmax(36px,1fr)] [&::-webkit-scrollbar]:hidden">
          {weeks.map((week, index) => {
            const rows = events.filter(e => weekOf(e.date) === week);
            const count = rows.filter(inView).length;
            const newMonth = index === 0 || monthName(week) !== monthName(weeks[index - 1]);
            const current = week === thisWeek;
            const selected = periodTouchesWeek(week, period, today);
            return (
              <button
                key={week}
                type="button"
                onClick={() => onPickWeek(week)}
                aria-pressed={period === `week:${week}`}
                aria-label={`Week of ${shortDay(week)} ${week.slice(0, 4)}: ${count} ${count === 1 ? 'event' : 'events'}`}
                className={cn(
                  'relative border-b pb-1 text-left transition-colors hover:bg-secondary/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-ring',
                  selected ? 'border-foreground' : 'border-transparent',
                )}
              >
                <span className="block h-5 pl-1.5 text-xs leading-5 text-muted-foreground">{newMonth ? monthName(week) : ''}</span>
                <span className={cn('block h-6 pl-1.5 text-xs leading-5 tabular-nums', current || selected ? 'font-medium text-foreground' : 'text-muted-foreground')}>
                  {dayNumber(week)}
                </span>
                {LANES.map(lane => (
                  <LaneTicks key={lane.market} events={rows.filter(e => e.market === lane.market)} inView={inView} />
                ))}
                {current && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 top-11 w-px bg-foreground"
                    style={{ left: `${((dayOfWeek(today) + 0.5) / 7) * 100}%` }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
