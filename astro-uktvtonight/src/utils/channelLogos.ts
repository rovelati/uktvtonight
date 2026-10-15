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
};

export function getChannelLogo(slug: string, fallbackUrl?: string | null): string {
  if (UK_CHANNEL_LOGOS[slug]) return UK_CHANNEL_LOGOS[slug];
  return `/channel-logos/${slug}.svg`;
}
