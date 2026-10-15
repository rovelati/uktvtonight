# 🇬🇧 UK TV Tonight (`uktvtonight.co.uk`)
## Master Project Blueprint & Implementation Guide

> **Dominio:** `uktvtonight.co.uk`  
> **Architettura:** Astro 5 (Static Site Generation / Edge) + Tailwind CSS + Cloudflare Pages  
> **Backend & Database:** PostgreSQL 16 su Contabo VPS (`37.60.255.18`)  
> **Target:** #1 Smart Freeview TV Guide nel Regno Unito con 100/100 Core Web Vitals

---

## 📑 Indice dei Moduli Operativi

1. [Architettura di Sistema & Mappa Componenti](#1-architettura-di-sistema)
2. [Base Dati & Script di Ingestion (Contabo VPS)](#2-base-dati--script-di-ingestion)
3. [EPG Spider & Parsing Freeview UK](#3-epg-spider--parsing-freeview-uk)
4. [Configurazione Progetto Astro & Core Engine](#4-configurazione-progetto-astro)
5. [Gestione Immagini & Architettura Anti-404 / Anti-Buco](#5-gestione-immagini--anti-404)
6. [Implementazione delle "Killing Features"](#6-implementazione-delle-killing-features)
7. [SEO Programmatico, Schema.org, Sitemap & Robots.txt](#7-seo-programmatico--schemaorg)
8. [Deploy Cloudflare Pages & Dominio Personalizzato](#8-deploy-cloudflare-pages)
9. [Automazione Aggiornamenti Giornalieri (Cron Workflow)](#9-automazione-aggiornamenti)

---

## 1. Architettura di Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      FONTI DATI (UK)                        │
│  • MJH XMLTV UK Feed (https://i.mjh.nz/uk/all/epg.xml.gz)   │
│  • Freeview DTT Lineup / BBC & ITV Official Catch-up APIs   │
│  • OMDb / TMDB API (per rating IMDb e poster HD)            │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Download & Parsing giornaliero)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 CONTABO VPS (37.60.255.18)                  │
│  • Database: PostgreSQL 16 (DB: uktvtonight)                │
│  • Cron Job notturno: ore 04:15 UTC                         │
│  • Output snapshot: src/data/epg-cache.json                 │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Build Time Static Generation)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             ASTRO 5 STATIC ENGINE (Cloudflare Pages)        │
│  • 100/100 PageSpeed (HTML puro + zero runtime bloat)       │
│  • Timezone: Europe/London (gestione automatica GMT/BST)    │
│  • Dati strutturati Schema.org BroadcastEvent (en-GB)       │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Global Edge Distribution)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             UTENTE FINALE (uktvtonight.co.uk)               │
│  • PWA mobile-first con PWA Push & Add to Calendar          │
│  • Filtro IMDb > 7.0 sui Film di Film4 e BBC                │
│  • Watershed (21:00) Selector + Mood Picker 5-secondi       │
│  • Deep link diretti a BBC iPlayer, ITVX, Channel 4, My5, U │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Base Dati & Script di Ingestion (Contabo VPS)

Rispettando scrupolosamente le linee guida di [`CONTABO-SERVER-RULES.md`](file:///Users/romolovelati/Desktop/uktvtonight.co.uk/CONTABO-SERVER-RULES.md), creiamo un database dedicato su PostgreSQL 16 senza interferire con gli altri progetti in produzione.

### 2.1 Creazione Database e Utente
Accesso al server via `ssh root@37.60.255.18` ed esecuzione SQL:

```sql
-- Creazione utente e database isolati
CREATE USER uktv_user WITH PASSWORD 'DEFINIRE_PASSWORD_SICURA';
CREATE DATABASE uktvtonight OWNER uktv_user;
GRANT ALL PRIVILEGES ON DATABASE uktvtonight TO uktv_user;

\c uktvtonight;

-- Tabella Canali UK (Freeview)
CREATE TABLE IF NOT EXISTS channels_uk (
    id VARCHAR(50) PRIMARY KEY,
    channel_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    lcn INT NOT NULL, -- Logical Channel Number (es. 1 per BBC One, 14 per Film4)
    logo_url TEXT,
    category VARCHAR(50) DEFAULT 'General',
    bvod_platform VARCHAR(50), -- 'BBC iPlayer', 'ITVX', 'Channel 4', 'My5', 'U'
    stream_url TEXT,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Programmi TV
CREATE TABLE IF NOT EXISTS programs_uk (
    id SERIAL PRIMARY KEY,
    channel_id VARCHAR(50) REFERENCES channels_uk(channel_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    sub_title VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    rating VARCHAR(20), -- BBFC rating: U, PG, 12, 15, 18 oppure 'Watershed'
    image_url TEXT,
    imdb_id VARCHAR(20),
    imdb_rating NUMERIC(3, 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_programs_uk_times ON programs_uk(start_time, end_time);
CREATE INDEX idx_programs_uk_channel ON programs_uk(channel_id);
CREATE INDEX idx_programs_uk_category ON programs_uk(category);
CREATE INDEX idx_programs_uk_rating ON programs_uk(imdb_rating);
```

---

## 3. EPG Spider & Parsing Freeview UK

### 3.1 Lista dei Canali Freeview Canonici UK (Ordinamento LCN)

Gli spettatori britannici usano rigorosamente i numeri LCN:

| LCN | Slug ID | Canale | BVOD Catch-up | Note / Genere |
| :---: | :--- | :--- | :--- | :--- |
| **1** | `bbc-one` | BBC One | BBC iPlayer | Flagship News, Prime Time Dramas, Match of the Day |
| **2** | `bbc-two` | BBC Two | BBC iPlayer | Documentari, Cinema d'autore, Comedy |
| **3** | `itv1` | ITV1 | ITVX | Soap (*Coronation Street*, *Emmerdale*), Intrattenimento |
| **4** | `channel-4` | Channel 4 | Channel 4 Streaming | Cinema internazionale, Serie UK, Talk show |
| **5** | `channel-5` | Channel 5 | My5 | Factual TV, UK Dramas, Documentari storici |
| **6** | `itv2` | ITV2 | ITVX | Giovani & Reality (*Love Island*) |
| **9** | `bbc-four` | BBC Four | BBC iPlayer | Musica, Archivio storico, Serie straniere |
| **11** | `sky-arts` | Sky Arts | NOW / Sky Go | Gratuito su Freeview: Teatro, Concerti, Belle arti |
| **13** | `e4` | E4 | Channel 4 Streaming | Commedie USA, Reality |
| **14** | `film4` | Film4 | Channel 4 Streaming | **Canale Cinema #1 in chiaro del Regno Unito** |
| **19** | `dave` | U&Dave | U (UKTV Play) | Stand-up comedy, *Taskmaster*, Panel shows |
| **20** | `drama` | U&Drama | U (UKTV Play) | Period drama, Classici BBC/ITV |
| **25** | `itv4` | ITV4 | ITVX | Sport d'annata, Motori, Cinema action |
| **27** | `yesterday` | U&Yesterday | U (UKTV Play) | Documentari storici, Ferrovia, Scienza |
| **56** | `5usa` | 5USA | My5 | Procedurali crime americani (*Law & Order*, *CSI*) |

### 3.2 Script Spider Python (`scripts/fetch-epg-uk.py`)
Lo script esegue il download dell'XMLTV compresso di MJH UK (`https://i.mjh.nz/uk/all/epg.xml.gz`), estrae la programmazione dei canali canonici, converte gli orari in UTC/ISO-8601 e genera lo snapshot [`src/data/epg-cache.json`](file:///Users/romolovelati/Desktop/uktvtonight.co.uk).

Funzionalità chiave dello spider:
1. Normalizza gli ID e i loghi SVG/PNG ad alta risoluzione.
2. Identifica se il programma va in onda nel periodo **Pre-Watershed** o **Post-Watershed (dopo le 21:00)**.
3. Se il programma è classificato `Movie` / `Film`, interroga una cache locale o OMDb per arricchirlo con il rating **IMDb**.
4. Genera `epg-cache.json` per garantire build statiche offline al 100%.

---

## 4. Configurazione Progetto Astro & Core Engine

### 4.1 Pacchetti e Setup
```bash
# Inizializzazione nella cartella del progetto
npm create astro@latest astro-uktvtonight -- --template minimal --no-install --no-git
cd astro-uktvtonight
npm install -D tailwindcss @tailwindcss/vite
npm install pg @types/pg
```

### 4.2 Timezone & Formattazione UK (`src/utils/timeSlots.ts`)
Fondamentale per il mercato UK che alterna **GMT** (inverno, UTC+0) e **BST** (estate, UTC+1):
```typescript
export function getTodayInUK(): string {
  const d = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', { 
    timeZone: 'Europe/London', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });
  return formatter.format(d); // YYYY-MM-DD
}

export function formatTimeUK(isoString: string): string {
  const d = new Date(isoString);
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // Formato 24h standard per le guide TV UK (es. 21:00)
  }).format(d);
}

export function isWatershed(isoString: string): boolean {
  const d = new Date(isoString);
  const hour = parseInt(new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: 'numeric',
    hourCycle: 'h23'
  }).format(d), 10);
  return hour >= 21 || hour < 5; // Dalle 21:00 alle 05:00
}
```

### 4.3 Pagine e Rotte
* `/` ➔ **Home:** *What's on TV Tonight in the UK* (Prime time 19:00 - 23:00 con tab switchabili).
* `/[sender]/` ➔ **Pagine Canale:** `/bbc-one/`, `/itv1/`, `/channel-4/`, `/film4/`, `/dave/`.
* `/films-tonight/` ➔ **Films on TV Tonight:** Con filtro IMDb > 7.0, sinossi e indicazione canale.
* `/sport-tonight/` ➔ **Live Sport on Freeview:** Orario di kickoff esatto e broadcaster.
* `/shows-tonight/` ➔ **British TV Shows & Soaps:** (*EastEnders*, *Coronation Street*, ecc.).
* `/on-now/` ➔ **On Now & Next:** Programmi in onda in tempo reale con barra di completamento.
* `/tomorrow/` ➔ **Tomorrow's TV Guide**.

---

## 5. Gestione Immagini & Anti-404

Per evitare gli errori 404/403 riscontrati con i CDN remoti, il progetto UK adotta fin dal Day 1 la **strategia a triplo scudo**:

1. **Asset di Fallback Locali su Cloudflare Edge (`public/images/fallbacks/`):**
   * `sports.jpg`: Wembley / Premier League action shot.
   * `movies.jpg`: Cinema classico / Film4 aesthetic.
   * `shows.jpg`: British drama / studio lighting.
   * `news.jpg`: BBC/ITV newsroom desk.
   * `comedy.jpg`: Stand-up comedy stage (Dave style).
   * `kids.jpg`: Animazione per bambini (CBBC/CBeebies).
   * `default.jpg`: TV lounge contemporanea.

2. **Matching Dedicato ai Poster dei Grandi Programmi UK (`POPULAR_UK_PROGRAM_POSTERS`):**
   * Pre-impostati per i campioni d'ascolto: *Match of the Day*, *Coronation Street*, *EastEnders*, *Emmerdale*, *Doctor Who*, *Strictly Come Dancing*, *The Great British Bake Off*, *Taskmaster*, *Gogglebox*.

3. **Scudo Visivo CSS + onerror a Prova di Errore:**
   Ogni contenitore immagine include un badge di sfondo con icona tematica (es. 🍿 `Film4 / Movie`, 🏉 `Live Sport`, 📺 `BBC Series`). In caso di errore o blocco di rete:
   ```html
   <img 
     src={displayImage} 
     alt={program.title} 
     class="w-full h-full object-cover relative z-10"
     loading="lazy"
     referrerpolicy="no-referrer"
     onerror="if (!this.src.endsWith('/images/fallbacks/movies.jpg')) { this.src = '/images/fallbacks/movies.jpg'; } else { this.style.display = 'none'; }"
   />
   ```
   *Risultato:* **Zero buchi vuoti, zero icone di immagine spezzata, zero 404 in console.**

---

## 6. Implementazione delle "Killing Features"

### 6.1 ⭐ Il Filtro Qualità IMDb / Rotten Tomatoes
* Nel componente `FilmCard.astro`, accanto a ogni titolo compare:
  ```html
  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold">
    ⭐ 7.8 IMDb
  </span>
  ```
* In cima alla pagina `/films-tonight/`:
  ```html
  <button id="filter-top-rated" onclick="toggleTopRated()" class="...">
    ⭐ High Rating Only (> 7.0)
  </button>
  ```

### 6.2 🔗 Il Bridge Diretto a BVOD (Catch-up Ufficiale)
Nel modale informativo di ogni programma:
* Un pulsante primario rosso acceso: **"Watch Live / Catch Up on BBC iPlayer"** (o ITVX / Channel 4).
* Link diretto profondo (*deep-link*) al catalogo streaming ufficiale, risolvendo il problema di chi accende la TV a programma già iniziato.

### 6.3 🌙 Il Filtro "The 9 PM Watershed"
* Badge evidenziatore viola `18+ Post-Watershed` per tutti i programmi in onda dopo le 21:00.
* Switch per visualizzare solo la seconda serata per adulti (*Late Night Thrillers & Crime*).

### 6.4 📅 Aggiungi al Calendario (Google & Apple iCal)
* Generazione istantanea del file `.ics` e URL `https://calendar.google.com/calendar/render?action=TEMPLATE...` per impostare un promemoria sullo smartphone con 1 solo click.

### 6.5 🎲 "The 5-Second Decision Maker" (Mood Picker)
* Un drawer interattivo che chiede:
  1. *Cosa vuoi provare stasera?* (`Laugh` | `Get Thrilled` | `Watch Drama` | `Live Match`)
  2. Restituisce all'istante **i 3 migliori programmi raccomandati** con trailer e orario esatto.

---

## 7. SEO Programmatico, Schema.org, Sitemap & Robots.txt

### 7.1 Dati Strutturati JSON-LD (`BroadcastEvent` & `ItemList`)
Ogni pagina genera il markup approvato da Google per l'inclusione nei rich snippet:
```json
{
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "What's on TV Tonight in the UK - Freeview TV Guide",
  "inLanguage": "en-GB",
  "spatialCoverage": {
    "@type": "Country",
    "name": "United Kingdom",
    "identifier": "GB"
  },
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "BroadcastEvent",
        "name": "Match of the Day",
        "description": "Gary Lineker and guests review the latest Premier League action.",
        "startDate": "2026-10-17T21:30:00+01:00",
        "inLanguage": "en-GB",
        "location": {
          "@type": "BroadcastService",
          "name": "BBC One",
          "broadcastChannelId": "1"
        }
      }
    }
  ]
}
```

### 7.2 `robots.txt`
```txt
User-agent: *
Allow: /

Sitemap: https://uktvtonight.co.uk/sitemap-index.xml
```

### 7.3 `sitemap.xml`
Generato automaticamente da `@astrojs/sitemap` includendo:
* Homepage (`/`) con `priority: 1.0`, `changefreq: hourly`
* Pagine canali (`/bbc-one/`, `/itv1/`, ecc.) con `priority: 0.9`
* Categorie verticali (`/films-tonight/`, `/sport-tonight/`, `/shows-tonight/`) con `priority: 0.9`

---

## 8. Deploy Cloudflare Pages

1. **Configurazione Account Cloudflare:**
   * Utilizzare il token presente in `.cloudflare-token`.
   * Progetto Cloudflare Pages: `uktvtonight`.
2. **Comando di Deploy Diretto:**
   ```bash
   npx wrangler pages deploy dist --project-name="uktvtonight" --branch=main --commit-dirty=true
   ```
3. **Collegamento Dominio:**
   * Associazione dominio `uktvtonight.co.uk` su Cloudflare Pages.
   * DNS CNAME verso `uktvtonight.pages.dev` con Proxy Cloudflare attivo (arancione).
   * SSL Edge abilitato: *Full (Strict)*.

---

## 9. Automazione Aggiornamenti (Cron Workflow)

Per garantire palinsesti sempre aggiornati 7 giorni su 7:

* **Ore 04:15 UTC (Contabo VPS):** 
  Lo spider `fetch-epg-uk.py` scarica l'XMLTV più recente, aggiorna il database PostgreSQL e rigenera `epg-cache.json`.
* **Ore 04:30 UTC:** 
  Uno script esegue `npm run build` e distribuisce i nuovi file statici su Cloudflare Pages con latenza globale immediata.
* **Health Check automatico:**
  Script di verifica che valida la presenza dei canali critici (BBC One, ITV1, Channel 4, Film4) prima del deploy.

---
*Documentazione redatta per l'avvio immediato del progetto `uktvtonight.co.uk`.*
