import { Feather } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

function calcZakat(inputs: ZakatInputs): { total: number; zakatDue: number; aboveNisab: boolean } {
  const cash = parseFloat(inputs.cash) || 0;
  const gold = parseFloat(inputs.gold) || 0;
  const investments = parseFloat(inputs.investments) || 0;
  const stock = parseFloat(inputs.stock) || 0;
  const liabilities = parseFloat(inputs.liabilities) || 0;
  const nisab = parseFloat(inputs.nisab) || NISAB_DEFAULT;

  const total = cash + gold + investments + stock - liabilities;
  const aboveNisab = total >= nisab;
  const zakatDue = aboveNisab ? total * 0.025 : 0;
  return { total, zakatDue, aboveNisab };
}

interface FieldProps {
  label: string;
  hint: string;
  value: string;
  onChangeText: (text: string) => void;
}

function ZakatField({ label, hint, value, onChangeText }: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={f.fieldRow}>
      <View style={f.fieldLabel}>
        <Text style={f.labelText}>{label}</Text>
        <Text style={f.hintText}>{hint}</Text>
      </View>
      <View style={[f.inputContainer, focused && f.inputFocused]}>
        <Text style={f.prefix}>£</Text>
        <TextInput
          style={f.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder="0.00"
          placeholderTextColor={theme.colors.text3}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
    </View>
  );
}

const f = StyleSheet.create({
  fieldRow: { marginBottom: 12 },
  fieldLabel: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  labelText: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
  hintText: { fontSize: 11, color: theme.colors.text3 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.surface2, borderRadius: 12, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 14, height: 48 },
  inputFocused: { borderColor: `rgba(201,168,76,0.5)` },
  prefix: { fontSize: 16, color: theme.colors.text2, marginRight: 6 },
  input: { flex: 1, fontSize: 16, color: theme.colors.text },
});

export default function ZakatScreen() {
  const insets = useSafeAreaInsets();
  const [inputs, setInputs] = useState<ZakatInputs>({
    cash: '',
    gold: '',
    investments: '',
    stock: '',
    liabilities: '',
    nisab: NISAB_DEFAULT.toString(),
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const setField = (key: keyof ZakatInputs) => (val: string) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
  };

  const { total, zakatDue, aboveNisab } = calcZakat(inputs);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.content, { paddingTop: topPad + 16, paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Header */}
          <View style={s.header}>
            <Text style={s.eyebrow}>ANNUAL OBLIGATION</Text>
            <Text style={s.title}>Zakat Calculator</Text>
          </View>

          {/* Result Card */}
          <View style={[s.resultCard, aboveNisab ? s.resultCardActive : s.resultCardInactive]}>
            <View style={s.resultRow}>
              <View>
                <Text style={s.resultLabel}>Zakat Due</Text>
                <Text style={[s.resultAmount, { color: aboveNisab ? theme.colors.gold : theme.colors.text2 }]}>
                  £{zakatDue.toFixed(2)}
                </Text>
              </View>
              <View style={[s.nisabBadge, aboveNisab ? s.nisabAbove : s.nisabBelow]}>
                <Feather
                  name={aboveNisab ? 'trending-up' : 'trending-down'}
                  size={14}
                  color={aboveNisab ? theme.colors.gold : theme.colors.text2}
                />
                <Text style={[s.nisabText, { color: aboveNisab ? theme.colors.gold : theme.colors.text2 }]}>
                  {aboveNisab ? 'Above Nisab' : 'Below Nisab'}
                </Text>
              </View>
            </View>
            <View style={s.resultDivider} />
            <View style={s.netRow}>
              <Text style={s.netLabel}>Net Zakatable Wealth</Text>
              <Text style={s.netValue}>£{total.toFixed(2)}</Text>
            </View>
            <View style={s.netRow}>
              <Text style={s.netLabel}>Rate (2.5%)</Text>
              <Text style={s.netValue}>× 0.025</Text>
            </View>
          </View>

          {/* Input Fields */}
          <View style={s.fieldsCard}>
            <ZakatField label="Cash & Bank Savings" hint="inc. current & savings" value={inputs.cash} onChangeText={setField('cash')} />
            <ZakatField label="Gold & Silver Value" hint="at current market price" value={inputs.gold} onChangeText={setField('gold')} />
            <ZakatField label="Investments" hint="stocks, funds, crypto" value={inputs.investments} onChangeText={setField('investments')} />
            <ZakatField label="Business Stock" hint="if applicable" value={inputs.stock} onChangeText={setField('stock')} />
            <ZakatField label="Liabilities" hint="debts due now" value={inputs.liabilities} onChangeText={setField('liabilities')} />
            <View style={s.divider} />
            <ZakatField label="Nisab Threshold" hint="silver nisab ~£5,950" value={inputs.nisab} onChangeText={setField('nisab')} />
          </View>

          {/* Disclaimer */}
          <View style={s.disclaimer}>
            <Feather name="info" size={16} color={theme.colors.teal} style={{ marginTop: 2 }} />
            <Text style={s.disclaimerText}>
              This calculator is a guide only. Zakat rules vary by madhab. Consult a qualified Islamic scholar or institution for your specific circumstances. Nur does not provide fatwa.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20 },
  header: { marginBottom: 24 },
  eyebrow: { fontSize: 11, letterSpacing: 2, color: theme.colors.gold, fontWeight: '600', marginBottom: 6 },
  title: { fontSize: 28, fontWeight: '700', color: theme.colors.text },
  resultCard: { borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1 },
  resultCardActive: { backgroundColor: theme.colors.goldDim, borderColor: `rgba(201,168,76,0.3)` },
  resultCardInactive: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  resultLabel: { fontSize: 12, color: theme.colors.text2, marginBottom: 4, fontWeight: '500' },
  resultAmount: { fontSize: 36, fontWeight: '800' },
  nisabBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1 },
  nisabAbove: { backgroundColor: theme.colors.goldDim, borderColor: `rgba(201,168,76,0.3)` },
  nisabBelow: { backgroundColor: theme.colors.surface2, borderColor: theme.colors.border },
  nisabText: { fontSize: 12, fontWeight: '600' },
  resultDivider: { height: 1, backgroundColor: theme.colors.border, marginBottom: 12 },
  netRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  netLabel: { fontSize: 13, color: theme.colors.text2 },
  netValue: { fontSize: 13, color: theme.colors.text, fontWeight: '600' },
  fieldsCard: { backgroundColor: theme.colors.surface, borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: theme.colors.border },
  divider: { height: 1, backgroundColor: theme.colors.border, marginVertical: 12 },
  disclaimer: { flexDirection: 'row', gap: 10, backgroundColor: theme.colors.tealDim, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: `rgba(61,140,124,0.3)`, alignItems: 'flex-start', marginBottom: 16 },
  disclaimerText: { flex: 1, fontSize: 13, color: theme.colors.tealLight, lineHeight: 19 },
});
