'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SectorData } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const sectorLabel = (name: string) => name.replace(/^Nifty\s+/i, '');

// Darker tile for a small move, stronger for a large one, so the size of each move can be seen at a glance.
function tileTone(change: number) {
  const size = Math.abs(change);
  if (change >= 0) {
    if (size >= 2) return 'bg-emerald-500/25 hover:bg-emerald-500/35';
    if (size >= 1) return 'bg-emerald-500/15 hover:bg-emerald-500/25';
    return 'bg-emerald-500/[.08] hover:bg-emerald-500/15';
  }
  if (size >= 2) return 'bg-red-500/25 hover:bg-red-500/35';
  if (size >= 1) return 'bg-red-500/15 hover:bg-red-500/25';
  return 'bg-red-500/[.08] hover:bg-red-500/15';
}

export default function SectorHeatmap({ sectors }: { sectors: SectorData[] }) {
  const sorted = [...sectors].sort((a, b) => b.change - a.change);

  return (
    <Card className="rounded-2xl border-0 bg-card shadow-none h-full flex flex-col">
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-base font-semibold tracking-normal">Sector Heatmap</CardTitle>
        <CardDescription>Today&apos;s change by sector, biggest gain first</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-5 pt-0">
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sector data is unavailable right now.</p>
        ) : (
        <div className="grid h-full grid-cols-3 auto-rows-fr gap-2">
          {sorted.map((sector) => {
            const isPositive = sector.change >= 0;
            const value = `${isPositive ? '+' : ''}${sector.change.toFixed(2)}%`;

            return (
              <Dialog key={sector.name}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    aria-label={`${sector.name} ${value}`}
                    className={cn(
                      "flex min-h-[72px] min-w-0 flex-col justify-center rounded-lg p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      tileTone(sector.change),
                    )}
                  >
                    <span className="break-words text-sm leading-tight text-foreground">{sectorLabel(sector.name)}</span>
                    <span className={cn("mt-1 text-sm font-semibold tabular-nums", isPositive ? "text-up" : "text-down")}>
                      {value}
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{sector.name} Details</DialogTitle>
                    <DialogDescription>
                      Today&apos;s performance for this sector.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-2">
                    <div className="flex items-center justify-between bg-secondary/50 p-3 rounded-lg">
                      <span className="text-sm font-medium">Daily change</span>
                      <span className={cn("text-sm font-semibold tabular-nums", isPositive ? 'text-up' : 'text-down')}>
                        {value}
                      </span>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
        )}
      </CardContent>
    </Card>
  );
}
