/**
 * adsense.ts — UK TV Tonight AdSense Constants
 * Centralized Slot IDs and Publisher ID for uktvtonight.co.uk.
 */

export const ADSENSE_CLIENT_ID = 'ca-pub-2168172914069272';

export const ADSENSE_SLOTS = {
  IN_FEED_CHANNELS:    '3881971380', // Responsive in-feed ad between channel cards
  CHANNEL_MID_CONTENT: '4452817027', // Mid-content ad on channel detail pages
  PRE_FOOTER:          '1255808043', // Bottom banner before footer / FAQ
} as const;
