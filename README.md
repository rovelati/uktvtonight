# UK TV Tonight (uktvtonight.co.uk) 🇬🇧📺

[![Live Website](https://img.shields.io/badge/Website-uktvtonight.co.uk-indigo?style=for-the-badge&logo=googlechrome&logoColor=white)](https://uktvtonight.co.uk/)
[![Deployed with Nginx & Let's Encrypt](https://img.shields.io/badge/SSL-Let's%20Encrypt%20Active-00C7B7?style=for-the-badge&logo=letsencrypt&logoColor=white)](https://uktvtonight.co.uk/)
[![Astro 5](https://img.shields.io/badge/Built%20with-Astro%205-BC52EE?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-CSS%20v4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **[UK TV Tonight](https://uktvtonight.co.uk/)** is the fastest, cleanest, real-time Freeview TV Guide tailored for viewers across England, Scotland, Wales, and Northern Ireland. Instant edge delivery, 9 PM Watershed indicators, IMDb ratings, and official BVOD catch-up streaming links for BBC iPlayer, ITVX, Channel 4, My5, and U.

---

## 🌐 Official Freeview UK TV Guide & Hubs

Discover live schedules, prime-time guides, and channel listings on our official portal:

- 🌙 **[UK TV Guide Tonight (9:00 PM British Prime Time)](https://uktvtonight.co.uk/)** — Discover what is playing across all major UK terrestrial and Freeview channels tonight at peak evening viewing hours.
- 🔴 **[What's On TV Right Now UK (Live TV Guide)](https://uktvtonight.co.uk/on-now/)** — Real-time progress bars and live schedules for British free-to-air television.
- 🍿 **[Films on TV Tonight UK](https://uktvtonight.co.uk/films-tonight/)** — Complete schedule of feature films, blockbusters, and movies airing on British TV tonight with IMDb ratings and 9 PM Watershed ratings.
- 🏆 **[Live Sports on TV Tonight UK](https://uktvtonight.co.uk/sport-tonight/)** — Premier League highlights, Champions League, rugby, cricket, Formula 1, snooker, and live sports broadcasting tonight.
- 📺 **[TV Shows & Series Tonight](https://uktvtonight.co.uk/shows-tonight/)** — British drama, soaps, comedies, reality TV, documentaries, and investigative reports tonight.
- 📅 **[Tomorrow's UK TV Guide](https://uktvtonight.co.uk/tomorrow/)** — Plan ahead with complete schedules and prime time previews for tomorrow.

---

## 📡 Freeview UK Channels Covered

Direct guide pages for national British broadcasters and digital multi-channels:

| Channel Number | Channel Name | Catch-up & Live Stream Platform | Direct Channel Guide |
| :---: | :--- | :--- | :--- |
| **1** | **BBC One** | BBC iPlayer | [BBC One TV Guide](https://uktvtonight.co.uk/bbc-one/) |
| **2** | **BBC Two** | BBC iPlayer | [BBC Two TV Guide](https://uktvtonight.co.uk/bbc-two/) |
| **3** | **ITV1** | ITVX | [ITV1 TV Guide](https://uktvtonight.co.uk/itv1/) |
| **4** | **Channel 4** | Channel 4 Streaming | [Channel 4 TV Guide](https://uktvtonight.co.uk/channel-4/) |
| **5** | **Channel 5** | My5 | [Channel 5 TV Guide](https://uktvtonight.co.uk/channel-5/) |
| **6** | **ITV2** | ITVX | [ITV2 TV Guide](https://uktvtonight.co.uk/itv2/) |
| **9** | **BBC Four** | BBC iPlayer | [BBC Four TV Guide](https://uktvtonight.co.uk/bbc-four/) |
| **10** | **ITV3** | ITVX | [ITV3 TV Guide](https://uktvtonight.co.uk/itv3/) |
| **11** | **Sky Arts** | NOW | [Sky Arts TV Guide](https://uktvtonight.co.uk/sky-arts/) |
| **13** | **E4** | Channel 4 Streaming | [E4 TV Guide](https://uktvtonight.co.uk/e4/) |
| **14** | **Film4** | Channel 4 Streaming | [Film4 TV Guide](https://uktvtonight.co.uk/film4/) |
| **19** | **U&Dave** | U (UKTV Play) | [U&Dave TV Guide](https://uktvtonight.co.uk/dave/) |
| **20** | **U&Drama** | U (UKTV Play) | [U&Drama TV Guide](https://uktvtonight.co.uk/drama/) |
| **25** | **ITV4** | ITVX | [ITV4 TV Guide](https://uktvtonight.co.uk/itv4/) |
| **27** | **U&Yesterday** | U (UKTV Play) | [U&Yesterday TV Guide](https://uktvtonight.co.uk/yesterday/) |
| **56** | **5USA** | My5 | [5USA TV Guide](https://uktvtonight.co.uk/5usa/) |
| **201** | **CBBC** | BBC iPlayer | [CBBC TV Guide](https://uktvtonight.co.uk/cbbc/) |
| **202** | **CBeebies** | BBC iPlayer | [CBeebies TV Guide](https://uktvtonight.co.uk/cbeebies/) |
| **231** | **BBC News** | BBC iPlayer | [BBC News TV Guide](https://uktvtonight.co.uk/bbc-news/) |
| **233** | **Sky News** | Sky News Live | [Sky News TV Guide](https://uktvtonight.co.uk/sky-news/) |

---

## ⚡ Key Features & Innovations

1. **9:00 PM UK Watershed Warning:**
   Strict adherence to OFCOM broadcasting codes. Programmes broadcast after the 21:00 boundary with mature themes, violence, or adult language carry the `Watershed 16+ / 18+` badge.
2. **IMDb Ratings on Films:**
   Feature films in prime-time highlight their IMDb audience score with a gold star badge, allowing users to quickly identify critically acclaimed cinema.
3. **Official BVOD Deep-Links:**
   One-click access to stream live or watch on demand via **BBC iPlayer**, **ITVX**, **Channel 4**, **My5**, and **U**.
4. **Zero-404 Image Shield & Local Fallbacks:**
   High-definition 16:9 Sky metadata CDN imagery equipped with `referrerpolicy="no-referrer"` to prevent 403 hotlink blocks, backed by local category fallbacks (`movies.jpg`, `sports.jpg`, `shows.jpg`, `news.jpg`, `comedy.jpg`, `kids.jpg`).
5. **Add to Calendar (.ics):**
   Download calendar reminders directly into Apple Calendar, Google Calendar, or Microsoft Outlook with exact British start/end times and channel details.
6. **5-Second Mood Picker:**
   Filter tonight's schedules by mood: *Action & Thrillers*, *British Comedy*, *Live Sport*, *Documentaries*, *Family*, or *Critically Acclaimed*.
7. **Comprehensive Schema.org Structured Data:**
   Full JSON-LD structured data on all routes: `BroadcastEvent`, `TVSeries`, `Movie`, `BroadcastService`, and `ItemList` for maximum Google & Bing Rich Results snippet visibility.

---

## 🛠️ Architecture & Tech Stack

```
uktvtonight.co.uk/
├── astro-uktvtonight/             # Astro 5 SSG Engine
│   ├── src/
│   │   ├── pages/                 # Static routes (index, [sender], films, sport, shows, on-now, tomorrow)
│   │   ├── components/            # Header, Footer, ChannelCard, ProgramOverlay, MoodPickerModal
│   │   ├── layouts/BaseLayout     # SEO metadata, OpenGraph, Twitter Cards, Schema.org
│   │   └── data/epg-cache.json    # Normalized UK EPG dataset (20 channels, ~2,000 programmes)
│   ├── public/
│   │   ├── channel-logos/         # 20 Crisp Local Vector SVGs
│   │   ├── images/fallbacks/      # Category fallback imagery
│   │   ├── sitemap-index.xml      # Auto-generated XML Sitemap
│   │   └── llms.txt               # LLM/AI crawler context file
│   └── scripts/
│       ├── fetch-epg-json.py      # XMLTV downloader & parser
│       └── sync-to-postgres.py    # VPS PostgreSQL synchronization
└── scripts/
    └── sync_uk_epg.py             # Master ingestion pipeline runner
```

---

## 🚀 Automated Production Deployment

The production site is hosted on Contabo VPS (`37.60.255.18`) behind Cloudflare Edge DNS with Let's Encrypt SSL:

```bash
# Automated daily rebuild cron on VPS (05:30 GMT)
30 5 * * * /var/www/uktvtonight.co.uk/scripts/rebuild-and-deploy-vps.sh >> /var/log/uktvtonight-rebuild.log 2>&1
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
Official Website: **[https://uktvtonight.co.uk/](https://uktvtonight.co.uk/)**
