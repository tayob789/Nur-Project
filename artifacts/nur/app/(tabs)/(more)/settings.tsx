import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GeometricBackground } from '@/components/GeometricBackground';
import { theme } from '@/constants/colors';

const CALC_METHODS = ['Muslim World League', 'ISNA', 'Egypt', 'Makkah', 'Karachi'];
const ASR_METHODS = ["Shafi'i / Maliki / Hanbali", 'Hanafi'];
const PAGE_GOALS = [7, 14, 21, 35, 70];

function SectionHeader({ title }: { title: string }) {
  return <Text style={s.sectionHeader}>{title}</Text>;
}

function SettingRow({ label, value, onPress, arrow = true }: { label: string; value?: string; onPress?: () => void; arrow?: boolean }) {
  return (
    <TouchableOpacity activeOpacity={onPress ? 0.7 : 1} onPress={onPress} style={s.settingRow}>
      <Text style={s.settingLabel}>{label}</Text>
      <View style={s.settingRight}>
        {value && <Text style={s.settingValue}>{value}</Text>}
        {arrow && <Feather name="chevron-right" size={16} color={theme.colors.text3} />}
      </View>
    </TouchableOpacity>
  );
}

function ToggleRow({ label, value, onToggle, subtitle }: { label: string; value: boolean; onToggle: (v: boolean) => void; subtitle?: string }) {
  return (
    <View style={s.settingRow}>
      <View style={{ flex: 1 }}>
        <Text style={s.settingLabel}>{label}</Text>
        {subtitle && <Text style={s.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: theme.colors.border2, true: theme.colors.teal }}
        thumbColor={value ? theme.colors.goldLight : theme.colors.text3}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  const [calcMethod, setCalcMethod] = useState(0);
  const [asrMethod, setAsrMethod] = useState(0);
  const [pageGoal, setPageGoal] = useState(2);
  const [notifFajr, setNotifFajr] = useState(true);
  const [notifDhuhr, setNotifDhuhr] = useState(true);
  const [notifAsr, setNotifAsr] = useState(true);
  const [notifMaghrib, setNotifMaghrib] = useState(true);
  const [notifIsha, setNotifIsha] = useState(true);
  const [morningReminder, setMorningReminder] = useState(true);
  const [eveningReminder, setEveningReminder] = useState(true);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      <GeometricBackground />
      <ScrollView
        contentContainerStyle={[s.content, { paddingTop: topPad + 8, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >

        <SectionHeader title="PRAYER SETTINGS" />
        <View style={s.card}>
          <SettingRow
            label="Calculation Method"
            value={CALC_METHODS[calcMethod]}
            onPress={() => setCalcMethod((calcMethod + 1) % CALC_METHODS.length)}
          />
          <View style={s.divider} />
          <SettingRow
            label="Asr Method"
            value={ASR_METHODS[asrMethod]}
            onPress={() => setAsrMethod((asrMethod + 1) % ASR_METHODS.length)}
          />
          <View style={s.divider} />
          <SettingRow
            label="Location"
            value="Auto (GPS)"
            onPress={() => {}}
          />
        </View>

        <SectionHeader title="NOTIFICATIONS" />
        <View style={s.card}>
          <ToggleRow label="Fajr" value={notifFajr} onToggle={setNotifFajr} />
          <View style={s.divider} />
          <ToggleRow label="Dhuhr" value={notifDhuhr} onToggle={setNotifDhuhr} />
          <View style={s.divider} />
          <ToggleRow label="Asr" value={notifAsr} onToggle={setNotifAsr} />
          <View style={s.divider} />
          <ToggleRow label="Maghrib" value={notifMaghrib} onToggle={setNotifMaghrib} />
          <View style={s.divider} />
          <ToggleRow label="Isha" value={notifIsha} onToggle={setNotifIsha} />
          <View style={s.divider} />
          <ToggleRow label="Morning Azkar Reminder" subtitle="After Fajr" value={morningReminder} onToggle={setMorningReminder} />
          <View style={s.divider} />
          <ToggleRow label="Evening Azkar Reminder" subtitle="After Asr" value={eveningReminder} onToggle={setEveningReminder} />
        </View>

        <SectionHeader title="QURAN" />
        <View style={s.card}>
          <View style={s.settingRow}>
            <Text style={s.settingLabel}>Weekly Page Goal</Text>
            <View style={s.stepperRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setPageGoal(Math.max(0, pageGoal - 1))}
                style={s.stepBtn}
              >
                <Feather name="minus" size={14} color={theme.colors.gold} />
              </TouchableOpacity>
              <Text style={s.stepValue}>{PAGE_GOALS[pageGoal]} pg/wk</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setPageGoal(Math.min(PAGE_GOALS.length - 1, pageGoal + 1))}
                style={s.stepBtn}
              >
                <Feather name="plus" size={14} color={theme.colors.gold} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <SectionHeader title="ABOUT" />
        <View style={s.privacyCard}>
          <Feather name="shield" size={20} color={theme.colors.gold} style={{ marginBottom: 10 }} />
          <Text style={s.privacyText}>
            Nur does not track you, sell your data, or serve ads. Ever.{'\n'}Your worship is between you and Allah.
          </Text>
        </View>
        <View style={s.card}>
          <SettingRow label="Version" value="1.0.0" arrow={false} />
          <View style={s.divider} />
          <SettingRow label="Privacy Policy" onPress={() => {}} />
        </View>

      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  content: { paddingHorizontal: 18 },
  sectionHeader: { fontSize: 10, letterSpacing: 1.5, color: theme.colors.text3, fontWeight: '700', marginTop: 22, marginBottom: 8, marginLeft: 4 },
  card: { backgroundColor: theme.colors.surface, borderRadius: 16, borderWidth: 1, borderColor: theme.colors.border, overflow: 'hidden', marginBottom: 4 },
  divider: { height: 1, backgroundColor: theme.colors.border, marginLeft: 16 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  settingLabel: { fontSize: 15, color: theme.colors.text, fontWeight: '500' },
  settingSubtitle: { fontSize: 11, color: theme.colors.text3, marginTop: 2 },
  settingValue: { fontSize: 14, color: theme.colors.text2, marginRight: 6 },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: theme.colors.goldDim, borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)', justifyContent: 'center', alignItems: 'center' },
  stepValue: { fontSize: 14, color: theme.colors.gold, fontWeight: '700', minWidth: 70, textAlign: 'center' },
  privacyCard: { backgroundColor: 'rgba(201,168,76,0.06)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)', padding: 20, alignItems: 'center', marginBottom: 4 },
  privacyText: { fontSize: 14, color: theme.colors.text, lineHeight: 22, textAlign: 'center', fontStyle: 'italic' },
});
