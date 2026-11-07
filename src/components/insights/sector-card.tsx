import type { SectorData } from '@/lib/types';
import { cn } from '@/lib/utils';

// The first round number at or above the largest move, so the scale reads as whole steps.
function niceLimit(maxAbs: number) {
  for (const step of [0.5, 1, 2, 3, 5, 10, 20]) {
    if (maxAbs <= step) return step;
  }
  return Math.ceil(maxAbs);
}

export default function SectorCard({ sectors }: { sectors: SectorData[] }) {
  const sorted = [...sectors].sort((a, b) => b.change - a.change);
  const limit  = niceLimit(Math.max(...sectors.map(s => Math.abs(s.change)), 0.01));

  return (
    <section className="flex h-full flex-col gap-3 rounded-2xl bg-card p-5" aria-label="Sector performance">
      <div>
        <h2 className="text-base font-semibold">Sector Performance</h2>
        <p className="text-sm text-muted-foreground">Today&apos;s change, on one scale</p>
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">Sector data is unavailable right now. Please check back shortly.</p>
      ) : (
        <div className="grid grid-cols-[minmax(0,5.5rem)_minmax(0,1fr)_3.75rem] items-center gap-x-2 gap-y-1.5">
          {sorted.map(sector => {
            const isUp  = sector.change >= 0;
            const width = (Math.abs(sector.change) / limit) * 50;
            const value = `${sector.change > 0 ? '+' : ''}${sector.change.toFixed(2)}%`;
            return (
              <div key={sector.name} className="contents">
                <span className="text-[13px] leading-tight text-foreground">
                  {sector.name.replace(/^Nifty\s*/i, '')}
                </span>
                <div className="relative h-5" role="img" aria-label={`${sector.name} ${value}`}>
                  <span className="absolute inset-y-0 left-1/2 w-px bg-border" aria-hidden="true" />
                  <span
                    className={cn('absolute top-1 h-3 rounded-[2px]', isUp ? 'bg-up' : 'bg-down')}
                    style={isUp ? { left: '50%', width: `${width}%` } : { right: '50%', width: `${width}%` }}
                    aria-hidden="true"
                  />
                </div>
                <span className={cn(
                  'text-right text-[13px] font-medium tabular-nums',
                  sector.change > 0 ? 'text-up' : sector.change < 0 ? 'text-down' : 'text-muted-foreground',
                )}>
                  {value}
                </span>
              </div>
            );
          })}

          {/* Scale, under the bars and on the same zero line */}
          <span aria-hidden="true" />
          <div className="relative h-4 text-xs tabular-nums text-muted-foreground" aria-label={`Scale from -${limit}% to +${limit}%`}>
            <span className="absolute left-0">-{limit}%</span>
            <span className="absolute left-1/2 -translate-x-1/2">0</span>
            <span className="absolute right-0">+{limit}%</span>
          </div>
          <span aria-hidden="true" />
        </div>
      )}
    </section>
  );
}
