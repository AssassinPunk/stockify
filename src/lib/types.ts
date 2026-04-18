export type IndexData = {
  symbol: string;
  value: number;
  change: number;
  percentChange: number;
  lastUpdated: string;
};

export type VixData = {
  value: number;
  lastUpdated: string;
};

export type SectorData = {
  name: string;
  change: number;
};

export type Ticker = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  currency?: 'INR' | 'USD' | 'GBP';
  isIndex?: boolean;
};

export type TrendingData = {
  gainers: Ticker[];
  losers: Ticker[];
};

export type NewsArticle = {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  url: string;
  category: 'Indices' | 'Stocks' | 'Macro';
};

export type ChartDataPoint = {
    date: string;
    value: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
    [key: string]: any;
};

export type MainChartData = {
    '1D': ChartDataPoint[];
    '5D': ChartDataPoint[];
    '1M': ChartDataPoint[];
    '6M': ChartDataPoint[];
    '1Y': ChartDataPoint[];
};
