import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import {
  Linking,
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

export default function MosqueScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  async function findMosques() {
    setStatus('loading');
    try {
      if (Platform.OS !== 'web') {
        const { status: perm } = await Location.requestForegroundPermissionsAsync();
        if (perm !== 'granted') {
          setStatus('error');
          return;
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const url = `https://www.google.com/maps/search/mosque/@${loc.coords.latitude},${loc.coords.longitude},14z`;
        Linking.openURL(url);
      } else {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const url = `https://www.google.com/maps/search/mosque/@${pos.coords.latitude},${pos.coords.longitude},14z`;
            Linking.openURL(url);
          },
          () => {
            Linking.openURL('https://www.google.com/maps/search/mosque+near+me');
          },
          { timeout: 6000 }
        );
      }
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      <GeometricBackground />
      <ScrollView
        contentContainerStyle={[s.content, { paddingTop: topPad + 8, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* Hero */}
        <View style={s.hero}>
          <View style={s.heroIcon}>
            <Feather name="map-pin" size={36} color={theme.colors.gold} />
          </View>
          <Text style={s.heroTitle}>Find a Mosque</Text>
          <Text style={s.heroSub}>
            Locate the nearest masjid using your current location.
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={findMosques}
          disabled={status === 'loading'}
          style={[s.btn, status === 'loading' && s.btnDisabled]}
        >
          <Feather name="map" size={18} color={theme.colors.bg} style={{ marginRight: 10 }} />
          <Text style={s.btnTxt}>
            {status === 'loading' ? 'Getting location…' : 'Open in Maps'}
          </Text>
        </TouchableOpacity>

        {status === 'error' && (
          <View style={s.errCard}>
            <Text style={s.errTxt}>Location permission is required to find nearby mosques. Please enable it in your device settings.</Text>
          </View>
        )}

        {/* Info Cards */}
        <View style={s.infoCard}>
          <Feather name="info" size={16} color={theme.colors.teal} style={{ marginRight: 10, marginTop: 1 }} />
          <Text style={s.infoTxt}>Results are provided by Google Maps. Nur has no affiliation with any listed mosque.</Text>
        </View>

        {/* Tips */}
        <Text style={s.tipsHeader}>WHEN VISITING</Text>
        {[
          { icon: 'clock', text: 'Arrive a few minutes before the iqamah' },
          { icon: 'wifi-off', text: 'Silence your phone before entering' },
          { icon: 'heart', text: 'Make intention before you enter' },
          { icon: 'gift', text: 'Greet with Assalamu Alaikum' },
        ].map((tip, i) => (
          <View key={i} style={s.tipRow}>
            <View style={s.tipIcon}>
              <Feather name={tip.icon as any} size={14} color={theme.colors.gold} />
            </View>
            <Text style={s.tipTxt}>{tip.text}</Text>
          </View>
        ))}

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  content: { paddingHorizontal: 20 },
  hero: { alignItems: 'center', paddingVertical: 32 },
  heroIcon: { width: 80, height: 80, borderRadius: 24, backgroundColor: theme.colors.goldDim, borderWidth: 1, borderColor: theme.colors.goldBorder30, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: theme.colors.text, marginBottom: 10 },
  heroSub: { fontSize: 15, color: theme.colors.text2, textAlign: 'center', lineHeight: 22 },
  btn: { backgroundColor: theme.colors.gold, borderRadius: 16, padding: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  btnDisabled: { opacity: 0.6 },
  btnTxt: { fontSize: 16, fontWeight: '700', color: theme.colors.bg },
  errCard: { backgroundColor: theme.colors.amberBg10, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: theme.colors.amberBorder30, marginBottom: 14 },
  errTxt: { fontSize: 13, color: theme.colors.amber, lineHeight: 20 },
  infoCard: { flexDirection: 'row', backgroundColor: theme.colors.surface, borderRadius: 14, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'flex-start' },
  infoTxt: { flex: 1, fontSize: 12, color: theme.colors.text2, lineHeight: 18 },
  tipsHeader: { fontSize: 10, letterSpacing: 1.5, color: theme.colors.text3, fontWeight: '700', marginBottom: 12 },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  tipIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: theme.colors.goldDim, justifyContent: 'center', alignItems: 'center' },
  tipTxt: { flex: 1, fontSize: 14, color: theme.colors.text2, lineHeight: 20 },
});
