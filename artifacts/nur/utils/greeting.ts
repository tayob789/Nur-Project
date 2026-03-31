export function getGreeting(): { arabic: string; label: string } {
  const h = new Date().getHours();
  if (h >= 4 && h < 7)  return { arabic: '\u0635\u0628\u0627\u062d \u0627\u0644\u062e\u064a\u0631', label: 'GOOD MORNING' };
  if (h >= 7 && h < 12) return { arabic: '\u0623\u0635\u0628\u062d\u0646\u0627 \u0648\u0623\u0635\u0628\u062d \u0627\u0644\u0645\u0644\u0643 \u0644\u0644\u0647', label: 'A BLESSED MORNING' };
  if (h >= 12 && h < 15) return { arabic: '\u0627\u0646\u062a\u0647\u0649 \u0627\u0644\u0635\u0628\u0627\u062d', label: 'GOOD AFTERNOON' };
  if (h >= 15 && h < 18) return { arabic: '\u0645\u0633\u0627\u0621 \u0627\u0644\u062e\u064a\u0631', label: 'GOOD AFTERNOON' };
  if (h >= 18 && h < 21) return { arabic: '\u0645\u0633\u0627\u0621 \u0627\u0644\u0646\u0648\u0631', label: 'GOOD EVENING' };
  return { arabic: '\u0637\u0627\u0628 \u0644\u064a\u0644\u0643', label: 'GOOD NIGHT' };
}

export function getRamadanInfo(): { inRamadan: boolean; daysUntil: number; dayOf: number } {
  const RAMADAN_START = new Date('2026-03-18');
  const RAMADAN_END   = new Date('2026-04-17');
  const now = new Date();
  if (now >= RAMADAN_START && now < RAMADAN_END) {
    const dayOf = Math.ceil((now.getTime() - RAMADAN_START.getTime()) / 86400000);
    return { inRamadan: true, daysUntil: 0, dayOf };
  }
  const daysUntil = Math.ceil((RAMADAN_START.getTime() - now.getTime()) / 86400000);
  return { inRamadan: false, daysUntil: Math.max(0, daysUntil), dayOf: 0 };
}
