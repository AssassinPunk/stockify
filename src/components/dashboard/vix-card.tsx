'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Info, ShieldAlert, Maximize2 } from 'lucide-react';
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

  return (
    <>
      <Card className={cn(
        'rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 transition-all hover:shadow-black/20 hover:-translate-y-1 overflow-hidden flex flex-col',
        isUpdating && 'ring-2 ring-primary/50',
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            INDIA VIX
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    India VIX measures market's expectation of volatility over the next 30 days.
                    High VIX = high fear / uncertainty.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <Badge variant="outline" className={cn('text-[10px] h-5', risk.color)}>
            <ShieldAlert className="mr-1 h-3 w-3" />
            {risk.level}
          </Badge>
        </CardHeader>

        <CardContent className="flex flex-col gap-2 flex-1">
          {/* Mini Fear Gauge */}
          <div className="flex justify-center -mx-1">
            <div className="w-full max-w-[180px]">
              <VixGauge value={vixData.value} size="sm" />
            </div>
          </div>

          {/* Value + last updated */}
          <div className="flex items-end justify-between">
            <span className={cn(
              'font-mono text-2xl font-bold transition-colors duration-300',
              isUpdating ? 'text-primary' : 'text-foreground',
            )}>
              {formatNumber(vixData.value, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-[10px] text-muted-foreground">{vixData.lastUpdated}</span>
          </div>

          {/* Implied move pills */}
          <div className="flex flex-wrap gap-1">
            {[
              { label: 'D', val: moves.daily },
              { label: 'W', val: moves.weekly },
              { label: 'M', val: moves.monthly },
            ].map(({ label, val }) => (
              <TooltipProvider key={label}>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="cursor-default text-xs font-mono rounded-full bg-secondary px-2 py-0.5">
                      <span className="text-muted-foreground">{label}: </span>
                      <span className="font-semibold">±{formatNumber(val, { minimumFractionDigits: 2 })}%</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Statistically likely {label === 'D' ? 'daily' : label === 'W' ? 'weekly' : 'monthly'} market move implied by current VIX.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>

          {/* Full Analysis button */}
          <Button
            variant="outline"
            size="sm"
            className="mt-auto w-full text-xs gap-1.5 border-border/50 hover:border-primary/50"
            onClick={() => setDialogOpen(true)}
          >
            <Maximize2 className="h-3.5 w-3.5" />
            Full Analysis
          </Button>
        </CardContent>
      </Card>

      <VixDialog
        isOpen={dialogOpen}
        onOpenChange={setDialogOpen}
        vixData={vixData}
        chartData={chartData}
      />
    </>
  );
}
