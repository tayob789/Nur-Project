export type SeasonalBanner = {
  eyebrow: string;
  title: string;
  subtitle: string;
};

/**
 * Hijri occasion banner. Only returns content during Ramadan, Dhul Hijjah 1–9, or Muharram.
 * Uses API month (1–12) and day from prayer context.
 */
export function getSeasonalBanner(hijriMonth: number, hijriDay: number): SeasonalBanner | null {
  if (hijriMonth < 1 || hijriMonth > 12 || hijriDay < 1) return null;

  if (hijriMonth === 9) {
    return {
      eyebrow: 'RAMADAN MUBARAK',
      title: `Day ${hijriDay}`,
      subtitle: 'May Allah accept your fasts and prayers',
    };
  }

  if (hijriMonth === 12 && hijriDay >= 1 && hijriDay <= 9) {
    return {
      eyebrow: 'HAJJ & EID',
      title: 'Eid Mubarak · Hajj Mubarak',
      subtitle: 'May Allah accept your worship and sacrifice',
    };
  }

  if (hijriMonth === 1) {
    return {
      eyebrow: 'MUHARRAM',
      title: 'Islamic New Year Mubarak',
      subtitle: 'May Allah bless the year ahead',
    };
  }

  return null;
}
