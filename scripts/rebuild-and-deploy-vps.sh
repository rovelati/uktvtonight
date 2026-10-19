#!/bin/bash
set -euo pipefail

LOG="/var/log/uktvtonight/rebuild.log"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting UK TV Tonight Daily Rebuild & EPG Ingestion..." | tee -a "$LOG"

cd /var/www/uktvtonight.co.uk/astro

# 1. Fetch XMLTV and refresh cache
python3 scripts/fetch-epg-json.py 2>&1 | tee -a "$LOG"

# 2. Sync to PostgreSQL database
python3 scripts/sync-to-postgres.py 2>&1 | tee -a "$LOG" || true

# 3. Build Astro SSG
npm run build 2>&1 | tee -a "$LOG"

# 4. Rsync build to web root
rsync -a --delete dist/ /var/www/uktvtonight.co.uk/dist/ 2>&1 | tee -a "$LOG"

# 6. Ping IndexNow (Bing, Microsoft, Yandex)
node scripts/ping-indexnow.mjs 2>&1 | tee -a "$LOG" || true

# 6. Ping Google Indexing API (URL_UPDATED)
python3 /var/www/uktvtonight.co.uk/scripts/push_google_indexing.py 2>&1 | tee -a "$LOG" || true

echo "[$(date '+%Y-%m-%d %H:%M:%S')] UK TV Tonight Rebuild, Deploy, IndexNow & Google Indexing SUCCESS!" | tee -a "$LOG"
