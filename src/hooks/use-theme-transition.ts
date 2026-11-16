'use client';

import { useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { prepareChartsFor } from '@/lib/chart-theme';
import { getTheme, setTheme, useTheme, type Theme } from '@/lib/theme';

// ── Tuning ───────────────────────────────────────────────────────────────────
export const THEME_TRANSITION = {
  duration: 1000,                            // ms
  easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
  points: 40,                                // points on the price line; fixed, so the shape morphs smoothly
  jaggedness: 0.09,                          // height of the line's swings, as a share of the screen height
  spreadBy: 0.5,                             // share of the run by which the reveal has reached both sides
  tickerGap: 28,                             // px kept clear at the right edge for the pulsing dot
  overshoot: 14,                             // px the finished shape runs past each side, so the glow leaves too
  // CSS variables for the line: the gain colour when going light, the loss colour when going dark.
  // They are read from the dark theme's set, whose brighter shades show against both themes.
  accent: { light: '--up', dark: '--down' } as Record<Theme, string>,
};

const SVG_NS = 'http://www.w3.org/2000/svg';
type Point = [number, number];

// A random walk scaled into -1..1, new on every switch.
function randomWalk(count: number) {
  const steps: number[] = [0];
  for (let i = 1; i < count; i += 1) steps.push(steps[i - 1] + (Math.random() - 0.5) * 2 + 0.06);
  const min = Math.min(...steps);
  const max = Math.max(...steps);
  const span = max - min || 1;
  return steps.map(v => ((v - min) / span) * 2 - 1);
}

// The outline of the revealed area at progress 0..1: up the left side, along the price line, down the
// right side. It starts as a sliver below the screen at the toggle's x and ends covering everything.
function outline(progress: number, walk: number[], originX: number, width: number, height: number): Point[] {
  const { jaggedness, spreadBy, tickerGap, overshoot } = THEME_TRANSITION;
  const swing = height * jaggedness;
  const spread = Math.min(1, progress / spreadBy);
  const settle = Math.max(0, (progress - spreadBy) / (1 - spreadBy));

  const left = originX + (-overshoot - originX) * spread;
  const rightAtSpread = Math.max(originX, width - tickerGap);
  const right = originX + (rightAtSpread - originX) * spread + (width + overshoot - rightAtSpread) * settle;
  // From just below the bottom edge to just above the top one, with room for the swings at both ends.
  const base = height + swing + 4 - progress * (height + 2 * swing + 8);
  const floor = height + swing + 8;

  const top = walk.map((v, i): Point => [left + (i / (walk.length - 1)) * (right - left), base + v * swing]);
  return [[left, floor], ...top, [right, floor]];
}

const polygon = (points: Point[]) => `polygon(${points.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(', ')})`;
const pathData = (points: Point[]) => points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');

function buildLine(theme: Theme, width: number, height: number) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'theme-reveal-line dark'); // `dark` scopes the dark theme's variables to the line
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('aria-hidden', 'true');
  svg.style.color = `hsl(var(${THEME_TRANSITION.accent[theme]}))`;

  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('stroke', 'currentColor');
  const pulse = document.createElementNS(SVG_NS, 'circle');
  pulse.setAttribute('class', 'theme-reveal-pulse');
  pulse.setAttribute('r', '4');
  pulse.setAttribute('fill', 'currentColor');
  const dot = document.createElementNS(SVG_NS, 'circle');
  dot.setAttribute('r', '4');
  dot.setAttribute('fill', 'currentColor');
  svg.append(path, pulse, dot);

  return {
    svg,
    draw(points: Point[]) {
      path.setAttribute('d', pathData(points));
      const [x, y] = points[points.length - 2]; // the newest point on the price line
      for (const circle of [pulse, dot]) { circle.setAttribute('cx', x.toFixed(1)); circle.setAttribute('cy', y.toFixed(1)); }
    },
  };
}

const nextFrames = (count: number) =>
  new Promise<void>(resolve => {
    const step = (left: number) => (left <= 0 ? resolve() : requestAnimationFrame(() => step(left - 1)));
    step(count);
  });

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { ready: Promise<void>; finished: Promise<void> };
};

// Switches between dark and light. Where the browser can, the new theme is revealed from under a
// climbing price line that starts at the toggle; otherwise the switch is instant.
export function useThemeTransition() {
  const theme = useTheme();
  const running = useRef(false);

  const toggleTheme = useCallback(async (origin?: Element | null) => {
    if (running.current) return; // a second click during a reveal is ignored
    const next: Theme = getTheme() === 'dark' ? 'light' : 'dark';
    const doc = document as ViewTransitionDocument;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!doc.startViewTransition || reduced) {
      prepareChartsFor(next, false);
      flushSync(() => setTheme(next));
      return;
    }

    running.current = true;
    const root = document.documentElement;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const box = origin?.getBoundingClientRect();
    const originX = box ? box.left + box.width / 2 : width / 2;
    const walk = randomWalk(THEME_TRANSITION.points);
    const line = buildLine(next, width, height);
    let frame = 0;

    try {
      // The canvas charts take the new colours now, hidden under a picture of their old look, and get
      // two frames to repaint. Everything else follows the CSS variables the moment the class flips.
      const unfreezeCharts = prepareChartsFor(next, true);
      await nextFrames(2);

      root.dataset.themeTransition = next;
      const transition = doc.startViewTransition(() => {
        flushSync(() => setTheme(next));
        unfreezeCharts();
        line.draw(outline(0, walk, originX, width, height));
        document.body.appendChild(line.svg);
      });

      await transition.ready;
      const reveal = root.animate(
        {
          clipPath: [0, THEME_TRANSITION.spreadBy, 1].map(p => polygon(outline(p, walk, originX, width, height))),
          offset: [0, THEME_TRANSITION.spreadBy, 1],
        },
        { duration: THEME_TRANSITION.duration, easing: THEME_TRANSITION.easing, pseudoElement: '::view-transition-new(root)' },
      );
      // The line reads the same eased progress as the clip, so the two never drift apart.
      const follow = () => {
        const progress = reveal.effect?.getComputedTiming().progress;
        if (typeof progress === 'number') line.draw(outline(progress, walk, originX, width, height));
        frame = requestAnimationFrame(follow);
      };
      follow();

      await transition.finished;
    } catch {
      // A transition the browser skipped (tab hidden, another one started) still leaves the right theme.
      if (getTheme() !== next) { prepareChartsFor(next, false); flushSync(() => setTheme(next)); }
    } finally {
      cancelAnimationFrame(frame);
      line.svg.remove();
      delete root.dataset.themeTransition;
      running.current = false;
    }
  }, []);

  return { theme, toggleTheme };
}
