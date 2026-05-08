"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type RatesResponse =
  | {
      result: "success";
      base_code: string;
      rates: Record<string, number>;
    }
  | {
      result: "error";
      "error-type"?: string;
    };

const COMMON_CURRENCIES: Array<{ code: string; name: string }> = [
  { code: "USD", name: "US Dollar" },
  { code: "INR", name: "Indian Rupee" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "CNY", name: "Chinese Yuan" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "NZD", name: "New Zealand Dollar" },
  { code: "SEK", name: "Swedish Krona" },
  { code: "NOK", name: "Norwegian Krone" },
  { code: "DKK", name: "Danish Krone" },
  { code: "ZAR", name: "South African Rand" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "MXN", name: "Mexican Peso" },
  { code: "RUB", name: "Russian Ruble" },
  { code: "KRW", name: "South Korean Won" },
  { code: "TRY", name: "Turkish Lira" },
  { code: "IDR", name: "Indonesian Rupiah" },
  { code: "THB", name: "Thai Baht" },
  { code: "MYR", name: "Malaysian Ringgit" },
  { code: "PHP", name: "Philippine Peso" },
  { code: "AED", name: "UAE Dirham" },
  { code: "SAR", name: "Saudi Riyal" },
];

const ISO3 = /^[A-Z]{3}$/;

const ratesCache = new Map<
  string,
  { fetchedAtMs: number; rates: Record<string, number> }
>();

async function fetchRates(base: string, signal?: AbortSignal) {
  // Free endpoint, no API key. Example: https://open.er-api.com/v6/latest/USD
  const res = await fetch(`https://open.er-api.com/v6/latest/${encodeURIComponent(base)}`, {
    signal,
  });
  if (!res.ok) throw new Error("Failed to fetch rates");
  const json = (await res.json()) as RatesResponse;
  if (!json || json.result !== "success") throw new Error("Rates unavailable");
  return json.rates;
}

function tryFormatCurrency(value: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 6,
    }).format(value);
  } catch {
    return `${value.toFixed(6)} ${currency}`;
  }
}

export function CurrencyConverterTile({
  className,
  defaultFrom = "USD",
  defaultTo = "INR",
  defaultAmount = 1,
}: {
  className?: string;
  defaultFrom?: string;
  defaultTo?: string;
  defaultAmount?: number;
}) {
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [inputValue, setInputValue] = useState<string>(defaultAmount > 0 ? String(defaultAmount) : '');
  const amount = parseFloat(inputValue) || 0;
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const ac = new AbortController();
    const base = from.toUpperCase();

    if (!ISO3.test(base)) {
      setRates(null);
      setLoading(false);
      setError("Enter a 3-letter code");
      return () => {
        cancelled = true;
        ac.abort();
      };
    }

    const cached = ratesCache.get(base);
    const now = Date.now();
    const freshForMs = 10 * 60 * 1000; // 10 minutes
    if (cached && now - cached.fetchedAtMs < freshForMs) {
      setRates(cached.rates);
      setError(null);
      return () => {
        cancelled = true;
        ac.abort();
      };
    }

    setLoading(true);
    setError(null);
    fetchRates(base, ac.signal)
      .then(r => {
        if (cancelled) return;
        ratesCache.set(base, { fetchedAtMs: Date.now(), rates: r });
        setRates(r);
      })
      .catch(() => {
        if (cancelled) return;
        setRates(null);
        setError("FX rates unavailable");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
      ac.abort();
    };
  }, [from]);

  const rate = useMemo(() => {
    const r = rates?.[to.toUpperCase()];
    return typeof r === "number" ? r : null;
  }, [rates, to]);

  const converted = useMemo(() => {
    if (rate == null || amount <= 0) return null;
    return amount * rate;
  }, [amount, rate]);

  return (
    <div className={cn("flex flex-1 items-center gap-3 px-5 py-3.5", className)}>
      <div className={cn("rounded-lg p-2 shrink-0 bg-muted/40")}>
        <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex flex-1 items-center justify-between gap-3 min-w-0">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground truncate">
            Currency Converter
          </p>

          <div className="mt-1 grid grid-cols-3 gap-2 items-center">
            <Input
              value={inputValue}
              onChange={e => {
                const v = e.target.value;
                // Allow empty, digits, and one decimal point only
                if (/^\d*\.?\d*$/.test(v)) setInputValue(v);
              }}
              onBlur={() => {
                if (!inputValue || inputValue === '.') setInputValue('');
              }}
              inputMode="decimal"
              placeholder="0"
              className="h-9 font-mono text-sm"
              aria-label="Amount"
            />

            <Input
              value={from}
              onChange={e => setFrom(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3))}
              placeholder="USD"
              className="h-9 font-mono text-sm uppercase"
              list="currency-codes"
              aria-label="From currency code"
            />

            <Input
              value={to}
              onChange={e => setTo(e.target.value.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 3))}
              placeholder="INR"
              className="h-9 font-mono text-sm uppercase"
              list="currency-codes"
              aria-label="To currency code"
            />
          </div>
          <datalist id="currency-codes">
            {COMMON_CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </datalist>
        </div>

        <div className="shrink-0 text-right">
          {loading ? (
            <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground font-mono">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading
            </div>
          ) : error ? (
            <div className="text-xs text-destructive font-mono">{error}</div>
          ) : converted == null ? (
            <div className="text-xs text-muted-foreground font-mono">—</div>
          ) : (
            <div className="font-mono text-sm font-bold leading-tight">
              {tryFormatCurrency(converted, to.toUpperCase())}
              {rate != null && (
                <div className="text-[10px] font-normal text-muted-foreground">
                  1 {from.toUpperCase()} = {rate.toFixed(6)} {to.toUpperCase()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

