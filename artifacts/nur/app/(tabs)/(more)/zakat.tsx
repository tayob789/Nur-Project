import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GeometricBackground } from '@/components/GeometricBackground';
import { theme } from '@/constants/colors';

const NISAB_DEFAULT = 5950;

interface ZakatInputs {
  cash: string;
  gold: string;
  investments: string;
  stock: string;
  liabilities: string;
  nisab: string;
}

interface SavedCalc {
  date: string;
  amount: number;
  total: number;
}

const CHARITIES = [
  { name: 'National Zakat Foundation', url: 'https://nzf.org.uk' },
  { name: 'Islamic Relief', url: 'https://www.islamic-relief.org.uk' },
  { name: 'Human Appeal', url: 'https://humanappeal.org.uk' },
];

function calcZakat(inputs: ZakatInputs): { total: number; zakatDue: number; aboveNisab: boolean } {
  const cash = parseFloat(inputs.cash) || 0;
  const gold = parseFloat(inputs.gold) || 0;
  const investments = parseFloat(inputs.investments) || 0;
  const stock = parseFloat(inputs.stock) || 0;
  const liabilities = parseFloat(inputs.liabilities) || 0;
  const nisab = parseFloat(inputs.nisab) || NISAB_DEFAULT;
  const total = cash + gold + investments + stock - liabilities;
  const aboveNisab = total >= nisab;
  return { total, zakatDue: aboveNisab ? total * 0.025 : 0, aboveNisab };
}

