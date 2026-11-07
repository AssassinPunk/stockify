import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';

const Bar = ({ className }: { className: string }) => <div className={`rounded bg-secondary ${className}`} />;

// The final layout with each value as a flat bar at its real size, so nothing shifts when the data lands.
export default function InsightsLoading() {
  return (
    <div className="flex min-h-svh w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-4 p-4 md:p-6" aria-busy="true">
        <h1 className="text-2xl font-semibold tracking-tight">Market Insights</h1>
        <div className="grid h-[52px] w-full grid-cols-2 gap-1 rounded-xl bg-card p-1 sm:h-11 sm:w-[372px]" />
        <Bar className="h-6 w-full max-w-2xl" />

        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {['NIFTY 50', 'SENSEX', 'BANK NIFTY', 'India VIX'].map(label => (
            <div key={label} className="rounded-2xl bg-card p-4">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Bar className="mt-2 h-7 w-28" />
              <Bar className="mt-2 h-4 w-24" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="rounded-2xl bg-card p-5 xl:col-span-8">
            <h2 className="text-base font-semibold">AI Market Brief</h2>
            <Bar className="mt-4 h-4 w-full" />
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 rounded-lg bg-secondary/50" />)}
            </div>
          </div>
          <div className="rounded-2xl bg-card p-5 xl:col-span-4">
            <h2 className="text-base font-semibold">Sector Performance</h2>
            <div className="mt-4 space-y-3">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => <Bar key={i} className="h-3 w-full" />)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="rounded-2xl bg-card p-5 lg:col-span-5">
            <h2 className="text-base font-semibold">Today&apos;s Movers</h2>
            <div className="mt-4 space-y-4">
              {[0, 1, 2, 3].map(i => <Bar key={i} className="h-9 w-full" />)}
            </div>
          </div>
          <div className="rounded-2xl bg-card p-5 lg:col-span-7">
            <h2 className="text-base font-semibold">News Digest</h2>
            <div className="mt-4 space-y-4">
              {[0, 1, 2, 3].map(i => <Bar key={i} className="h-9 w-full" />)}
            </div>
          </div>
        </div>
      </main>
      <Disclaimer />
    </div>
  );
}
