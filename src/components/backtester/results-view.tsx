'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { BacktestResult } from '@/app/api/backtest/route';
import { money, monthYear, percent, shortHistory, signedMoney, whatIf } from '@/lib/backtest-format';
import { GrowthChart, ValueChart, ValueChartLegend } from './result-charts';

export type RunState = 'idle' | 'running' | 'updating' | 'done' | 'error';

const Skeleton = ({ className }: { className: string }) => <div className={cn('rounded bg-secondary', className)} />;

const tone = (value: number) => (value > 0 ? 'text-up' : value < 0 ? 'text-down' : '');

function Figure({ label, children, sub, className }: { label: string; children: ReactNode; sub?: string; className?: string }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-3 py-1.5">
      <dt className="whitespace-nowrap text-sm text-muted-foreground">{label}</dt>
      <dd className="flex flex-row-reverse flex-wrap items-baseline gap-x-2">
        <span className={cn('text-sm font-medium tabular-nums', className)}>{children}</span>
        {sub && <span className="text-xs tabular-nums text-muted-foreground">{sub}</span>}
      </dd>
    </div>
  );
}

// A faint empty plot: the frame the chart will land in, with its lines already drawn.
// For the value chart it also shows the one line the form already decides: a SIP's invested amount climbs, a lump sum's stays flat.
function EmptyPlot({ invested, children }: { invested?: string; children?: ReactNode }) {
  const lines = invested ? 9 : 5;
  return (
    <div className="relative flex h-full flex-col justify-between py-2">
      {Array.from({ length: lines }, (_, line) => <div key={line} className="border-t border-border/60" />)}
      {invested && (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full">
          <line x1="0" x2="100" y1={invested === 'sip' ? 92 : 62} y2={invested === 'sip' ? 22 : 62} strokeWidth="1.5" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" style={{ stroke: 'hsl(var(--muted-foreground))' }} />
        </svg>
      )}
      {children && <div className="absolute inset-x-0 bottom-3 px-4 text-center text-sm text-muted-foreground">{children}</div>}
    </div>
  );
}

const placeholderRows = (type: string) => ['Total Invested', 'Gain / Loss', 'Total Return', 'vs Benchmark', type === 'sip' ? 'SIP Total' : 'Deployed', 'Best Month', 'Worst Month'];

// The lead block keeps one height through every state, so nothing below it moves when a result lands.
const LEAD = 'mt-3 min-h-[100px]';

