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
function generateFallbackChartData(baseValue: number): ChartDataPoint[] {
    const data: ChartDataPoint[] = [];
    let lastValue = baseValue;
    const today = new Date();
    for(let i=30; i>=0; i--) {
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
