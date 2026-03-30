# Nur — Islamic Lifestyle App

## Project Overview
A premium Islamic lifestyle mobile app built with Expo/React Native. Dark gold "Sacred Light" design system. Monorepo managed by pnpm.

## Architecture
- **Monorepo root**: `/home/runner/workspace`
- **API Server**: `artifacts/api-server` — Express backend (port 8080)
- **Nur Mobile App**: `artifacts/nur` — Expo/React Native (Expo Go compatible)
- **Mockup Sandbox**: `artifacts/mockup-sandbox` — Vite component preview

## Design System
- **Background**: `#0c0b09` (near black)
- **Surface**: `#141210`, `#1c1914`, `#221f1a`
- **Gold**: `#c9a84c` (primary accent)
- **Teal**: `#3d8c7c` (secondary accent)
- **Text**: `#ede8df`, `#9c9488`, `#5c5750`
- **Amber**: `#d4870a` (warnings, missed prayers)
- **Fonts**: DM Sans (UI), DM Serif Display (headings), Amiri (Arabic)
- **Geometric SVG background** at ~7% opacity on every screen

## Navigation Structure (Expo Router)
```
app/
  _layout.tsx              — Root layout (fonts, providers)
  (tabs)/
    _layout.tsx            — 5-tab bar layout
    index.tsx              — Home screen
    prayers.tsx            — Daily Prayers
    quran.tsx              — Quran Planner
    dhikr.tsx              — Dhikr Counter
    (more)/
      _layout.tsx          — Stack navigator for More section
      index.tsx            — More hub (feature grid)
      qibla.tsx            — Qibla Compass
      names.tsx            — 99 Names of Allah
      calendar.tsx         — Islamic Calendar
      zakat.tsx            — Zakat Calculator
```

## Features
### Home Screen
- Greeting with Hijri date
- Next prayer card with live countdown (ticks every second), LinearGradient, gold glow
- Prayer timeline (SVG horizontal arc showing all 5 prayers + current time)
- Prayer strip (tap to mark done)
- Goals cards: Prayers Today + Quran This Week
- Streak tracker (7-day week dots)
- Verse of the Day (Arabic RTL + English translation, rotates daily)
- Hadith of the Day (authentic hadith, rotates daily)

### Prayers Screen
- Prayer completion summary with progress ring
- Full prayer list (tap to toggle done/undone)
- Missed prayer indicator (amber, respectful)
- Next prayer badge (gold)
- Sunnah prayers section (collapsible)

### Quran Screen
- Pages read stepper + weekly goal stepper
- Khatm tracker with progress ring (604 pages = 1 khatm)
- Milestones: pages/year, khatms completed
- Progress bar

### Dhikr Screen
- Counter for: SubhanAllah, Alhamdulillah, Allahu Akbar, Astaghfirullah, La ilaha illallah
- Target progress bar (33/34/100)
- Gold flash animation when target reached
- Haptic feedback (expo-haptics, guarded for web)
- Azkar collections: Morning, Evening, After Prayer, Before Sleep (full Arabic + transliteration + source)

### More Hub
- Grid: Qibla, Calendar, 99 Names, Zakat
- Fasting times (Sehri/Iftar from prayer times)
- Privacy promise card

### Qibla Screen
- Location-based direction calculation to Mecca (21.4225°N, 39.8262°E)
- SVG compass rose with animated gold needle
- Distance to Mecca in km
- Fallback to London coords on web

### 99 Names of Allah
- Searchable grid (2 columns) of all 99 names
- Arabic + transliteration + meaning
- Tap to expand full description modal

### Islamic Calendar
- Month calendar view (Gregorian)
- Navigation arrows (month/year)
- Hijri date display
- Full list of Islamic events with descriptions

### Zakat Calculator
- Asset inputs: Cash, Gold, Investments, Business Stock, Liabilities
- Nisab threshold (adjustable, default £5,950)
- Zakat due at 2.5%
- Charity suggestions: NZF, Islamic Relief, Human Appeal (suggestion-only, no affiliation)
- Save calculation to AsyncStorage history

## Key Files
- `constants/colors.ts` — Full theme with gradients, shadows, colors
- `data/verses.ts` — 30 Quranic verses
- `data/hadith.ts` — 20 authentic hadith
- `data/azkar.ts` — Full azkar collections (morning/evening/after prayer/sleep) + dhikr counter options
- `data/namesOfAllah.ts` — All 99 Names of Allah with descriptions
- `data/islamicEvents.ts` — 14 Islamic calendar events
- `components/GeometricBackground.tsx` — SVG Islamic lattice pattern
- `components/PrayerTimeline.tsx` — SVG horizontal day arc
- `hooks/usePrayerTimes.ts` — Aladhan API integration
- `hooks/useCountdown.ts` — Live second-by-second countdown
- `hooks/useStreak.ts` — 7-day streak persistence
- `hooks/useQuranGoal.ts` — Quran reading goal persistence

## Important Rules
- No emojis in UI — use @expo/vector-icons (Feather)
- No gamification: streaks OK, no leaderboards/badges/points
- No analytics, no third-party SDKs except future RevenueCat
- All Arabic text: `writingDirection: 'rtl'` in StyleSheet
- All hardcoded content must be authentic Islamic content
- Web insets: 67px top, 34px bottom
- Platform.OS !== 'web' guards on haptics, magnetometer
- Expo Go compatible — no native-only packages

## Packages
Key dependencies: expo-linear-gradient, react-native-svg, expo-haptics, expo-sensors, react-native-reanimated, @expo-google-fonts/dm-serif-display, @expo-google-fonts/dm-sans, @expo-google-fonts/amiri, expo-location, @tanstack/react-query
