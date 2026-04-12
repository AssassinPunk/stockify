export const DEFAULT_MARKET_SYMBOLS = [
  "NIFTY 50",
  "SENSEX",
  "BANK NIFTY",
  "INDIA VIX"
] as const;

export const SYMBOL_MAP: Record<string, string> = {
  "NIFTY 50": "^NSEI",
  "SENSEX": "^BSESN",
  "BANK NIFTY": "^NSEBANK",
  "INDIA VIX": "^INDIAVIX"
};
