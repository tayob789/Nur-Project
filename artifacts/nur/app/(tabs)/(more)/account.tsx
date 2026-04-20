import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GeometricBackground } from '@/components/GeometricBackground';
import { theme } from '@/constants/colors';
import { useUser } from '@/context/UserContext';

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const { name, hasAccount, email, createAccount, signOut, isPremium } = useUser();
  const [emailInput, setEmailInput] = useState(email ?? '');
  const [working, setWorking] = useState(false);

  const canCreate = useMemo(
    () => emailInput.includes('@') && emailInput.includes('.') && !working,
    [emailInput, working],
  );

  async function handleCreateAccount() {
    if (!canCreate) return;
    setWorking(true);
    await createAccount(emailInput);
    setWorking(false);
  }

  return (
    <View style={s.root}>
      <GeometricBackground />
      <ScrollView contentContainerStyle={[s.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }]}>
        <View style={s.card}>
          <Text style={s.eyebrow}>ACCOUNT</Text>
          <Text style={s.title}>Assalamu Alaikum, {name || 'Friend'}</Text>
          <Text style={s.subtitle}>
            Create an account to save your worship progress across devices and securely keep your preferences.
          </Text>

          {hasAccount ? (
            <>
              <Text style={s.valueLabel}>Email</Text>
              <Text style={s.value}>{email}</Text>
              <Text style={s.valueLabel}>Plan</Text>
              <Text style={s.value}>{isPremium ? 'Premium' : 'Free'}</Text>

              <TouchableOpacity style={s.secondaryBtn} onPress={() => router.push('/(tabs)/(more)/premium')}>
                <Text style={s.secondaryBtnText}>{isPremium ? 'Manage Premium' : 'Upgrade to Premium'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.ghostBtn} onPress={signOut}>
                <Text style={s.ghostBtnText}>Sign out from account</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TextInput
                value={emailInput}
                onChangeText={setEmailInput}
                style={s.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="you@example.com"
                placeholderTextColor={theme.colors.text3}
              />
              <TouchableOpacity
                disabled={!canCreate}
                onPress={handleCreateAccount}
                style={[s.primaryBtn, !canCreate && s.disabled]}
              >
                <Text style={s.primaryBtnText}>{working ? 'Creating…' : 'Create Account'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.secondaryBtn} onPress={() => router.push('/(tabs)/(more)/premium')}>
                <Text style={s.secondaryBtnText}>View Premium Options</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  content: { paddingHorizontal: 18 },
  card: { backgroundColor: theme.colors.surface, borderRadius: 18, borderWidth: 1, borderColor: theme.colors.border, padding: 18 },
  eyebrow: { color: theme.colors.gold, fontWeight: '700', letterSpacing: 1.6, fontSize: 11, marginBottom: 8 },
  title: { color: theme.colors.text, fontSize: 23, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: theme.colors.text2, fontSize: 13, lineHeight: 20, marginBottom: 14 },
  input: {
    backgroundColor: theme.colors.surface2,
    borderColor: theme.colors.border2,
    borderWidth: 1,
    borderRadius: 10,
    color: theme.colors.text,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  primaryBtn: { backgroundColor: theme.colors.gold, borderRadius: 10, alignItems: 'center', paddingVertical: 12, marginBottom: 10 },
  primaryBtnText: { color: theme.colors.bg, fontWeight: '700' },
  secondaryBtn: { backgroundColor: theme.colors.surface2, borderRadius: 10, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center', paddingVertical: 12, marginBottom: 10 },
  secondaryBtnText: { color: theme.colors.text, fontWeight: '600' },
  ghostBtn: { alignItems: 'center', paddingVertical: 10 },
  ghostBtnText: { color: theme.colors.text3, fontSize: 12 },
  valueLabel: { color: theme.colors.text3, fontSize: 11, marginTop: 8 },
  value: { color: theme.colors.text, fontSize: 15, fontWeight: '600', marginTop: 2 },
  disabled: { opacity: 0.5 },
});
