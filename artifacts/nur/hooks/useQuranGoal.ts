import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'nur_quran_data';

interface QuranData {
  pagesRead: number;
  weeklyGoal: number;
  weekStart: string;
}

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
}

export function useQuranGoal() {
  const [pagesRead, setPagesRead] = useState(0);
  const [weeklyGoal, setWeeklyGoalState] = useState(20);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data: QuranData = JSON.parse(stored);
        const currentWeek = getWeekStart();
        if (data.weekStart === currentWeek) {
          setPagesRead(data.pagesRead);
          setWeeklyGoalState(data.weeklyGoal);
        } else {
          setPagesRead(0);
          setWeeklyGoalState(data.weeklyGoal);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ pagesRead: 0, weeklyGoal: data.weeklyGoal, weekStart: currentWeek }));
        }
      }
    } catch {}
    setLoading(false);
  }, []);

  const save = useCallback(async (pages: number, goal: number) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ pagesRead: pages, weeklyGoal: goal, weekStart: getWeekStart() }));
  }, []);

  useEffect(() => { load(); }, [load]);

  const incrementPages = useCallback(() => {
    setPagesRead((p) => { const n = p + 1; save(n, weeklyGoal); return n; });
  }, [weeklyGoal, save]);

  const decrementPages = useCallback(() => {
    setPagesRead((p) => { const n = Math.max(0, p - 1); save(n, weeklyGoal); return n; });
  }, [weeklyGoal, save]);

  const setWeeklyGoal = useCallback((goal: number) => {
    setWeeklyGoalState(goal);
    save(pagesRead, goal);
  }, [pagesRead, save]);

  const pagesPerYear = Math.round((pagesRead / 7) * 365);
  const khatmsPerYear = parseFloat(((pagesPerYear) / 604).toFixed(1));
  const remaining = Math.max(0, weeklyGoal - pagesRead);
  const progress = weeklyGoal > 0 ? Math.min(1, pagesRead / weeklyGoal) : 0;

  return {
    pagesRead,
    weeklyGoal,
    remaining,
    progress,
    pagesPerYear,
    khatmsPerYear,
    loading,
    incrementPages,
    decrementPages,
    setWeeklyGoal,
  };
}
