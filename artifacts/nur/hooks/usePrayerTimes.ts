import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { normalizeTimingsRecord, readStoredPrayerCalcSettings } from '@/constants/prayerSettings';
import { parseHijriDisplayString } from '@/utils/hijriParse';

export interface Prayer {
  name: string;
  arabic: string;
  time: string;
  done: boolean;
}

export interface PrayerTimesState {
  prayers: Prayer[];
  nextPrayer: Prayer | null;
  nextPrayerIndex: number;
  countdown: string;
  loading: boolean;
  error: string | null;
  hijriDate: string;
  /** 1–12 from API; 0 if unknown (e.g. old cache). */
  hijriMonth: number;
  /** 1–30 from API; 0 if unknown. */
  hijriDay: number;
  gregorianDate: string;
  refresh: () => void;
  togglePrayer: (index: number) => void;
}

const PRAYER_NAMES = [
  { name: 'Fajr', arabic: 'الفجر', key: 'Fajr' },
  { name: 'Dhuhr', arabic: 'الظهر', key: 'Dhuhr' },
  { name: 'Asr', arabic: 'العصر', key: 'Asr' },
  { name: 'Maghrib', arabic: 'المغرب', key: 'Maghrib' },
  { name: 'Isha', arabic: 'العشاء', key: 'Isha' },
];

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function parseTime(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const now = new Date();
  const result = new Date(now);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    result.setHours(23, 59, 0, 0);
    return result;
  }
  result.setHours(hours, minutes, 0, 0);
  return result;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '0m';
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function getNextPrayer(prayers: Prayer[]): { prayer: Prayer; index: number } | null {
  const now = new Date();
  for (let i = 0; i < prayers.length; i++) {
    const prayerTime = parseTime(prayers[i].time);
    if (prayerTime > now) {
      return { prayer: prayers[i], index: i };
    }
  }
  return { prayer: prayers[0], index: 0 };
}

export function usePrayerTimes(): PrayerTimesState {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hijriDate, setHijriDate] = useState('');
  const [hijriMonth, setHijriMonth] = useState(0);
  const [hijriDay, setHijriDay] = useState(0);
  const [gregorianDate, setGregorianDate] = useState('');
  const [countdown, setCountdown] = useState('');
  const [nextPrayer, setNextPrayer] = useState<Prayer | null>(null);
  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadDoneState = useCallback(async (): Promise<boolean[]> => {
    try {
      const stored = await AsyncStorage.getItem(`prayer_done_${getTodayKey()}`);
      if (stored) return JSON.parse(stored);
    } catch {}
    return [false, false, false, false, false];
  }, []);

  const saveDoneState = useCallback(async (doneState: boolean[]) => {
    try {
      await AsyncStorage.setItem(`prayer_done_${getTodayKey()}`, JSON.stringify(doneState));
    } catch {}
  }, []);

  const togglePrayer = useCallback((index: number) => {
    setPrayers((prev) => {
      const updated = prev.map((p, i) =>
        i === index ? { ...p, done: !p.done } : p
      );
      saveDoneState(updated.map((p) => p.done));
      return updated;
    });
  }, [saveDoneState]);

  const fetchPrayerTimes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { method: calcMethod, school: asrSchool } = await readStoredPrayerCalcSettings();
      const todayKey = getTodayKey();
      const cacheKey = `prayer_times_${todayKey}_${calcMethod}_${asrSchool}`;
      const cached = await AsyncStorage.getItem(cacheKey);
      const doneState = await loadDoneState();

      let timings: Record<string, string> = {};
      let hijri = '';
      let gregorian = '';
      let hMonth = 0;
      let hDay = 0;

      if (cached) {
        const parsed = JSON.parse(cached);
        timings = normalizeTimingsRecord(parsed.timings ?? {});
        hijri = parsed.hijri;
        gregorian = parsed.gregorian;
        hMonth = typeof parsed.hijriMonth === 'number' ? parsed.hijriMonth : 0;
        hDay = typeof parsed.hijriDay === 'number' ? parsed.hijriDay : 0;
        if ((hMonth === 0 || hDay === 0) && hijri) {
          const parsedDisplay = parseHijriDisplayString(hijri);
          if (parsedDisplay.month > 0) hMonth = parsedDisplay.month;
          if (parsedDisplay.day > 0) hDay = parsedDisplay.day;
        }
      } else {
        let lat = 51.5074;
        let lng = -0.1278;

        if (Platform.OS !== 'web') {
          try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
              const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
              lat = loc.coords.latitude;
              lng = loc.coords.longitude;
            }
          } catch {}
        } else {
          try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
            );
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
          } catch {}
        }

        const timestamp = Math.floor(Date.now() / 1000);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        const resp = await fetch(
          `https://api.aladhan.com/v1/timings/${timestamp}?latitude=${lat}&longitude=${lng}&method=${calcMethod}&school=${asrSchool}`,
          { signal: controller.signal },
        ).finally(() => clearTimeout(timeoutId));
        if (!resp.ok) throw new Error(`Prayer API responded with ${resp.status}`);
        const data = await resp.json();
        const payload = data?.data;
        if (!payload?.timings || !payload?.date?.hijri || !payload?.date?.gregorian) {
          throw new Error('Prayer API payload missing expected fields');
        }
        timings = normalizeTimingsRecord(payload.timings ?? {});

        const dateObj = payload.date;
        hijri = `${dateObj.hijri.day} ${dateObj.hijri.month.en} ${dateObj.hijri.year} AH`;
        gregorian = dateObj.gregorian.date;
        hMonth = parseInt(String(dateObj.hijri.month.number), 10);
        hDay = parseInt(String(dateObj.hijri.day), 10);
        if (!Number.isFinite(hMonth)) hMonth = 0;
        if (!Number.isFinite(hDay)) hDay = 0;

        await AsyncStorage.setItem(
          cacheKey,
          JSON.stringify({ timings, hijri, gregorian, hijriMonth: hMonth, hijriDay: hDay }),
        );
      }

      const builtPrayers: Prayer[] = PRAYER_NAMES.map((p, i) => ({
        name: p.name,
        arabic: p.arabic,
        time: timings[p.key] ?? '--:--',
        done: doneState[i] ?? false,
      }));

      setPrayers(builtPrayers);
      setHijriDate(hijri);
      setHijriMonth(hMonth);
      setHijriDay(hDay);
      setGregorianDate(gregorian);
    } catch (e) {
      setError('Could not load prayer times. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, [loadDoneState, refreshKey]);

  useEffect(() => {
    fetchPrayerTimes();
  }, [fetchPrayerTimes]);

  useEffect(() => {
    if (prayers.length === 0) return;
    const update = () => {
      const result = getNextPrayer(prayers);
      if (result) {
        setNextPrayer(result.prayer);
        setNextPrayerIndex(result.index);
        const nextTime = parseTime(result.prayer.time);
        const now = new Date();
        let diff = nextTime.getTime() - now.getTime();
        if (diff < 0) diff += 24 * 60 * 60 * 1000;
        setCountdown(formatCountdown(diff));
      }
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [prayers]);

  return {
    prayers,
    nextPrayer,
    nextPrayerIndex,
    countdown,
    loading,
    error,
    hijriDate,
    hijriMonth,
    hijriDay,
    gregorianDate,
    refresh: () => setRefreshKey((k) => k + 1),
    togglePrayer,
  };
}
