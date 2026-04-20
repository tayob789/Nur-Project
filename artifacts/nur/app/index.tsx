import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { theme } from '@/constants/colors';
import { useUser } from '@/context/UserContext';

export default function RootIndex() {
  const { isLoaded, name } = useUser();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={theme.colors.gold} />
      </View>
    );
  }

  if (!name.trim()) {
    return <Redirect href="/onboarding" />;
  }

  return <Redirect href="/(tabs)" />;
}
