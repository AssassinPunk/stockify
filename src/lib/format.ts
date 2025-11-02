export function formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('en-IN', options).format(num);
}

export function formatChange(change: number, percentChange: number): string {
  const sign = change > 0 ? '+' : '';
  return `${sign}${formatNumber(change, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${sign}${formatNumber(percentChange, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%)`;
}

export function compactNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(num);
}
