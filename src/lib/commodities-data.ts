export const COMMODITIES = [
  // Metals
  { id: 'gold',      label: 'Gold',         symbol: 'GC=F',     unit: '$/oz',    category: 'Metal'  },
  { id: 'silver',    label: 'Silver',       symbol: 'SI=F',     unit: '$/oz',    category: 'Metal'  },
  { id: 'platinum',  label: 'Platinum',     symbol: 'PL=F',     unit: '$/oz',    category: 'Metal'  },
  { id: 'copper',    label: 'Copper',       symbol: 'HG=F',     unit: '$/lb',    category: 'Metal'  },
  // Energy
  { id: 'oil',       label: 'Crude Oil',    symbol: 'CL=F',     unit: '$/bbl',   category: 'Energy' },
  { id: 'brent',     label: 'Brent Crude',  symbol: 'BZ=F',     unit: '$/bbl',   category: 'Energy' },
  { id: 'natgas',    label: 'Natural Gas',  symbol: 'NG=F',     unit: '$/MMBtu', category: 'Energy' },
  // Forex
  { id: 'usdinr',    label: 'USD/INR',      symbol: 'USDINR=X', unit: '₹',       category: 'Forex'  },
  { id: 'eurusd',    label: 'EUR/USD',      symbol: 'EURUSD=X', unit: '$',       category: 'Forex'  },
  { id: 'gbpusd',    label: 'GBP/USD',      symbol: 'GBPUSD=X', unit: '$',       category: 'Forex'  },
  { id: 'usdjpy',    label: 'USD/JPY',      symbol: 'USDJPY=X', unit: '¥',       category: 'Forex'  },
  { id: 'usdcny',    label: 'USD/CNY',      symbol: 'USDCNY=X', unit: '¥',       category: 'Forex'  },
] as const;

export type CommodityMeta = typeof COMMODITIES[number];
