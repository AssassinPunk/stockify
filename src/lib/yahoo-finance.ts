import type { VixData, ChartDataPoint } from './types';

// Fallback data
const FALLBACK_VIX: VixData = { value: 26.80, lastUpdated: new Date().toLocaleTimeString() };

export async function fetchIndiaVix(): Promise<{ vixData: VixData, chartData: ChartDataPoint[] }> {
  try {
    const url = 'https://query1.finance.yahoo.com/v8/finance/chart/%5EINDIAVIX?range=1mo&interval=1d';
    // Revalidate every 6 hours to handle "daily" but remain relatively fresh
    const res = await fetch(url, { next: { revalidate: 21600 } }); 
    const data = await res.json();
    
    if (data.chart.error) {
       throw new Error(data.chart.error.description);
    }
    
    const result = data.chart.result[0];
    const meta = result.meta;
    const timestamps = result.timestamp;
    const quote = result.indicators.quote[0];

    // Build the chart data backwards from the results
    const chartData: ChartDataPoint[] = [];
    if (timestamps && quote) {
      for (let i = 0; i < timestamps.length; i++) {
        // Only include valid points
        if (quote.close[i] !== null) {
          chartData.push({
            date: new Date(timestamps[i] * 1000).toISOString(),
            open: quote.open[i] ?? 0,
            high: quote.high[i] ?? 0,
            low: quote.low[i] ?? 0,
            close: quote.close[i] ?? 0,
            value: quote.close[i] ?? 0, // Used by the AreaChart
            volume: result.indicators.quote[0]?.volume?.[i] ?? 0,
          });
        }
      }
    }

    const currentVix = meta.regularMarketPrice;
    const previousClose = meta.chartPreviousClose; 
    const lastUpdated = new Date(meta.regularMarketTime * 1000).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }) + ' IST';

    return { 
        vixData: { value: currentVix, lastUpdated }, 
        chartData: chartData.length > 0 ? chartData : generateFallbackChartData(currentVix) 
    };
  } catch (error) {
    console.error("Failed to fetch India VIX from Yahoo Finance:", error);
    return { vixData: FALLBACK_VIX, chartData: generateFallbackChartData(FALLBACK_VIX.value) };
  }
}

// Minimal fallback generator for chart data
function generateFallbackChartData(baseValue: number, points: number = 30): ChartDataPoint[] {
    const data: ChartDataPoint[] = [];
    let lastValue = baseValue;
    const today = new Date();
    for(let i=points; i>=0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        data.push({
            date: d.toISOString(),
            open: lastValue,
            high: lastValue + 1,
            low: lastValue - 1,
            close: lastValue,
            value: lastValue,
        });
    }
    return data;
}

// Convert common Indian symbols to Yahoo symbols
function getYahooSymbol(symbol: string): string {
    if (symbol === 'NIFTY 50') return '^NSEI';
    if (symbol === 'SENSEX') return '^BSESN';
    if (symbol === 'BANK NIFTY') return '^NSEBANK';
    if (symbol === 'INDIA VIX') return '^INDIAVIX';
    // If it doesn't look like an international stock, assume NSE
    const international = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA', 'META', 'JPM', 'S&P 500', 'NASDAQ', 'FTSE 100'];
    if (!international.includes(symbol) && !symbol.includes('.')) {
         return `${symbol}.NS`;
    }
    if (symbol === 'S&P 500') return '^GSPC';
    if (symbol === 'NASDAQ') return '^IXIC';
    if (symbol === 'FTSE 100') return '^FTSE';
    return symbol;
}

export async function fetchYahooChart(symbol: string): Promise<import('./types').MainChartData> {
  const ySymbol = getYahooSymbol(symbol);
  
  // Format individual timeframe chart
  async function fetchTimeframe(range: string, interval: string): Promise<ChartDataPoint[]> {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ySymbol)}?range=${range}&interval=${interval}`;
      const res = await fetch(url, { next: { revalidate: 300 } }); 
      const data = await res.json();
      
      if (data.chart.error) return [];
      
      const result = data.chart.result[0];
      const timestamps = result.timestamp;
      const quote = result.indicators.quote[0];

      const chartData: ChartDataPoint[] = [];
      if (timestamps && quote) {
        for (let i = 0; i < timestamps.length; i++) {
          if (quote.close[i] !== null) {
            chartData.push({
              date: new Date(timestamps[i] * 1000).toISOString(),
              open: quote.open[i] ?? 0,
              high: quote.high[i] ?? 0,
              low: quote.low[i] ?? 0,
              close: quote.close[i] ?? 0,
              value: quote.close[i] ?? 0,
              volume: quote.volume?.[i] ?? 0,
            });
          }
        }
      }
      return chartData;
    } catch {
      return [];
    }
  }

  // Fetch all concurrently
  const [day, week, month, sixMonths, year] = await Promise.all([
    fetchTimeframe('1d', '5m'),
    fetchTimeframe('5d', '15m'),
    fetchTimeframe('1mo', '1d'),
    fetchTimeframe('6mo', '1d'),
    fetchTimeframe('1y', '1d')
  ]);

  // Provide fallback logic if it fails
  return {
    '1D': day.length > 0 ? day : generateFallbackChartData(100, 96),
    '5D': week.length > 0 ? week : generateFallbackChartData(100, 60),
    '1M': month.length > 0 ? month : generateFallbackChartData(100, 30),
    '6M': sixMonths.length > 0 ? sixMonths : generateFallbackChartData(100, 120),
    '1Y': year.length > 0 ? year : generateFallbackChartData(100, 250),
  };
}

// Fetch live quotes for Indian indices
export async function fetchLiveIndianIndices(): Promise<import('./types').IndexData[]> {
  const indices = [
    { name: 'NIFTY 50', symbol: 'NIFTY 50', yahoo: '^NSEI' },
    { name: 'SENSEX', symbol: 'SENSEX', yahoo: '^BSESN' },
    { name: 'BANK NIFTY', symbol: 'BANK NIFTY', yahoo: '^NSEBANK' }
  ];

  try {
    const promises = indices.map(async (idx) => {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(idx.yahoo)}?range=1d&interval=1d`;
      const res = await fetch(url, { next: { revalidate: 60 } }); 
      const data = await res.json();
      const meta = data.chart?.result?.[0]?.meta;
      
      if (!meta) throw new Error("Metadata missing for " + idx.symbol);

      const price = meta.regularMarketPrice;
      const prevClose = meta.chartPreviousClose;
      const change = price - prevClose;
      const changePercent = (change / prevClose) * 100;

      return {
        symbol: idx.symbol,
        value: price,
        change: change,
        percentChange: changePercent,
        lastUpdated: new Date(meta.regularMarketTime * 1000).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }) + ' IST'
      };
    });

    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error("Failed to fetch Live Indian Indices from Yahoo:", error);
    // Fallback to initial if Yahoo completely fails
    return [
      { symbol: 'NIFTY 50', value: 24200.50, change: -120.30, percentChange: -0.49, lastUpdated: '17 Apr, 3:30 pm IST' },
      { symbol: 'SENSEX', value: 79500.10, change: -450.80, percentChange: -0.56, lastUpdated: '17 Apr, 3:30 pm IST' },
      { symbol: 'BANK NIFTY', value: 52100.80, change: 320.40, percentChange: 0.62, lastUpdated: '17 Apr, 3:30 pm IST' }
    ];
  }
}
