# 🇬🇧 UK TV Tonight (`uktvtonight.co.uk`)

> The fastest, smartest, and cleanest Freeview TV guide in the United Kingdom. Built with Astro 5, Tailwind CSS, PostgreSQL on Contabo VPS, and deployed to Cloudflare Pages edge network.

---

## 📚 Documentazione del Progetto

* 📋 **[PROJECT-BLUEPRINT.md](./PROJECT-BLUEPRINT.md)**: Il piano di implementazione master dettagliato (Database, Spider, Astro Engine, Schema.org, Killer Features, Cloudflare).
* 🖥️ **[CONTABO-SERVER-RULES.md](./CONTABO-SERVER-RULES.md)**: Regole operative e inventario porte/servizi del server VPS Contabo (`37.60.255.18`).

---

## ⚡ Caratteristiche Principali del Progetto

1. **Top Freeview UK Channels:** Ordinamento rigoroso per LCN (BBC One #1, BBC Two #2, ITV1 #3, Channel 4 #4, Channel 5 #5, Film4 #14, Dave #19, ecc.).
2. **⭐ IMDb Rating Filter:** Badge con voto IMDb per i film in onda e filtro "Solo film > 7.0".
3. **🌙 The 9 PM Watershed Selector:** Evidenziazione dei contenuti post-spartiacque per adulti e thriller.
4. **🔗 BVOD Catch-up Deep Links:** Collegamento diretto e rapido a BBC iPlayer, ITVX, Channel 4 Streaming, My5 e U (UKTV Play).
5. **📅 Smart Calendar / Rubrica:** Aggiunta immediata dell'evento al calendario Google / Apple iCal per non perdere la diretta.
6. **🛡️ Zero-404 Architecture:** Fallback locali a zero latenza su Cloudflare Edge con scudo visivo SVG/CSS anti-buco.
7. **🚀 100/100 Core Web Vitals:** Static Site Generation pura, tempi di caricamento inferiori a 200ms su rete mobile britannica.

---

## 🚀 Step Operativi di Avvio

1. **Setup Database:** Eseguire lo script SQL di creazione tabella `channels_uk` e `programs_uk` sul database PostgreSQL `uktvtonight` (server Contabo).
2. **Setup Spider:** Eseguire `scripts/fetch-epg-uk.py` per popolare il primo snapshot `src/data/epg-cache.json`.
3. **Inizializzazione Astro:** Creare l'applicazione `astro-uktvtonight` con i componenti ereditati dal collaudato motore australiano/spagnolo.
4. **Deploy Cloudflare Pages:** Collegare il token in `.cloudflare-token` e configurare il dominio personalizzato `uktvtonight.co.uk`.
