'use client';
import { Area, AreaChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatNumber } from "@/lib/format";
import type { VixData, ChartDataPoint } from "@/lib/types";
import { calculateVixMoves } from "@/lib/vix";
import { Info } from "lucide-react";

export default function VixCard({ vixData, chartData }: { vixData: VixData; chartData: ChartDataPoint[] }) {
  const moves = calculateVixMoves(vixData.value);

  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 transition-all hover:shadow-black/20 hover:-translate-y-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">INDIA VIX</CardTitle>
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Implied annualized volatility. Derived moves assume √time scaling.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent>
        <div className="font-code text-2xl font-bold">
          {formatNumber(vixData.value, { minimumFractionDigits: 2 })}
        </div>
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
                    <p>Implied {period} move</p>
                 </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
