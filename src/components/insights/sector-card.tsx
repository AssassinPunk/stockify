import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import type { SectorData } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function SectorCard({ sectors }: { sectors: SectorData[] }) {
  const sorted  = [...sectors].sort((a, b) => b.change - a.change);
  const maxAbs  = Math.max(...sectors.map(s => Math.abs(s.change)), 0.01);

  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <BarChart3 className="h-4 w-4 text-primary" />
          Sector Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3.5">
        {sorted.map(sector => {
          const isUp   = sector.change >= 0;
          const barPct = (Math.abs(sector.change) / maxAbs) * 100;
          const label  = sector.name.replace(/^Nifty\s*/i, '');
          return (
            <div key={sector.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className={cn('text-xs font-mono font-semibold', isUp ? 'text-emerald-400' : 'text-red-400')}>
                  {isUp ? '+' : ''}{sector.change.toFixed(2)}%
                </span>
              </div>
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-700', isUp ? 'bg-emerald-500' : 'bg-red-500')}
                  style={{ width: `${barPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
