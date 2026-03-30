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
import { useQuranGoal } from '@/hooks/useQuranGoal';

export default function QuranScreen() {
  const insets = useSafeAreaInsets();
  const {
    pagesRead,
    weeklyGoal,
    remaining,
    progress,
    pagesPerYear,
    khatmsPerYear,
    incrementPages,
    decrementPages,
    setWeeklyGoal,
  } = useQuranGoal();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const percentage = Math.round(progress * 100);
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
            <Text style={s.eyebrow}>WEEKLY GOAL</Text>
            <Text style={s.title}>Quran Planner</Text>
          </View>

          {/* Hero Progress Card */}
          <View style={s.heroCard}>
            <View style={s.statsRow}>
              <View style={s.stat}>
                <Text style={s.statNumber}>{pagesRead}</Text>
                <Text style={s.statLabel}>Pages Read</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.stat}>
                <Text style={[s.statNumber, { color: theme.colors.text2 }]}>{weeklyGoal}</Text>
                <Text style={s.statLabel}>Weekly Goal</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.stat}>
                <Text style={[s.statNumber, { color: remaining === 0 ? theme.colors.tealLight : theme.colors.goldLight }]}>
                  {remaining}
                </Text>
                <Text style={s.statLabel}>Remaining</Text>
              </View>
            </View>
            <View style={s.progressBarContainer}>
              <View style={s.progressBar}>
                <Animated.View
                  style={[s.progressFill, { width: `${percentage}%` }]}
                />
              </View>
              <Text style={s.percentLabel}>{percentage}%</Text>
            </View>
            {remaining === 0 && (
              <View style={s.completeBadge}>
                <Feather name="check-circle" size={14} color={theme.colors.tealLight} />
                <Text style={s.completeText}>Weekly goal achieved!</Text>
              </View>
            )}
          </View>

          {/* Pages Counter */}
          <View style={s.sectionCard}>
            <Text style={s.sectionTitle}>Today's Pages</Text>
            <View style={s.stepper}>
              <TouchableOpacity activeOpacity={0.7} onPress={decrementPages} style={s.stepBtn}>
                <Feather name="minus" size={20} color={theme.colors.gold} />
              </TouchableOpacity>
              <Text style={s.stepNumber}>{pagesRead}</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={incrementPages} style={s.stepBtn}>
                <Feather name="plus" size={20} color={theme.colors.gold} />
              </TouchableOpacity>
            </View>
            <Text style={s.stepperHint}>Tap to update pages read this week</Text>
          </View>

          {/* Goal Setter */}
          <View style={s.sectionCard}>
            <Text style={s.sectionTitle}>Weekly Goal</Text>
            <View style={s.stepper}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setWeeklyGoal(Math.max(1, weeklyGoal - 5))}
                style={s.stepBtn}
              >
                <Feather name="minus" size={20} color={theme.colors.text2} />
              </TouchableOpacity>
              <Text style={s.stepNumber}>{weeklyGoal}</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setWeeklyGoal(weeklyGoal + 5)}
                style={s.stepBtn}
              >
                <Feather name="plus" size={20} color={theme.colors.text2} />
              </TouchableOpacity>
            </View>
            <Text style={s.stepperHint}>Pages per week target</Text>
          </View>

          {/* Milestones */}
          <Text style={s.milestonesTitle}>Your Milestones</Text>
          <View style={s.milestonesRow}>
            <View style={s.milestoneCard}>
              <Feather name="book-open" size={22} color={theme.colors.gold} style={s.milestoneIcon} />
              <Text style={s.milestoneNumber}>{pagesPerYear}</Text>
              <Text style={s.milestoneLabel}>Pages / Year</Text>
            </View>
            <View style={s.milestoneCard}>
              <Feather name="award" size={22} color={theme.colors.tealLight} style={s.milestoneIcon} />
              <Text style={[s.milestoneNumber, { color: theme.colors.tealLight }]}>{khatmsPerYear}</Text>
              <Text style={s.milestoneLabel}>Khatms / Year</Text>
            </View>
            <View style={s.milestoneCard}>
              <Feather name="calendar" size={22} color={theme.colors.text2} style={s.milestoneIcon} />
              <Text style={[s.milestoneNumber, { color: theme.colors.text2 }]}>52</Text>
              <Text style={s.milestoneLabel}>Weeks Active</Text>
            </View>
          </View>

          {/* Quran tip */}
          <View style={s.tipCard}>
            <Text style={s.tipText}>
              "The best among you are those who learn the Quran and teach it."
            </Text>
            <Text style={s.tipSource}>— Sahih al-Bukhari</Text>
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
  header: { marginBottom: 24 },
  eyebrow: { fontSize: 11, letterSpacing: 2, color: theme.colors.gold, fontWeight: '600', marginBottom: 6 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text },
  heroCard: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: theme.colors.border },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginBottom: 20 },
  stat: { alignItems: 'center' },
  statNumber: { fontSize: 28, fontWeight: '800', color: theme.colors.gold, marginBottom: 4 },
  statLabel: { fontSize: 11, color: theme.colors.text2, fontWeight: '500' },
  statDivider: { width: 1, height: 40, backgroundColor: theme.colors.border },
  progressBarContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressBar: { flex: 1, height: 6, backgroundColor: theme.colors.border2, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: theme.colors.gold, borderRadius: 3 },
  percentLabel: { fontSize: 13, fontWeight: '700', color: theme.colors.gold, width: 36 },
  completeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, backgroundColor: theme.colors.tealDim, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start' },
  completeText: { fontSize: 13, color: theme.colors.tealLight, fontWeight: '600' },
  sectionCard: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: theme.colors.border },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: theme.colors.text2, marginBottom: 16 },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 8 },
  stepBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: theme.colors.surface2, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border },
  stepNumber: { fontSize: 36, fontWeight: '800', color: theme.colors.text, minWidth: 60, textAlign: 'center' },
  stepperHint: { fontSize: 12, color: theme.colors.text3, textAlign: 'center' },
  milestonesTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: 12 },
  milestonesRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  milestoneCard: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center' },
  milestoneIcon: { marginBottom: 8 },
  milestoneNumber: { fontSize: 20, fontWeight: '800', color: theme.colors.gold, marginBottom: 4 },
  milestoneLabel: { fontSize: 10, color: theme.colors.text3, textAlign: 'center', fontWeight: '500' },
  tipCard: { backgroundColor: theme.colors.goldDim, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: `rgba(201,168,76,0.2)` },
  tipText: { fontSize: 14, color: theme.colors.goldLight, fontStyle: 'italic', lineHeight: 22, marginBottom: 8 },
  tipSource: { fontSize: 12, color: theme.colors.gold, fontWeight: '600' },
});
