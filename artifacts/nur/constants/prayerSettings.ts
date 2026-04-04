import AsyncStorage from '@react-native-async-storage/async-storage';

/** Aladhan `method` query values, aligned with `CALC_METHOD_LABELS` indices. */
export const CALC_METHOD_API_VALUES = [3, 2, 5, 4, 1] as const;

export const CALC_METHOD_LABELS = [
  'Muslim World League',
  'ISNA',
  'Egypt',
  'Makkah',
  'Karachi',
] as const;

export const ASR_METHOD_LABELS = ["Shafi'i / Maliki / Hanbali", 'Hanafi'] as const;

export const STORAGE_NUR_CALC_METHOD = 'nur_calc_method';
export const STORAGE_NUR_ASR_METHOD = 'nur_asr_method';

/** Aladhan defaults: method 2 (ISNA), school 0 (Shafi). */
export const DEFAULT_CALC_METHOD_API = 2;
export const DEFAULT_ASR_SCHOOL = 0;

export function calcMethodIndexFromApi(apiMethod: number): number {
  const idx = CALC_METHOD_API_VALUES.findIndex((v) => v === apiMethod);
  return idx >= 0 ? idx : 1;
}

/**
 * Produces a stable `HH:MM` from Aladhan (or similar) time strings.
 * Strips seconds, timezone suffixes, and trailing text (e.g. "05:30 (BST)", "05:30:00").
 */
export function normalizeTimeString(raw: string): string {
  try {
    if (raw == null) return '00:00';
    const s = String(raw).trim();
    if (s === '') return '00:00';
    const m = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?/);
    if (!m) return '00:00';
    const h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    if (!Number.isFinite(h) || !Number.isFinite(min)) return '00:00';
    if (h < 0 || h > 23 || min < 0 || min > 59) return '00:00';
    return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  } catch {
    return '00:00';
  }
}

export function normalizeTimingsRecord(timings: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, val] of Object.entries(timings)) {
    out[key] = normalizeTimeString(val ?? '');
  }
  return out;
}

export async function readStoredPrayerCalcSettings(): Promise<{
  method: number;
  school: number;
}> {
  const [mRaw, sRaw] = await Promise.all([
    AsyncStorage.getItem(STORAGE_NUR_CALC_METHOD),
    AsyncStorage.getItem(STORAGE_NUR_ASR_METHOD),
  ]);
  const methodParsed = mRaw != null && mRaw !== '' ? parseInt(mRaw, 10) : DEFAULT_CALC_METHOD_API;
  const schoolParsed = sRaw != null && sRaw !== '' ? parseInt(sRaw, 10) : DEFAULT_ASR_SCHOOL;
  return {
    method: Number.isFinite(methodParsed) ? methodParsed : DEFAULT_CALC_METHOD_API,
    school: schoolParsed === 1 ? 1 : DEFAULT_ASR_SCHOOL,
  };
}
