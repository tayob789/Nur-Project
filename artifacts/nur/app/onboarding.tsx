import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { GeometricBackground } from '@/components/GeometricBackground';
import { theme } from '@/constants/colors';
import { useUser } from '@/context/UserContext';

export default function OnboardingScreen() {
  const { saveName } = useUser();
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isDisabled = useMemo(() => name.trim().length < 2 || submitting, [name, submitting]);

  async function continueApp() {
    if (isDisabled) return;
    setSubmitting(true);
    await saveName(name);
    router.replace('/(tabs)');
  }

  return (
    <View style={s.root}>
      <GeometricBackground />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.container}>
        <View style={s.card}>
          <Text style={s.eyebrow}>WELCOME TO NUR</Text>
          <Text style={s.title}>What should we call you?</Text>
          <Text style={s.subtitle}>
            Your name is saved on this device. You can create an account later to sync data and unlock premium.
          </Text>

          <TextInput
            value={name}
            onChangeText={setName}
            style={s.input}
            placeholder="Enter your name"
            placeholderTextColor={theme.colors.text3}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={continueApp}
          />

          <TouchableOpacity
            onPress={continueApp}
            disabled={isDisabled}
            activeOpacity={0.8}
            style={[s.cta, isDisabled && s.ctaDisabled]}
          >
            <Text style={s.ctaText}>{submitting ? 'Saving…' : 'Continue'}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20 },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  eyebrow: { color: theme.colors.gold, fontSize: 11, letterSpacing: 1.5, marginBottom: 8, fontWeight: '700' },
  title: { color: theme.colors.text, fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: theme.colors.text2, fontSize: 14, lineHeight: 20, marginBottom: 18 },
  input: {
    backgroundColor: theme.colors.surface2,
    borderColor: theme.colors.border2,
    borderWidth: 1,
    borderRadius: 12,
    color: theme.colors.text,
    fontSize: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  cta: {
    backgroundColor: theme.colors.gold,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 14,
  },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { color: theme.colors.bg, fontWeight: '700', fontSize: 15 },
});
