import * as Haptics from 'expo-haptics';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GeometricBackground } from '@/components/GeometricBackground';
import { theme } from '@/constants/colors';
import { AZKAR_COLLECTIONS, DHIKR_COUNTER_OPTIONS } from '@/data/azkar';

const COLLECTION_LABELS: Record<string, string> = {
  morning: 'Morning Azkar',
  evening: 'Evening Azkar',
  afterPrayer: 'After Prayer',
  beforeSleep: 'Before Sleep',
};

export default function DhikrScreen() {
  const insets = useSafeAreaInsets();
  const [selectedDhikr, setSelectedDhikr] = useState(0);
  const [count, setCount] = useState(0);
  const [expandedCollection, setExpandedCollection] = useState<string | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;

  const current = DHIKR_COUNTER_OPTIONS[selectedDhikr];
  const progress = Math.min(1, count / current.target);
  const targetReached = count > 0 && count % current.target === 0;

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const next = count + 1;
    setCount(next);

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();

    if (next % current.target === 0) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 1, duration: 200, useNativeDriver: false }),
        Animated.timing(flashAnim, { toValue: 0, duration: 600, useNativeDriver: false }),
      ]).start();
    }
  };

  const handleReset = () => {
    setCount(0);
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const borderColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.goldBorder20, theme.colors.goldBorder80],
  });

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      <GeometricBackground />
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.content, { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.header}>
          <Text style={s.eyebrow}>REMEMBRANCE</Text>
          <Text style={s.title}>Dhikr Counter</Text>
        </View>

        {/* Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.selectorRow}>
          {DHIKR_COUNTER_OPTIONS.map((d, i) => (
            <TouchableOpacity
              key={d.name}
              activeOpacity={0.7}
              onPress={() => { setSelectedDhikr(i); setCount(0); }}
              style={[s.selectorPill, i === selectedDhikr && s.selectorActive]}
            >
              <Text style={[s.selectorTxt, i === selectedDhikr && s.selectorTxtActive]}>{d.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Main Counter */}
        <Animated.View style={[s.counterCard, { borderColor }]}>
          <Pressable onPress={handleTap} style={s.counterPressable}>
            <Animated.View style={{ transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
              <Text style={s.counterArabic}>{current.arabic}</Text>
              <Text style={s.counterCount}>{count}</Text>
              <Text style={s.counterName}>{current.name}</Text>
              <Text style={s.counterTranslit}>{current.transliteration}</Text>
            </Animated.View>
          </Pressable>
        </Animated.View>

        {/* Progress to target */}
        <View style={s.progressSection}>
          <View style={s.progressRow}>
            <Text style={s.progressLabel}>Target: {current.target}</Text>
            <Text style={s.progressCount}>{count % current.target}/{current.target}</Text>
          </View>
          <View style={s.progressBar}>
            <Animated.View style={[s.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          {targetReached && (
            <Text style={s.targetReached}>Target reached {Math.floor(count / current.target)}× ✦</Text>
          )}
        </View>

        {/* Reset */}
        <View style={s.actionsRow}>
          <TouchableOpacity activeOpacity={0.7} onPress={handleReset} style={s.resetBtn}>
            <Text style={s.resetTxt}>Reset</Text>
          </TouchableOpacity>
          <View style={s.sessionCount}>
            <Text style={s.sessionLabel}>Session Total</Text>
            <Text style={s.sessionNum}>{count.toLocaleString()}</Text>
          </View>
        </View>

        {/* Azkar Collections */}
        <Text style={s.collectionsTitle}>Azkar Collections</Text>
        {Object.entries(AZKAR_COLLECTIONS).map(([key, items]) => (
          <View key={key}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setExpandedCollection(expandedCollection === key ? null : key)}
              style={s.collectionHeader}
            >
              <View>
                <Text style={s.collectionName}>{COLLECTION_LABELS[key]}</Text>
                <Text style={s.collectionCount}>{items.length} adhkar</Text>
              </View>
              <View style={s.chevronRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={s.startBtn}
                  onPress={() => setExpandedCollection(expandedCollection === key ? null : key)}
                >
                  <Text style={s.startTxt}>{expandedCollection === key ? 'Hide' : 'View'}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            {expandedCollection === key && items.map((dhikr, i) => (
              <View key={i} style={s.dhikrItem}>
                <Text style={s.dhikrArabic}>{dhikr.arabic}</Text>
                <Text style={s.dhikrTranslit}>{dhikr.transliteration}</Text>
                <Text style={s.dhikrTranslation}>{dhikr.translation}</Text>
                <View style={s.dhikrFooter}>
                  <Text style={s.dhikrCount}>×{dhikr.count}</Text>
                  <Text style={s.dhikrSource}>{dhikr.source}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}
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
  selectorRow: { marginBottom: 20 },
  selectorPill: { backgroundColor: theme.colors.surface2, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, marginRight: 8, borderWidth: 1, borderColor: theme.colors.border },
  selectorActive: { backgroundColor: theme.colors.goldDim, borderColor: theme.colors.goldBorder50 },
  selectorTxt: { fontSize: 12, color: theme.colors.text2, fontWeight: '600' },
  selectorTxtActive: { color: theme.colors.gold },
  counterCard: { backgroundColor: theme.colors.surface, borderRadius: 24, padding: 32, marginBottom: 16, borderWidth: 1.5, alignItems: 'center' },
  counterPressable: { alignItems: 'center', width: '100%' },
  counterArabic: { fontSize: 32, color: theme.colors.gold, textAlign: 'center', writingDirection: 'rtl', marginBottom: 20, lineHeight: 50 },
  counterCount: { fontSize: 72, fontWeight: '800', color: theme.colors.text, marginBottom: 8 },
  counterName: { fontSize: 16, fontWeight: '700', color: theme.colors.text2, marginBottom: 4 },
  counterTranslit: { fontSize: 13, color: theme.colors.text3, fontStyle: 'italic' },
  progressSection: { marginBottom: 16 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 12, color: theme.colors.text2 },
  progressCount: { fontSize: 12, color: theme.colors.gold, fontWeight: '700' },
  progressBar: { height: 4, backgroundColor: theme.colors.border2, borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', backgroundColor: theme.colors.gold, borderRadius: 2 },
  targetReached: { fontSize: 13, color: theme.colors.goldLight, textAlign: 'center', fontWeight: '600' },
  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 28, alignItems: 'center' },
  resetBtn: { backgroundColor: theme.colors.surface, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 12, borderWidth: 1, borderColor: theme.colors.border },
  resetTxt: { fontSize: 14, color: theme.colors.text2, fontWeight: '600' },
  sessionCount: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center' },
  sessionLabel: { fontSize: 10, color: theme.colors.text3, marginBottom: 2 },
  sessionNum: { fontSize: 20, fontWeight: '800', color: theme.colors.gold },
  collectionsTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginBottom: 12 },
  collectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: 14, padding: 16, marginBottom: 6, borderWidth: 1, borderColor: theme.colors.border },
  collectionName: { fontSize: 14, fontWeight: '700', color: theme.colors.text, marginBottom: 2 },
  collectionCount: { fontSize: 11, color: theme.colors.text3 },
  chevronRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  startBtn: { backgroundColor: theme.colors.goldDim, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: theme.colors.goldBorder30 },
  startTxt: { fontSize: 11, color: theme.colors.gold, fontWeight: '700' },
  dhikrItem: { backgroundColor: theme.colors.surface2, borderRadius: 12, padding: 14, marginBottom: 6, borderWidth: 1, borderColor: theme.colors.border },
  dhikrArabic: { fontSize: 18, color: theme.colors.goldLight, textAlign: 'right', writingDirection: 'rtl', marginBottom: 8, lineHeight: 28 },
  dhikrTranslit: { fontSize: 12, color: theme.colors.text2, fontStyle: 'italic', marginBottom: 4 },
  dhikrTranslation: { fontSize: 13, color: theme.colors.text, lineHeight: 19, marginBottom: 8 },
  dhikrFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dhikrCount: { fontSize: 12, color: theme.colors.gold, fontWeight: '700' },
  dhikrSource: { fontSize: 10, color: theme.colors.text3 },
});
