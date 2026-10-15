/**
 * Date & Time Utilities for UK TV Tonight
 * Timezone: Europe/London (GMT/BST auto-handled)
 */

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

export function getTomorrowInUK(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(d);
}

export function formatDateUK(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(d);
}

export function formatTimeUK(isoString: string): string {
  if (!isoString) return '--:--';
  const d = new Date(isoString);
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(d);
}

export function getUKHour(isoString: string): number {
  const d = new Date(isoString);
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: 'numeric',
    hourCycle: 'h23'
  });
  return parseInt(formatter.format(d), 10);
}

export function isWatershed(isoString: string): boolean {
  const hour = getUKHour(isoString);
  return hour >= 21 || hour < 5; // The 9 PM Watershed in UK Broadcasting
}

export function isCurrentBroadcastDay(isoString: string, targetDate: string): boolean {
  if (!isoString || !targetDate) return false;
  const d = new Date(isoString);
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(d) === targetDate;
}
