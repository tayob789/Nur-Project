import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
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
import { theme } from '@/constants/colors';
import { usePrayers } from '@/context/PrayerContext';

const MESSAGES = [
  'Begin your day with intention.',
  'One prayer down. Stay consistent.',
  'Halfway there. Keep going.',
  'Almost complete. Well done.',
  'All prayers complete. May Allah accept.',
  'All prayers complete. May Allah accept.',
];

const SUNNAH = [
  { name: '2 rakat', label: 'Before Fajr', note: 'Sunnah Muakkadah' },
  { name: '4 rakat', label: 'Before Dhuhr', note: 'Sunnah Muakkadah' },
  { name: '2 rakat', label: 'After Dhuhr', note: 'Sunnah Muakkadah' },
  { name: '2 rakat', label: 'After Maghrib', note: 'Sunnah Muakkadah' },
  { name: '2 rakat', label: 'After Isha', note: 'Sunnah Muakkadah' },
  { name: 'Witr', label: 'After Isha (night)', note: 'Sunnah Muakkadah' },
];

export default function PrayersScreen() {
  const insets = useSafeAreaInsets();
  const { prayers, nextPrayer, loading, error, hijriDate, togglePrayer } = usePrayers();
  const [sunnahExpanded, setSunnahExpanded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const done = prayers.filter((p) => p.done).length;
  const ringColor = done === 5 ? theme.colors.teal : theme.colors.gold;
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();

  function isMissed(timeStr: string, isDone: boolean) {
    if (isDone) return false;
    const [h, m] = timeStr.split(':').map(Number);
    const pMins = h * 60 + m;
    return pMins < nowMins;
  }

  function isPast(timeStr: string) {
    const [h, m] = timeStr.split(':').map(Number);
    const pMins = h * 60 + m;
    return pMins < nowMins;
  }

  // Calculate progress between previous and next prayer
  const getProgress = () => {
    if (!nextPrayer || prayers.length === 0) return 0;
    const nextIdx = prayers.findIndex(p => p.name === nextPrayer.name);
    const prevIdx = nextIdx === 0 ? prayers.length - 1 : nextIdx - 1;
    const prevPrayer = prayers[prevIdx];
    
    const [nh, nm] = nextPrayer.time.split(':').map(Number);
    const [ph, pm] = prevPrayer.time.split(':').map(Number);
    
    let nTotal = nh * 60 + nm;
    let pTotal = ph * 60 + pm;
    let cTotal = now.getHours() * 60 + now.getMinutes();
    
    if (nTotal < pTotal) { // Over midnight (Isha to Fajr)
        if (cTotal < nTotal) cTotal += 24 * 60;
        nTotal += 24 * 60;
    }
    
    const totalDiff = nTotal - pTotal;
    const elapsed = cTotal - pTotal;
    return Math.max(0, Math.min(1, elapsed / totalDiff));
  };

  const progress = getProgress();

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
            <Text style={s.eyebrow}>{hijriDate || 'DAILY SALAH'}</Text>
            <Text style={s.title}>Daily Prayers</Text>
          </View>

          <View style={s.summaryCard}>
            <View style={[s.ring, { borderColor: ringColor }]}>
              <Text style={[s.ringNum, { color: ringColor }]}>{done}</Text>
              <Text style={s.ringOf}>of 5</Text>
            </View>
            <View style={s.summaryText}>
              <Text style={s.summaryMsg}>{MESSAGES[done]}</Text>
              <View style={s.progressContainer}>
                <View style={s.progressBarBg}>
                  <View style={[s.progressBarFill, { width: `${progress * 100}%` }]} />
                </View>
                <Text style={s.progressLabel}>
                  {nextPrayer ? `Time to ${nextPrayer.name}` : 'Day complete'}
                </Text>
              </View>
            </View>
          </View>

          {loading && <View style={s.loadBox}><Text style={s.loadTxt}>Loading prayer times…</Text></View>}
          {error && <View style={s.errBox}><Text style={s.errTxt}>{error}</Text></View>}

          {prayers.map((prayer, i) => {
            const isNext = nextPrayer?.name === prayer.name && !prayer.done;
            const missed = isMissed(prayer.time, prayer.done);
            const past = isPast(prayer.time) && !isNext;
            
            return (
              <TouchableOpacity
                key={prayer.name}
                activeOpacity={0.7}
                onPress={() => togglePrayer(i)}
                style={[
                  s.row,
                  prayer.done && s.rowDone,
                  isNext && s.rowNext,
                  missed && s.rowMissed,
                  past && !prayer.done && s.rowPast,
                ]}
              >
                <View style={[s.leftBar, {
                  backgroundColor: prayer.done ? theme.colors.teal : isNext ? theme.colors.gold : missed ? theme.colors.amber : 'transparent'
                }]} />
                <View style={[s.cb, prayer.done && s.cbDone, missed && !prayer.done && s.cbMissed, past && !prayer.done && s.cbPast]}>
                  {prayer.done && <Feather name="check" size={13} color={theme.colors.bg} />}
                  {missed && !prayer.done && <Feather name="clock" size={11} color={theme.colors.amber} />}
                </View>
                <View style={s.prayerInfo}>
                  <View style={s.nameRow}>
                    <Text style={[s.pName, prayer.done && s.pNameDone, isNext && s.pNameNext, past && !prayer.done && s.pNamePast]}>{prayer.name}</Text>
                    <Text style={s.pArabic}>{prayer.arabic}</Text>
                  </View>
                  <Text style={[s.pTime, past && !prayer.done && s.pTimePast]}>{prayer.time}</Text>
                </View>
                {isNext && <View style={s.nextBadge}><Text style={s.nextBadgeTxt}>Next</Text></View>}
                {missed && !prayer.done && <View style={s.missedBadge}><Text style={s.missedBadgeTxt}>Missed</Text></View>}
                {prayer.done && <Feather name="check-circle" size={18} color={theme.colors.teal} />}
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSunnahExpanded(!sunnahExpanded)}
            style={s.sunnahHeader}
          >
            <Text style={s.sunnahTitle}>Sunnah Prayers</Text>
            <Feather name={sunnahExpanded ? 'chevron-up' : 'chevron-down'} size={16} color={theme.colors.text2} />
          </TouchableOpacity>
          {sunnahExpanded && SUNNAH.map((sunnah, i) => (
            <View key={i} style={s.sunnahRow}>
              <View style={s.sunnahLeft}>
                <Text style={s.sunnahName}>{sunnah.name}</Text>
                <Text style={s.sunnahLabel}>{sunnah.label}</Text>
              </View>
              <Text style={s.sunnahNote}>{sunnah.note}</Text>
            </View>
          ))}
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
  summaryCard: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: theme.colors.border, flexDirection: 'row', alignItems: 'center', gap: 18 },
  ring: { width: 72, height: 72, borderRadius: 36, borderWidth: 3, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.surface2 },
  ringNum: { fontSize: 22, fontWeight: '800' },
  ringOf: { fontSize: 10, color: theme.colors.text3, fontWeight: '500' },
  summaryText: { flex: 1 },
  summaryMsg: { fontSize: 14, fontWeight: '600', color: theme.colors.text, lineHeight: 20, marginBottom: 8 },
  progressContainer: { marginTop: 4 },
  progressBarBg: { height: 4, backgroundColor: theme.colors.border2, borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  progressBarFill: { height: '100%', backgroundColor: theme.colors.gold, borderRadius: 2 },
  progressLabel: { fontSize: 10, color: theme.colors.text3, fontWeight: '500' },
  loadBox: { padding: 20, alignItems: 'center' },
  loadTxt: { color: theme.colors.text2 },
  errBox: { backgroundColor: theme.colors.errorBg15, borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: theme.colors.errorBorder30 },
  errTxt: { color: theme.colors.errorSoft, fontSize: 13 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: 14, marginBottom: 10, paddingRight: 14, paddingVertical: 16, borderWidth: 1, borderColor: theme.colors.border, overflow: 'hidden', gap: 12 },
  rowDone: { backgroundColor: theme.colors.tealDim, borderColor: theme.colors.tealBorder30 },
  rowNext: { borderColor: theme.colors.goldBorder40, backgroundColor: theme.colors.goldDim, transform: [{ scale: 1.02 }] },
  rowMissed: { borderColor: theme.colors.amberBorder30, backgroundColor: theme.colors.amberDim },
  rowPast: { opacity: 0.5 },
  leftBar: { width: 3, height: '100%', position: 'absolute', left: 0, top: 0 },
  cb: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: theme.colors.border2, justifyContent: 'center', alignItems: 'center', marginLeft: 14 },
  cbDone: { backgroundColor: theme.colors.teal, borderColor: theme.colors.teal },
  cbMissed: { borderColor: theme.colors.amber },
  cbPast: { borderColor: theme.colors.text3 },
  prayerInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
  pName: { fontSize: 16, fontWeight: '700', color: theme.colors.text },
  pNameDone: { color: theme.colors.tealLight },
  pNameNext: { color: theme.colors.gold },
  pNamePast: { color: theme.colors.text3 },
  pArabic: { fontSize: 13, color: theme.colors.text3 },
  pTime: { fontSize: 12, color: theme.colors.text2 },
  pTimePast: { color: theme.colors.text3 },
  nextBadge: { backgroundColor: theme.colors.goldDim, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: theme.colors.goldBorder40 },
  nextBadgeTxt: { fontSize: 10, color: theme.colors.gold, fontWeight: '700' },
  missedBadge: { backgroundColor: theme.colors.amberDim, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: theme.colors.amberBorder30 },
  missedBadgeTxt: { fontSize: 10, color: theme.colors.amber, fontWeight: '700' },
  sunnahHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surface, borderRadius: 14, padding: 16, marginBottom: 4, borderWidth: 1, borderColor: theme.colors.border },
  sunnahTitle: { fontSize: 14, fontWeight: '600', color: theme.colors.text2 },
  sunnahRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surface2, borderRadius: 10, padding: 12, marginBottom: 4, borderWidth: 1, borderColor: theme.colors.border },
  sunnahLeft: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  sunnahName: { fontSize: 13, fontWeight: '700', color: theme.colors.text3 },
  sunnahLabel: { fontSize: 13, color: theme.colors.text2 },
  sunnahNote: { fontSize: 10, color: theme.colors.text3, fontStyle: 'italic' },
});
