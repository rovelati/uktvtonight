import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

console.log('[verify-build] Checking built artifacts in dist/ ...');

if (!fs.existsSync(distDir)) {
  console.error('[verify-build] ERROR: dist directory does not exist!');
  process.exit(1);
}

const criticalFiles = [
  'index.html',
  'bbc-one/index.html',
  'bbc-two/index.html',
  'itv1/index.html',
  'channel-4/index.html',
  'film4/index.html',
  'films-tonight/index.html',
  'sport-tonight/index.html',
  'shows-tonight/index.html',
  'on-now/index.html',
  'tomorrow/index.html',
  'robots.txt'
];

for (const file of criticalFiles) {
  const filePath = path.join(distDir, file);
  if (!fs.existsSync(filePath)) {
    console.error(`[verify-build] ERROR: Missing critical file: ${file}`);
    process.exit(1);
  }
}

console.log('[verify-build] SUCCESS: All British critical channels & landing pages verified!');
process.exit(0);
