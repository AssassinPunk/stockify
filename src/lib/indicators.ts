import { ChartDataPoint } from "./types";

export function calculateMA(data: ChartDataPoint[], period: number = 20) {
  return data.map((d, i) => {
    if (i < period - 1) return { ...d, value: null };
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += data[j].close;
    }
    return { ...d, value: sum / period };
  });
}

export function calculateRSI(data: ChartDataPoint[], period: number = 14) {
  return data.map((d, i) => {
    if (i < period) return { ...d, value: null };
    let gains = 0;
    let losses = 0;
    for (let j = i - period + 1; j <= i; j++) {
      const change = data[j].close - data[j - 1].close;
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }
    const rs = gains / (losses || 1);
    const rsi = 100 - 100 / (1 + rs);
    return { ...d, value: rsi };
  });
}

export function calculateADL(data: ChartDataPoint[]) {
  let prevADL = 0;
  return data.map((d) => {
    let mfm = 0;
    const range = d.high - d.low;
    if (range > 0) {
      mfm = ((d.close - d.low) - (d.high - d.close)) / range;
    }
    const mfv = mfm * (d.volume || 1); // fallback to 1 if no volume
    const adl = prevADL + mfv;
    prevADL = adl;
    return { ...d, value: adl };
  });
}
