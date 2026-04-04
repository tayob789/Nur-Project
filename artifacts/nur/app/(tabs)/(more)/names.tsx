import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
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
import { NAMES_OF_ALLAH, type NameOfAllah } from '@/data/namesOfAllah';

export default function NamesScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<NameOfAllah | null>(null);

  const filtered = search
    ? NAMES_OF_ALLAH.filter(n =>
        n.transliteration.toLowerCase().includes(search.toLowerCase()) ||
        n.meaning.toLowerCase().includes(search.toLowerCase())
      )
    : NAMES_OF_ALLAH;

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" />
      <GeometricBackground />
      <View style={[s.searchBox, { marginTop: 12 }]}>
        <TextInput
          style={s.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name or meaning…"
          placeholderTextColor={theme.colors.text3}
        />
      </View>
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={item => item.number.toString()}
        contentContainerStyle={[s.list, { paddingBottom: insets.bottom + 100 }]}
        columnWrapperStyle={s.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSelected(item)}
            style={s.card}
          >
            <Text style={s.num}>{String(item.number).padStart(2, '0')}</Text>
            <Text style={s.arabic}>{item.arabic}</Text>
            <Text style={s.translit}>{item.transliteration}</Text>
            <Text style={s.meaning}>{item.meaning}</Text>
          </TouchableOpacity>
        )}
      />
      <Modal visible={!!selected} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setSelected(null)}>
          <View style={s.modal}>
            <Text style={s.modalNum}>{String(selected?.number ?? '').padStart(2, '0')}</Text>
            <Text style={s.modalArabic}>{selected?.arabic}</Text>
            <Text style={s.modalTranslit}>{selected?.transliteration}</Text>
            <Text style={s.modalMeaning}>{selected?.meaning}</Text>
            <View style={s.modalDivider} />
            <Text style={s.modalDesc}>{selected?.description}</Text>
            <TouchableOpacity onPress={() => setSelected(null)} style={s.closeBtn}>
              <Text style={s.closeTxt}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg },
  searchBox: { paddingHorizontal: 16, marginBottom: 12 },
  search: { backgroundColor: theme.colors.surface, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, color: theme.colors.text, fontSize: 14, borderWidth: 1, borderColor: theme.colors.border },
  list: { paddingHorizontal: 12 },
  row: { gap: 10, marginBottom: 10, justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: theme.colors.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: theme.colors.border, alignItems: 'center' },
  num: { fontSize: 10, color: theme.colors.gold, fontWeight: '700', marginBottom: 8, letterSpacing: 1 },
  arabic: { fontSize: 20, color: theme.colors.text, textAlign: 'center', writingDirection: 'rtl', marginBottom: 6, lineHeight: 30 },
  translit: { fontSize: 11, color: theme.colors.gold, fontWeight: '600', marginBottom: 2, textAlign: 'center' },
  meaning: { fontSize: 10, color: theme.colors.text2, textAlign: 'center' },
  overlay: { flex: 1, backgroundColor: theme.colors.modalOverlay70, justifyContent: 'center', padding: 24 },
  modal: { backgroundColor: theme.colors.surface2, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: theme.colors.goldBorder30 },
  modalNum: { fontSize: 12, color: theme.colors.gold, fontWeight: '700', marginBottom: 8 },
  modalArabic: { fontSize: 32, color: theme.colors.text, textAlign: 'center', writingDirection: 'rtl', marginBottom: 8, lineHeight: 48 },
  modalTranslit: { fontSize: 16, color: theme.colors.gold, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  modalMeaning: { fontSize: 14, color: theme.colors.text2, textAlign: 'center', marginBottom: 16 },
  modalDivider: { height: 1, backgroundColor: theme.colors.border, marginBottom: 14 },
  modalDesc: { fontSize: 13, color: theme.colors.text, lineHeight: 20, marginBottom: 20 },
  closeBtn: { backgroundColor: theme.colors.goldDim, borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: theme.colors.goldBorder30 },
  closeTxt: { fontSize: 14, color: theme.colors.gold, fontWeight: '700' },
});
