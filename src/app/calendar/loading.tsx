import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';

const Bar = ({ className }: { className: string }) => <div className={`rounded bg-secondary ${className}`} />;

const EventRow = () => (
  <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 py-3 xl:grid-cols-[88px_84px_28px_minmax(0,1fr)_104px_72px] xl:gap-x-4">
    <Bar className="h-4 w-3/5 xl:col-start-4 xl:row-start-1" />
    <Bar className="h-4 w-16 xl:col-start-2 xl:row-start-1" />
    <Bar className="col-span-2 mt-1.5 h-4 w-4/5 xl:col-span-1 xl:col-start-4 xl:row-start-2" />
    <Bar className="col-span-2 mt-2 h-4 w-52 xl:col-span-1 xl:col-start-1 xl:row-start-1 xl:mt-0 xl:w-20" />
  </div>
);

// The final layout with each value as a flat bar at its real size, so nothing shifts when the events land.
export default function CalendarLoading() {
  return (
    <div className="flex min-h-svh w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-4 p-4 md:p-6" aria-busy="true">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Economic Calendar</h1>
          <Bar className="mt-2 h-4 w-96 max-w-full" />
        </div>

        <div className="grid grid-cols-3 border-b border-border pb-2.5 text-center text-sm text-muted-foreground sm:flex sm:gap-6">
          {['All', 'India Markets', 'International'].map(name => <span key={name} className="pt-2">{name}</span>)}
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-5 rounded-2xl bg-card p-5 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <h2 className="text-base font-semibold">Next high-impact event</h2>
            <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-[auto_minmax(0,1fr)]">
              <div>
                <Bar className="h-9 w-28" />
                <Bar className="mt-2 h-4 w-20" />
              </div>
              <div>
                <Bar className="h-7 w-4/5" />
                <Bar className="mt-2 h-4 w-3/5" />
                <Bar className="mt-3 h-5 w-40" />
              </div>
            </div>
          </div>
          <div className="hidden sm:block xl:col-span-5">
            <h2 className="text-base font-semibold">After that</h2>
            <div className="mt-1 divide-y divide-border/60">
              {[0, 1].map(i => (
                <div key={i} className="py-2.5">
                  <Bar className="h-4 w-3/5" />
                  <Bar className="mt-1.5 h-3 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-card p-5">
          <h2 className="text-base font-semibold">Next 6 months</h2>
          <Bar className="mt-3 h-[108px] w-full" />
        </div>

        <div className="rounded-2xl bg-card px-5 pb-3 pt-5">
          <h2 className="text-base font-semibold">Upcoming events</h2>
          <div className="mt-2 flex gap-x-4 overflow-hidden border-b border-border pb-2.5 pt-2 text-sm text-muted-foreground xl:gap-x-5">
            {['High', 'Medium', 'Low', 'This week', 'This month'].map(name => <span key={name} className="flex-none">{name}</span>)}
          </div>
          <Bar className="mt-5 h-4 w-40" />
          <div className="divide-y divide-border/60"><EventRow /><EventRow /><EventRow /><EventRow /></div>
        </div>
      </main>
      <Disclaimer />
    </div>
  );
}
