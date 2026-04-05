import { Stack } from 'expo-router';
import { theme } from '@/constants/colors';

export default function MoreLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.gold,
        headerTitleStyle: { color: theme.colors.text, fontWeight: '700' },
        headerBackTitle: 'More',
        contentStyle: { backgroundColor: theme.colors.bg },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="qibla" options={{ title: 'Qibla Compass' }} />
      <Stack.Screen name="names" options={{ title: '99 Names of Allah' }} />
      <Stack.Screen name="calendar" options={{ title: 'Islamic Calendar' }} />
      <Stack.Screen name="zakat" options={{ title: 'Zakat Calculator' }} />
      <Stack.Screen name="mosque" options={{ title: 'Mosque Finder' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      <Stack.Screen name="account" options={{ title: 'Account' }} />
      <Stack.Screen name="premium" options={{ title: 'Premium' }} />
    </Stack>
  );
}
