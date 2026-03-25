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

function getBackgroundColor(change: number): string {
  if (change > 1.5) return "bg-up/80 hover:bg-up/90";
  if (change > 0.5) return "bg-up/60 hover:bg-up/70";
  if (change > 0) return "bg-up/40 hover:bg-up/50";
  if (change < -1.5) return "bg-down/80 hover:bg-down/90";
  if (change < -0.5) return "bg-down/60 hover:bg-down/70";
  if (change < 0) return "bg-down/40 hover:bg-down/50";
  return "bg-secondary hover:bg-muted";
}

export default function SectorHeatmap({ sectors }: { sectors: SectorData[] }) {
  return (
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10 h-full">
      <CardHeader>
        <CardTitle>Sector Performance</CardTitle>
        <CardDescription>Daily % Change</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-3">
          {sectors.map((sector) => (
            <Dialog key={sector.name}>
              <DialogTrigger asChild>
                <div
                  className={cn(
                    "flex h-20 cursor-pointer flex-col justify-center rounded-lg p-2 transition-all hover:ring-2 hover:ring-primary",
                    getBackgroundColor(sector.change)
                  )}
                >
                  <div className="text-xs font-medium truncate">{sector.name}</div>
                  <div className="font-code text-sm font-bold">
                    {sector.change.toFixed(2)}%
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{sector.name} Details</DialogTitle>
                  <DialogDescription>
                    Performance breakdown and contributing factors for the {sector.name} sector.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Sector Sentiment</span>
                    <Badge variant={sector.change >= 0 ? 'default' : 'destructive'} className={cn(sector.change >= 0 ? 'bg-up' : 'bg-down')}>
                      {sector.change >= 0 ? 'Bullish' : 'Bearish'}
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
                        <TableCell className="text-right text-up">+0.45%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Institutional Flow</TableCell>
                        <TableCell className="text-right text-up">+0.80%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Earnings Results</TableCell>
                        <TableCell className={cn("text-right", sector.change >= 0 ? 'text-up' : 'text-down')}>
                          {sector.change.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
