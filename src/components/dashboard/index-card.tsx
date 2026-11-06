
'use client';

import { useState, useEffect, useRef } from "react";
import { formatChange, formatNumber } from "@/lib/format";
import { INDEX_MEANINGS } from "@/lib/index-meanings";
import type { IndexData } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function IndexCard({ index, lead = false }: { index: IndexData; lead?: boolean }) {
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
  const hasData = index.value > 0;

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
        <button
          type="button"
          aria-label={`${index.symbol} details`}
          className="flex h-full w-full flex-col rounded-2xl bg-card p-5 text-left transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex w-full items-center justify-between gap-2 text-sm text-muted-foreground">
            {index.symbol}
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
          </span>
          {hasData ? (
            <>
              <span className={cn(
                "mt-2 font-semibold tabular-nums tracking-tight transition-colors duration-300",
                lead ? "text-[32px] leading-10" : "text-2xl",
                isUpdating ? "text-up" : "text-foreground",
              )}>
                {formatNumber(index.value, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={cn("mt-1 text-sm tabular-nums", isPositive ? "text-up" : "text-down")}>
                {formatChange(index.change, index.percentChange)}
              </span>
              <span className="text-xs text-muted-foreground">from previous close</span>
            </>
          ) : (
            <span className="mt-2 text-sm text-muted-foreground">{index.lastUpdated}</span>
          )}
          {INDEX_MEANINGS[index.symbol] && (
            <span className="mt-3 text-sm leading-snug text-muted-foreground">{INDEX_MEANINGS[index.symbol]}</span>
          )}
        </button>
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
              <span className="text-sm text-muted-foreground">Current value</span>
              <div className="text-2xl font-semibold tabular-nums mt-1">{formatNumber(index.value)}</div>
            </div>
            <div className="rounded-xl bg-secondary/30 p-4">
              <span className="text-sm text-muted-foreground">Daily change</span>
              <div className={cn("text-2xl font-semibold tabular-nums mt-1", isPositive ? 'text-up' : 'text-down')}>
                {formatChange(index.change, index.percentChange)}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {stats.map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center gap-4 text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold tabular-nums text-right">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
