import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GeometricBackground } from '@/components/GeometricBackground';
import { theme } from '@/constants/colors';
import { useUser } from '@/context/UserContext';

const PREMIUM_FEATURES = [
  'Cloud sync across devices',
  'Advanced fasting planner and reminders',
  'Premium adhan packs and themes',
  'Priority future features',
];

export default function PremiumScreen() {
  const insets = useSafeAreaInsets();
  const { hasAccount, isPremium, setPremium } = useUser();
  const [working, setWorking] = useState(false);

  const ctaLabel = useMemo(() => {
    if (!hasAccount) return 'Create account first';
    return isPremium ? 'You are Premium' : 'Start Premium';
  }, [hasAccount, isPremium]);

  async function onUpgrade() {
    if (!hasAccount || isPremium || working) return;
    setWorking(true);
    await setPremium(true);
    setWorking(false);
  }

  return (
    <View style={s.root}>
      <GeometricBackground />
      <ScrollView contentContainerStyle={[s.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }]}>
        <View style={s.card}>
          <Text style={s.badge}>PREMIUM</Text>
          <Text style={s.title}>Unlock Nur Premium</Text>
          <Text style={s.price}>$4.99 / month</Text>
          <Text style={s.desc}>You can continue with the free plan anytime and upgrade later from Account.</Text>

          {PREMIUM_FEATURES.map((feature) => (
            <Text key={feature} style={s.feature}>• {feature}</Text>
          ))}

          <TouchableOpacity
            disabled={!hasAccount || isPremium || working}
            onPress={onUpgrade}
            style={[s.cta, (!hasAccount || isPremium || working) && s.ctaDisabled]}
          >
            <Text style={s.ctaText}>{working ? 'Processing…' : ctaLabel}</Text>
          </TouchableOpacity>
          {!hasAccount ? <Text style={s.helper}>For now, subscriptions are available after account creation.</Text> : null}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  content: { paddingHorizontal: 18 },
  card: { backgroundColor: theme.colors.surface, borderRadius: 18, borderWidth: 1, borderColor: theme.colors.goldBorder30, padding: 18 },
  badge: { color: theme.colors.gold, letterSpacing: 2, fontSize: 11, fontWeight: '700', marginBottom: 8 },
  title: { color: theme.colors.text, fontSize: 26, fontWeight: '700', marginBottom: 4 },
  price: { color: theme.colors.goldLight, fontSize: 18, fontWeight: '700', marginBottom: 8 },
  desc: { color: theme.colors.text2, lineHeight: 19, marginBottom: 14 },
  feature: { color: theme.colors.text, marginBottom: 8, lineHeight: 20 },
  cta: { marginTop: 10, backgroundColor: theme.colors.gold, borderRadius: 12, alignItems: 'center', paddingVertical: 13 },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { color: theme.colors.bg, fontSize: 15, fontWeight: '700' },
  helper: { marginTop: 8, color: theme.colors.text3, fontSize: 12, textAlign: 'center' },
});
