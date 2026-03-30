import { BlurView } from 'expo-blur';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { theme } from '@/constants/colors';

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="prayers">
        <Icon sf={{ default: 'moon.stars', selected: 'moon.stars.fill' }} />
        <Label>Prayers</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="quran">
        <Icon sf={{ default: 'book', selected: 'book.fill' }} />
        <Label>Quran</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="zakat">
        <Icon sf={{ default: 'scalemass', selected: 'scalemass.fill' }} />
        <Label>Zakat</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.gold,
        tabBarInactiveTintColor: theme.colors.text3,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isIOS ? 'transparent' : 'rgba(20,18,16,0.97)',
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          elevation: 0,
          height: Platform.OS === 'web' ? 84 : 80,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(20,18,16,0.97)' }]} />
          ),
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: -4,
          marginBottom: Platform.OS === 'web' ? 8 : 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="house" tintColor={color} size={22} />
            ) : (
              <Feather name="home" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="prayers"
        options={{
          title: 'Prayers',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="moon.stars" tintColor={color} size={22} />
            ) : (
              <Feather name="moon" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: 'Quran',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="book" tintColor={color} size={22} />
            ) : (
              <Feather name="book-open" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="zakat"
        options={{
          title: 'Zakat',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="scalemass" tintColor={color} size={22} />
            ) : (
              <Feather name="dollar-sign" size={22} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
