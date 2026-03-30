import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GeometricBackground } from '@/components/GeometricBackground';
import { theme } from '@/constants/colors';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';

interface FeatureCardProps {
  icon: string;
  label: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}

function FeatureCard({ icon, label, subtitle, color, onPress }: FeatureCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={s.card}>
      <View style={[s.cardIcon, { backgroundColor: color + '22' }]}>
        <Feather name={icon as any} size={24} color={color} />
      </View>
      <Text style={s.cardLabel}>{label}</Text>
      <Text style={s.cardSub}>{subtitle}</Text>
    </TouchableOpacity>
  );
}

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const { prayers } = usePrayerTimes();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start(); }, []);

  const fajr = prayers.find(p => p.name === 'Fajr');
  const maghrib = prayers.find(p => p.name === 'Maghrib');
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
          <View style={s.header}>
            <Text style={s.eyebrow}>FEATURES</Text>
            <Text style={s.title}>More</Text>
          </View>

          <View style={s.grid}>
            <FeatureCard icon="navigation" label="Qibla" subtitle="Find direction" color={theme.colors.gold} onPress={() => router.push('/(tabs)/(more)/qibla')} />
            <FeatureCard icon="calendar" label="Calendar" subtitle="Islamic dates" color={theme.colors.teal} onPress={() => router.push('/(tabs)/(more)/calendar')} />
            <FeatureCard icon="star" label="99 Names" subtitle="Asma ul-Husna" color={theme.colors.goldLight} onPress={() => router.push('/(tabs)/(more)/names')} />
            <FeatureCard icon="percent" label="Zakat" subtitle="Calculate now" color={theme.colors.tealLight} onPress={() => router.push('/(tabs)/(more)/zakat')} />
          </View>

          {/* Sehri / Iftar (based on Fajr / Maghrib) */}
          {(fajr || maghrib) && (
            <View style={s.ramadanCard}>
              <Text style={s.ramadanTitle}>Fasting Times</Text>
              <View style={s.fastRow}>
                <View style={s.fastItem}>
                  <Text style={s.fastLabel}>Sehri ends</Text>
                  <Text style={s.fastTime}>{fajr?.time ?? '--:--'}</Text>
                </View>
                <View style={s.fastDivider} />
                <View style={s.fastItem}>
                  <Text style={s.fastLabel}>Iftar</Text>
                  <Text style={[s.fastTime, { color: theme.colors.tealLight }]}>{maghrib?.time ?? '--:--'}</Text>
                </View>
              </View>
            </View>
          )}

          {/* About / Privacy */}
          <View style={s.privacyCard}>
            <Feather name="shield" size={18} color={theme.colors.teal} />
            <View style={{ flex: 1 }}>
              <Text style={s.privacyTitle}>Privacy Promise</Text>
              <Text style={s.privacyText}>Nur never sells your data. No ads. No tracking. Your worship is between you and Allah.</Text>
            </View>
          </View>

          <View style={s.aboutCard}>
            <Text style={s.aboutVersion}>Nur v1.0</Text>
            <Text style={s.aboutSub}>A premium Islamic lifestyle app. Built with care.</Text>
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
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  card: { width: '47%', backgroundColor: theme.colors.surface, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: theme.colors.border },
  cardIcon: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  cardLabel: { fontSize: 15, fontWeight: '700', color: theme.colors.text, marginBottom: 2 },
  cardSub: { fontSize: 11, color: theme.colors.text3 },
  ramadanCard: { backgroundColor: theme.colors.surface, borderRadius: 18, padding: 20, marginBottom: 14, borderWidth: 1, borderColor: theme.colors.border },
  ramadanTitle: { fontSize: 13, fontWeight: '600', color: theme.colors.gold, marginBottom: 14, letterSpacing: 1 },
  fastRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  fastItem: { alignItems: 'center' },
  fastLabel: { fontSize: 11, color: theme.colors.text2, marginBottom: 4 },
  fastTime: { fontSize: 22, fontWeight: '800', color: theme.colors.gold },
  fastDivider: { width: 1, height: 30, backgroundColor: theme.colors.border },
  privacyCard: { flexDirection: 'row', gap: 12, backgroundColor: theme.colors.tealDim, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(61,140,124,0.25)', alignItems: 'flex-start' },
  privacyTitle: { fontSize: 13, fontWeight: '700', color: theme.colors.tealLight, marginBottom: 4 },
  privacyText: { fontSize: 12, color: theme.colors.text2, lineHeight: 18 },
  aboutCard: { alignItems: 'center', paddingVertical: 20 },
  aboutVersion: { fontSize: 14, fontWeight: '700', color: theme.colors.text3, marginBottom: 4 },
  aboutSub: { fontSize: 11, color: theme.colors.text3 },
});
