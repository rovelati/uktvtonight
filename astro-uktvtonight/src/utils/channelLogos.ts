/**
 * High-definition SVG Logos for UK Freeview Channels (Local, zero external requests)
 */
export const UK_CHANNEL_LOGOS: Record<string, string> = {
  'bbc-one': '/channel-logos/bbc-one.svg',
  'bbc-two': '/channel-logos/bbc-two.svg',
  'itv1': '/channel-logos/itv1.svg',
  'channel-4': '/channel-logos/channel-4.svg',
  'channel-5': '/channel-logos/channel-5.svg',
  'itv2': '/channel-logos/itv2.svg',
  'bbc-four': '/channel-logos/bbc-four.svg',
  'itv3': '/channel-logos/itv3.svg',
  'sky-arts': '/channel-logos/sky-arts.svg',
  'e4': '/channel-logos/e4.svg',
  'film4': '/channel-logos/film4.svg',
  'dave': '/channel-logos/dave.svg',
  'drama': '/channel-logos/drama.svg',
  'itv4': '/channel-logos/itv4.svg',
  'yesterday': '/channel-logos/yesterday.svg',
  '5usa': '/channel-logos/5usa.svg',
  'cbbc': '/channel-logos/cbbc.svg',
  'cbeebies': '/channel-logos/cbeebies.svg',
  'bbc-news': '/channel-logos/bbc-news.svg',
  'sky-news': '/channel-logos/sky-news.svg',
  'quest': '/channel-logos/quest.svg',
  'really': '/channel-logos/really.svg',
  'more4': '/channel-logos/more4.svg',
  '5star': '/channel-logos/5star.svg',
  '5action': '/channel-logos/5action.svg',
  'great-movies': '/channel-logos/great-movies.svg',
  'dmax': '/channel-logos/dmax.svg',
  'quest-red': '/channel-logos/quest-red.svg',
  'legend': '/channel-logos/legend.svg',
  'food-network': '/channel-logos/food-network.svg',
  'hgtv': '/channel-logos/hgtv.svg',
  '5select': '/channel-logos/5select.svg',
  'challenge': '/channel-logos/challenge.svg',
  '4seven': '/channel-logos/4seven.svg',
  'great-tv': '/channel-logos/great-tv.svg',
  'talking-pictures-tv': '/channel-logos/talking-pictures-tv.svg',
};

export function getChannelLogo(slug: string, fallbackUrl?: string | null): string {
  if (UK_CHANNEL_LOGOS[slug]) return UK_CHANNEL_LOGOS[slug];
  return `/channel-logos/${slug}.svg`;
}
