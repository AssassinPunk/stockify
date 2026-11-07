import type { NewsArticle } from './types';

export type Desk = 'India' | 'Global';
export type DeskStory = NewsArticle & { desk: Desk };

// Some feed items are the title of a live page rather than a story. They stay in the list, quietly,
// and are never picked as the top story.
const PAGE_TITLE_PATTERNS = [
  /\b(share|stock)\s+market\s+(live|today)\b/i,
  /\blive\s+(updates?|blog|coverage)\b/i,
  /\bon\s+the\s+economic\s+times$/i,
];

export const isPageTitle = (title: string) => PAGE_TITLE_PATTERNS.some(pattern => pattern.test(title));

/** The publisher is shown beside every item, so it doesn't need repeating at the end of a page title. */
export const displayTitle = (title: string) => title.replace(/\s+on\s+the\s+economic\s+times$/i, '');

/** "3 hours ago" as "3h", for the time column. */
export function shortAge(timestamp: string): string {
  if (timestamp === 'Just now') return 'Now';
  const match = timestamp.match(/^(\d+)\s+(min|hour|day)/);
  return match ? `${match[1]}${match[2][0]}` : '—';
}

/** Both desks as one list, newest first, with repeats removed. Items with no publish time go last. */
export function mergeDesks(india: NewsArticle[], global: NewsArticle[]): DeskStory[] {
  const seen = new Set<string>();
  const all: DeskStory[] = [
    ...india.map(story => ({ ...story, desk: 'India' as const })),
    ...global.map(story => ({ ...story, desk: 'Global' as const })),
  ];
  return all
    .filter(story => {
      const key = story.title.trim().toLowerCase();
      if (seen.has(story.id) || seen.has(key)) return false;
      seen.add(story.id);
      seen.add(key);
      return true;
    })
    .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
}

/**
 * The newest real story leads, with up to three more beside it. Those three come from whichever desk
 * has more left, so the two desks below stay about the same length.
 */
export function pickLead(stories: DeskStory[]): { top: DeskStory | null; next: DeskStory[]; rest: DeskStory[] } {
  const realStories = stories.filter(story => !isPageTitle(story.title));
  const top = realStories[0] ?? null;
  if (!top) return { top: null, next: [], rest: stories };

  const next: DeskStory[] = [];
  const remaining = realStories.slice(1);
  const left = { India: 0, Global: 0 };
  stories.forEach(story => { if (story !== top) left[story.desk] += 1; });

  while (next.length < 3 && remaining.length > 0) {
    const fuller: Desk = left.India >= left.Global ? 'India' : 'Global';
    const index = remaining.findIndex(story => story.desk === fuller);
    const [story] = remaining.splice(index === -1 ? 0 : index, 1);
    left[story.desk] -= 1;
    next.push(story);
  }

  next.sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
  const featured = new Set<DeskStory>([top, ...next]);
  return { top, next, rest: stories.filter(story => !featured.has(story)) };
}

/** Real stories first, live pages after them, each newest first. */
export const wireOrder = (stories: DeskStory[]) => [
  ...stories.filter(story => !isPageTitle(story.title)),
  ...stories.filter(story => isPageTitle(story.title)),
];
