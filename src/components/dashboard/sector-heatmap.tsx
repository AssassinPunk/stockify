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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import {
  Building2, Monitor, Car, Pill, ShoppingCart,
  Home, Wrench, Tv, Building, LayoutGrid,
  Cpu, HeartPulse, Zap, Factory, FlaskConical,
  Wifi, Landmark, Leaf
} from "lucide-react";

// Map sectors to intuitive icons — covers both Indian (Nifty) and International (S&P GICS) names
const getSectorIcon = (name: string) => {
  const n = name.toLowerCase();
  // Indian sectors
  if (n.includes('it'))            return Monitor;
  if (n.includes('bank'))          return Building2;
  if (n.includes('auto'))          return Car;
  if (n.includes('pharma'))        return Pill;
  if (n.includes('fmcg'))          return ShoppingCart;
  if (n.includes('realty'))        return Home;
  if (n.includes('metal'))         return Wrench;
  if (n.includes('media'))         return Tv;
  if (n.includes('pse') || n.includes('psu')) return Building;
  // International sectors
  if (n.includes('tech'))          return Cpu;
  if (n.includes('health'))        return HeartPulse;
  if (n.includes('financ'))        return Landmark;
  if (n.includes('energy'))        return Zap;
  if (n.includes('consumer disc')) return ShoppingCart;
  if (n.includes('consumer stap')) return ShoppingCart;
  if (n.includes('industri'))      return Factory;
  if (n.includes('material'))      return FlaskConical;
  if (n.includes('real estate'))   return Home;
  if (n.includes('util'))          return Leaf;
  if (n.includes('commun'))        return Wifi;
  return LayoutGrid;
};

// Generate an aesthetically pleasing miniature trend line
const generateSparkline = (change: number) => {
  const points = [];
  let val = 0;
  for (let i = 0; i < 7; i++) {
    points.push({ val });
    val += (change / 6) + (Math.random() - 0.5) * Math.abs(change) * 0.5;
  }
  points[6].val = change; // Ensure it ends exactly on the change proportion
  return points;
};

export default function SectorHeatmap({ sectors }: { sectors: SectorData[] }) {
  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Sector Heatmap</CardTitle>
        <CardDescription>Daily performance across industries</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-3 h-full auto-rows-fr">
          {sectors.map((sector) => {
            const isPositive = sector.change >= 0;
            const Icon = getSectorIcon(sector.name);
            const sparklineData = generateSparkline(sector.change);
            const sparkColor = isPositive ? '#10b981' : '#ef4444';
            
            return (
              <Dialog key={sector.name}>
                <DialogTrigger asChild>
                  <div
                    className={cn(
                      "group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border p-3 transition-all duration-300",
                      "hover:-translate-y-1",
                      isPositive 
                        ? "border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]" 
                        : "border-red-500/20 bg-red-500/5 hover:border-red-500/40 hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]"
                    )}
                  >
                    {/* Header: Icon + Name */}
                    <div className="flex items-center gap-2 mb-1 z-10">
                      <div className={cn("p-1.5 rounded-md", isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-foreground/80 truncate text-left">{sector.name}</span>
                    </div>

                    {/* Value */}
                    <div className={cn("text-left font-code text-lg font-bold z-10", isPositive ? "text-emerald-500" : "text-red-500")}>
                      {isPositive ? '+' : ''}{sector.change.toFixed(2)}%
                    </div>

                    {/* Background Sparkline */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 opacity-30 group-hover:opacity-50 transition-opacity">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={sparklineData}>
                          <defs>
                            <linearGradient id={`spark-${sector.name}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={sparkColor} stopOpacity={0.8}/>
                              <stop offset="95%" stopColor={sparkColor} stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <Area 
                            type="monotone" 
                            dataKey="val" 
                            stroke={sparkColor} 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill={`url(#spark-${sector.name})`} 
                            isAnimationActive={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                       <div className={cn("p-2 rounded-lg", isPositive ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {sector.name} Details
                    </DialogTitle>
                    <DialogDescription>
                      Macro performance breakdown and contributing factors.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-2">
                    <div className="flex items-center justify-between mb-4 bg-secondary/50 p-3 rounded-lg">
                      <span className="text-sm font-medium">Sector Sentiment</span>
                      <Badge variant="outline" className={cn("border", isPositive ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' : 'border-red-500/30 text-red-500 bg-red-500/10')}>
                        {isPositive ? 'Bullish' : 'Bearish'}
                      </Badge>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Factor</TableHead>
                          <TableHead className="text-right">Impact</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Global Markets</TableCell>
                          <TableCell className="text-right text-emerald-500">+0.45%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Institutional Flow</TableCell>
                          <TableCell className="text-right text-emerald-500">+0.80%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-semibold border-t">Net Performance</TableCell>
                          <TableCell className={cn("text-right font-bold border-t", isPositive ? 'text-emerald-500' : 'text-red-500')}>
                            {isPositive ? '+' : ''}{sector.change.toFixed(2)}%
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