function ZField({ label, hint, value, onChange }: { label: string; hint: string; value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={f.field}>
      <View style={f.labelRow}>
        <Text style={f.label}>{label}</Text>
        <Text style={f.hint}>{hint}</Text>
      </View>
      <View style={[f.inputWrap, focused && f.inputFocused]}>
        <Text style={f.prefix}>£</Text>
        <TextInput style={f.input} value={value} onChangeText={onChange} keyboardType="decimal-pad" placeholder="0.00" placeholderTextColor={theme.colors.text3} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      </View>
    </View>
  );
}
const f = StyleSheet.create({
  field: { marginBottom: 10 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  label: { fontSize: 13, fontWeight: '600', color: theme.colors.text },
  hint: { fontSize: 10, color: theme.colors.text3 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface2, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 12, height: 46 },
  inputFocused: { borderColor: 'rgba(201,168,76,0.5)' },
  prefix: { fontSize: 15, color: theme.colors.text2, marginRight: 6 },
  input: { flex: 1, fontSize: 15, color: theme.colors.text },
});

export default function ZakatScreen() {
  const insets = useSafeAreaInsets();
  const [inputs, setInputs] = useState<ZakatInputs>({ cash: '', gold: '', investments: '', stock: '', liabilities: '', nisab: NISAB_DEFAULT.toString() });
  const [saved, setSaved] = useState<SavedCalc[]>([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
    AsyncStorage.getItem('nur_zakat_history').then(s => { if (s) setSaved(JSON.parse(s)); });
  }, []);

  const set = (k: keyof ZakatInputs) => (v: string) => setInputs(p => ({ ...p, [k]: v }));
  const { total, zakatDue, aboveNisab } = calcZakat(inputs);
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom;

  const saveCalc = async () => {
    const entry: SavedCalc = { date: new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }), amount: zakatDue, total };
    const updated = [entry, ...saved].slice(0, 10);
    setSaved(updated);
    await AsyncStorage.setItem('nur_zakat_history', JSON.stringify(updated));
  };

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" />
      <GeometricBackground />
      <ScrollView contentContainerStyle={[s.content, { paddingBottom: bottomPad + 80 }]} keyboardShouldPersistTaps="handled">
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Result */}
          <LinearGradient colors={aboveNisab ? theme.gradients.quranHero : theme.gradients.nextPrayer} style={[s.resultCard, aboveNisab && { borderColor: 'rgba(201,168,76,0.3)' }]}>
            <View style={s.resultRow}>
              <View>
                <Text style={s.resultLabel}>Zakat Due</Text>
                <Text style={[s.resultAmount, { color: aboveNisab ? theme.colors.gold : theme.colors.text2 }]}>£{zakatDue.toFixed(2)}</Text>
              </View>
              <View style={[s.nisabBadge, aboveNisab ? s.nisabAbove : s.nisabBelow]}>
                <Feather name={aboveNisab ? 'trending-up' : 'trending-down'} size={13} color={aboveNisab ? theme.colors.gold : theme.colors.text2} />
                <Text style={[s.nisabTxt, { color: aboveNisab ? theme.colors.gold : theme.colors.text2 }]}>{aboveNisab ? 'Above Nisab' : 'Below Nisab'}</Text>
              </View>
            </View>
            <View style={s.netRow}><Text style={s.netLbl}>Net Zakatable Wealth</Text><Text style={s.netVal}>£{total.toFixed(2)}</Text></View>
            <View style={s.netRow}><Text style={s.netLbl}>Rate (2.5%)</Text><Text style={s.netVal}>× 0.025</Text></View>
          </LinearGradient>

          {/* Fields */}
          <View style={s.fieldsCard}>
            <ZField label="Cash & Savings" hint="current + savings accounts" value={inputs.cash} onChange={set('cash')} />
            <ZField label="Gold & Silver" hint="at current market value" value={inputs.gold} onChange={set('gold')} />
            <ZField label="Investments" hint="stocks, ISA, crypto" value={inputs.investments} onChange={set('investments')} />
            <ZField label="Business Stock" hint="goods held for sale" value={inputs.stock} onChange={set('stock')} />
            <ZField label="Liabilities" hint="debts due this year" value={inputs.liabilities} onChange={set('liabilities')} />
            <View style={s.divider} />
            <ZField label="Nisab Threshold" hint="silver nisab ~£5,950" value={inputs.nisab} onChange={set('nisab')} />
          </View>

          {/* Save */}
          {zakatDue > 0 && (
            <TouchableOpacity activeOpacity={0.7} onPress={saveCalc} style={s.saveBtn}>
              <Feather name="save" size={16} color={theme.colors.gold} />
              <Text style={s.saveTxt}>Save Calculation</Text>
            </TouchableOpacity>
          )}

          {/* Charities */}
          {zakatDue > 0 && (
            <View style={s.charityCard}>
              <Text style={s.charityTitle}>Donate Your Zakat</Text>
              <Text style={s.charitySubtitle}>Your zakat is £{zakatDue.toFixed(2)}. Consider donating to:</Text>
              {CHARITIES.map((c, i) => (
                <TouchableOpacity key={i} activeOpacity={0.7} onPress={() => Linking.openURL(c.url)} style={s.charityRow}>
                  <Text style={s.charityName}>{c.name}</Text>
                  <Feather name="external-link" size={14} color={theme.colors.teal} />
                </TouchableOpacity>
              ))}
              <Text style={s.charityNote}>Nur is not affiliated with these organisations. They are suggested as trusted UK charities.</Text>
            </View>
          )}

          {/* History */}
          {saved.length > 0 && (
            <View style={s.historyCard}>
              <Text style={s.historyTitle}>Previous Calculations</Text>
              {saved.map((c, i) => (
                <View key={i} style={s.historyRow}>
                  <Text style={s.historyDate}>{c.date}</Text>
                  <Text style={s.historyAmount}>£{c.amount.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Disclaimer */}
          <View style={s.disclaimer}>
            <Feather name="info" size={15} color={theme.colors.teal} style={{ marginTop: 2 }} />
            <Text style={s.disclaimerTxt}>This calculator is a guide only. Zakat rules vary by madhab. Consult a qualified Islamic scholar for your circumstances. Nur does not provide fatwa.</Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  content: { paddingHorizontal: 16, paddingTop: 16 },
  resultCard: { borderRadius: 20, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: theme.colors.border },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 },
  resultLabel: { fontSize: 11, color: theme.colors.text2, marginBottom: 4 },
  resultAmount: { fontSize: 34, fontWeight: '800' },
  nisabBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1 },
  nisabAbove: { backgroundColor: theme.colors.goldDim, borderColor: 'rgba(201,168,76,0.3)' },
  nisabBelow: { backgroundColor: theme.colors.surface2, borderColor: theme.colors.border },
  nisabTxt: { fontSize: 11, fontWeight: '600' },
  netRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  netLbl: { fontSize: 12, color: theme.colors.text2 },
  netVal: { fontSize: 12, color: theme.colors.text, fontWeight: '600' },
  fieldsCard: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: theme.colors.border },
  divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: 10 },
  saveBtn: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: theme.colors.goldDim, borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(201,168,76,0.3)', justifyContent: 'center' },
  saveTxt: { fontSize: 14, color: theme.colors.gold, fontWeight: '700' },
  charityCard: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: theme.colors.border },
  charityTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.text, marginBottom: 4 },
  charitySubtitle: { fontSize: 12, color: theme.colors.text2, marginBottom: 12 },
  charityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  charityName: { fontSize: 13, color: theme.colors.tealLight, fontWeight: '600' },
  charityNote: { fontSize: 10, color: theme.colors.text3, marginTop: 10, lineHeight: 15 },
  historyCard: { backgroundColor: theme.colors.surface, borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: theme.colors.border },
  historyTitle: { fontSize: 14, fontWeight: '700', color: theme.colors.text, marginBottom: 12 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  historyDate: { fontSize: 13, color: theme.colors.text2 },
  historyAmount: { fontSize: 13, color: theme.colors.gold, fontWeight: '700' },
  disclaimer: { flexDirection: 'row', gap: 10, backgroundColor: theme.colors.tealDim, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: 'rgba(61,140,124,0.3)', alignItems: 'flex-start', marginBottom: 16 },
  disclaimerTxt: { flex: 1, fontSize: 12, color: theme.colors.tealLight, lineHeight: 18 },
});
