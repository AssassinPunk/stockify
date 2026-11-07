import type { MainChartData } from './types';

// A refresh that fails returns empty series. Keep the last real data for those periods, so one bad
// poll doesn't wipe a chart that is already on screen.
export function mergeChartData(previous: MainChartData, next: MainChartData): MainChartData {
  const merged = { ...next };
  for (const key of Object.keys(previous) as (keyof MainChartData)[]) {
    if (!next[key]?.length) merged[key] = previous[key];
  }
  return merged;
}
