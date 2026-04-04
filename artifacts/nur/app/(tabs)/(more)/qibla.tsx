import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G, Line, Path, Text as SvgText } from 'react-native-svg';

import { GeometricBackground } from '@/components/GeometricBackground';
import { theme } from '@/constants/colors';

function calculateQibla(lat: number, lng: number): number {
  const meccaLat = 21.4225 * (Math.PI / 180);
  const meccaLng = 39.8262 * (Math.PI / 180);
  const userLat = lat * (Math.PI / 180);
  const userLng = lng * (Math.PI / 180);
  const dLng = meccaLng - userLng;
  const x = Math.cos(meccaLat) * Math.sin(dLng);
  const y = Math.cos(userLat) * Math.sin(meccaLat) - Math.sin(userLat) * Math.cos(meccaLat) * Math.cos(dLng);
  return ((Math.atan2(x, y) * (180 / Math.PI)) + 360) % 360;
}

function haversineDistance(lat: number, lng: number): number {
  const R = 6371;
  const mLat = 21.4225 * Math.PI / 180;
  const mLng = 39.8262 * Math.PI / 180;
  const uLat = lat * Math.PI / 180;
  const uLng = lng * Math.PI / 180;
  const dLat = mLat - uLat;
  const dLng = mLng - uLng;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(uLat) * Math.cos(mLat) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function QiblaScreen() {
  const insets = useSafeAreaInsets();
  const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      try {
        let lat = 51.5074, lng = -0.1278;
        if (Platform.OS !== 'web') {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status === 'granted') {
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
            lat = loc.coords.latitude;
            lng = loc.coords.longitude;
          }
        } else {
          try {
            const pos = await new Promise<GeolocationPosition>((res, rej) =>
              navigator.geolocation.getCurrentPosition(res, rej, { timeout: 5000 })
            );
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
          } catch {}
        }
        const angle = calculateQibla(lat, lng);
        const dist = haversineDistance(lat, lng);
        setQiblaAngle(angle);
        setDistance(dist);
        Animated.spring(rotateAnim, {
          toValue: angle,
          useNativeDriver: false,
          tension: 30,
          friction: 8,
        }).start();
      } catch (e) {
        setError('Could not determine location.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;
  const size = 260;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 16;

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      <GeometricBackground />
      <View style={[s.content, { paddingBottom: bottomPad + 20 }]}>
        <Text style={s.subtitle}>Hold flat and away from metal</Text>

        {loading && <Text style={s.loadTxt}>Locating…</Text>}
        {error && <Text style={s.errTxt}>{error}</Text>}

        {qiblaAngle !== null && (
          <>
            <View style={s.compassContainer}>
              <Svg width={size} height={size}>
                <Circle cx={cx} cy={cy} r={r} fill={theme.colors.surface} stroke={theme.colors.border2} strokeWidth={1.5} />
                <Circle cx={cx} cy={cy} r={r - 16} fill="none" stroke={theme.colors.border} strokeWidth={1} />
                {['N', 'E', 'S', 'W'].map((dir, i) => {
                  const angle = i * 90 * Math.PI / 180;
                  const tx = cx + (r - 8) * Math.sin(angle);
                  const ty = cy - (r - 8) * Math.cos(angle);
                  return <SvgText key={dir} x={tx} y={ty + 4} fontSize="12" fill={dir === 'N' ? theme.colors.compassNorth : theme.colors.text3} textAnchor="middle" fontWeight="700">{dir}</SvgText>;
                })}
                {Array.from({ length: 36 }).map((_, i) => {
                  const angle = (i * 10) * Math.PI / 180;
                  const inner = r - (i % 9 === 0 ? 14 : i % 3 === 0 ? 10 : 7);
                  const x1 = cx + inner * Math.sin(angle);
                  const y1 = cy - inner * Math.cos(angle);
                  const x2 = cx + (r - 2) * Math.sin(angle);
                  const y2 = cy - (r - 2) * Math.cos(angle);
                  return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={theme.colors.border2} strokeWidth={0.8} />;
                })}
              </Svg>
              <Animated.View style={[s.needleContainer, { transform: [{ rotate }] }]}>
                <Svg width={size} height={size}>
                  <G>
                    <Path
                      d={`M${cx},${cy - r + 20} L${cx - 8},${cy + 20} L${cx},${cy + 10} L${cx + 8},${cy + 20} Z`}
                      fill={theme.colors.gold}
                      opacity={0.9}
                    />
                    <Circle cx={cx} cy={cy} r={8} fill={theme.colors.surface3} stroke={theme.colors.gold} strokeWidth={1.5} />
                    <SvgText x={cx} y={cy - r + 38} fontSize="10" fill={theme.colors.gold} textAnchor="middle" fontWeight="700">Kaaba</SvgText>
                  </G>
                </Svg>
              </Animated.View>
            </View>

            <View style={s.infoCard}>
              <View style={s.infoItem}>
                <Text style={s.infoLabel}>Direction</Text>
                <Text style={s.infoValue}>{Math.round(qiblaAngle)}°</Text>
              </View>
              <View style={s.infoDivider} />
              <View style={s.infoItem}>
                <Text style={s.infoLabel}>Distance to Mecca</Text>
                <Text style={s.infoValue}>{distance?.toLocaleString()} km</Text>
              </View>
            </View>

            <View style={s.tipBox}>
              <Feather name="info" size={14} color={theme.colors.teal} />
              <Text style={s.tipTxt}>Face the direction of the needle for Salah. The Qibla is the direction of the Kaaba in Mecca.</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  subtitle: { fontSize: 12, color: theme.colors.text2, marginBottom: 28, textAlign: 'center' },
  loadTxt: { color: theme.colors.text2, fontSize: 16 },
  errTxt: { color: theme.colors.errorSoft, fontSize: 14, textAlign: 'center' },
  compassContainer: { position: 'relative', width: 260, height: 260, marginBottom: 24 },
  needleContainer: { position: 'absolute', top: 0, left: 0, width: 260, height: 260 },
  infoCard: { flexDirection: 'row', backgroundColor: theme.colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: theme.colors.border, marginBottom: 16, width: '100%', justifyContent: 'space-around' },
  infoItem: { alignItems: 'center' },
  infoLabel: { fontSize: 10, color: theme.colors.text2, marginBottom: 4 },
  infoValue: { fontSize: 22, fontWeight: '800', color: theme.colors.gold },
  infoDivider: { width: 1, backgroundColor: theme.colors.border },
  tipBox: { flexDirection: 'row', gap: 8, backgroundColor: theme.colors.tealDim, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: theme.colors.tealBorder30, alignItems: 'flex-start', width: '100%' },
  tipTxt: { flex: 1, fontSize: 12, color: theme.colors.tealLight, lineHeight: 18 },
});