function Summary({ state, result, question, error, onRetry, type }: {
  type: string;
  state: RunState;
  result: BacktestResult | null;
  question: string;
  error: string;
  onRetry: () => void;
}) {
  const header = 'text-xl font-semibold leading-7 tracking-tight';

  if (!result) {
    return (
      <section aria-label="Result" className="flex flex-col rounded-2xl bg-card p-5 xl:col-span-4">
        <h2 className={header}>{question}</h2>
        <div className={LEAD}>
          {state === 'error' ? (
            <p role="alert" className="text-sm text-muted-foreground">
              {error} <button type="button" onClick={onRetry} className="font-medium text-foreground underline underline-offset-2">Try again</button>
            </p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">It would be worth</p>
              {state === 'running'
                ? <><Skeleton className="my-1 h-10 w-44" /><Skeleton className="mt-2 h-5 w-52" /></>
                : (
                  <>
                    <p aria-hidden="true" className="text-[40px] font-semibold leading-[48px] tracking-tight text-muted-foreground">?</p>
                    <p className="mt-1 text-xs text-muted-foreground">Uses real monthly price data from Yahoo Finance</p>
                  </>
                )}
            </>
          )}
        </div>
        <dl className="mt-2 divide-y divide-border/60">
          {placeholderRows(type).map(label => (
            <Figure key={label} label={label}>
              {state === 'running' ? <span className="inline-block h-3.5 w-20 rounded bg-secondary align-middle" /> : <span className="font-normal text-muted-foreground">—</span>}
            </Figure>
          ))}
        </dl>
      </section>
    );
  }

  const gain = result.finalValue - result.totalInvested;
  const lead = result.totalReturn - result.benchmark.totalReturn;
  const beat = result.totalReturn > result.benchmark.totalReturn;
  const months = result.timeline.length;
  const perRun = result.type === 'sip' ? result.totalInvested / months : result.totalInvested;
  const first = result.timeline[0].date;
  const last = result.timeline[months - 1].date;

  return (
    <section aria-label="Result" className={cn('flex flex-col rounded-2xl bg-card p-5 transition-opacity xl:col-span-4', state === 'updating' && 'opacity-60')}>
      <h2 className={header}>{question}</h2>
      <div className={LEAD}>
        <p className="text-sm text-muted-foreground">It would be worth</p>
        <p className="text-[40px] font-semibold leading-[48px] tracking-tight tabular-nums">{money(result.finalValue, result.currency)}</p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className={cn('rounded px-1.5 py-0.5 text-xs font-medium tabular-nums', beat ? 'bg-up/10 text-up' : 'bg-down/10 text-down')}>
            {beat ? 'Beat' : 'Trailed'} {result.benchmark.symbol} by {Math.abs(lead).toFixed(1)}%
          </span>
          <span className="text-xs tabular-nums text-muted-foreground">{monthYear(first)} to {monthYear(last)}</span>
        </p>
      </div>

      <dl className="mt-2 divide-y divide-border/60">
        <Figure label="Total Invested">{money(result.totalInvested, result.currency)}</Figure>
        <Figure label="Gain / Loss" className={tone(gain)}>{signedMoney(gain, result.currency)}</Figure>
        <Figure label="Total Return" className={tone(result.totalReturn)} sub={`CAGR ${percent(result.cagr)}`}>{percent(result.totalReturn)}</Figure>
        <Figure label={`vs ${result.benchmark.symbol}`} className={tone(result.benchmark.totalReturn)} sub={`CAGR ${percent(result.benchmark.cagr)}`}>{percent(result.benchmark.totalReturn)}</Figure>
        <Figure label={result.type === 'sip' ? `${result.period} SIP Total` : 'Deployed'}>
          {result.type === 'sip' ? `${months}× ${money(perRun, result.currency)}` : `1× ${money(perRun, result.currency)}`}
        </Figure>
        <Figure label="Best Month" className={tone(result.bestMonth)}>{percent(result.bestMonth)}</Figure>
        <Figure label="Worst Month" className={tone(result.worstMonth)}>{percent(result.worstMonth)}</Figure>
      </dl>

      {shortHistory(months, result.period) && (
        <p className="mt-2 text-xs text-muted-foreground">
          Only {months} monthly prices exist for {result.symbol}, so this covers less than the {result.period} you chose.
        </p>
      )}
    </section>
  );
}

export default function ResultsView({ state, result, question, error, onRetry, type }: {
  type: string;
  state: RunState;
  result: BacktestResult | null;
  question: string;
  error: string;
  onRetry: () => void;
}) {
  const shownQuestion = result
    ? whatIf(result.type === 'sip' ? result.totalInvested / result.timeline.length : result.totalInvested, result.currency, result.type, result.symbol, result.period)
    : question;
  const busy = state === 'running' || state === 'updating';
  const dim = state === 'updating' && 'opacity-60';

  return (
    <div className="scroll-mt-20 space-y-4" aria-busy={busy}>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Summary state={state} result={result} question={shownQuestion} error={error} onRetry={onRetry} type={type} />

        <section aria-label="Portfolio Value vs Benchmark" className={cn('flex min-w-0 flex-col rounded-2xl bg-card p-5 transition-opacity xl:col-span-8', dim)}>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
            <h2 className="text-base font-semibold">Portfolio Value vs Benchmark</h2>
            {result
              ? <ValueChartLegend result={result} />
              : state === 'idle' && <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><span aria-hidden="true" className="w-4 border-t border-dashed border-muted-foreground" />Invested</p>}
          </div>
          <div className="mt-3 h-[300px] xl:h-auto xl:min-h-[300px] xl:flex-1">
            {result
              ? <ValueChart result={result} />
              : state === 'running'
                ? <Skeleton className="h-full w-full" />
                : state === 'error'
                  ? <EmptyPlot><span className="bg-card px-2">No chart for this run.</span></EmptyPlot>
                  : <EmptyPlot invested={type}><span className="bg-card px-2">Run the backtest to draw the portfolio and the benchmark against it.</span></EmptyPlot>}
          </div>
        </section>
      </div>

      <section aria-label="Month-over-Month Portfolio Growth" className={cn('rounded-2xl bg-card p-5 transition-opacity', dim)}>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 className="text-base font-semibold">Month-over-Month Portfolio Growth</h2>
          {result?.type === 'sip' && <p className="text-xs text-muted-foreground">Includes each month&apos;s new SIP amount</p>}
        </div>
        <div className="mt-3 h-[180px]">
          {result
            ? <GrowthChart result={result} />
            : state === 'running'
              ? <Skeleton className="h-full w-full" />
              : <EmptyPlot />}
        </div>
      </section>
    </div>
  );
}
