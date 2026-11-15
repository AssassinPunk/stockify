'use client';

import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import Header from '@/components/dashboard/header';
import Disclaimer from '@/components/dashboard/disclaimer';
import AmountField from '@/components/backtester/amount-field';
import ResultsView, { type RunState } from '@/components/backtester/results-view';
import StockPicker from '@/components/backtester/stock-picker';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getAllTickers } from '@/lib/data';
import { amountProblem, whatIf, type Currency, type InvestmentType } from '@/lib/backtest-format';
import type { BacktestResult } from '../api/backtest/route';

const allTickers = getAllTickers().filter(t => !t.isIndex);
const indiaTickers = allTickers.filter(t => t.currency === 'INR');
const intlTickers = allTickers.filter(t => t.currency === 'USD');

const MARKETS: { value: Currency; label: string }[] = [{ value: 'INR', label: 'India' }, { value: 'USD', label: 'US' }];
const TYPES: { value: InvestmentType; label: string }[] = [{ value: 'sip', label: 'Monthly SIP' }, { value: 'lumpsum', label: 'Lump Sum' }];
const PERIODS = ['1Y', '2Y', '3Y', '5Y'].map(value => ({ value, label: value }));

const RERUN_AFTER_MS = 400;
const AMOUNT_ID = 'backtest-amount';
const STOCK_ID = 'backtest-stock';

// Every choice in the form is the same underlined group, as on News and Calendar.
function Choice<T extends string>({ label, options, value, onChange }: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label}>
      <p className="mb-1.5 text-sm text-muted-foreground">{label}</p>
      <div className="flex gap-5 border-b border-border">
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              '-mb-px min-h-11 whitespace-nowrap border-b text-sm transition-colors hover:text-foreground max-sm:flex-1 sm:min-h-[39px]',
              value === option.value ? 'border-foreground font-medium text-foreground' : 'border-transparent text-muted-foreground',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const Field = ({ className, children }: { className: string; children: ReactNode }) => <div className={cn('min-w-0', className)}>{children}</div>;

export default function BacktesterPage() {
  const [symbol, setSymbol] = useState('RELIANCE');
  const [amountStr, setAmountStr] = useState('10000');
  const [type, setType] = useState<InvestmentType>('sip');
  const [period, setPeriod] = useState('3Y');
  const [currency, setCurrency] = useState<Currency>('INR');

  const [result, setResult] = useState<BacktestResult | null>(null);
  const [state, setState] = useState<RunState>('idle');
  const [error, setError] = useState('');

  const amount = parseFloat(amountStr) || 0;
  const problem = amountProblem(amountStr);
  const amountInput = useRef<HTMLInputElement>(null);
  const resultsBox = useRef<HTMLDivElement>(null);
  const latestRun = useRef(0);
  const hasRun = useRef(false);

  const handleCurrency = (next: Currency) => {
    if (next === currency) return;
    setCurrency(next);
    setSymbol(next === 'INR' ? indiaTickers[0].symbol : intlTickers[0].symbol);
    setAmountStr(next === 'INR' ? '10000' : '500');
  };

  const run = useCallback(async () => {
    const ticket = ++latestRun.current;
    hasRun.current = true;
    setError('');
    setState(current => (current === 'done' || current === 'updating' ? 'updating' : 'running'));
    try {
      const res = await fetch(
        `/api/backtest?symbol=${encodeURIComponent(symbol)}&amount=${amount}&type=${type}&period=${period}&currency=${currency}`,
        { cache: 'no-store' },
      );
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      if (ticket !== latestRun.current) return; // a newer run has started; its answer is the one to show
      setResult(json);
      setState('done');
    } catch (e) {
      if (ticket !== latestRun.current) return;
      setResult(null);
      setError(e instanceof Error && e.message ? e.message : 'Something went wrong.');
      setState('error');
    }
  }, [symbol, amount, type, period, currency]);

  // After the first run, a changed input runs again by itself. A bad amount waits, and the last result stays.
  const skipFirst = useRef(true);
  useEffect(() => {
    if (skipFirst.current) { skipFirst.current = false; return; }
    if (!hasRun.current || problem) return;
    const timer = setTimeout(run, RERUN_AFTER_MS);
    return () => clearTimeout(timer);
  }, [run, problem]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (problem) { amountInput.current?.focus(); return; }
    run();
    // Below xl the results sit under the form, so bring them up.
    if (window.matchMedia('(max-width: 1279px)').matches) {
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      resultsBox.current?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    }
  };

  const busy = state === 'running' || state === 'updating';
  const tickers = currency === 'INR' ? indiaTickers : intlTickers;

  return (
    <div className="flex min-h-svh w-full flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">&ldquo;What If&rdquo; Backtester</h1>
          <p className="mt-1 text-sm text-muted-foreground">Simulate SIP or lump sum investments using real historical price data</p>
        </div>

        <form onSubmit={submit} noValidate aria-label="Configure Backtest" className="rounded-2xl bg-card p-5">
          <h2 className="text-base font-semibold">Configure Backtest</h2>
          {/* 12 columns from xl: 2 + 6 + 4 on the first row, 5 + 4 + 3 on the second. 6 columns from sm: 2 + 4, 2 + 4, 3 + 3. */}
          <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 xl:grid-cols-12">
            <Field className="sm:col-span-2 xl:col-span-2">
              <Choice label="Market" options={MARKETS} value={currency} onChange={handleCurrency} />
            </Field>
            <Field className="sm:col-span-4 xl:col-span-6">
              <label htmlFor={STOCK_ID} className="mb-1.5 block text-sm text-muted-foreground">Stock</label>
              <StockPicker id={STOCK_ID} tickers={tickers} value={symbol} onChange={setSymbol} />
            </Field>
            <Field className="sm:col-span-2 xl:col-span-4">
              <Choice label="Investment Type" options={TYPES} value={type} onChange={setType} />
            </Field>
            <Field className="sm:col-span-4 xl:col-span-5">
              <AmountField ref={amountInput} id={AMOUNT_ID} value={amountStr} currency={currency} type={type} onChange={setAmountStr} />
            </Field>
            <Field className="sm:col-span-3 xl:col-span-4">
              <Choice label="Period" options={PERIODS} value={period} onChange={setPeriod} />
            </Field>
            <Field className="flex items-start sm:col-span-3 sm:pt-[26px] xl:col-span-3">
              <Button type="submit" disabled={busy} className="h-10 w-full max-sm:h-11">
                {busy ? 'Running simulation…' : 'Run Backtest'}
              </Button>
            </Field>
          </div>
        </form>

        <div ref={resultsBox} className="scroll-mt-20">
          <ResultsView
            state={state}
            result={result}
            question={whatIf(problem ? null : amount, currency, type, symbol, period)}
            error={error}
            onRetry={run}
            type={type}
          />
        </div>
      </main>
      <Disclaimer />
    </div>
  );
}
