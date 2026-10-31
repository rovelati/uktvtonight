import type { Program } from '../types';

// Canonical UK Freeview LCN Order
export const MAJOR_UK_ORDER: string[] = [
  'bbc-one',
  'bbc-two',
  'itv1',
  'channel-4',
  'channel-5',
  'itv2',
  'bbc-four',
  'itv3',
  'sky-arts',
  'quest',
  'e4',
  'film4',
  'really',
  'more4',
  'dave',
  'drama',
  'itv4',
  'yesterday',
  '5star',
  '5action',
  'great-movies',
  'dmax',
  'quest-red',
  'legend',
  'food-network',
  'hgtv',
  '5select',
  'challenge',
  '4seven',
  'great-tv',
  '5usa',
  'talking-pictures-tv',
  'cbbc',
  'cbeebies',
  'bbc-news',
  'sky-news'
];

export function filterRealPrograms(programs: Program[]): Program[] {
  return programs.filter(p => {
    const t = (p.title || '').toLowerCase().trim();
    if (!t) return false;
    if (t.includes('off air') || t.includes('teleshopping') || t.includes('closedown') || t.includes('pages from ceefax')) {
      return false;
    }
    return true;
  });
}
