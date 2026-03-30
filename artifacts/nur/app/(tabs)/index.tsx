import { Feather } from '@expo/vector-icons';
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

import { theme } from '@/constants/colors';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useQuranGoal } from '@/hooks/useQuranGoal';
import { useStreak } from '@/hooks/useStreak';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const TODAY_IDX = (() => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; })();

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { prayers, nextPrayer, countdown, loading, togglePrayer } = usePrayerTimes();
  const { pagesRead, weeklyGoal, progress: quranProgress } = useQuranGoal();
  const { streakCount, weekDays } = useStreak();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const prayersDone = prayers.filter((p) => p.done).length;
  const prayerProgress = prayers.length > 0 ? prayersDone / prayers.length : 0;

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.content, { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <View style={s.header}>
            <View>
              <Text style={s.greeting}>ASSALAMU ALAIKUM</Text>
              <Text style={s.name}>Muhammad</Text>
              <Text style={s.subdate}>
                {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
              </Text>
            </View>
            <View style={s.avatar}>
              <Text style={s.avatarText}>م</Text>
            </View>
          </View>

          {/* Next Prayer Card */}
          {nextPrayer && !loading && (
            <View style={s.nextPrayerCard}>
              <View style={s.nextGlow} />
              <View style={s.nextPrayerRow}>
                <View>
                  <Text style={s.nextLabel}>NEXT PRAYER</Text>
                  <Text style={s.nextName}>{nextPrayer.name}</Text>
                  <Text style={s.nextTime}>{nextPrayer.time}</Text>
                </View>
                <View style={s.nextRight}>
                  <Text style={s.countdown}>in {countdown}</Text>
                  <View style={s.prepareBadge}>
                    <Text style={s.prepareTxt}>Prepare now</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          {loading && (
            <View style={[s.nextPrayerCard, s.loadingCard]}>
              <Text style={s.loadingText}>Loading prayer times…</Text>
            </View>
          )}

          {/* Prayer Strip */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.strip}>
            {prayers.map((prayer, i) => {
              const isNext = nextPrayer?.name === prayer.name;
              return (
                <TouchableOpacity
                  key={prayer.name}
                  activeOpacity={0.7}
                  onPress={() => togglePrayer(i)}
                  style={[
                    s.pill,
                    prayer.done && s.pillDone,
                    isNext && !prayer.done && s.pillNext,
                  ]}
                >
                  <Text style={[s.pillName, prayer.done && s.pillNameDone, isNext && !prayer.done && s.pillNameNext]}>
                    {prayer.name}
                  </Text>
                  <Text style={[s.pillTime, prayer.done && s.pillTimeDone, isNext && !prayer.done && s.pillTimeNext]}>
                    {prayer.time}
                  </Text>
                  {prayer.done && <Feather name="check" size={10} color={theme.colors.tealLight} style={s.pillCheck} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Goal Cards */}
          <View style={s.goalsRow}>
            <View style={[s.goalCard, s.goalCardLeft]}>
              <Text style={s.goalLabel}>Prayers Today</Text>
              <Text style={s.goalNumber}>{prayersDone}<Text style={s.goalTotal}>/5</Text></Text>
              <View style={s.progressBar}>
                <View style={[s.progressFill, { width: `${prayerProgress * 100}%`, backgroundColor: theme.colors.gold }]} />
              </View>
            </View>
            <View style={[s.goalCard, s.goalCardRight]}>
              <Text style={s.goalLabel}>Quran This Week</Text>
              <Text style={[s.goalNumber, { color: theme.colors.tealLight }]}>{pagesRead}<Text style={[s.goalTotal, { color: theme.colors.text3 }]}>/{weeklyGoal}pg</Text></Text>
              <View style={s.progressBar}>
                <View style={[s.progressFill, { width: `${quranProgress * 100}%`, backgroundColor: theme.colors.teal }]} />
              </View>
            </View>
          </View>

          {/* Streak Card */}
          <View style={s.streakCard}>
            <View style={s.streakHeader}>
              <Feather name="zap" size={18} color={theme.colors.gold} />
              <Text style={s.streakTitle}>{streakCount} Day Streak</Text>
            </View>
            <View style={s.weekRow}>
              {DAY_LABELS.map((day, i) => (
                <View key={i} style={s.dayCol}>
                  <View style={[
                    s.dayDot,
                    weekDays[i] && s.dayDotDone,
                    i === TODAY_IDX && !weekDays[i] && s.dayDotToday,
                  ]} />
                  <Text style={s.dayLabel}>{day}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Note */}
          <View style={s.tipCard}>
            <Text style={s.tipEmoji}>☀</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.tipTitle}>Daily Reminder</Text>
              <Text style={s.tipText}>Consistency is more beloved to Allah than intensity. Pray each prayer on time.</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  greeting: { fontSize: 11, letterSpacing: 2, color: theme.colors.gold, fontWeight: '600', marginBottom: 4 },
  name: { fontSize: 28, fontWeight: '700', color: theme.colors.text, marginBottom: 2 },
  subdate: { fontSize: 13, color: theme.colors.text2 },
  avatar: { width: 52, height: 52, borderRadius: 26, borderWidth: 1.5, borderColor: theme.colors.gold, backgroundColor: theme.colors.goldDim, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 22, color: theme.colors.gold },
  nextPrayerCard: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: `rgba(201,168,76,0.3)`, borderRadius: 20, padding: 20, marginBottom: 16, overflow: 'hidden' },
  nextGlow: { position: 'absolute', top: -40, right: -40, width: 120, height: 120, borderRadius: 60, backgroundColor: theme.colors.goldDim },
  nextPrayerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nextLabel: { fontSize: 10, letterSpacing: 2, color: theme.colors.gold, marginBottom: 4, fontWeight: '600' },
  nextName: { fontSize: 28, fontWeight: '700', color: theme.colors.text, marginBottom: 2 },
  nextTime: { fontSize: 16, color: theme.colors.text2 },
  nextRight: { alignItems: 'flex-end' },
  countdown: { fontSize: 20, fontWeight: '700', color: theme.colors.gold, marginBottom: 8 },
  prepareBadge: { backgroundColor: theme.colors.goldDim, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: `rgba(201,168,76,0.3)` },
  prepareTxt: { fontSize: 11, color: theme.colors.gold, fontWeight: '600' },
  loadingCard: { alignItems: 'center', justifyContent: 'center', height: 80 },
  loadingText: { color: theme.colors.text2, fontSize: 14 },
  strip: { marginBottom: 20 },
  pill: { backgroundColor: theme.colors.surface2, borderRadius: 12, padding: 12, marginRight: 10, minWidth: 72, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center' },
  pillDone: { backgroundColor: theme.colors.tealDim, borderColor: `rgba(61,140,124,0.4)` },
  pillNext: { backgroundColor: theme.colors.goldDim, borderColor: `rgba(201,168,76,0.4)` },
  pillName: { fontSize: 12, fontWeight: '600', color: theme.colors.text2, marginBottom: 2 },
  pillNameDone: { color: theme.colors.tealLight },
  pillNameNext: { color: theme.colors.gold },
  pillTime: { fontSize: 11, color: theme.colors.text3 },
  pillTimeDone: { color: theme.colors.teal },
  pillTimeNext: { color: theme.colors.goldLight },
  pillCheck: { marginTop: 4 },
  goalsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  goalCard: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.colors.border },
  goalCardLeft: {},
  goalCardRight: {},
  goalLabel: { fontSize: 11, color: theme.colors.text2, marginBottom: 6, fontWeight: '500' },
  goalNumber: { fontSize: 26, fontWeight: '700', color: theme.colors.gold, marginBottom: 10 },
  goalTotal: { fontSize: 14, color: theme.colors.text3, fontWeight: '400' },
  progressBar: { height: 3, backgroundColor: theme.colors.border2, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  streakCard: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 16 },
  streakHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  streakTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center', gap: 6 },
  dayDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: theme.colors.surface3, borderWidth: 1, borderColor: theme.colors.border },
  dayDotDone: { backgroundColor: theme.colors.tealDim, borderColor: theme.colors.teal },
  dayDotToday: { borderColor: theme.colors.gold, borderWidth: 1.5 },
  dayLabel: { fontSize: 10, color: theme.colors.text3, fontWeight: '500' },
  tipCard: { flexDirection: 'row', gap: 12, backgroundColor: theme.colors.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'flex-start' },
  tipEmoji: { fontSize: 20, marginTop: 2 },
  tipTitle: { fontSize: 13, fontWeight: '700', color: theme.colors.gold, marginBottom: 4 },
  tipText: { fontSize: 13, color: theme.colors.text2, lineHeight: 19 },
});
