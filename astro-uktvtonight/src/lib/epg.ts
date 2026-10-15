/**
 * EPG Data Fetching — SERVER-ONLY (Astro build time).
 * Uses DATABASE_URL if configured, otherwise falls back to src/data/epg-cache.json snapshot.
 */
import pg from 'pg';
import { getChannelLogo } from '../utils/channelLogos';
import { normCid } from '../utils/channelSlug';
import { MAJOR_UK_ORDER } from '../utils/channelFilters';
import { UK_BVOD_PLATFORMS, UK_LIVE_STREAMS } from '../utils/channelStreams';
import { isCurrentBroadcastDay, getUKHour } from '../utils/timeSlots';
import type { Channel, Program } from '../types';

import epgData from '../data/epg-cache.json';

const { Pool } = pg;
const databaseUrl = (import.meta.env.DATABASE_URL as string | undefined)?.trim() || '';

const pgPool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      max: Number(import.meta.env.POSTGRES_POOL_MAX ?? 4),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 8_000,
    })
  : null;

async function pgQuery<T = any>(text: string, values: unknown[] = []): Promise<T[]> {
  if (!pgPool) throw new Error('DATABASE_URL not configured');
  const result = await pgPool.query(text, values);
  return result.rows as T[];
}

export async function fetchChannels(): Promise<Channel[]> {
  if (pgPool) {
    try {
      const rows = await pgQuery(
        `SELECT id, channel_id, name, lcn, logo_url, category, bvod_platform, stream_url, website_url
         FROM channels_uk
         ORDER BY lcn ASC NULLS LAST
         LIMIT 100`
      );
      if (rows && rows.length > 0) {
        return rows.map(r => ({
          id: normCid(r.channel_id),
          name: r.name,
          number: r.lcn ?? 0,
          logo: getChannelLogo(normCid(r.channel_id), r.logo_url),
          type: 'General',
          programs: [],
          visible: true,
          position: r.lcn ?? 999,
          bvodPlatform: r.bvod_platform || UK_BVOD_PLATFORMS[normCid(r.channel_id)],
          streamUrl: r.stream_url || UK_LIVE_STREAMS[normCid(r.channel_id)],
          website: r.website_url
        }));
      }
    } catch (e) {
      console.warn('[epg.ts] PostgreSQL fetch failed, falling back to epg-cache.json:', e);
    }
  }

  // Fallback to local snapshot
  const rawChannels = (epgData as any).channels || [];
  const channels: Channel[] = rawChannels.map((c: any) => {
    const slug = normCid(c.id);
    return {
      id: slug,
      name: c.name,
      number: c.number || 0,
      logo: getChannelLogo(slug, c.logo),
      type: 'General',
      programs: [],
      visible: true,
      position: c.number || 999,
      bvodPlatform: UK_BVOD_PLATFORMS[slug] || 'Freeview',
      streamUrl: UK_LIVE_STREAMS[slug] || undefined,
      website: undefined
    };
  });

  // Sort channels in canonical Freeview LCN order
  channels.sort((a, b) => {
    const idxA = MAJOR_UK_ORDER.indexOf(a.id);
    const idxB = MAJOR_UK_ORDER.indexOf(b.id);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return a.number - b.number;
  });

  return channels;
}

export async function fetchProgramsForDate(dateStr: string): Promise<Program[]> {
  const allProgs = ((epgData as any).programs || []) as Program[];
  return allProgs.filter(p => isCurrentBroadcastDay(p.start_time, dateStr));
}

export async function fetchChannelPrograms(channelSlug: string, dateStr: string): Promise<Program[]> {
  const allProgs = ((epgData as any).programs || []) as Program[];
  const targetSlug = normCid(channelSlug);

  return allProgs.filter(p => {
    const pSlug = normCid(p.channel_id || '');
    return pSlug === targetSlug && isCurrentBroadcastDay(p.start_time, dateStr);
  }).sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
}

export async function fetchTonightPrograms(channelSlug: string, dateStr: string): Promise<Program[]> {
  const dayPrograms = await fetchChannelPrograms(channelSlug, dateStr);
  return dayPrograms.filter(p => {
    const hour = getUKHour(p.start_time);
    return hour >= 18 || hour <= 2;
  });
}
