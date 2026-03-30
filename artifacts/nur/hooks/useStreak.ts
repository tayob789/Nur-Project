import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'nur_streak_data';

interface StreakData {
  streakCount: number;
  lastCompletedDate: string;
  weekDays: boolean[];
}

function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function getWeekDayIndex(): number {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1;
}

export function useStreak() {
  const [streakCount, setStreakCount] = useState(0);
  const [weekDays, setWeekDays] = useState<boolean[]>([false, false, false, false, false, false, false]);

  const load = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: StreakData = JSON.parse(stored);
        setStreakCount(data.streakCount);
        setWeekDays(data.weekDays || [false, false, false, false, false, false, false]);
      }
    } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const markTodayComplete = useCallback(async () => {
    const today = getTodayStr();
    const dayIdx = getWeekDayIndex();
    setStreakCount((prev) => {
      const newStreak = prev + 1;
      setWeekDays((days) => {
        const updated = [...days];
        updated[dayIdx] = true;
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ streakCount: newStreak, lastCompletedDate: today, weekDays: updated }));
        return updated;
      });
      return newStreak;
    });
  }, []);

  return { streakCount, weekDays, markTodayComplete };
}
