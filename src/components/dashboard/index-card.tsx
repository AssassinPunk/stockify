
'use client';

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatChange, formatNumber } from "@/lib/format";
import type { IndexData } from "@/lib/types";
import { ArrowDown, ArrowUp, Info, TrendingUp, TrendingDown } from "lucide-react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const contributors = [
    { symbol: 'RELIANCE', impact: 12.5, type: 'up' },
    { symbol: 'TCS', impact: 8.2, type: 'up' },
    { symbol: 'HDFCBANK', impact: -15.4, type: 'down' },
    { symbol: 'INFY', impact: 5.1, type: 'up' },
    { symbol: 'ICICIBANK', impact: -4.3, type: 'down' },
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
            Key drivers and top movers currently influencing {index.symbol}.
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

          <Tabs defaultValue="movers">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="movers">Top Contributors</TabsTrigger>
              <TabsTrigger value="stats">Index Stats</TabsTrigger>
            </TabsList>
            <TabsContent value="movers" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stock</TableHead>
                    <TableHead className="text-right">Index Impact (pts)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contributors.map((c) => (
                    <TableRow key={c.symbol}>
                      <TableCell className="font-medium flex items-center gap-2">
                        {c.type === 'up' ? <TrendingUp className="h-3 w-3 text-up" /> : <TrendingDown className="h-3 w-3 text-down" />}
                        {c.symbol}
                      </TableCell>
                      <TableCell className={cn("text-right font-code", c.type === 'up' ? 'text-up' : 'text-down')}>
                        {c.impact > 0 ? '+' : ''}{c.impact.toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="stats" className="mt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Advance/Decline Ratio</span>
                  <span className="font-semibold">32 : 18</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Volume Trend</span>
                  <span className="font-semibold text-up">Above Average</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">52-Week High Range</span>
                  <span className="font-semibold">94.5%</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
