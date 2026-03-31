import React, { createContext, useContext } from 'react';
import { usePrayerTimes, PrayerTimesState } from '@/hooks/usePrayerTimes';

const PrayerContext = createContext<PrayerTimesState | null>(null);

export function PrayerProvider({ children }: { children: React.ReactNode }) {
  const prayerState = usePrayerTimes();
  return (
    <PrayerContext.Provider value={prayerState}>
      {children}
    </PrayerContext.Provider>
  );
}

export function usePrayers(): PrayerTimesState {
  const ctx = useContext(PrayerContext);
  if (!ctx) throw new Error('usePrayers must be used within PrayerProvider');
  return ctx;
}
