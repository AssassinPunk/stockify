// Sits over an empty chart so a failed fetch reads as missing data, never as a flat or invented line.
export default function ChartUnavailable() {
  return (
    <div
      role="status"
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center p-4 text-center text-sm text-muted-foreground"
    >
      Chart data for this period is unavailable right now.
    </div>
  );
}
