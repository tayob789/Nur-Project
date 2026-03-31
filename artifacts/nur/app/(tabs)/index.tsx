import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GeometricBackground } from '@/components/GeometricBackground';
import { PrayerTimeline } from '@/components/PrayerTimeline';
import { theme } from '@/constants/colors';
import { usePrayers } from '@/context/PrayerContext';
import { HADITH_OF_THE_DAY } from '@/data/hadith';
import { VERSES_OF_THE_DAY } from '@/data/verses';
import { useCountdown } from '@/hooks/useCountdown';
import { useQuranGoal } from '@/hooks/useQuranGoal';
import { useStreak } from '@/hooks/useStreak';
import { getGreeting, getRamadanInfo } from '@/utils/greeting';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const TODAY_IDX = (() => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; })();

const dayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
};
const todayVerse = VERSES_OF_THE_DAY[dayOfYear() % VERSES_OF_THE_DAY.length];
const todayHadith = HADITH_OF_THE_DAY[dayOfYear() % HADITH_OF_THE_DAY.length];
const greeting = getGreeting();
const ramadan = getRamadanInfo();

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { prayers, nextPrayer, nextPrayerIndex, loading, togglePrayer, hijriDate } = usePrayers();
  const { pagesRead, weeklyGoal, progress: quranProgress } = useQuranGoal();
  const { streakCount, weekDays } = useStreak();
  const { text: countdown, isUrgent } = useCountdown(nextPrayer?.time ?? null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, []);

  const prayersDone = prayers.filter((p) => p.done).length;
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      <GeometricBackground />
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.content, { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>

          {/* Header */}
          <View style={s.header}>
            <View>
              <Text style={s.greeting}>{greeting.label}</Text>
              <Text style={s.name}>Muhammad</Text>
              <Text style={s.subdate}>
                {new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })}
                {hijriDate ? ` · ${hijriDate}` : ''}
              </Text>
            </View>
            <View style={s.avatar}>
              <Text style={s.avatarArabic}>{greeting.arabic[0]}</Text>
            </View>
          </View>

          {/* Ramadan Card */}
          {ramadan.inRamadan ? (
            <LinearGradient colors={['#1a0e05', '#1c1108', '#141008']} style={s.ramadanCard}>
              <Text style={s.ramadanEyebrow}>RAMADAN MUBARAK</Text>
              <Text style={s.ramadanDay}>Day {ramadan.dayOf}</Text>
              <Text style={s.ramadanSub}>May Allah accept your fasts and prayers</Text>
            </LinearGradient>
          ) : ramadan.daysUntil <= 30 ? (
            <LinearGradient colors={['#1a0e05', '#1c1108', '#141008']} style={s.ramadanCard}>
              <Text style={s.ramadanEyebrow}>COMING SOON</Text>
              <Text style={s.ramadanDay}>Ramadan in {ramadan.daysUntil} days</Text>
              <Text style={s.ramadanSub}>Begin your preparation now</Text>
            </LinearGradient>
          ) : null}

          {/* Next Prayer Card */}
          {!loading && nextPrayer ? (
            <LinearGradient colors={theme.gradients.nextPrayer} style={[s.nextCard, theme.shadows.goldGlow]}>
              <View style={s.nextGlow} />
              <View style={s.nextTop}>
                <View>
                  <Text style={s.nextLabel}>NEXT PRAYER</Text>
                  <Text style={s.nextName}>{nextPrayer.name}</Text>
                  <Text style={s.nextTime}>{nextPrayer.time}</Text>
                </View>
                <View style={s.nextRight}>
                  <Text style={[s.countdown, isUrgent && s.countdownUrgent]}>{countdown}</Text>
                  <View style={s.prepareBadge}>
                    <Text style={s.prepareTxt}>Prepare now</Text>
                  </View>
                </View>
              </View>
              <PrayerTimeline prayers={prayers} nextPrayerIndex={nextPrayerIndex} />
            </LinearGradient>
          ) : (
            <LinearGradient colors={theme.gradients.nextPrayer} style={[s.nextCard, s.loadingCard]}>
              <Text style={s.loadingText}>Loading prayer times…</Text>
            </LinearGradient>
          )}

          {/* Prayer Strip */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.strip}>
            {prayers.map((prayer, i) => {
              const isNext = nextPrayer?.name === prayer.name && !prayer.done;
              return (
                <TouchableOpacity
                  key={prayer.name}
                  activeOpacity={0.7}
                  onPress={() => togglePrayer(i)}
                  style={[s.pill, prayer.done && s.pillDone, isNext && s.pillNext]}
                >
                  <Text style={[s.pillName, prayer.done && s.pillNameDone, isNext && s.pillNameNext]}>
                    {prayer.name}
                  </Text>
                  <Text style={[s.pillTime, prayer.done && s.pillTimeDone, isNext && s.pillTimeNext]}>
                    {prayer.time}
                  </Text>
                  {prayer.done && <Feather name="check" size={10} color={theme.colors.tealLight} style={{ marginTop: 3 }} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Goal Cards */}
          <View style={s.goalsRow}>
            <View style={s.goalCard}>
              <Text style={s.goalLabel}>Prayers Today</Text>
              <Text style={s.goalNumber}>{prayersDone}<Text style={s.goalTotal}>/5</Text></Text>
              <View style={s.progressBar}>
                <View style={[s.progressFill, { width: `${(prayersDone / 5) * 100}%`, backgroundColor: theme.colors.gold }]} />
              </View>
            </View>
            <View style={s.goalCard}>
              <Text style={s.goalLabel}>Quran This Week</Text>
              <Text style={[s.goalNumber, { color: theme.colors.tealLight }]}>{pagesRead}<Text style={s.goalTotal}> /{weeklyGoal}pg</Text></Text>
              <View style={s.progressBar}>
                <View style={[s.progressFill, { width: `${quranProgress * 100}%`, backgroundColor: theme.colors.teal }]} />
              </View>
            </View>
          </View>

          {/* Streak Card */}
          <View style={s.streakCard}>
            <View style={s.streakHeader}>
              <Feather name="zap" size={16} color={theme.colors.gold} />
              <Text style={s.streakTitle}>{streakCount} Day Streak</Text>
            </View>
            <View style={s.weekRow}>
              {DAY_LABELS.map((day, i) => (
                <View key={i} style={s.dayCol}>
                  <View style={[s.dayDot, weekDays[i] && s.dayDotDone, i === TODAY_IDX && !weekDays[i] && s.dayDotToday]} />
                  <Text style={s.dayLabel}>{day}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Verse of the Day */}
          <View style={s.verseCard}>
            <View style={s.verseBorderTop} />
            <Text style={s.verseEyebrow}>VERSE OF THE DAY</Text>
            <Text style={s.verseArabic}>{todayVerse.arabic}</Text>
            <Text style={s.verseTranslation}>"{todayVerse.translation}"</Text>
            <Text style={s.verseRef}>{todayVerse.reference}</Text>
          </View>

          {/* Hadith of the Day */}
          <View style={s.hadithCard}>
            <Text style={s.hadithEyebrow}>HADITH OF THE DAY</Text>
            <Text style={s.hadithPrefix}>The Prophet \u262d said:</Text>
            <Text style={s.hadithText}>"{todayHadith.text}"</Text>
            <Text style={s.hadithSource}>{todayHadith.source} · {todayHadith.narrator}</Text>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 18 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 },
  greeting: { fontSize: 10, letterSpacing: 2.5, color: theme.colors.gold, fontWeight: '600', marginBottom: 4 },
  name: { fontSize: 26, fontWeight: '700', color: theme.colors.text, marginBottom: 2 },
  subdate: { fontSize: 12, color: theme.colors.text2 },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 1.5, borderColor: theme.colors.gold, backgroundColor: theme.colors.goldDim, justifyContent: 'center', alignItems: 'center' },
  avatarArabic: { fontSize: 22, color: theme.colors.gold },

  ramadanCard: { borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(201,168,76,0.25)', alignItems: 'center' },
  ramadanEyebrow: { fontSize: 9, letterSpacing: 2.5, color: theme.colors.gold, fontWeight: '700', marginBottom: 6, opacity: 0.8 },
  ramadanDay: { fontSize: 20, fontWeight: '800', color: theme.colors.goldLight, marginBottom: 4 },
  ramadanSub: { fontSize: 12, color: theme.colors.text2, fontStyle: 'italic' },

  nextCard: { borderRadius: 20, padding: 20, marginBottom: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(201,168,76,0.25)' },
  nextGlow: { position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: 50, backgroundColor: theme.colors.goldDim },
  nextTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  nextLabel: { fontSize: 9, letterSpacing: 2, color: theme.colors.gold, marginBottom: 4, fontWeight: '600' },
  nextName: { fontSize: 26, fontWeight: '700', color: theme.colors.text, marginBottom: 2 },
  nextTime: { fontSize: 15, color: theme.colors.text2 },
  nextRight: { alignItems: 'flex-end' },
  countdown: { fontSize: 18, fontWeight: '700', color: theme.colors.text, marginBottom: 8, fontVariant: ['tabular-nums'] },
  countdownUrgent: { color: theme.colors.gold },
  prepareBadge: { backgroundColor: theme.colors.goldDim, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)' },
  prepareTxt: { fontSize: 10, color: theme.colors.gold, fontWeight: '600' },
  loadingCard: { alignItems: 'center', justifyContent: 'center', height: 80 },
  loadingText: { color: theme.colors.text2, fontSize: 14 },

  strip: { marginBottom: 14 },
  pill: { backgroundColor: theme.colors.surface2, borderRadius: 12, padding: 10, marginRight: 8, minWidth: 68, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center' },
  pillDone: { backgroundColor: theme.colors.tealDim, borderColor: 'rgba(61,140,124,0.4)' },
  pillNext: { backgroundColor: theme.colors.goldDim, borderColor: 'rgba(201,168,76,0.4)' },
  pillName: { fontSize: 11, fontWeight: '600', color: theme.colors.text2, marginBottom: 2 },
  pillNameDone: { color: theme.colors.tealLight },
  pillNameNext: { color: theme.colors.gold },
  pillTime: { fontSize: 10, color: theme.colors.text3 },
  pillTimeDone: { color: theme.colors.teal },
  pillTimeNext: { color: theme.colors.goldLight },

  goalsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  goalCard: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: theme.colors.border },
  goalLabel: { fontSize: 10, color: theme.colors.text2, marginBottom: 6, fontWeight: '500' },
  goalNumber: { fontSize: 24, fontWeight: '700', color: theme.colors.gold, marginBottom: 10 },
  goalTotal: { fontSize: 13, color: theme.colors.text3, fontWeight: '400' },
  progressBar: { height: 3, backgroundColor: theme.colors.border2, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },

  streakCard: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 14 },
  streakHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  streakTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.text },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center', gap: 5 },
  dayDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: theme.colors.surface3, borderWidth: 1, borderColor: theme.colors.border },
  dayDotDone: { backgroundColor: theme.colors.tealDim, borderColor: theme.colors.teal },
  dayDotToday: { borderColor: theme.colors.gold, borderWidth: 1.5 },
  dayLabel: { fontSize: 9, color: theme.colors.text3, fontWeight: '600' },

  verseCard: {
    backgroundColor: '#1a1608',
    borderRadius: 20,
    padding: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.2)',
    alignItems: 'center',
    overflow: 'hidden',
  },
  verseBorderTop: {
    position: 'absolute',
    top: 0, left: 40, right: 40, height: 1,
    backgroundColor: theme.colors.gold,
    opacity: 0.45,
    borderRadius: 1,
  },
  verseEyebrow: { fontSize: 10, color: theme.colors.gold, letterSpacing: 2, fontWeight: '700', marginBottom: 18, opacity: 0.8 },
  verseArabic: {
    fontSize: 28,
    color: '#e8c97a',
    textAlign: 'center',
    writingDirection: 'rtl',
    lineHeight: 50,
    marginBottom: 16,
    fontFamily: 'Amiri_400Regular',
  },
  verseTranslation: { fontSize: 15, color: theme.colors.text, textAlign: 'center', fontStyle: 'italic', lineHeight: 24, marginBottom: 12, opacity: 0.85 },
  verseRef: { fontSize: 12, color: theme.colors.gold, opacity: 0.7 },

  hadithCard: { backgroundColor: theme.colors.surface, borderRadius: 18, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: theme.colors.border },
  hadithEyebrow: { fontSize: 9, letterSpacing: 2, color: theme.colors.gold, marginBottom: 10, fontWeight: '600' },
  hadithPrefix: { fontSize: 12, color: theme.colors.gold, fontWeight: '600', marginBottom: 6 },
  hadithText: { fontSize: 14, color: theme.colors.text, lineHeight: 22, fontStyle: 'italic', marginBottom: 10 },
  hadithSource: { fontSize: 11, color: theme.colors.text2 },
});
