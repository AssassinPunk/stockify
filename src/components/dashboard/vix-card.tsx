
'use client';

import { useState, useEffect, useRef } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatNumber } from "@/lib/format";
import type { VixData, ChartDataPoint } from "@/lib/types";
import { calculateVixMoves, getRiskLevel } from "@/lib/vix";
import { Info, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function VixCard({ vixData, chartData }: { vixData: VixData; chartData: ChartDataPoint[] }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const prevValue = useRef(vixData.value);

  // Trigger visual pulse on live data update
  useEffect(() => {
    if (vixData.value !== prevValue.current) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 300);
      prevValue.current = vixData.value;
      return () => clearTimeout(timer);
    }
  }, [vixData.value]);

  const moves = calculateVixMoves(vixData.value);
  const risk = getRiskLevel(vixData.value);

  return (
    <Card className={cn(
      "rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 transition-all hover:shadow-black/20 hover:-translate-y-1 overflow-hidden",
      isUpdating && "ring-2 ring-primary/50"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            INDIA VIX
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Info className="h-3.5 w-3.5 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">India VIX measures market's expectation of volatility over the next 30 days. High VIX usually means high fear/uncertainty.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={cn("text-[10px] h-5", risk.color)}>
              <ShieldAlert className="mr-1 h-3 w-3" />
              {risk.level} Zone
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className={cn(
                "font-code text-2xl font-bold cursor-default transition-colors duration-300",
                isUpdating ? "text-primary" : "text-foreground"
              )}>
                {formatNumber(vixData.value, { minimumFractionDigits: 2 })}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{vixData.value < 13 ? "Low VIX = Stable market environment" : vixData.value >= 25 ? "Extreme Volatility = Panic selling likely" : "Elevated VIX = Expect wider price swings"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="mt-2 h-16">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                 <linearGradient id="vixGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <RechartsTooltip
                cursor={false}
                contentStyle={{ display: 'none' }}
              />
              <Area type="monotone" dataKey="value" stroke="hsl(var(--muted-foreground))" strokeWidth={2} fill="url(#vixGradient)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {Object.entries(moves).map(([period, value]) => (
            <TooltipProvider key={period}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div className="cursor-default text-xs font-code rounded-full bg-secondary px-2 py-1">
                    <span className="capitalize text-muted-foreground">{period.slice(0, 1)}: </span>
                    <span className="font-semibold">
                      ±{formatNumber(value, { minimumFractionDigits: 2 })}%
                    </span>
                  </div>
                </TooltipTrigger>
                 <TooltipContent>
                    <p>Statistically likely range the market might move in a {period}.</p>
                 </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
