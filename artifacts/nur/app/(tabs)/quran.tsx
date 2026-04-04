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
import Svg, { Circle } from 'react-native-svg';

import { GeometricBackground } from '@/components/GeometricBackground';
import { theme } from '@/constants/colors';
import { useQuranGoal } from '@/hooks/useQuranGoal';

const TOTAL_QURAN_PAGES = 604;
const JUZ_COUNT = 30;

function ProgressRing({ progress, size, color, strokeWidth }: { progress: number; size: number; color: string; strokeWidth: number }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(1, progress);
  return (
    <Svg width={size} height={size}>
      <Circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={theme.colors.surface3} strokeWidth={strokeWidth} />
      <Circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
}

export default function QuranScreen() {
  const insets = useSafeAreaInsets();
  const {
    pagesRead, weeklyGoal, remaining, progress,
    pagesPerYear, khatmsPerYear,
    incrementPages, decrementPages, setWeeklyGoal,
  } = useQuranGoal();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const khatmProgress = (pagesRead % TOTAL_QURAN_PAGES) / TOTAL_QURAN_PAGES;
  const completedKhatms = Math.floor(pagesRead / TOTAL_QURAN_PAGES);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const percentage = Math.round(progress * 100);

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
          <View style={s.header}>
            <Text style={s.eyebrow}>WEEKLY GOAL</Text>
            <Text style={s.title}>Quran Planner</Text>
          </View>

          {/* Hero Card */}
          <LinearGradient colors={theme.gradients.quranHero} style={s.heroCard}>
            <View style={s.statsRow}>
              <View style={s.stat}>
                <Text style={s.statNum}>{pagesRead}</Text>
                <Text style={s.statLbl}>Pages Read</Text>
              </View>
              <View style={s.statDiv} />
              <View style={s.stat}>
                <Text style={[s.statNum, { color: theme.colors.text2 }]}>{weeklyGoal}</Text>
                <Text style={s.statLbl}>Weekly Goal</Text>
              </View>
              <View style={s.statDiv} />
              <View style={s.stat}>
                <Text style={[s.statNum, { color: remaining === 0 ? theme.colors.tealLight : theme.colors.goldLight }]}>{remaining}</Text>
                <Text style={s.statLbl}>Remaining</Text>
              </View>
            </View>
            <View style={s.progRow}>
              <View style={s.progBar}>
                <View style={[s.progFill, { width: `${percentage}%` }]} />
              </View>
              <Text style={s.progPct}>{percentage}%</Text>
            </View>
            {remaining === 0 && (
              <View style={s.completeBadge}>
                <Feather name="check-circle" size={13} color={theme.colors.tealLight} />
                <Text style={s.completeText}>Weekly goal achieved!</Text>
              </View>
            )}
          </LinearGradient>

          {/* Stepper */}
          <View style={s.card}>
            <Text style={s.cardLabel}>Today's Pages</Text>
            <View style={s.stepper}>
              <TouchableOpacity activeOpacity={0.7} onPress={decrementPages} style={s.stepBtn}>
                <Feather name="minus" size={20} color={theme.colors.gold} />
              </TouchableOpacity>
              <Text style={s.stepNum}>{pagesRead}</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={incrementPages} style={s.stepBtn}>
                <Feather name="plus" size={20} color={theme.colors.gold} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={s.card}>
            <Text style={s.cardLabel}>Weekly Target</Text>
            <View style={s.stepper}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setWeeklyGoal(Math.max(1, weeklyGoal - 5))} style={s.stepBtn}>
                <Feather name="minus" size={20} color={theme.colors.text2} />
              </TouchableOpacity>
              <Text style={s.stepNum}>{weeklyGoal}</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => setWeeklyGoal(weeklyGoal + 5)} style={s.stepBtn}>
                <Feather name="plus" size={20} color={theme.colors.text2} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Khatm Ring */}
          <View style={s.khatmCard}>
            <View style={s.khatmRing}>
              <ProgressRing progress={khatmProgress} size={80} color={theme.colors.gold} strokeWidth={5} />
              <View style={s.khatmCenter}>
                <Text style={s.khatmNum}>{completedKhatms}</Text>
                <Text style={s.khatmLbl}>Khatm</Text>
              </View>
            </View>
            <View style={s.khatmInfo}>
              <Text style={s.khatmTitle}>Quran Completion</Text>
              <Text style={s.khatmSub}>{pagesRead % TOTAL_QURAN_PAGES} / {TOTAL_QURAN_PAGES} pages to next khatm</Text>
              <Text style={s.khatmYear}>{khatmsPerYear} khatms / year at this pace</Text>
            </View>
          </View>

          {/* Milestones */}
          <View style={s.milestonesRow}>
            <View style={s.mCard}>
              <Feather name="book-open" size={20} color={theme.colors.gold} style={{ marginBottom: 8 }} />
              <Text style={s.mNum}>{pagesPerYear}</Text>
              <Text style={s.mLbl}>Pages / Year</Text>
            </View>
            <View style={s.mCard}>
              <Feather name="calendar" size={20} color={theme.colors.tealLight} style={{ marginBottom: 8 }} />
              <Text style={[s.mNum, { color: theme.colors.tealLight }]}>52</Text>
              <Text style={s.mLbl}>Weeks Active</Text>
            </View>
            <View style={s.mCard}>
              <Feather name="award" size={20} color={theme.colors.text2} style={{ marginBottom: 8 }} />
              <Text style={[s.mNum, { color: theme.colors.text2 }]}>{completedKhatms}</Text>
              <Text style={s.mLbl}>Total Khatms</Text>
            </View>
          </View>

          <View style={s.tipCard}>
            <Text style={s.tipText}>"The best among you are those who learn the Quran and teach it."</Text>
            <Text style={s.tipSource}>— Sahih Bukhari 5027</Text>
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
  header: { marginBottom: 20 },
  eyebrow: { fontSize: 10, letterSpacing: 2, color: theme.colors.gold, fontWeight: '600', marginBottom: 6 },
  title: { fontSize: 26, fontWeight: '700', color: theme.colors.text },
  heroCard: { borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: theme.colors.goldBorder20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 18 },
  stat: { alignItems: 'center' },
  statNum: { fontSize: 26, fontWeight: '800', color: theme.colors.gold, marginBottom: 4 },
  statLbl: { fontSize: 10, color: theme.colors.text2, fontWeight: '500' },
  statDiv: { width: 1, height: 36, backgroundColor: theme.colors.border },
  progRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  progBar: { flex: 1, height: 5, backgroundColor: theme.colors.border2, borderRadius: 3, overflow: 'hidden' },
  progFill: { height: '100%', backgroundColor: theme.colors.gold, borderRadius: 3 },
  progPct: { fontSize: 12, fontWeight: '700', color: theme.colors.gold, width: 34 },
  completeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, backgroundColor: theme.colors.tealDim, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start' },
  completeText: { fontSize: 12, color: theme.colors.tealLight, fontWeight: '600' },
  card: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border },
  cardLabel: { fontSize: 12, fontWeight: '600', color: theme.colors.text2, marginBottom: 14 },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24 },
  stepBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: theme.colors.surface2, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
  stepNum: { fontSize: 34, fontWeight: '800', color: theme.colors.text, minWidth: 60, textAlign: 'center' },
  khatmCard: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: theme.colors.border, flexDirection: 'row', alignItems: 'center', gap: 16 },
  khatmRing: { position: 'relative', width: 80, height: 80, justifyContent: 'center', alignItems: 'center' },
  khatmCenter: { position: 'absolute', alignItems: 'center' },
  khatmNum: { fontSize: 20, fontWeight: '800', color: theme.colors.gold },
  khatmLbl: { fontSize: 9, color: theme.colors.text3, fontWeight: '600' },
  khatmInfo: { flex: 1 },
  khatmTitle: { fontSize: 15, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  khatmSub: { fontSize: 12, color: theme.colors.text2, marginBottom: 2 },
  khatmYear: { fontSize: 11, color: theme.colors.text3 },
  milestonesRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  mCard: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center' },
  mNum: { fontSize: 20, fontWeight: '800', color: theme.colors.gold, marginBottom: 4 },
  mLbl: { fontSize: 9, color: theme.colors.text3, textAlign: 'center', fontWeight: '500' },
  tipCard: { backgroundColor: theme.colors.goldDim, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: theme.colors.goldBorder20 },
  tipText: { fontSize: 13, color: theme.colors.goldLight, fontStyle: 'italic', lineHeight: 20, marginBottom: 6 },
  tipSource: { fontSize: 11, color: theme.colors.gold, fontWeight: '600' },
});
