'use client';

import { useState, useEffect, useRef } from 'react';
import { Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/format';
import type { VixData, ChartDataPoint } from '@/lib/types';
import { calculateVixMoves, getRiskLevel } from '@/lib/vix';
import VixGauge from './vix-gauge';
import VixDialog from './vix-dialog';

export default function VixCard({
  vixData,
  chartData,
}: {
  vixData: VixData;
  chartData: ChartDataPoint[];
}) {
  const [isUpdating, setIsUpdating]   = useState(false);
  const [dialogOpen, setDialogOpen]   = useState(false);
  const prevValue                     = useRef(vixData.value);

  useEffect(() => {
    if (vixData.value !== prevValue.current) {
      setIsUpdating(true);
      const t = setTimeout(() => setIsUpdating(false), 300);
      prevValue.current = vixData.value;
      return () => clearTimeout(t);
    }
  }, [vixData.value]);

  const moves = calculateVixMoves(vixData.value);
  const risk  = getRiskLevel(vixData.value);
  const hasData = vixData.value > 0;

  return (
    <>
      <div className="flex h-full flex-col rounded-2xl bg-card p-5">
        <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
          India VIX
          {hasData && <span className={cn('text-sm font-medium', risk.color)}>{risk.level}</span>}
        </div>

        <div className="mt-2 flex items-start justify-between gap-3">
          <span className={cn(
            'text-2xl font-semibold tabular-nums tracking-tight transition-colors duration-300',
            isUpdating ? 'text-up' : 'text-foreground',
          )}>
            {hasData ? formatNumber(vixData.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '—'}
          </span>
          <div className="-mt-1 w-[104px] shrink-0">
            <VixGauge value={vixData.value} size="sm" />
          </div>
        </div>

        <p className="mt-1 text-sm leading-snug text-muted-foreground">
          Expected market swings over the next 30 days.
          {hasData && ` Implied daily move about ±${formatNumber(moves.daily, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%.`}
        </p>

        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full gap-1.5 border-border"
          onClick={() => setDialogOpen(true)}
        >
          <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
          Full Analysis
        </Button>
      </div>

      <VixDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        vixData={vixData}
        chartData={chartData}
      />
    </>
  );
}
