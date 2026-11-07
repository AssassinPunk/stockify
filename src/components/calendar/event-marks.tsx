import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@/lib/calendar-data';
import { regionOf } from '@/lib/calendar';

type Impact = CalendarEvent['impact'];

const LEVEL: Record<Impact, number> = { High: 3, Medium: 2, Low: 1 };
const FILL: Record<Impact, string> = { High: 'bg-amber-400', Medium: 'bg-amber-400/70', Low: 'bg-muted-foreground' };

// Impact reads from the number of bars and the word as well as the colour. Amber keeps green and red
// for gains and losses, as on the rest of Stockify.
export function ImpactLabel({ impact, className }: { impact: Impact; className?: string }) {
  return (
    <span className={cn('flex flex-none items-center gap-1.5 whitespace-nowrap text-xs', impact === 'High' ? 'font-medium text-foreground' : 'text-muted-foreground', className)}>
      <span className="flex h-3 items-end gap-0.5" aria-hidden="true">
        {[1, 2, 3].map(bar => (
          <span
            key={bar}
            style={{ height: 3 + bar * 3 }}
            className={cn('w-[3px] rounded-[1px]', bar <= LEVEL[impact] ? FILL[impact] : 'bg-secondary')}
          />
        ))}
      </span>
      {impact}<span className="sr-only"> impact</span>
    </span>
  );
}

// The same mark in the runway and in its legend.
export function ImpactTick({ impact, dim = false }: { impact: Impact; dim?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'block h-3.5 w-1 flex-none rounded-[1px]',
        impact === 'High' && 'bg-amber-400',
        impact === 'Medium' && 'border border-amber-400',
        impact === 'Low' && 'border border-muted-foreground',
        dim && 'opacity-25',
      )}
    />
  );
}

// The same neutral tag as News and Insights: RBI and Central Bank are the same kind of thing and look it.
export function CategoryTag({ category }: { category: string }) {
  return <span className="flex-none whitespace-nowrap rounded bg-secondary px-1.5 py-0.5 text-xs text-foreground">{category}</span>;
}

export function RegionCode({ event, className }: { event: CalendarEvent; className?: string }) {
  const region = regionOf(event);
  return (
    <span title={region.name} className={cn('flex-none text-xs font-medium tabular-nums text-muted-foreground', className)}>
      <span aria-hidden="true">{region.code}</span>
      <span className="sr-only">{region.name}</span>
    </span>
  );
}
