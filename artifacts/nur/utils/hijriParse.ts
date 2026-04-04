/** Maps Aladhan English month names (normalized) to Hijri month number 1–12. */
const MONTH_EN_TO_NUM: Record<string, number> = {
  muharram: 1,
  safar: 2,
  "rabi' al-awwal": 3,
  "rabi' al-thani": 4,
  'jumada al-awwal': 5,
  'jumada al-thani': 6,
  rajab: 7,
  "sha'ban": 8,
  ramadan: 9,
  shawwal: 10,
  "dhul qi'dah": 11,
  "dhul hijjah": 12,
};

function normalizeMonthKey(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[\u2018\u2019\u0060\u02bf\u02be]/g, "'");
}

/**
 * Parses Aladhan-style display strings, e.g. "10 Ramadan 1447 AH".
 * Used to backfill hijri month/day when older caches omit numeric fields.
 */
export function parseHijriDisplayString(hijri: string): { day: number; month: number } {
  if (!hijri || typeof hijri !== 'string') return { day: 0, month: 0 };
  const m = hijri.trim().match(/^(\d+)\s+(.+?)\s+(\d+)\s*AH$/i);
  if (!m) return { day: 0, month: 0 };
  const day = parseInt(m[1], 10);
  const monthKey = normalizeMonthKey(m[2]);
  const month = MONTH_EN_TO_NUM[monthKey] ?? 0;
  return {
    day: Number.isFinite(day) ? day : 0,
    month,
  };
}
