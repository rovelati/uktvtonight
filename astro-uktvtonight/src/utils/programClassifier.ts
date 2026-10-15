/**
 * Program Classifier for British TV
 * Accurate categorization for Movies/Films, Live Sport, British Dramas, News, and Comedy.
 */

export function isMovie(category: string = '', title: string = '', description: string = ''): boolean {
  const cat = (category || '').toLowerCase();
  const text = `${title} ${description}`.toLowerCase();

  if (cat.includes('movie') || cat.includes('film') || cat.includes('cinema')) return true;
  if (text.includes('starring ') && (text.includes('directed by') || text.includes('feature film'))) return true;
  return false;
}

export function isSport(category: string = '', title: string = '', description: string = ''): boolean {
  const cat = (category || '').toLowerCase();
  const text = `${title} ${description}`.toLowerCase();

  const sportKeywords = [
    'sport', 'football', 'premier league', 'fa cup', 'match of the day', 'champions league',
    'rugby', 'six nations', 'cricket', 'the ashes', 'snooker', 'darts', 'formula 1', 'f1',
    'motogp', 'tennis', 'wimbledon', 'golf', 'boxing', 'mma', 'athletics', 'cycling',
    'horse racing', 'grand national', 'super league', 'afl', 'world cup'
  ];

  if (cat.includes('sport')) return true;
  return sportKeywords.some(k => text.includes(k));
}

export function isSeries(category: string = '', title: string = '', description: string = ''): boolean {
  const cat = (category || '').toLowerCase();
  const text = `${title} ${description}`.toLowerCase();

  if (cat.includes('drama') || cat.includes('series') || cat.includes('soap') || cat.includes('comedy') || cat.includes('sitcom')) {
    return true;
  }

  const seriesKeywords = [
    'episode', 'season', 'series', 'part 1', 'part 2', 'coronation street', 'eastenders',
    'emmerdale', 'doctor who', 'death in paradise', 'silent witness', 'vera', 'line of duty',
    'peaky blinders', 'call the midwife', 'midsomer murders', 'taskmaster'
  ];

  return seriesKeywords.some(k => text.includes(k));
}

export function isNews(category: string = '', title: string = '', description: string = ''): boolean {
  const cat = (category || '').toLowerCase();
  const text = `${title} ${description}`.toLowerCase();

  return cat.includes('news') || text.includes('bbc news') || text.includes('itv news') || text.includes('channel 4 news') || text.includes('weather');
}
