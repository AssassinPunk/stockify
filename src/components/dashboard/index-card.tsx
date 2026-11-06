
'use client';

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatChange, formatNumber } from "@/lib/format";
import type { IndexData } from "@/lib/types";
import { ArrowDown, ArrowUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function IndexCard({ index }: { index: IndexData }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const prevValue = useRef(index.value);

  // Trigger a visual pulse when the price changes via polling
  useEffect(() => {
    if (index.value !== prevValue.current) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 300);
      prevValue.current = index.value;
      return () => clearTimeout(timer);
    }
  }, [index.value]);

  const isPositive = index.change >= 0;

  const formatStat = (value?: number) =>
    value === undefined ? '—' : formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const { previousClose, dayLow, dayHigh, fiftyTwoWeekLow, fiftyTwoWeekHigh } = index;
  const fiftyTwoWeekPosition =
    fiftyTwoWeekLow !== undefined && fiftyTwoWeekHigh !== undefined && fiftyTwoWeekHigh > fiftyTwoWeekLow
      ? `${(((index.value - fiftyTwoWeekLow) / (fiftyTwoWeekHigh - fiftyTwoWeekLow)) * 100).toFixed(1)}%`
      : '—';

  const stats = [
    { label: 'Previous Close', value: formatStat(previousClose) },
    { label: 'Day Range', value: `${formatStat(dayLow)} – ${formatStat(dayHigh)}` },
    { label: '52-Week Range', value: `${formatStat(fiftyTwoWeekLow)} – ${formatStat(fiftyTwoWeekHigh)}` },
    { label: 'Position in 52-Week Range', value: fiftyTwoWeekPosition },
    { label: 'Last Updated', value: index.lastUpdated },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className={cn(
          "rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 transition-all hover:shadow-black/20 hover:-translate-y-1 cursor-pointer overflow-hidden",
          isUpdating && "ring-2 ring-primary/50"
        )}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              {index.symbol}
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Major market index representing the performance of a group of stocks. Click to expand.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardTitle>
            {isPositive ? (
              <ArrowUp className="h-4 w-4 text-up" />
            ) : (
              <ArrowDown className="h-4 w-4 text-down" />
            )}
          </CardHeader>
          <CardContent>
            <div className={cn(
              "font-code text-2xl font-bold transition-colors duration-300",
              isUpdating ? "text-primary" : "text-foreground"
            )}>
              {formatNumber(index.value, { minimumFractionDigits: 2 })}
            </div>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <p className={cn("font-code text-xs cursor-default", isPositive ? 'text-up' : 'text-down')}>
                    {formatChange(index.change, index.percentChange)}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isPositive ? "Upward market momentum" : "Downward market pressure"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{index.symbol} Detailed Breakdown</DialogTitle>
          <DialogDescription>
            Today&apos;s session and 52-week range for {index.symbol}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl bg-secondary/30 p-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Current Value</span>
              <div className="text-2xl font-bold font-code mt-1">{formatNumber(index.value)}</div>
            </div>
            <div className="rounded-xl bg-secondary/30 p-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Daily Change</span>
              <div className={cn("text-2xl font-bold font-code mt-1", isPositive ? 'text-up' : 'text-down')}>
                {formatChange(index.change, index.percentChange)}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {stats.map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center gap-4 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold font-code text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
