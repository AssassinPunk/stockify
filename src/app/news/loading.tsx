import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';

const Bar = ({ className }: { className: string }) => <div className={`rounded bg-secondary ${className}`} />;

const Row = () => (
  <div className="grid grid-cols-[32px_minmax(0,1fr)_14px] gap-x-3 py-3">
    <Bar className="h-4 w-6" />
    <div className="xl:min-h-[66px]">
      <Bar className="h-4 w-full" />
      <Bar className="mt-2 h-4 w-2/5" />
    </div>
  </div>
);

// The final layout with each value as a flat bar at its real size, so nothing shifts when the news lands.
export default function NewsLoading() {
  return (
    <div className="flex min-h-svh w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-4 p-4 md:p-6" aria-busy="true">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Global News Hub</h1>
          <Bar className="mt-2 h-4 w-72 max-w-full" />
        </div>

        <div className="grid grid-cols-1 divide-y divide-border/60 rounded-2xl bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {['NIFTY 50', 'SENSEX', 'India VIX'].map(label => (
            <div key={label} className="flex items-baseline justify-between gap-3 px-5 py-3 sm:block">
              <p className="text-sm text-muted-foreground">{label}</p>
              <Bar className="h-6 w-36 sm:mt-0.5" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-4 border-b border-border pb-2.5 text-sm text-muted-foreground sm:flex sm:gap-6">
          {['All', 'Indices', 'Stocks', 'Macro'].map(name => <span key={name} className="pt-2">{name}</span>)}
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-6 rounded-2xl bg-card p-5 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <h2 className="mb-3 text-base font-semibold">Top story</h2>
            <Bar className="h-8 w-full" />
            <Bar className="mt-2 h-8 w-3/4" />
            <Bar className="mt-3 h-5 w-1/2" />
            <Bar className="mt-4 h-5 w-40" />
          </div>
          <div className="xl:col-span-5">
            <h2 className="text-base font-semibold">Next up</h2>
            <Row /><Row /><Row />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {['India desk', 'Global desk'].map(desk => (
            <div key={desk} className="rounded-2xl bg-card p-5">
              <h2 className="text-base font-semibold">{desk}</h2>
              <Row /><Row /><Row /><Row />
            </div>
          ))}
        </div>
      </main>
      <Disclaimer />
    </div>
  );
}
