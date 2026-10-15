#!/usr/bin/env python3
"""
UK TV Tonight — Automated EPG Ingestion & Database Pipeline
Downloads Freeview UK XMLTV feed, normalizes programmes, updates snapshot cache,
and syncs directly with PostgreSQL on Contabo VPS.
"""
import os
import subprocess
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASTRO_DIR = os.path.join(BASE_DIR, '..', 'astro-uktvtonight')

def main():
    print("=== UK TV Tonight: Daily EPG Pipeline ===")
    
    # 1. Fetch XMLTV and generate JSON cache
    fetch_script = os.path.join(ASTRO_DIR, 'scripts', 'fetch-epg-json.py')
    print(f"Step 1: Running {fetch_script} ...")
    res1 = subprocess.run([sys.executable, fetch_script], cwd=ASTRO_DIR)
    if res1.returncode != 0:
        print("ERROR: fetch-epg-json.py failed!")
        sys.exit(res1.returncode)

    # 2. Sync to Postgres database on Contabo
    sync_script = os.path.join(ASTRO_DIR, 'scripts', 'sync-to-postgres.py')
    if os.path.exists(sync_script):
        print(f"Step 2: Syncing database via {sync_script} ...")
        res2 = subprocess.run([sys.executable, sync_script], cwd=ASTRO_DIR)
        if res2.returncode != 0:
            print("WARNING: PostgreSQL sync encountered issues (see above). Continuing...")

    print("=== UK TV Tonight Pipeline Complete! ===")

if __name__ == '__main__':
    main()
