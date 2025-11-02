export function formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  
  // Don't use en-IN for USD or GBP as it adds the incorrect currency symbol prefix
  const locale = options?.currency === 'INR' || !options?.currency ? 'en-IN' : 'en-US';

  return new Intl.NumberFormat(locale, { ...defaultOptions, ...options }).format(num);
}

export function formatChange(change: number, percentChange: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${formatNumber(change, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${sign}${formatNumber(percentChange, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%)`;
}

export function compactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
}
