#!/usr/bin/env node
/**
 * ping-indexnow.mjs — uktvtonight.co.uk
 * Submits high-priority UK Freeview TV guide URLs to IndexNow (Bing, Microsoft, Yandex, Seznam, Naver).
 */

const HOST = 'uktvtonight.co.uk';
const KEYS = [
  '4f25c5dc3491468f8459b92c21bb3ac1',
  '211149cc9ea6e1474b4a1881220eef9b'
];

const ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow'
];

// Top Priority URLs for UK TV Tonight
const PRIORITY_URLS = [
  `https://${HOST}/`,
  `https://${HOST}/films-tonight/`,
  `https://${HOST}/sport-tonight/`,
  `https://${HOST}/shows-tonight/`,
  `https://${HOST}/on-now/`,
  `https://${HOST}/tomorrow/`,
  `https://${HOST}/bbc-one/`,
  `https://${HOST}/bbc-two/`,
  `https://${HOST}/itv1/`,
  `https://${HOST}/channel-4/`,
  `https://${HOST}/channel-5/`,
  `https://${HOST}/itv2/`,
  `https://${HOST}/bbc-four/`,
  `https://${HOST}/itv3/`,
  `https://${HOST}/sky-arts/`,
  `https://${HOST}/e4/`,
  `https://${HOST}/film4/`,
  `https://${HOST}/dave/`,
  `https://${HOST}/drama/`,
  `https://${HOST}/itv4/`,
  `https://${HOST}/yesterday/`,
  `https://${HOST}/5usa/`,
  `https://${HOST}/cbbc/`,
  `https://${HOST}/cbeebies/`,
  `https://${HOST}/bbc-news/`,
  `https://${HOST}/sky-news/`,
];

async function pingIndexNow() {
  console.log(`[IndexNow] Preparing Bing/Microsoft IndexNow notification for ${HOST}...`);
  console.log(`[IndexNow] Submitting ${PRIORITY_URLS.length} priority URLs:`);
  PRIORITY_URLS.forEach((u, i) => console.log(`  ${i + 1}. ${u}`));

  for (const KEY of KEYS) {
    const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
    console.log(`\n--- Pinging with KEY: ${KEY} ---`);

    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: PRIORITY_URLS,
    };

    for (const endpoint of ENDPOINTS) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify(payload),
        });

        console.log(`[IndexNow] ${endpoint} -> Status ${response.status} (${response.statusText || 'OK'})`);
        if (!response.ok) {
          const text = await response.text();
          console.warn(`[IndexNow] Response body:`, text);
        }
      } catch (err) {
        console.error(`[IndexNow] Failed to ping ${endpoint}:`, err instanceof Error ? err.message : err);
      }
    }
  }

  console.log(`\n[IndexNow] Notification process complete!`);
}

pingIndexNow();
