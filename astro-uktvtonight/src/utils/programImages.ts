/**
 * British TV Guide — Image & Fallback Resolver
 * Zero-latency local fallbacks served directly from Cloudflare Pages Edge.
 */

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'News': '/images/fallbacks/news.jpg',
  'News & Documentary': '/images/fallbacks/news.jpg',
  'Sports': '/images/fallbacks/sports.jpg',
  'Sport': '/images/fallbacks/sports.jpg',
  'Drama': '/images/fallbacks/shows.jpg',
  'Entertainment': '/images/fallbacks/shows.jpg',
  'Comedy': '/images/fallbacks/comedy.jpg',
  'Kids & Family': '/images/fallbacks/kids.jpg',
  'Children': '/images/fallbacks/kids.jpg',
  'Action & Adventure': '/images/fallbacks/movies.jpg',
  'Special Interest': '/images/fallbacks/default.jpg',
  'Music': '/images/fallbacks/shows.jpg',
  'Movie': '/images/fallbacks/movies.jpg',
  'Film': '/images/fallbacks/movies.jpg',
  'Default': '/images/fallbacks/default.jpg',
};

export const POPULAR_UK_PROGRAM_POSTERS: Record<string, string> = {
  'match of the day': '/images/fallbacks/sports.jpg',
  'coronation street': '/images/fallbacks/shows.jpg',
  'eastenders': '/images/fallbacks/shows.jpg',
  'emmerdale': '/images/fallbacks/shows.jpg',
  'bbc news': '/images/fallbacks/news.jpg',
  'itv news': '/images/fallbacks/news.jpg',
  'taskmaster': '/images/fallbacks/comedy.jpg',
  'doctor who': '/images/fallbacks/shows.jpg',
  'the great british bake off': '/images/fallbacks/shows.jpg',
  'strictly come dancing': '/images/fallbacks/shows.jpg',
  'the chase': '/images/fallbacks/comedy.jpg',
};

export function getFallbackImageForProgram(title: string = '', category: string = ''): string {
  const t = title.toLowerCase().trim();
  for (const [key, url] of Object.entries(POPULAR_UK_PROGRAM_POSTERS)) {
    if (t.includes(key)) return url;
  }

  if (category && CATEGORY_FALLBACK_IMAGES[category]) {
    return CATEGORY_FALLBACK_IMAGES[category];
  }

  if (category) {
    const catLower = category.toLowerCase().trim();
    for (const [catKey, url] of Object.entries(CATEGORY_FALLBACK_IMAGES)) {
      if (catLower.includes(catKey.toLowerCase())) return url;
    }
  }

  return CATEGORY_FALLBACK_IMAGES['Default'];
}

export function getCleanProgramImage(rawImageUrl: string | undefined | null, title: string = '', category: string = ''): string {
  if (rawImageUrl && rawImageUrl.startsWith('http')) {
    return rawImageUrl;
  }
  return getFallbackImageForProgram(title, category);
}
