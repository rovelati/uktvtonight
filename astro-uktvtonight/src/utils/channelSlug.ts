/**
 * Channel Slug Normalizer for Freeview UK
 */
export function normCid(rawId: string = ''): string {
  if (!rawId) return '';
  const clean = rawId.toLowerCase().trim()
    .replace(/^mjh-/, '')
    .replace(/\.uk$/, '')
    .replace(/\.hd$/, '')
    .replace(/\.lon$/, '')
    .replace(/\./g, '-')
    .replace(/\+/g, '-plus-')
    .replace(/[^a-z0-9\-]/g, '');

  const aliases: Record<string, string> = {
    'bbc-one-lon': 'bbc-one',
    'bbc-one-east': 'bbc-one',
    'bbc-two-ni': 'bbc-two',
    'u-and-dave': 'dave',
    'u-and-drama': 'drama',
    'u-and-yesterday': 'yesterday',
    'channel-5-hd': 'channel-5',
    'channel-4-hd': 'channel-4',
    'itv1-hd': 'itv1',
    'itv2-hd': 'itv2',
    'itv3-hd': 'itv3',
    'itv4-hd': 'itv4',
    'film4-hd': 'film4',
    'e4-hd': 'e4',
    'sky-arts-hd': 'sky-arts',
    'bbc-news-hd': 'bbc-news',
    'sky-news-hd': 'sky-news',
  };

  return aliases[clean] || clean;
}
