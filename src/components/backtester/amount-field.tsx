'use client';

import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  amountProblem, currencySign, groupDigits, presetsFor, wholeMoney, type Currency, type InvestmentType,
} from '@/lib/backtest-format';

const HELP_ID = 'backtest-amount-help';

const AmountField = forwardRef<HTMLInputElement, {
  id: string;
  value: string;
  currency: Currency;
  type: InvestmentType;
  onChange: (value: string) => void;
}>(function AmountField({ id, value, currency, type, onChange }, ref) {
  const input = useRef<HTMLInputElement>(null);
  const digitsBeforeCaret = useRef<number | null>(null);
  useImperativeHandle(ref, () => input.current as HTMLInputElement);

  const negative = value.startsWith('-');
  const digits = negative ? value.slice(1) : value;
  const shown = `${negative ? '-' : ''}${groupDigits(digits, currency)}`;
  const problem = amountProblem(value);

  // Adding separators moves the text, so the caret is put back after the same number of digits.
  useLayoutEffect(() => {
    const element = input.current;
    if (!element || digitsBeforeCaret.current === null) return;
    let left = digitsBeforeCaret.current;
    let position = 0;
    while (left > 0 && position < shown.length) {
      if (/[\d-]/.test(shown[position])) left -= 1;
      position += 1;
    }
    element.setSelectionRange(position, position);
    digitsBeforeCaret.current = null;
  }, [shown]);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {type === 'sip' ? 'Monthly Amount' : 'Investment Amount'} ({currency})
      </label>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <div className="relative w-full sm:w-44">
          <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-muted-foreground">{currencySign(currency)}</span>
          <Input
            ref={input}
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            value={shown}
            placeholder="0"
            aria-invalid={problem !== null}
            aria-describedby={HELP_ID}
            onChange={event => {
              const text = event.target.value;
              const clean = text.replace(/,/g, '');
              if (!/^-?\d*$/.test(clean)) return;
              const caret = event.target.selectionStart ?? text.length;
              digitsBeforeCaret.current = text.slice(0, caret).replace(/,/g, '').length;
              onChange(clean);
            }}
            className={cn(
              'h-10 pl-7 text-base font-semibold tabular-nums max-sm:h-11',
              problem && 'border-foreground focus-visible:ring-foreground',
            )}
          />
        </div>
        <div className="flex items-center gap-3">
          {presetsFor(currency).map(preset => {
            const pressed = value === String(preset);
            return (
              <button
                key={preset}
                type="button"
                aria-pressed={pressed}
                onClick={() => onChange(String(preset))}
                className={cn(
                  'min-h-11 whitespace-nowrap border-b text-sm tabular-nums transition-colors hover:text-foreground sm:min-h-8',
                  pressed ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground',
                )}
              >
                {wholeMoney(preset, currency)}
              </button>
            );
          })}
        </div>
      </div>
      <p id={HELP_ID} role={problem ? 'alert' : undefined} className={cn('mt-1 flex min-h-5 items-center gap-1.5 text-xs', problem ? 'font-medium text-foreground' : 'text-muted-foreground')}>
        {problem && <AlertCircle className="h-3.5 w-3.5 flex-none text-down" aria-hidden="true" />}
        {problem ?? (type === 'sip' ? "Invested every month, at that month's closing price" : "Invested once, at the first month's closing price")}
      </p>
    </div>
  );
});

export default AmountField;
