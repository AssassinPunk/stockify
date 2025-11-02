import type { IndexData, VixData, SectorData, TrendingData, NewsArticle, MainChartData, ChartDataPoint } from './types';

export function getIndices(): IndexData[] {
  return [
    { symbol: 'NIFTY 50', value: 23516.00, change: 48.50, percentChange: 0.21, lastUpdated: '1 min ago' },
    { symbol: 'SENSEX', value: 77241.59, change: -236.48, percentChange: -0.31, lastUpdated: '1 min ago' },
    { symbol: 'BANK NIFTY', value: 51703.95, change: 385.20, percentChange: 0.75, lastUpdated: '1 min ago' },
  ];
}

export function getVixData(): VixData {
  return { value: 14.35, lastUpdated: '2 min ago' };
}

export function getSectors(): SectorData[] {
  return [
    { name: 'Nifty IT', change: 1.25 },
    { name: 'Nifty Bank', change: 0.75 },
    { name: 'Nifty Auto', change: 0.50 },
    { name: 'Nifty Pharma', change: -0.20 },
    { name: 'Nifty FMCG', change: 0.10 },
    { name: 'Nifty Realty', change: 2.15 },
    { name: 'Nifty Metal', change: -1.80 },
    { name: 'Nifty Media', change: 0.90 },
    { name: 'Nifty PSE', change: -0.55 },
  ];
}

export function getTrendingTickers(): TrendingData {
  return {
    gainers: [
      { symbol: 'TATAMOTORS', price: 985.50, change: 45.20, percentChange: 4.81 },
      { symbol: 'WIPRO', price: 490.15, change: 18.50, percentChange: 3.92 },
      { symbol: 'ADANIPORTS', price: 1450.70, change: 52.30, percentChange: 3.75 },
      { symbol: 'INFY', price: 1530.00, change: 44.10, percentChange: 2.97 },
    ],
    losers: [
      { symbol: 'HDFCBANK', price: 1658.90, change: -45.80, percentChange: -2.69 },
      { symbol: 'RELIANCE', price: 2880.25, change: -60.55, percentChange: -2.06 },
      { symbol: 'ICICIBANK', price: 1115.60, change: -15.20, percentChange: -1.34 },
      { symbol: 'LT', price: 3540.00, change: -40.10, percentChange: -1.12 },
    ],
  };
}

export function getNews(): NewsArticle[] {
  return [
    { id: '1', title: 'Sensex, Nifty trade flat amid volatility; IT stocks gain', source: 'MoneyControl', timestamp: '10 min ago', url: '#', category: 'Indices' },
    { id: '2', title: 'RBI announces new measures to control inflation', source: 'Livemint', timestamp: '30 min ago', url: '#', category: 'Macro' },
    { id: '3', title: 'Tata Motors shares jump 5% on strong JLR sales data', source: 'Economic Times', timestamp: '1 hour ago', url: '#', category: 'Stocks' },
    { id: '4', title: 'SEBI plans to introduce T+0 settlement by next year', source: 'Reuters', timestamp: '2 hours ago', url: '#', category: 'Macro' },
    { id: '5', title: 'FIIs turn net buyers in Indian market after a week', source: 'Business Standard', timestamp: '3 hours ago', url: '#', category: 'Indices' },
  ];
}

const generateChartData = (base: number, points: number, volatility: number): ChartDataPoint[] => {
    let lastValue = base;
    const data = [];
    for (let i = 0; i < points; i++) {
        const change = (Math.random() - 0.5) * volatility;
        lastValue += change;
        data.push({ date: `T-${points - i}`, value: parseFloat(lastValue.toFixed(2)) });
    }
    return data.reverse();
};

export function getVixChartData(): ChartDataPoint[] {
    return generateChartData(14, 30, 0.5);
}

export function getMainChartData(): MainChartData {
    return {
        '1D': generateChartData(23500, 96, 50), // ~8 hours of 5-min intervals
        '5D': generateChartData(23300, 60, 100), // 5 days of hourly data
        '1M': generateChartData(23000, 30, 150), // 1 month of daily data
        '6M': generateChartData(21000, 26, 300), // 6 months of weekly data
        '1Y': generateChartData(19000, 52, 500), // 1 year of weekly data
    };
}
