import { ColorType, type IChartApi, type ISeriesApi, type SeriesType } from 'lightweight-charts';
import { getTheme, type Theme } from '@/lib/theme';

// The price charts draw on a canvas, which cannot read CSS variables, so their colours live here,
// one set per theme. The surfaces match --card, --chart-well and --background in globals.css.
export type ChartSurface = 'card' | 'well' | 'ground';

export type ChartPalette = {
  surface: Record<ChartSurface, string>;
  grid: string;
  text: string;
  line: string;        // the main price line, and the first of two compared lines
  areaTop: string;
  areaBottom: string;
  up: string;
  down: string;
  average: string;     // moving average and the second compared line
  compare: string[];   // overlays added on the main chart
};

export const CHART_PALETTES: Record<Theme, ChartPalette> = {
  dark: {
    surface: { card: '#121212', well: '#050505', ground: '#000000' },
    grid: '#1c1c1c',
    text: '#888888',
    line: '#d4d4d4',
    areaTop: 'rgba(99,102,241,0.35)',
    areaBottom: 'rgba(99,102,241,0)',
    up: '#10b981',
    down: '#ef4444',
    average: '#fbbf24',
    compare: ['#3b82f6', '#f59e0b', '#22d3ee', '#ec4899', '#14b8a6'],
  },
  light: {
    surface: { card: '#ffffff', well: '#fafafa', ground: '#f5f5f5' },
    grid: '#ebebeb',
    text: '#616161',
    line: '#262626',
    areaTop: 'rgba(99,102,241,0.22)',
    areaBottom: 'rgba(99,102,241,0)',
    up: '#059669',
    down: '#dc2626',
    average: '#b45309',
    compare: ['#2563eb', '#b45309', '#0e7490', '#be185d', '#0f766e'],
  },
};

export const chartPalette = (theme: Theme = getTheme()) => CHART_PALETTES[theme];

// Everything about a chart's frame that depends on the theme. applyOptions merges it into the rest.
export const frameOptions = (p: ChartPalette, surface: ChartSurface) => ({
  layout: { background: { type: ColorType.Solid as const, color: p.surface[surface] }, textColor: p.text },
  grid: { vertLines: { color: p.grid }, horzLines: { color: p.grid } },
  rightPriceScale: { borderColor: p.grid },
  timeScale: { borderColor: p.grid },
});

type Painter = (p: ChartPalette) => Record<string, unknown>;
type Entry = { charts: IChartApi[]; repaint: (p: ChartPalette) => void };

const live = new Set<Entry>();

// One per chart build. It hands out the current colours, remembers what it coloured, and re-colours
// it when the theme changes. Call dispose() when the chart is removed.
export function chartTheme(surface: ChartSurface) {
  const charts: IChartApi[] = [];
  const painted: [ISeriesApi<SeriesType>, Painter][] = [];
  const entry: Entry = {
    charts,
    repaint: p => {
      charts.forEach(chart => chart.applyOptions(frameOptions(p, surface)));
      painted.forEach(([series, paint]) => series.applyOptions(paint(p)));
    },
  };
  live.add(entry);

  return {
    palette: chartPalette(),
    frame: frameOptions(chartPalette(), surface),
    chart<T extends IChartApi>(chart: T) { charts.push(chart); return chart; },
    // Colours a series now and again on every theme change.
    series<T extends ISeriesApi<SeriesType>>(series: T, paint: Painter) {
      series.applyOptions(paint(chartPalette()));
      painted.push([series, paint]);
      return series;
    },
    dispose() { live.delete(entry); },
  };
}

// Re-colours every chart on screen for `theme`.
// A canvas only repaints on the next frame, so for an animated switch `freeze` first lays a picture of
// each chart's current look over it. The old theme's snapshot then shows the old chart, while the real
// one repaints underneath. The returned function removes the pictures.
export function prepareChartsFor(theme: Theme, freeze: boolean) {
  const undo: (() => void)[] = [];
  const palette = chartPalette(theme);

  live.forEach(entry => {
    if (freeze) {
      entry.charts.forEach(chart => {
        try {
          const host = chart.chartElement().parentElement;
          if (!host) return;
          const picture = chart.takeScreenshot();
          Object.assign(picture.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', zIndex: '5', pointerEvents: 'none' });
          picture.setAttribute('aria-hidden', 'true');
          const wasStatic = getComputedStyle(host).position === 'static';
          if (wasStatic) host.style.position = 'relative';
          host.appendChild(picture);
          undo.push(() => { picture.remove(); if (wasStatic) host.style.position = ''; });
        } catch { /* a chart that is mid-teardown just switches without the picture */ }
      });
    }
    try { entry.repaint(palette); } catch { /* removed chart */ }
  });

  return () => undo.forEach(run => run());
}
