#!/usr/bin/env python3
"""
Sync EPG cache data into Contabo VPS PostgreSQL database (uktvtonight).
Transfers channels and programs into public.channels_uk and public.programs_uk.
"""
import json
import os
import subprocess
import sys

DATA_FILE = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'epg-cache.json')
SQL_FILE = os.path.join(os.path.dirname(__file__), 'epg-insert.sql')
PASSWD_FILE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '.new-server-passwd'))

def escape_sql(val):
    if val is None:
        return 'NULL'
    s = str(val).replace("'", "''")
    return f"'{s}'"

def main():
    if not os.path.exists(DATA_FILE):
        print(f"Error: {DATA_FILE} not found!")
        sys.exit(1)

    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)

    channels = data.get('channels', [])
    programs = data.get('programs', [])

    print(f"Loaded {len(channels)} channels and {len(programs)} programs from {DATA_FILE}.")

    with open(SQL_FILE, 'w', encoding='utf-8') as f:
        f.write("BEGIN;\n")
        f.write("TRUNCATE TABLE programs_uk CASCADE;\n")
        f.write("TRUNCATE TABLE channels_uk CASCADE;\n\n")

        # Insert channels
        for ch in channels:
            ch_id = escape_sql(ch.get('id'))
            name = escape_sql(ch.get('name'))
            lcn = int(ch.get('number', 0))
            logo = escape_sql(ch.get('logo'))
            bvod = escape_sql(ch.get('bvod_platform'))
            stream = escape_sql(ch.get('stream_url'))
            f.write(
                f"INSERT INTO channels_uk (id, channel_id, name, lcn, logo_url, bvod_platform, stream_url) "
                f"VALUES ({ch_id}, {ch_id}, {name}, {lcn}, {logo}, {bvod}, {stream});\n"
            )

        f.write("\n")

        # Insert programs in batches
        for p in programs:
            ch_id = escape_sql(p.get('channel_id'))
            title = escape_sql(p.get('title'))
            sub_title = escape_sql(p.get('sub_title'))
            desc = escape_sql(p.get('description'))
            cat = escape_sql(p.get('category'))
            start_t = escape_sql(p.get('start_time'))
            end_t = escape_sql(p.get('end_time'))
            rating = escape_sql(p.get('rating'))
            img = escape_sql(p.get('image_url'))
            imdb_id = escape_sql(p.get('imdb_id'))
            imdb_rating = p.get('imdb_rating')
            imdb_val = f"{float(imdb_rating):.1f}" if imdb_rating is not None else "NULL"

            f.write(
                f"INSERT INTO programs_uk (channel_id, title, sub_title, description, category, start_time, end_time, rating, image_url, imdb_id, imdb_rating) "
                f"VALUES ({ch_id}, {title}, {sub_title}, {desc}, {cat}, {start_t}, {end_t}, {rating}, {img}, {imdb_id}, {imdb_val});\n"
            )

        f.write("COMMIT;\n")

    print(f"Generated SQL at {SQL_FILE} ({os.path.getsize(SQL_FILE)} bytes).")

    # Detect if we are running locally on the VPS
    is_on_vps = os.path.exists('/var/www/uktvtonight.co.uk') or os.path.exists('/var/log/uktvtonight')

    if is_on_vps:
        print("Running locally on Contabo VPS: applying SQL directly via su - postgres...")
        cmd = f'su - postgres -c "psql -d uktvtonight -f {SQL_FILE}"'
        res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if res.returncode == 0:
            print("Successfully synchronized EPG data to Contabo PostgreSQL database!")
            if os.path.exists(SQL_FILE):
                os.remove(SQL_FILE)
        else:
            print(f"Failed to sync to Postgres directly: {res.stderr}")
            sys.exit(res.returncode)
    else:
        # Now execute on Contabo VPS via sshpass from remote dev machine
        print("Uploading and executing SQL on Contabo VPS via SSH...")
        cmd = (
            f"sshpass -f '{PASSWD_FILE}' scp -o StrictHostKeyChecking=no '{SQL_FILE}' root@37.60.255.18:/tmp/epg-uk.sql && "
            f"sshpass -f '{PASSWD_FILE}' ssh -o StrictHostKeyChecking=no root@37.60.255.18 'su - postgres -c \"psql -d uktvtonight -f /tmp/epg-uk.sql\" > /tmp/psql_uk.log 2>&1 && rm -f /tmp/epg-uk.sql && echo OK'"
        )
        res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if res.returncode == 0:
            print("Successfully synchronized EPG data to Contabo PostgreSQL database!")
            if os.path.exists(SQL_FILE):
                os.remove(SQL_FILE)
        else:
            print(f"Failed to sync to Postgres: {res.stderr}")
            sys.exit(res.returncode)

if __name__ == '__main__':
    main()
