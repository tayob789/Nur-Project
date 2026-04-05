import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

import { daysBetweenLocalDateKeys, toLocalDateKey } from '@/utils/date';

const STORAGE_KEY = 'nur_streak_data';

interface StreakData {
  streakCount: number;
  lastCompletedDate: string;
  weekDays: boolean[];
}

function getTodayStr(): string {
  return toLocalDateKey();
}

function getWeekDayIndex(): number {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

export function useStreak() {
  const [streakCount, setStreakCount] = useState(0);
  const [weekDays, setWeekDays] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const [lastCompletedDate, setLastCompletedDate] = useState<string>('');

  const load = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StreakData = JSON.parse(stored);
        setStreakCount(data.streakCount);
        setWeekDays(data.weekDays || [false, false, false, false, false, false, false]);
        setLastCompletedDate(data.lastCompletedDate || '');
      }
    } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const markTodayComplete = useCallback(async () => {
    const today = getTodayStr();
    const dayIdx = getWeekDayIndex();
    const dayGap = lastCompletedDate ? daysBetweenLocalDateKeys(lastCompletedDate, today) : 1;

    if (dayGap === 0) return;

    const newStreak = dayGap === 1 ? streakCount + 1 : 1;
    const updatedWeekDays = [...weekDays];
    updatedWeekDays[dayIdx] = true;

    setStreakCount(newStreak);
    setWeekDays(updatedWeekDays);
    setLastCompletedDate(today);
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ streakCount: newStreak, lastCompletedDate: today, weekDays: updatedWeekDays }),
      );
    } catch {}
  }, [lastCompletedDate, streakCount, weekDays]);

  return { streakCount, weekDays, markTodayComplete };
}
