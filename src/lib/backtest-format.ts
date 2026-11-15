export type Currency = 'INR' | 'USD';
export type InvestmentType = 'sip' | 'lumpsum';

const SIGN: Record<Currency, string> = { INR: '₹', USD: '$' };
const LOCALE: Record<Currency, string> = { INR: 'en-IN', USD: 'en-US' };
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const currencySign = (currency: string) => SIGN[currency as Currency] ?? '';

// Short money: lakh and crore for rupees, K and M for dollars.
export function money(value: number, currency: string) {
  const size = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (currency === 'INR') {
    if (size >= 1_00_00_000) return `${sign}₹${(size / 1_00_00_000).toFixed(2)} Cr`;
    if (size >= 1_00_000) return `${sign}₹${(size / 1_00_000).toFixed(2)} L`;
    return `${sign}₹${size.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }
  if (size >= 1_000_000) return `${sign}$${(size / 1_000_000).toFixed(2)}M`;
  if (size >= 1_000) return `${sign}$${(size / 1_000).toFixed(2)}K`;
  return `${sign}$${size.toFixed(2)}`;
}

export const signedMoney = (value: number, currency: string) => `${value > 0 ? '+' : ''}${money(value, currency)}`;
export const percent = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;

// Whole money with separators, for the amounts a person typed: ₹1,00,000 and $100,000.
export const groupDigits = (digits: string, currency: string) =>
  digits === '' ? '' : Number(digits).toLocaleString(LOCALE[currency as Currency] ?? 'en-IN', { maximumFractionDigits: 0 });
export const wholeMoney = (value: number, currency: string) =>
  `${currencySign(currency)}${value.toLocaleString(LOCALE[currency as Currency] ?? 'en-IN', { maximumFractionDigits: 2 })}`;

export const monthYear = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;
export const monthTick = (iso: string) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${iso.slice(2, 4)}`;

const periodYears = (period: string) => Number(period.replace('Y', ''));
const years = (period: string) => `${periodYears(period)} ${periodYears(period) === 1 ? 'year' : 'years'}`;

// The same question whether it is built from the form or from a finished result.
export function whatIf(amount: number | null, currency: string, type: string, symbol: string, period: string) {
  const sum = amount && amount > 0 ? wholeMoney(amount, currency) : 'money';
  return type === 'sip'
    ? `What if ${sum}${amount && amount > 0 ? ' a month' : ' every month'} had gone into ${symbol} for ${years(period)}?`
    : `What if ${sum} had gone into ${symbol} ${years(period)} ago?`;
}

export const presetsFor = (currency: Currency) =>
  currency === 'INR' ? [5000, 10000, 25000] : [100, 500, 1000];

export function amountProblem(text: string) {
  if (text === '' || text === '-') return 'Enter an amount.';
  const value = Number(text);
  if (value < 0) return "The amount can't be negative.";
  if (value === 0) return 'The amount has to be more than zero.';
  return null;
}

// Yahoo gives whatever history a stock has, so a recent listing can come back shorter than the period asked for.
export const shortHistory = (months: number, period: string) => months < periodYears(period) * 12;
