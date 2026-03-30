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

const MESSAGES = [
  'Begin your day with intention.',
  'One prayer down. Stay consistent.',
  'Halfway there. Keep going.',
  'Almost complete. Well done.',
  'All prayers complete. May Allah accept.',
  'All prayers complete. May Allah accept.',
];

export default function PrayersScreen() {
  const insets = useSafeAreaInsets();
  const { prayers, nextPrayer, loading, error, hijriDate, togglePrayer } = usePrayerTimes();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const done = prayers.filter((p) => p.done).length;
  const progress = prayers.length > 0 ? done / prayers.length : 0;
  const ringColor = done === 5 ? theme.colors.teal : theme.colors.gold;
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
            <Text style={s.eyebrow}>{hijriDate || 'DAILY SALAH'}</Text>
            <Text style={s.title}>Daily Prayers</Text>
          </View>

          {/* Summary Ring */}
          <View style={s.summaryCard}>
            <View style={s.ringOuter}>
              <View style={[s.ringInner, { borderColor: ringColor }]}>
                <Text style={[s.ringNumber, { color: ringColor }]}>{done}</Text>
                <Text style={s.ringLabel}>of 5</Text>
              </View>
            </View>
            <View style={s.summaryText}>
              <Text style={s.summaryMessage}>{MESSAGES[done]}</Text>
              {done < 5 && (
                <Text style={s.summaryRemaining}>{5 - done} prayer{5 - done !== 1 ? 's' : ''} remaining</Text>
              )}
            </View>
          </View>

          {loading && (
            <View style={s.loadingContainer}>
              <Text style={s.loadingText}>Loading prayer times…</Text>
            </View>
          )}
          {error && (
            <View style={s.errorContainer}>
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          {/* Prayer List */}
          {prayers.map((prayer, i) => {
            const isNext = nextPrayer?.name === prayer.name && !prayer.done;
            return (
              <TouchableOpacity
                key={prayer.name}
                activeOpacity={0.7}
                onPress={() => togglePrayer(i)}
                style={[
                  s.prayerRow,
                  prayer.done && s.prayerRowDone,
                  isNext && s.prayerRowNext,
                ]}
              >
                <View style={[s.leftBorder, { backgroundColor: prayer.done ? theme.colors.teal : isNext ? theme.colors.gold : 'transparent' }]} />
                <View style={[s.checkbox, prayer.done && s.checkboxDone]}>
                  {prayer.done && <Feather name="check" size={14} color={theme.colors.bg} />}
                </View>
                <View style={s.prayerInfo}>
                  <View style={s.prayerNameRow}>
                    <Text style={[s.prayerName, prayer.done && s.prayerNameDone, isNext && s.prayerNameNext]}>
                      {prayer.name}
                    </Text>
                    <Text style={s.arabicName}>{prayer.arabic}</Text>
                  </View>
                  <Text style={s.prayerTime}>{prayer.time}</Text>
                </View>
                {isNext && (
                  <View style={s.nextBadge}>
                    <Text style={s.nextBadgeText}>Next</Text>
                  </View>
                )}
                {prayer.done && (
                  <Feather name="check-circle" size={18} color={theme.colors.teal} />
                )}
              </TouchableOpacity>
            );
          })}
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
  summaryCard: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 24, marginBottom: 24, borderWidth: 1, borderColor: theme.colors.border, flexDirection: 'row', alignItems: 'center', gap: 20 },
  ringOuter: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.surface2, justifyContent: 'center', alignItems: 'center' },
  ringInner: { width: 68, height: 68, borderRadius: 34, borderWidth: 3, justifyContent: 'center', alignItems: 'center' },
  ringNumber: { fontSize: 24, fontWeight: '800' },
  ringLabel: { fontSize: 11, color: theme.colors.text3, fontWeight: '500' },
  summaryText: { flex: 1 },
  summaryMessage: { fontSize: 15, fontWeight: '600', color: theme.colors.text, lineHeight: 22, marginBottom: 4 },
  summaryRemaining: { fontSize: 13, color: theme.colors.text2 },
  loadingContainer: { padding: 20, alignItems: 'center' },
  loadingText: { color: theme.colors.text2 },
  errorContainer: { backgroundColor: 'rgba(255,100,100,0.1)', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,100,100,0.3)' },
  errorText: { color: '#ff6464', fontSize: 14 },
  prayerRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: 14, marginBottom: 10, paddingRight: 16, paddingVertical: 16, borderWidth: 1, borderColor: theme.colors.border, overflow: 'hidden', gap: 12 },
  prayerRowDone: { backgroundColor: theme.colors.tealDim, borderColor: `rgba(61,140,124,0.3)` },
  prayerRowNext: { borderColor: `rgba(201,168,76,0.4)`, backgroundColor: theme.colors.goldDim },
  leftBorder: { width: 3, height: '100%', position: 'absolute', left: 0, top: 0, bottom: 0 },
  checkbox: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: theme.colors.border2, justifyContent: 'center', alignItems: 'center', marginLeft: 16 },
  checkboxDone: { backgroundColor: theme.colors.teal, borderColor: theme.colors.teal },
  prayerInfo: { flex: 1 },
  prayerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  prayerName: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  prayerNameDone: { color: theme.colors.tealLight },
  prayerNameNext: { color: theme.colors.gold },
  arabicName: { fontSize: 14, color: theme.colors.text3 },
  prayerTime: { fontSize: 13, color: theme.colors.text2 },
  nextBadge: { backgroundColor: theme.colors.goldDim, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: `rgba(201,168,76,0.4)` },
  nextBadgeText: { fontSize: 11, color: theme.colors.gold, fontWeight: '700' },
});
