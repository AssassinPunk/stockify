import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SectorData } from "@/lib/types";

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
    <Card className="rounded-2xl border-border/50 bg-card shadow-lg shadow-black/10">
      <CardHeader>
        <CardTitle>Sector Performance</CardTitle>
        <CardDescription>Daily % Change</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-center sm:grid-cols-3">
          {sectors.map((sector) => (
            <div
              key={sector.name}
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
